import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
  useAnimatedStyle,
} from 'react-native-reanimated';

interface WaveformVisualizerProps {
  isActive: boolean;
  barCount?: number;
  color?: string;
}

interface BarProps {
  isActive: boolean;
  color: string;
  index: number;
  barCount: number;
}

function WaveformBar({ isActive, color, index, barCount }: BarProps) {
  const height = useSharedValue(4);

  useEffect(() => {
    if (isActive) {
      const minHeight = 8;
      const maxHeight = 24 + Math.random() * 16;
      const duration = 300 + Math.random() * 400;
      const delay = index * (100 / barCount) * 10;

      height.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(maxHeight, {
              duration,
              easing: Easing.inOut(Easing.sin),
            }),
            withTiming(minHeight, {
              duration: duration * 0.8,
              easing: Easing.inOut(Easing.sin),
            })
          ),
          -1,
          true
        )
      );
    } else {
      height.value = withTiming(4, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  return (
    <Animated.View
      style={[
        styles.bar,
        { backgroundColor: color },
        animatedStyle,
      ]}
    />
  );
}

export function WaveformVisualizer({
  isActive,
  barCount = 30,
  color = '#38B6FF',
}: WaveformVisualizerProps) {
  return (
    <View
      style={styles.container}
      accessibilityRole="image"
      accessibilityLabel={isActive ? 'Audio waveform active' : 'Audio waveform inactive'}
    >
      {Array.from({ length: barCount }).map((_, index) => (
        <WaveformBar
          key={index}
          isActive={isActive}
          color={color}
          index={index}
          barCount={barCount}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    height: 48,
  },
  bar: {
    width: 3,
    borderRadius: 1.5,
    minHeight: 4,
  },
});
