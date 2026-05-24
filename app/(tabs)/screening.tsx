import React from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import { TaskCard } from '@/components/task-card';

const TASKS = [
  {
    id: 'vocal-tone',
    icon: '🎤',
    title: 'Vocal Tone',
    description: "Sustain a steady vowel sound 'Aaah' for 5-10 seconds.",
    duration: 'Est. 15 sec',
    stepNumber: 1,
  },
  {
    id: 'speech-rhythm',
    icon: '📖',
    title: 'Speech Rhythm',
    description: 'Read a short passage aloud clearly.',
    duration: 'Est. 1 min',
    stepNumber: 2,
  },
  {
    id: 'tap-test',
    icon: '👆',
    title: 'Tap Test',
    description: 'Tap your finger on the screen to the rhythm.',
    duration: 'Est. 30 sec',
    stepNumber: 3,
  },
];

export default function ScreeningScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: insets.top + 20 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>New Screening Session</Text>
        <Text style={styles.subtitle}>Step 1 of 3</Text>
      </View>

      <View style={styles.taskList}>
        {TASKS.map((task) => (
          <TaskCard
            key={task.id}
            icon={task.icon}
            title={task.title}
            description={task.description}
            duration={task.duration}
            stepNumber={task.stepNumber}
            onStart={() => router.push(`/recording/${task.id}`)}
          />
        ))}
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.skipButton,
          pressed && styles.skipButtonPressed,
        ]}
        onPress={() => router.push('/processing')}
        accessibilityRole="button"
        accessibilityLabel="Skip all tasks"
      >
        <Text style={styles.skipButtonText}>Skip All</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 28,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: Fonts.medium,
    fontSize: 15,
    color: Colors.textSecondary,
  },
  taskList: {
    gap: 14,
  },
  skipButton: {
    alignSelf: 'center',
    marginTop: 28,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  skipButtonPressed: {
    opacity: 0.6,
  },
  skipButtonText: {
    fontFamily: Fonts.medium,
    fontSize: 15,
    color: Colors.textSecondary,
  },
});
