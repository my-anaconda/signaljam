import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedProps,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';

type ScoreLabel = 'Stable' | 'Watch & Track' | 'Check In';

interface NeuroScoreRingProps {
  score: number;
  size: number;
  scoreLabel: ScoreLabel;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const getLabelColor = (label: ScoreLabel): string => {
  switch (label) {
    case 'Stable':
      return Colors.stable;
    case 'Watch & Track':
      return Colors.watchTrack;
    case 'Check In':
      return Colors.checkIn;
  }
};

export function NeuroScoreRing({ score, size, scoreLabel }: NeuroScoreRingProps) {
  const strokeWidth = size * 0.1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(score / 100, {
      duration: 1200,
      easing: Easing.out(Easing.cubic),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  const ringColor = getLabelColor(scoreLabel);

  return (
    <View
      style={[styles.container, { width: size, height: size }]}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: score }}
      accessibilityLabel={`Neuro score ${score} out of 100, status ${scoreLabel}`}
    >
      <Svg width={size} height={size}>
        {/* Background ring */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={Colors.border}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Animated progress ring */}
        <AnimatedCircle
          cx={center}
          cy={center}
          r={radius}
          stroke={ringColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          rotation="-90"
          origin={`${center}, ${center}`}
        />
      </Svg>
      <View style={styles.labelContainer}>
        <Text
          style={[
            styles.scoreText,
            { fontSize: size * 0.28, color: Colors.textPrimary },
          ]}
        >
          {score}
        </Text>
        <Text
          style={[
            styles.labelText,
            { fontSize: size * 0.1, color: ringColor },
          ]}
        >
          {scoreLabel}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontFamily: Fonts.bold,
  },
  labelText: {
    fontFamily: Fonts.medium,
    marginTop: 2,
  },
});
