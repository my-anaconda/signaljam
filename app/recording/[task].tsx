import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer } from 'expo-audio';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import { getLanguageOption } from '@/constants/Languages';
import { pickRandomParagraph } from '@/constants/SpeechParagraphs';
import { WaveformVisualizer } from '@/components/waveform-visualizer';
import { PrimaryButton } from '@/components/primary-button';
import { useAppStore } from '@/store/useAppStore';
import { useT } from '@/hooks/useT';
import type { StringKey } from '@/constants/Translations';

const CLICK_SOUND = require('@/assets/sounds/click.wav');
const TAP_BEAT_MS = 600; // 100 BPM

const TASK_ORDER = ['vocal-tone', 'speech-rhythm', 'tap-test'] as const;

const TASK_CONFIG: Record<
  string,
  { titleKey: StringKey; instructionKey: StringKey; duration: number }
> = {
  'vocal-tone': {
    titleKey: 'task.vocalTone.title',
    instructionKey: 'task.vocalTone.instruction',
    duration: 10,
  },
  'speech-rhythm': {
    titleKey: 'task.speechRhythm.title',
    instructionKey: 'task.speechRhythm.instruction',
    duration: 30,
  },
  'tap-test': {
    titleKey: 'task.tapTest.title',
    instructionKey: 'task.tapTest.instruction',
    duration: 30,
  },
};


export default function RecordingScreen() {
  const router = useRouter();
  const { task, step: stepParam, total: totalParam } = useLocalSearchParams<{
    task: string;
    step?: string;
    total?: string;
  }>();
  const insets = useSafeAreaInsets();

  const config = TASK_CONFIG[task ?? ''] ?? TASK_CONFIG['vocal-tone'];
  const isTapTest = task === 'tap-test';
  const isSpeechRhythm = task === 'speech-rhythm';

  const language = useAppStore((s) => s.settings.language);
  const languageOption = getLanguageOption(language);
  const t = useT();

  const paragraph = useMemo(
    () => (isSpeechRhythm ? pickRandomParagraph(language) : null),
    [isSpeechRhythm, task, language]
  );

  const parsedStep = parseInt(stepParam ?? '', 10);
  const parsedTotal = parseInt(totalParam ?? '', 10);
  const total = Number.isFinite(parsedTotal) && parsedTotal > 0 ? parsedTotal : TASK_ORDER.length;
  const step = Number.isFinite(parsedStep) && parsedStep > 0 ? parsedStep : 1;
  const isLastStep = step >= total;

  const [isRecording, setIsRecording] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(config.duration);
  const [tapCount, setTapCount] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);

  const clickPlayer = useAudioPlayer(CLICK_SOUND);

  useEffect(() => {
    setIsRecording(false);
    setHasRecorded(false);
    setTimeRemaining(config.duration);
    setTapCount(0);
  }, [task, config.duration]);

  useEffect(() => {
    if (!isTapTest || !isRecording || !clickPlayer) return;

    const tick = () => {
      try {
        clickPlayer.seekTo(0);
        clickPlayer.play();
      } catch {
        // Audio not ready yet — ignore and the next tick will try again.
      }
    };
    tick();
    const interval = setInterval(tick, TAP_BEAT_MS);
    return () => clearInterval(interval);
  }, [isTapTest, isRecording, clickPlayer]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isRecording && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRecording(false);
            setHasRecorded(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, timeRemaining]);

  const handleRecordToggle = useCallback(() => {
    if (isRecording) {
      setIsRecording(false);
      setHasRecorded(true);
    } else {
      setIsRecording(true);
    }
  }, [isRecording]);

  const handleReRecord = useCallback(() => {
    setIsRecording(false);
    setHasRecorded(false);
    setTimeRemaining(config.duration);
    setTapCount(0);
  }, [config.duration]);

  const handleSubmit = useCallback(() => {
    if (isLastStep) {
      router.replace('/processing');
      return;
    }
    const nextTask = TASK_ORDER[step] ?? TASK_ORDER[TASK_ORDER.length - 1];
    router.replace(
      `/recording/${nextTask}?step=${step + 1}&total=${total}`
    );
  }, [router, isLastStep, step, total]);

  const handleTap = useCallback(() => {
    if (isRecording) {
      setTapCount((prev) => prev + 1);
    }
  }, [isRecording]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </Pressable>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{t(config.titleKey)}</Text>
          {total > 1 && (
            <Text style={styles.headerSubtitle}>
              {t('recording.stepOf', { step, total })}
            </Text>
          )}
        </View>
        <View style={styles.backButton} />
      </View>

      {/* Instruction */}
      <Text style={styles.instruction}>{t(config.instructionKey)}</Text>

      {/* Timer */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
        <Text style={styles.timerLabel}>
          {isRecording
            ? t('recording.status.recording')
            : hasRecorded
              ? t('recording.status.complete')
              : t('recording.status.ready')}
        </Text>
      </View>

      {/* Visualizer, Tap Zone, or Reading Passage */}
      <View style={styles.visualizerContainer}>
        {isTapTest ? (
          <Pressable
            style={({ pressed }) => [
              styles.tapZone,
              pressed && isRecording && styles.tapZonePressed,
              !isRecording && styles.tapZoneDisabled,
            ]}
            onPress={handleTap}
            disabled={!isRecording}
            accessibilityRole="button"
            accessibilityLabel={`Tap zone. Tap count: ${tapCount}`}
          >
            <Text style={styles.tapEmoji}>👆</Text>
            <Text style={styles.tapCountText}>{tapCount}</Text>
            <Text style={styles.tapLabel}>{t('recording.tapsLabel')}</Text>
          </Pressable>
        ) : isSpeechRhythm && paragraph ? (
          <ScrollView
            style={styles.paragraphScroll}
            contentContainerStyle={styles.paragraphContent}
            showsVerticalScrollIndicator={false}
          >
            <Text
              style={[
                styles.paragraphText,
                languageOption.rtl && styles.paragraphRtl,
              ]}
            >
              {paragraph}
            </Text>
          </ScrollView>
        ) : (
          <WaveformVisualizer
            isActive={isRecording}
            barCount={36}
            color={Colors.secondary}
          />
        )}
      </View>

      {/* Record Button */}
      <View style={styles.recordButtonContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.recordButton,
            isRecording && styles.recordButtonActive,
            pressed && styles.recordButtonPressed,
          ]}
          onPress={handleRecordToggle}
          accessibilityRole="button"
          accessibilityLabel={isRecording ? t('recording.tapToStop') : t('recording.tapToRecord')}
        >
          {isRecording ? (
            <View style={styles.stopIcon} />
          ) : (
            <Ionicons name="mic" size={32} color={Colors.textPrimary} />
          )}
        </Pressable>
        <Text style={styles.recordHint}>
          {isRecording ? t('recording.tapToStop') : t('recording.tapToRecord')}
        </Text>
      </View>

      {/* Privacy Note */}
      <Text style={styles.privacyNote}>{t('recording.privacyNote')}</Text>

      {/* Action Buttons */}
      {hasRecorded && (
        <View style={styles.actionButtons}>
          <View style={styles.buttonWrapper}>
            <PrimaryButton
              title={t('recording.reRecord')}
              onPress={handleReRecord}
              variant="outline"
            />
          </View>
          <View style={styles.buttonWrapper}>
            <PrimaryButton
              title={isLastStep ? t('recording.submit') : t('recording.nextTask')}
              onPress={handleSubmit}
              variant="filled"
            />
          </View>
        </View>
      )}

      {/* Bottom safe area */}
      <View style={{ height: insets.bottom + 16 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 18,
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  instruction: {
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 12,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  timerText: {
    fontFamily: Fonts.bold,
    fontSize: 48,
    color: Colors.textPrimary,
  },
  timerLabel: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  visualizerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  paragraphScroll: {
    alignSelf: 'stretch',
    maxHeight: 260,
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  paragraphContent: {
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  paragraphText: {
    fontFamily: Fonts.regular,
    fontSize: 17,
    lineHeight: 26,
    color: Colors.textPrimary,
    textAlign: 'left',
  },
  paragraphRtl: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  tapZone: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.cardBackground,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tapZonePressed: {
    backgroundColor: Colors.cardBackgroundLight,
    borderColor: Colors.secondary,
    transform: [{ scale: 0.95 }],
  },
  tapZoneDisabled: {
    opacity: 0.5,
    borderColor: Colors.border,
  },
  tapEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  tapCountText: {
    fontFamily: Fonts.bold,
    fontSize: 36,
    color: Colors.textPrimary,
  },
  tapLabel: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  recordButtonContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 8px rgba(30, 111, 217, 0.3)',
  },
  recordButtonActive: {
    backgroundColor: Colors.error,
  },
  recordButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  stopIcon: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: Colors.textPrimary,
  },
  recordHint: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 10,
  },
  privacyNote: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  buttonWrapper: {
    flex: 1,
  },
});
