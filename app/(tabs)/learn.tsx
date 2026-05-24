import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import { GlassCard } from '@/components/glass-card';
import { useT } from '@/hooks/useT';
import type { StringKey } from '@/constants/Translations';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface LearnTopicKeys {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  titleKey: StringKey;
  previewKey: StringKey;
  contentKey: StringKey;
}

const TOPIC_KEYS: LearnTopicKeys[] = [
  { id: 'what-is-parkinsons', icon: 'medical-outline',     titleKey: 'learn.parkinsons.title', previewKey: 'learn.parkinsons.preview', contentKey: 'learn.parkinsons.content' },
  { id: 'scores-meaning',     icon: 'analytics-outline',   titleKey: 'learn.scores.title',     previewKey: 'learn.scores.preview',     contentKey: 'learn.scores.content' },
  { id: 'best-results',       icon: 'mic-outline',         titleKey: 'learn.tips.title',       previewKey: 'learn.tips.preview',       contentKey: 'learn.tips.content' },
  { id: 'faq',                icon: 'help-circle-outline', titleKey: 'learn.faq.title',        previewKey: 'learn.faq.preview',        contentKey: 'learn.faq.content' },
];

export default function LearnScreen() {
  const insets = useSafeAreaInsets();
  const t = useT();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = useCallback((id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Title */}
      <Text style={styles.title}>{t('learn.title')}</Text>

      {/* Topic Cards */}
      {TOPIC_KEYS.map((topic) => {
        const isExpanded = expandedIds.has(topic.id);
        return (
          <Pressable key={topic.id} onPress={() => toggleExpand(topic.id)}>
            <GlassCard style={styles.topicCard}>
              <View style={styles.topicHeader}>
                <View style={styles.iconContainer}>
                  <Ionicons name={topic.icon} size={24} color={Colors.secondary} />
                </View>
                <View style={styles.topicTextContainer}>
                  <Text style={styles.topicTitle}>{t(topic.titleKey)}</Text>
                  <Text style={styles.topicPreview}>{t(topic.previewKey)}</Text>
                </View>
                <Ionicons
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={Colors.textMuted}
                />
              </View>
              {isExpanded && (
                <View style={styles.topicContent}>
                  <View style={styles.divider} />
                  <Text style={styles.contentText}>{t(topic.contentKey)}</Text>
                </View>
              )}
            </GlassCard>
          </Pressable>
        );
      })}

      {/* Disclaimer */}
      <View style={styles.disclaimerContainer}>
        <Ionicons name="information-circle-outline" size={16} color={Colors.textMuted} />
        <Text style={styles.disclaimerText}>{t('learn.disclaimer')}</Text>
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
    gap: 16,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 28,
    color: Colors.textPrimary,
    paddingTop: 16,
    marginBottom: 4,
  },
  topicCard: {
    gap: 0,
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(56, 182, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicTextContainer: {
    flex: 1,
    gap: 2,
  },
  topicTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  topicPreview: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  topicContent: {
    marginTop: 14,
    gap: 12,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  contentText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  disclaimerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  disclaimerText: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 18,
  },
});
