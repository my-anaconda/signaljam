import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useAppStore';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import { Sparkline } from '@/components/sparkline';
import { GlassCard } from '@/components/glass-card';
import { useT } from '@/hooks/useT';
import type { ScoreLabel } from '@/store/types';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function getScoreColor(label: ScoreLabel): string {
  switch (label) {
    case 'Stable':
      return Colors.stable;
    case 'Watch & Track':
      return Colors.watchTrack;
    case 'Check In':
      return Colors.checkIn;
    default:
      return Colors.stable;
  }
}

const SCORE_LABEL_KEYS: Record<ScoreLabel, 'score.stable' | 'score.watchTrack' | 'score.checkIn'> = {
  Stable: 'score.stable',
  'Watch & Track': 'score.watchTrack',
  'Check In': 'score.checkIn',
};

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const sessions = useAppStore((s) => s.sessions);
  const t = useT();

  const displaySessions = sessions;
  const hasData = displaySessions.length > 0;
  const cardPadding = 20;
  const horizontalPadding = 20;
  const sparklineWidth = windowWidth - horizontalPadding * 2 - cardPadding * 2;
  const miniSparklineWidth = (windowWidth - horizontalPadding * 2 - cardPadding * 2 - 24) / 3;

  // Reverse for chronological order in charts
  const neuroScores = [...displaySessions].reverse().map((s) => s.neuroScore);
  const vocalScores = [...displaySessions].reverse().map((s) => s.vocalStabilityScore);
  const speechScores = [...displaySessions].reverse().map((s) => s.speechRhythmScore);
  const motorScores = [...displaySessions].reverse().map((s) => s.motorCoordinationScore);

  if (!hasData) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.emptyState}>
          <Ionicons name="time-outline" size={64} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>{t('history.empty.title')}</Text>
          <Text style={styles.emptyMessage}>{t('history.empty.body')}</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Title */}
      <Text style={styles.title}>{t('history.title')}</Text>

      {/* Main Trend Chart */}
      <GlassCard style={styles.chartCard}>
        <Text style={styles.chartTitle}>{t('history.chartTitle')}</Text>
        <View style={styles.sparklineWrapper}>
          <Sparkline
            data={neuroScores}
            width={sparklineWidth > 0 ? sparklineWidth : 280}
            height={80}
            color={Colors.secondary}
          />
        </View>
      </GlassCard>

      {/* Mini Trends */}
      <View style={styles.miniTrendsRow}>
        <View style={styles.miniTrendItem}>
          <Text style={styles.miniTrendLabel}>{t('history.miniVocal')}</Text>
          <Sparkline
            data={vocalScores}
            width={miniSparklineWidth > 0 ? miniSparklineWidth : 80}
            height={40}
            color={Colors.accent}
          />
        </View>
        <View style={styles.miniTrendItem}>
          <Text style={styles.miniTrendLabel}>{t('history.miniSpeech')}</Text>
          <Sparkline
            data={speechScores}
            width={miniSparklineWidth > 0 ? miniSparklineWidth : 80}
            height={40}
            color={Colors.primary}
          />
        </View>
        <View style={styles.miniTrendItem}>
          <Text style={styles.miniTrendLabel}>{t('history.miniMotor')}</Text>
          <Sparkline
            data={motorScores}
            width={miniSparklineWidth > 0 ? miniSparklineWidth : 80}
            height={40}
            color={Colors.stable}
          />
        </View>
      </View>

      {/* Session List */}
      <Text style={styles.sectionTitle}>{t('history.sessions')}</Text>
      {displaySessions.map((session) => (
        <Pressable key={session.id} style={({ pressed }) => [
          styles.sessionCard,
          pressed && styles.sessionCardPressed,
        ]}>
          <View style={styles.sessionLeft}>
            <Text style={styles.sessionDate}>{formatDate(session.date)}</Text>
            <View style={styles.sessionMetrics}>
              <Text style={styles.sessionMetricText}>
                V:{session.vocalStabilityScore} S:{session.speechRhythmScore} M:{session.motorCoordinationScore}
              </Text>
            </View>
          </View>
          <View style={styles.sessionRight}>
            <View style={styles.scoreRow}>
              <View style={[styles.scoreDot, { backgroundColor: getScoreColor(session.scoreLabel) }]} />
              <Text style={styles.sessionScore}>{session.neuroScore}</Text>
            </View>
            <Text style={[styles.sessionLabel, { color: getScoreColor(session.scoreLabel) }]}>
              {t(SCORE_LABEL_KEYS[session.scoreLabel] ?? 'score.stable')}
            </Text>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: 20,
    gap: 16,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 28,
    color: Colors.textPrimary,
    paddingTop: 16,
    marginBottom: 4,
  },
  chartCard: {
    gap: 12,
  },
  chartTitle: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  sparklineWrapper: {
    alignItems: 'center',
  },
  miniTrendsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  miniTrendItem: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: 12,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  miniTrendLabel: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  sectionTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 18,
    color: Colors.textPrimary,
    marginTop: 8,
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sessionCardPressed: {
    opacity: 0.7,
  },
  sessionLeft: {
    gap: 4,
  },
  sessionDate: {
    fontFamily: Fonts.semiBold,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  sessionMetrics: {
    flexDirection: 'row',
  },
  sessionMetricText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textMuted,
  },
  sessionRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scoreDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sessionScore: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    color: Colors.textPrimary,
  },
  sessionLabel: {
    fontFamily: Fonts.medium,
    fontSize: 12,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 16,
  },
  emptyTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 20,
    color: Colors.textPrimary,
  },
  emptyMessage: {
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
