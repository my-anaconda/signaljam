import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function GlassCard({ children, style }: GlassCardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(15, 32, 64, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(56, 182, 255, 0.15)',
    borderRadius: 20,
    borderCurve: 'continuous',
    padding: 20,
    overflow: 'hidden',
    boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.3)',
  },
});
