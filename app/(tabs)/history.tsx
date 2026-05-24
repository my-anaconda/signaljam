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
import type { ScoreLabel } from '@/store/types';

interface DemoSession {
  id: string;
  date: string;
  neuroScore: number;
  scoreLabel: ScoreLabel;
  vocalStabilityScore: number;
  speechRhythmScore: number;
  motorCoordinationScore: number;
  baselineDrift: number;
}

const demoSessions: DemoSession[] = [
  { id: '1', date: '2026-05-24', neuroScore: 94, scoreLabel: 'Stable', vocalStabilityScore: 88, speechRhythmScore: 92, motorCoordinationScore: 95, baselineDrift: 2 },
  { id: '2', date: '2026-05-22', neuroScore: 91, scoreLabel: 'Stable', vocalStabilityScore: 86, speechRhythmScore: 90, motorCoordinationScore: 93, baselineDrift: 1 },
  { id: '3', date: '2026-05-20', neuroScore: 89, scoreLabel: 'Stable', vocalStabilityScore: 84, speechRhythmScore: 88, motorCoordinationScore: 91, baselineDrift: -1 },
  { id: '4', date: '2026-05-18', neuroScore: 92, scoreLabel: 'Stable', vocalStabilityScore: 87, speechRhythmScore: 91, motorCoordinationScore: 94, baselineDrift: 3 },
  { id: '5', date: '2026-05-16', neuroScore: 87, scoreLabel: 'Stable', vocalStabilityScore: 82, speechRhythmScore: 86, motorCoordinationScore: 89, baselineDrift: -2 },
  { id: '6', date: '2026-05-14', neuroScore: 90, scoreLabel: 'Stable', vocalStabilityScore: 85, speechRhythmScore: 89, motorCoordinationScore: 92, baselineDrift: 0 },
  { id: '7', date: '2026-05-12', neuroScore: 85, scoreLabel: 'Stable', vocalStabilityScore: 80, speechRhythmScore: 84, motorCoordinationScore: 87, baselineDrift: -1 },
];

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

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const sessions = useAppStore((s) => s.sessions);

  const displaySessions: DemoSession[] =
    sessions.length > 0
      ? sessions.map((s) => ({
          id: s.id,
          date: s.date,
          neuroScore: s.neuroScore,
          scoreLabel: s.scoreLabel,
          vocalStabilityScore: s.vocalStabilityScore,
          speechRhythmScore: s.speechRhythmScore,
          motorCoordinationScore: s.motorCoordinationScore,
          baselineDrift: s.baselineDrift,
        }))
      : demoSessions;

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
          <Text style={styles.emptyTitle}>No sessions yet</Text>
          <Text style={styles.emptyMessage}>
            Complete your first screening to see trends here.
          </Text>
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
      <Text style={styles.title}>History & Trends</Text>

      {/* Main Trend Chart */}
      <GlassCard style={styles.chartCard}>
        <Text style={styles.chartTitle}>NeuroScore Over Time</Text>
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
          <Text style={styles.miniTrendLabel}>Vocal</Text>
          <Sparkline
            data={vocalScores}
            width={miniSparklineWidth > 0 ? miniSparklineWidth : 80}
            height={40}
            color={Colors.accent}
          />
        </View>
        <View style={styles.miniTrendItem}>
          <Text style={styles.miniTrendLabel}>Speech</Text>
          <Sparkline
            data={speechScores}
            width={miniSparklineWidth > 0 ? miniSparklineWidth : 80}
            height={40}
            color={Colors.primary}
          />
        </View>
        <View style={styles.miniTrendItem}>
          <Text style={styles.miniTrendLabel}>Motor</Text>
          <Sparkline
            data={motorScores}
            width={miniSparklineWidth > 0 ? miniSparklineWidth : 80}
            height={40}
            color={Colors.stable}
          />
        </View>
      </View>

      {/* Session List */}
      <Text style={styles.sectionTitle}>Sessions</Text>
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
              {session.scoreLabel}
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
