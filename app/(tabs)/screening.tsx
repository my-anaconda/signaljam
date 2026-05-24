import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import { TaskCard } from '@/components/task-card';
import { PrimaryButton } from '@/components/primary-button';
import { useT } from '@/hooks/useT';

const TASK_DEFS = [
  { id: 'vocal-tone',    icon: '🎤', titleKey: 'task.vocalTone.title',    shortKey: 'task.vocalTone.short',    durationKey: 'task.vocalTone.duration',    stepNumber: 1 },
  { id: 'speech-rhythm', icon: '📖', titleKey: 'task.speechRhythm.title', shortKey: 'task.speechRhythm.short', durationKey: 'task.speechRhythm.duration', stepNumber: 2 },
  { id: 'tap-test',      icon: '👆', titleKey: 'task.tapTest.title',      shortKey: 'task.tapTest.short',      durationKey: 'task.tapTest.duration',      stepNumber: 3 },
] as const;

export default function ScreeningScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const t = useT();

  const handleBeginScreening = () => {
    router.push(
      `/recording/${TASK_DEFS[0].id}?step=1&total=${TASK_DEFS.length}`
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 24 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{t('screening.title')}</Text>
        <Text style={styles.subtitle}>
          {t('screening.subtitle', { count: TASK_DEFS.length })}
        </Text>
      </View>

      <View style={styles.taskList}>
        {TASK_DEFS.map((task) => (
          <TaskCard
            key={task.id}
            icon={task.icon}
            title={t(task.titleKey)}
            description={t(task.shortKey)}
            duration={t(task.durationKey)}
            stepNumber={task.stepNumber}
          />
        ))}
      </View>

      <View style={styles.ctaContainer}>
        <PrimaryButton
          title={t('screening.beginButton')}
          onPress={handleBeginScreening}
          icon={
            <Ionicons name="play" size={18} color={Colors.textPrimary} />
          }
        />
        <Text style={styles.ctaHint}>{t('screening.hint')}</Text>
      </View>
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
    marginBottom: 24,
  },
  ctaContainer: {
    gap: 10,
  },
  ctaHint: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
