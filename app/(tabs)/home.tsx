import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useAppStore';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import { NeuroScoreRing } from '@/components/neuro-score-ring';
import { Sparkline } from '@/components/sparkline';
import { GlassCard } from '@/components/glass-card';
import { PrimaryButton } from '@/components/primary-button';
import type { ScoreLabel } from '@/store/types';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function formatLastRecorded(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  const timeStr = date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });

  if (isToday) {
    return `Last recorded: Today, ${timeStr}`;
  }

  const dateStr = date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
  });
  return `Last recorded: ${dateStr}, ${timeStr}`;
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const profile = useAppStore((s) => s.profile);
  const sessions = useAppStore((s) => s.sessions);

  const nickname = profile?.nickname || 'there';
  const greeting = `${getGreeting()}, ${nickname}`;

  // Use latest session data or demo defaults
  const latestSession = sessions.length > 0 ? sessions[0] : null;
  const score = latestSession?.neuroScore ?? 94;
  const scoreLabel: ScoreLabel = latestSession?.scoreLabel ?? 'Stable';
  const lastRecordedText = latestSession
    ? formatLastRecorded(latestSession.date)
    : 'Last recorded: Today, 9:15 AM';

  // Last 7 session scores for sparkline
  const sparklineData =
    sessions.length >= 2
      ? sessions.slice(0, 7).map((s) => s.neuroScore).reverse()
      : [85, 88, 90, 87, 92, 91, 94];

  const cardPadding = 20;
  const horizontalPadding = 20;
  const sparklineWidth = windowWidth - horizontalPadding * 2 - cardPadding * 2;

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>{greeting}</Text>
        <View style={styles.headerIcons}>
          <Pressable
            style={styles.iconButton}
            accessibilityLabel="Toggle visibility"
          >
            <Ionicons name="eye-outline" size={22} color={Colors.textSecondary} />
          </Pressable>
          <Pressable
            style={styles.iconButton}
            onPress={() => router.push('/(tabs)/settings')}
            accessibilityLabel="Settings"
          >
            <Ionicons name="settings-outline" size={22} color={Colors.textSecondary} />
          </Pressable>
        </View>
      </View>

      {/* NeuroScore Ring */}
      <View style={styles.scoreSection}>
        <NeuroScoreRing score={score} size={220} scoreLabel={scoreLabel} />
        <Text style={styles.lastRecorded}>{lastRecordedText}</Text>
      </View>

      {/* Sparkline Card */}
      <GlassCard style={styles.sparklineCard}>
        <Text style={styles.sparklineTitle}>Last 7 Sessions</Text>
        <View style={styles.sparklineWrapper}>
          <Sparkline
            data={sparklineData}
            width={sparklineWidth > 0 ? sparklineWidth : 280}
            height={60}
            color={Colors.secondary}
          />
        </View>
      </GlassCard>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <PrimaryButton
          title="New Screening"
          onPress={() => router.push('/(tabs)/screening')}
          icon={
            <Ionicons name="mic-outline" size={20} color={Colors.textPrimary} />
          }
        />
        <View style={styles.secondaryButtons}>
          <View style={styles.halfButton}>
            <PrimaryButton
              title="View History"
              variant="outline"
              onPress={() => router.push('/(tabs)/history')}
            />
          </View>
          <View style={styles.halfButton}>
            <PrimaryButton
              title="Learn More"
              variant="outline"
              onPress={() => router.push('/(tabs)/learn')}
            />
          </View>
        </View>
      </View>
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
    paddingBottom: 40,
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
  },
  greeting: {
    fontFamily: Fonts.semiBold,
    fontSize: 22,
    color: Colors.textPrimary,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreSection: {
    alignItems: 'center',
    paddingVertical: 12,
    gap: 14,
  },
  lastRecorded: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  sparklineCard: {
    gap: 12,
  },
  sparklineTitle: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  sparklineWrapper: {
    alignItems: 'center',
  },
  actions: {
    gap: 12,
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  halfButton: {
    flex: 1,
  },
});
