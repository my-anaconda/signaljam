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
import { useT } from '@/hooks/useT';
import type { ScoreLabel } from '@/store/types';

function getGreetingKey(): 'home.greeting.morning' | 'home.greeting.afternoon' | 'home.greeting.evening' {
  const hour = new Date().getHours();
  if (hour < 12) return 'home.greeting.morning';
  if (hour < 18) return 'home.greeting.afternoon';
  return 'home.greeting.evening';
}

function formatLastRecorded(dateString: string, todayLabel: string, lastRecordedLabel: string): string {
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
    return `${lastRecordedLabel}: ${todayLabel}, ${timeStr}`;
  }

  const dateStr = date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
  });
  return `${lastRecordedLabel}: ${dateStr}, ${timeStr}`;
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const profile = useAppStore((s) => s.profile);
  const sessions = useAppStore((s) => s.sessions);

  const t = useT();
  const nickname = profile?.nickname || t('home.defaultNickname');
  const greeting = `${t(getGreetingKey())}, ${nickname}`;

  const hasSessions = sessions.length > 0;
  const latestSession = hasSessions ? sessions[0] : null;
  const score = latestSession?.neuroScore ?? 0;
  const scoreLabel: ScoreLabel = latestSession?.scoreLabel ?? 'Stable';
  const lastRecordedText = latestSession
    ? formatLastRecorded(latestSession.date, t('common.today'), t('home.lastRecorded'))
    : null;

  const sparklineData =
    sessions.length >= 2
      ? sessions.slice(0, 7).map((s) => s.neuroScore).reverse()
      : null;

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

      {/* NeuroScore Ring or empty state */}
      {hasSessions ? (
        <View style={styles.scoreSection}>
          <NeuroScoreRing score={score} size={220} scoreLabel={scoreLabel} />
          {lastRecordedText && (
            <Text style={styles.lastRecorded}>{lastRecordedText}</Text>
          )}
        </View>
      ) : (
        <GlassCard style={styles.emptyCard}>
          <Ionicons name="pulse-outline" size={36} color={Colors.secondary} />
          <Text style={styles.emptyTitle}>{t('home.empty.title')}</Text>
          <Text style={styles.emptyBody}>{t('home.empty.body')}</Text>
        </GlassCard>
      )}

      {/* Sparkline Card — only after 2+ sessions */}
      {sparklineData && (
        <GlassCard style={styles.sparklineCard}>
          <Text style={styles.sparklineTitle}>{t('home.lastSessions')}</Text>
          <View style={styles.sparklineWrapper}>
            <Sparkline
              data={sparklineData}
              width={sparklineWidth > 0 ? sparklineWidth : 280}
              height={60}
              color={Colors.secondary}
            />
          </View>
        </GlassCard>
      )}

      {/* Action Buttons */}
      <View style={styles.actions}>
        <PrimaryButton
          title={t('home.newScreening')}
          onPress={() => router.push('/(tabs)/screening')}
          icon={
            <Ionicons name="mic-outline" size={20} color={Colors.textPrimary} />
          }
        />
        <View style={styles.secondaryButtons}>
          <View style={styles.halfButton}>
            <PrimaryButton
              title={t('home.viewHistory')}
              variant="outline"
              onPress={() => router.push('/(tabs)/history')}
            />
          </View>
          <View style={styles.halfButton}>
            <PrimaryButton
              title={t('home.learnMore')}
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
  emptyCard: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 28,
  },
  emptyTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 17,
    color: Colors.textPrimary,
  },
  emptyBody: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 12,
    lineHeight: 19,
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
