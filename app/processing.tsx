import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle, Path, G } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';

const STEPS = [
  'Extracting vocal features',
  'Comparing to your baseline',
  'Generating your NeuroScore',
];

export default function ProcessingScreen() {
  const router = useRouter();
  const [completedSteps, setCompletedSteps] = useState(0);

  // Pulse animation for brain icon
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.6);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.6, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [pulseScale, pulseOpacity]);

  // Step progression
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(
      setTimeout(() => setCompletedSteps(1), 1000)
    );
    timers.push(
      setTimeout(() => setCompletedSteps(2), 2000)
    );
    timers.push(
      setTimeout(() => setCompletedSteps(3), 3000)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  // Navigate after all steps complete
  useEffect(() => {
    if (completedSteps === 3) {
      const timer = setTimeout(() => {
        router.replace('/results');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [completedSteps, router]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  return (
    <View style={styles.container}>
      {/* Animated Brain/Signal Graphic */}
      <Animated.View style={[styles.brainContainer, pulseStyle]}>
        <View style={styles.glowOuter}>
          <View style={styles.glowInner}>
            <Svg width={80} height={80} viewBox="0 0 64 64">
              <G fill="none" stroke={Colors.accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                {/* Brain outline - left hemisphere */}
                <Path d="M32 56V32" />
                <Path d="M32 32C32 24 28 20 24 18C20 16 16 17 14 20C12 23 12 26 14 29C11 30 9 33 9 36C9 39 11 42 14 43C13 45 13 48 15 50C17 52 20 53 23 52C24 55 27 57 30 57C31 57 32 56 32 56" />
                {/* Brain outline - right hemisphere */}
                <Path d="M32 32C32 24 36 20 40 18C44 16 48 17 50 20C52 23 52 26 50 29C53 30 55 33 55 36C55 39 53 42 50 43C51 45 51 48 49 50C47 52 44 53 41 52C40 55 37 57 34 57C33 57 32 56 32 56" />
                {/* Neural signal waves */}
                <Path d="M20 30C22 28 24 32 26 30" />
                <Path d="M38 30C40 28 42 32 44 30" />
                <Path d="M24 40C26 38 28 42 30 40" />
                <Path d="M34 40C36 38 38 42 40 40" />
              </G>
              {/* Center dot */}
              <Circle cx={32} cy={32} r={3} fill={Colors.accent} />
            </Svg>
          </View>
        </View>
      </Animated.View>

      {/* Title */}
      <Text style={styles.title}>Analyzing your signals...</Text>

      {/* Micro-copy */}
      <Text style={styles.subtitle}>
        Hold tight — we&apos;re crunching the numbers
      </Text>

      {/* Progress Steps */}
      <View style={styles.stepsContainer}>
        {STEPS.map((step, index) => {
          const isCompleted = completedSteps > index;
          return (
            <View key={step} style={styles.stepRow}>
              {isCompleted ? (
                <Ionicons
                  name="checkmark-circle"
                  size={22}
                  color={Colors.accent}
                />
              ) : (
                <View style={styles.pendingDot} />
              )}
              <Text
                style={[
                  styles.stepText,
                  {
                    color: isCompleted ? Colors.textPrimary : '#5A7A9A',
                  },
                ]}
              >
                {step}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  brainContainer: {
    marginBottom: 40,
  },
  glowOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(92, 225, 230, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowInner: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(92, 225, 230, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 24,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 48,
  },
  stepsContainer: {
    gap: 20,
    width: '100%',
    maxWidth: 300,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pendingDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#5A7A9A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    fontFamily: Fonts.medium,
    fontSize: 15,
  },
});
