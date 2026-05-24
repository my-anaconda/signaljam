import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';

interface MetricCardProps {
  icon: string;
  title: string;
  score: number;
  color: string;
}

export function MetricCard({ icon, title, score, color }: MetricCardProps) {
  const clampedScore = Math.max(0, Math.min(100, score));

  return (
    <View
      style={styles.card}
      accessibilityRole="summary"
      accessibilityLabel={`${title}: ${clampedScore} out of 100`}
    >
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={[styles.scoreValue, { color }]}>{clampedScore}</Text>
      </View>

      <View style={styles.progressBarBackground}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${clampedScore}%`, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: 16,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 18,
  },
  title: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.textPrimary,
    flex: 1,
  },
  scoreValue: {
    fontFamily: Fonts.bold,
    fontSize: 16,
  },
  progressBarBackground: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.border,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});
