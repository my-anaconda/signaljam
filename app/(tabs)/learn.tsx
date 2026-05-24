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

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface LearnTopic {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  preview: string;
  content: string;
}

const topics: LearnTopic[] = [
  {
    id: 'what-is-parkinsons',
    icon: 'medical-outline',
    title: "What is Parkinson's?",
    preview: 'Brief overview of neurodegenerative diseases',
    content:
      "Parkinson's disease is a progressive nervous system disorder that affects movement. Early detection through signal analysis can help identify changes before clinical symptoms appear.",
  },
  {
    id: 'scores-meaning',
    icon: 'analytics-outline',
    title: 'What do these scores mean?',
    preview: 'Explanation of NeuroScore metrics',
    content:
      'Your NeuroScore is a composite of three measurements: vocal stability (pitch consistency), speech rhythm (fluency and timing), and motor coordination (finger tap regularity). Each is compared to your personal baseline.',
  },
  {
    id: 'best-results',
    icon: 'mic-outline',
    title: 'How to get the most accurate reading',
    preview: 'Tips for best results',
    content:
      'For best results: record in a quiet environment, hold your phone 6-8 inches from your mouth, try to relax and speak naturally, and test at the same time of day.',
  },
  {
    id: 'faq',
    icon: 'help-circle-outline',
    title: 'Frequently Asked Questions',
    preview: 'Common questions and answers',
    content:
      'Q: Is SignalJam a medical diagnosis?\nA: No. SignalJam is a screening and tracking tool. Always consult a healthcare professional for medical advice.\n\nQ: Is my data shared?\nA: No. All processing happens locally on your device. No audio is ever uploaded.',
  },
];

export default function LearnScreen() {
  const insets = useSafeAreaInsets();
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
      <Text style={styles.title}>Learn</Text>

      {/* Topic Cards */}
      {topics.map((topic) => {
        const isExpanded = expandedIds.has(topic.id);
        return (
          <Pressable key={topic.id} onPress={() => toggleExpand(topic.id)}>
            <GlassCard style={styles.topicCard}>
              <View style={styles.topicHeader}>
                <View style={styles.iconContainer}>
                  <Ionicons name={topic.icon} size={24} color={Colors.secondary} />
                </View>
                <View style={styles.topicTextContainer}>
                  <Text style={styles.topicTitle}>{topic.title}</Text>
                  <Text style={styles.topicPreview}>{topic.preview}</Text>
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
                  <Text style={styles.contentText}>{topic.content}</Text>
                </View>
              )}
            </GlassCard>
          </Pressable>
        );
      })}

      {/* Disclaimer */}
      <View style={styles.disclaimerContainer}>
        <Ionicons name="information-circle-outline" size={16} color={Colors.textMuted} />
        <Text style={styles.disclaimerText}>
          SignalJam is a screening tool, not a diagnostic device. Always consult a healthcare
          professional for medical concerns.
        </Text>
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
