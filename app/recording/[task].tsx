import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import { WaveformVisualizer } from '@/components/waveform-visualizer';
import { PrimaryButton } from '@/components/primary-button';

const TASK_CONFIG: Record<
  string,
  { title: string; duration: number; instruction: string }
> = {
  'vocal-tone': {
    title: 'Vocal Tone',
    duration: 10,
    instruction: "Sustain a steady vowel sound 'Aaah' for the duration.",
  },
  'speech-rhythm': {
    title: 'Speech Rhythm',
    duration: 60,
    instruction: 'Read the passage aloud clearly at a comfortable pace.',
  },
  'tap-test': {
    title: 'Tap Test',
    duration: 30,
    instruction: 'Tap the zone below steadily to the rhythm.',
  },
};

export default function RecordingScreen() {
  const router = useRouter();
  const { task } = useLocalSearchParams<{ task: string }>();
  const insets = useSafeAreaInsets();

  const config = TASK_CONFIG[task ?? ''] ?? TASK_CONFIG['vocal-tone'];
  const isTapTest = task === 'tap-test';

  const [isRecording, setIsRecording] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(config.duration);
  const [tapCount, setTapCount] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);

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
    router.push('/processing');
  }, [router]);

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
          accessibilityLabel="Go back"
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>{config.title}</Text>
        <View style={styles.backButton} />
      </View>

      {/* Instruction */}
      <Text style={styles.instruction}>{config.instruction}</Text>

      {/* Timer */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
        <Text style={styles.timerLabel}>
          {isRecording ? 'Recording...' : hasRecorded ? 'Complete' : 'Ready'}
        </Text>
      </View>

      {/* Visualizer or Tap Zone */}
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
            <Text style={styles.tapLabel}>taps</Text>
          </Pressable>
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
          accessibilityLabel={isRecording ? 'Stop recording' : 'Start recording'}
        >
          {isRecording ? (
            <View style={styles.stopIcon} />
          ) : (
            <Ionicons name="mic" size={32} color={Colors.textPrimary} />
          )}
        </Pressable>
        <Text style={styles.recordHint}>
          {isRecording ? 'Tap to stop' : 'Tap to record'}
        </Text>
      </View>

      {/* Privacy Note */}
      <Text style={styles.privacyNote}>
        Your audio is processed locally and never stored without your permission
      </Text>

      {/* Action Buttons */}
      {hasRecorded && (
        <View style={styles.actionButtons}>
          <View style={styles.buttonWrapper}>
            <PrimaryButton
              title="Re-record"
              onPress={handleReRecord}
              variant="outline"
            />
          </View>
          <View style={styles.buttonWrapper}>
            <PrimaryButton title="Submit" onPress={handleSubmit} variant="filled" />
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
  headerTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 18,
    color: Colors.textPrimary,
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
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
