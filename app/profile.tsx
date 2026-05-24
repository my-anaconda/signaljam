import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Switch,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import { useAppStore } from '@/store/useAppStore';
import type { AgeRange, BiologicalSex, UserProfile } from '@/store/types';

const AGE_RANGES: AgeRange[] = ['18-40', '41-60', '61-75', '75+'];
const BIO_SEX_OPTIONS: { label: string; value: BiologicalSex }[] = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const setProfile = useAppStore((s) => s.setProfile);
  const updateSettings = useAppStore((s) => s.updateSettings);

  const canGoBack = navigation.canGoBack();

  const [ageRange, setAgeRange] = useState<AgeRange | null>(null);
  const [biologicalSex, setBiologicalSex] = useState<BiologicalSex | null>(null);
  const [nickname, setNickname] = useState('');
  const [caregiverMode, setCaregiverMode] = useState(false);
  const [storageOptIn, setStorageOptIn] = useState(true);

  const handleSave = () => {
    if (!ageRange || !biologicalSex) return;

    const profile: UserProfile = {
      id: Date.now().toString(),
      nickname: nickname.trim() || undefined,
      ageRange,
      biologicalSex,
      caregiverMode,
      language: 'en',
      createdAt: new Date().toISOString(),
    };

    setProfile(profile);
    updateSettings({
      profileComplete: true,
      caregiverMode,
      storageOptIn,
    });

    router.replace('/(tabs)/home');
  };

  const isFormValid = ageRange !== null && biologicalSex !== null;

  return (
    <ScrollView
      style={[styles.container]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 32 },
      ]}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
    >
      {/* Back Button — only shown when there's a screen to go back to */}
      {canGoBack && (
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={22} color={Colors.textPrimary} />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
      )}

      <Text style={styles.title}>Set Up Your Profile</Text>

      {/* Age Range */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Age Range</Text>
        <View style={styles.pillRow}>
          {AGE_RANGES.map((range) => (
            <Pressable
              key={range}
              style={[
                styles.pill,
                ageRange === range && styles.pillActive,
              ]}
              onPress={() => setAgeRange(range)}
            >
              <Text
                style={[
                  styles.pillText,
                  ageRange === range && styles.pillTextActive,
                ]}
              >
                {range}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Biological Sex */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Biological Sex</Text>
        <Text style={styles.sectionSubLabel}>(for cohort matching)</Text>
        <View style={styles.pillRow}>
          {BIO_SEX_OPTIONS.map((option) => (
            <Pressable
              key={option.value}
              style={[
                styles.pill,
                biologicalSex === option.value && styles.pillActive,
              ]}
              onPress={() => setBiologicalSex(option.value)}
            >
              <Text
                style={[
                  styles.pillText,
                  biologicalSex === option.value && styles.pillTextActive,
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Name/Nickname */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Name / Nickname</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter name (optional)"
          placeholderTextColor={Colors.textMuted}
          value={nickname}
          onChangeText={setNickname}
          autoCapitalize="words"
          autoCorrect={false}
        />
      </View>

      {/* Caregiver Mode */}
      <View style={styles.section}>
        <View style={styles.toggleRow}>
          <View style={styles.toggleLabelContainer}>
            <Text style={styles.sectionLabel}>Caregiver Mode</Text>
            <Text style={styles.sectionSubLabel}>(monitoring someone else)</Text>
          </View>
          <Switch
            value={caregiverMode}
            onValueChange={setCaregiverMode}
            trackColor={{ false: Colors.border, true: Colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      {/* Local Data Storage */}
      <View style={styles.section}>
        <View style={styles.toggleRow}>
          <View style={styles.toggleLabelContainer}>
            <Text style={styles.sectionLabel}>Opt-in for Local Data Storage</Text>
            <Text style={styles.toggleDescription}>
              Securely save results on your device for trend tracking.
            </Text>
          </View>
          <Switch
            value={storageOptIn}
            onValueChange={setStorageOptIn}
            trackColor={{ false: Colors.border, true: Colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      {/* Save & Continue */}
      <Pressable
        style={[styles.button, !isFormValid && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={!isFormValid}
      >
        <Text style={styles.buttonText}>Save & Continue</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: 24,
    gap: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    minHeight: 44,
    marginBottom: 4,
    marginLeft: -4,
    gap: 2,
  },
  backButtonText: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 28,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  section: {
    gap: 12,
  },
  sectionLabel: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  sectionSubLabel: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: -8,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  pill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: 'transparent',
  },
  pillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pillText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  pillTextActive: {
    color: Colors.textPrimary,
  },
  input: {
    backgroundColor: Colors.inputBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 16,
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLabelContainer: {
    flex: 1,
    marginRight: 12,
    gap: 4,
  },
  toggleDescription: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    color: Colors.textPrimary,
  },
});
