import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import { NeuroScoreRing } from '@/components/neuro-score-ring';
import { MetricCard } from '@/components/metric-card';
import { useAppStore } from '@/store/useAppStore';
import { useT } from '@/hooks/useT';
import { shareHistory } from '@/lib/shareHistory';
import type { Session, ScoreLabel } from '@/store/types';

function generateRandomScore(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function ResultsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const addSession = useAppStore((s) => s.addSession);
  const profile = useAppStore((s) => s.profile);
  const sessions = useAppStore((s) => s.sessions);
  const t = useT();

  const [saveResults, setSaveResults] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);

  // Generate scores on mount (useMemo to keep stable across re-renders)
  const scores = useMemo(() => {
    const neuroScore = generateRandomScore(85, 98);
    const vocalStability = generateRandomScore(84, 94);
    const speechRhythm = generateRandomScore(88, 96);
    const motorCoordination = generateRandomScore(90, 98);
    const baselineDrift = generateRandomScore(1, 4);

    return {
      neuroScore,
      vocalStability,
      speechRhythm,
      motorCoordination,
      baselineDrift,
    };
  }, []);

  const scoreLabel: ScoreLabel = scores.neuroScore >= 80 ? 'Stable' : 'Watch & Track';

  const saveSession = () => {
    const session: Session = {
      id: Date.now().toString(),
      userId: profile?.id ?? 'anonymous',
      date: new Date().toISOString(),
      neuroScore: scores.neuroScore,
      scoreLabel,
      vocalStabilityScore: scores.vocalStability,
      speechRhythmScore: scores.speechRhythm,
      motorCoordinationScore: scores.motorCoordination,
      baselineDrift: scores.baselineDrift,
      tasksCompleted: ['vocal', 'speech', 'motor'],
      isBaseline: false,
    };
    addSession(session);
  };

  const buildCurrentSession = (): Session => ({
    id: `current-${Date.now()}`,
    userId: profile?.id ?? 'anonymous',
    date: new Date().toISOString(),
    neuroScore: scores.neuroScore,
    scoreLabel,
    vocalStabilityScore: scores.vocalStability,
    speechRhythmScore: scores.speechRhythm,
    motorCoordinationScore: scores.motorCoordination,
    baselineDrift: scores.baselineDrift,
    tasksCompleted: ['vocal', 'speech', 'motor'],
    isBaseline: false,
  });

  const handleShareWithClinician = async () => {
    try {
      await shareHistory({
        sessions,
        profile,
        currentSession: buildCurrentSession(),
      });
    } catch (err) {
      Alert.alert('Share failed', err instanceof Error ? err.message : String(err));
    }
  };

  const handleStartNewScreening = () => {
    if (saveResults) {
      saveSession();
    }
    router.replace('/(tabs)/screening');
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.container,
        { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(600).delay(100)}>
        <Text style={styles.header}>{t('results.title')}</Text>
      </Animated.View>

      {/* NeuroScore Ring */}
      <Animated.View
        entering={FadeInDown.duration(800).delay(200)}
        style={styles.ringContainer}
      >
        <NeuroScoreRing
          score={scores.neuroScore}
          size={200}
          scoreLabel={scoreLabel}
        />
      </Animated.View>

      {/* Celebration text */}
      <Animated.View entering={FadeInDown.duration(600).delay(400)}>
        <Text style={styles.celebrationText}>{t('results.celebrate.title')}</Text>
        <Text style={styles.celebrationSubtext}>
          {t('results.celebrate.subtitle')}
        </Text>
      </Animated.View>

      {/* Metric Cards */}
      <Animated.View
        entering={FadeInDown.duration(600).delay(600)}
        style={styles.metricsContainer}
      >
        <MetricCard
          icon="🎵"
          title={t('results.metric.vocal')}
          score={scores.vocalStability}
          color="#2196F3"
        />
        <MetricCard
          icon="🗣️"
          title={t('results.metric.speech')}
          score={scores.speechRhythm}
          color="#38B6FF"
        />
        <MetricCard
          icon="👆"
          title={t('results.metric.motor')}
          score={scores.motorCoordination}
          color="#5CE1E6"
        />
        <View style={styles.driftCard}>
          <View style={styles.driftHeader}>
            <Text style={styles.driftIcon}>{"📈"}</Text>
            <Text style={styles.driftTitle}>{t('results.metric.drift')}</Text>
            <Text style={styles.driftValue}>
              {t('results.drift.fromLast', { n: scores.baselineDrift })}
            </Text>
          </View>
          <View style={styles.driftBar}>
            <View style={[styles.driftBarFill, { width: `${Math.min(scores.baselineDrift * 10, 100)}%` }]} />
          </View>
        </View>
      </Animated.View>

      {/* What does this mean? */}
      <Animated.View
        entering={FadeInUp.duration(600).delay(800)}
        style={styles.explanationSection}
      >
        <Pressable
          onPress={() => setShowExplanation(!showExplanation)}
          style={styles.explanationToggle}
        >
          <Text style={styles.explanationTitle}>{t('results.explanation.toggle')}</Text>
          <Ionicons
            name={showExplanation ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={Colors.textSecondary}
          />
        </Pressable>
        {showExplanation && (
          <Text style={styles.explanationText}>{t('results.explanation.body')}</Text>
        )}
      </Animated.View>

      {/* Save Results Toggle */}
      <Animated.View
        entering={FadeInUp.duration(600).delay(900)}
        style={styles.saveRow}
      >
        <Text style={styles.saveLabel}>{t('results.save')}</Text>
        <Switch
          value={saveResults}
          onValueChange={setSaveResults}
          trackColor={{ false: Colors.border, true: Colors.primary }}
          thumbColor={saveResults ? Colors.accent : '#ccc'}
        />
      </Animated.View>

      {/* Action Buttons */}
      <Animated.View
        entering={FadeInUp.duration(600).delay(1000)}
        style={styles.buttonsContainer}
      >
        <Pressable
          onPress={handleShareWithClinician}
          style={styles.outlineButton}
        >
          <Ionicons name="share-outline" size={18} color={Colors.secondary} />
          <Text style={styles.outlineButtonText}>{t('results.share')}</Text>
        </Pressable>

        <Pressable
          onPress={handleStartNewScreening}
          style={styles.filledButton}
        >
          <Ionicons name="refresh" size={18} color={Colors.textPrimary} />
          <Text style={styles.filledButtonText}>{t('results.startNew')}</Text>
        </Pressable>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  header: {
    fontFamily: Fonts.bold,
    fontSize: 28,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 24,
  },
  ringContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  celebrationText: {
    fontFamily: Fonts.semiBold,
    fontSize: 20,
    color: Colors.accent,
    textAlign: 'center',
    marginBottom: 4,
  },
  celebrationSubtext: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  metricsContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 24,
  },
  driftCard: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: 16,
    gap: 12,
  },
  driftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  driftIcon: {
    fontSize: 18,
  },
  driftTitle: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.textPrimary,
    flex: 1,
  },
  driftValue: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: '#64B5F6',
  },
  driftBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.border,
    overflow: 'hidden',
  },
  driftBarFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#64B5F6',
  },
  explanationSection: {
    width: '100%',
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 20,
  },
  explanationToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  explanationTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  explanationText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
    marginTop: 12,
  },
  saveRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 24,
  },
  saveLabel: {
    fontFamily: Fonts.medium,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
  },
  outlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: Colors.secondary,
    borderRadius: 14,
    borderCurve: 'continuous',
    paddingVertical: 16,
  },
  outlineButtonText: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    color: Colors.secondary,
  },
  filledButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    borderCurve: 'continuous',
    paddingVertical: 16,
  },
  filledButtonText: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    color: Colors.textPrimary,
  },
});
