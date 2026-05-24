import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'filled' | 'outline';
  disabled?: boolean;
  icon?: React.ReactNode;
}

export function PrimaryButton({
  title,
  onPress,
  variant = 'filled',
  disabled = false,
  icon,
}: PrimaryButtonProps) {
  const isFilled = variant === 'filled';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        isFilled ? styles.filled : styles.outline,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled }}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text
        style={[
          styles.text,
          isFilled ? styles.filledText : styles.outlineText,
          disabled && styles.disabledText,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 14,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 8,
  },
  filled: {
    backgroundColor: Colors.primary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
  },
  filledText: {
    color: Colors.textPrimary,
  },
  outlineText: {
    color: Colors.primary,
  },
  disabledText: {
    color: Colors.textMuted,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
