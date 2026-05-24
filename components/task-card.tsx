import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';

interface TaskCardProps {
  icon: string;
  title: string;
  description: string;
  duration: string;
  onStart?: () => void;
  stepNumber: number;
}

export function TaskCard({
  icon,
  title,
  description,
  duration,
  onStart,
  stepNumber,
}: TaskCardProps) {
  return (
    <View style={styles.card} accessibilityRole="button" accessibilityLabel={`Step ${stepNumber}: ${title}. ${description}. Duration: ${duration}`}>
      <View style={styles.stepContainer}>
        <View style={styles.stepBadge}>
          <Text style={styles.stepText}>{stepNumber}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.icon}>{icon}</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.duration}>{duration}</Text>
      </View>

      {onStart && (
        <Pressable
          style={({ pressed }) => [
            styles.startButton,
            pressed && styles.startButtonPressed,
          ]}
          onPress={onStart}
          accessibilityRole="button"
          accessibilityLabel={`Start ${title}`}
        >
          <Text style={styles.startButtonText}>Start</Text>
        </Pressable>
      )}
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  stepContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.cardBackgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepText: {
    fontFamily: Fonts.semiBold,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  content: {
    flex: 1,
    gap: 4,
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
    fontFamily: Fonts.semiBold,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  description: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  duration: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  startButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonPressed: {
    opacity: 0.7,
  },
  startButtonText: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    color: Colors.textPrimary,
  },
});
