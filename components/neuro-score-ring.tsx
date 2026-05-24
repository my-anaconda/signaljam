import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import { useT } from '@/hooks/useT';
import type { StringKey } from '@/constants/Translations';

type ScoreLabel = 'Stable' | 'Watch & Track' | 'Check In';

interface NeuroScoreRingProps {
  score: number;
  size: number;
  scoreLabel: ScoreLabel;
}

const LABEL_KEYS: Record<ScoreLabel, StringKey> = {
  Stable: 'score.stable',
  'Watch & Track': 'score.watchTrack',
  'Check In': 'score.checkIn',
};

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
  const t = useT();
  const displayLabel = t(LABEL_KEYS[scoreLabel] ?? 'score.stable');
  const strokeWidth = size * 0.1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Animate via state to avoid useAnimatedProps SVG warnings on web
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    let frame: number;
    const startTime = Date.now();
    const duration = 1200;
    const target = score / 100;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      // Cubic ease-out
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimatedProgress(eased * target);

      if (t < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  const strokeDashoffset = circumference * (1 - animatedProgress);
  const ringColor = getLabelColor(scoreLabel);

  return (
    <View
      style={[styles.container, { width: size, height: size }]}
      accessibilityRole="none"
      accessibilityLabel={`Neuro score ${score} out of 100, status ${displayLabel}`}
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
        {/* Progress ring */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={ringColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation={-90}
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
          {displayLabel}
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
