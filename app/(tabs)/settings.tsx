import { ScrollView, View, Text, Pressable, Switch, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

function ToggleRow({
  label,
  value,
  onValueChange,
  description,
}: {
  label: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
  description?: string;
}) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        {description && <Text style={styles.rowDescription}>{description}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: Colors.border, true: Colors.primary }}
        thumbColor={Colors.textPrimary}
      />
    </View>
  );
}

function NavigationRow({
  label,
  value,
  onPress,
  destructive,
}: {
  label: string;
  value?: string;
  onPress: () => void;
  destructive?: boolean;
}) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <Text style={[styles.rowLabel, destructive && { color: Colors.error }]}>
        {label}
      </Text>
      {!destructive && (
        <View style={styles.rowRight}>
          {value && <Text style={styles.rowValue}>{value}</Text>}
          <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
        </View>
      )}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { settings, updateSettings, reset } = useAppStore();

  const handleDeleteData = () => {
    Alert.alert(
      'Delete All My Data',
      'Are you sure you want to delete all your data? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            reset();
            router.replace('/');
          },
        },
      ]
    );
  };

  const handleComingSoon = () => {
    Alert.alert('Coming Soon', 'Feature coming soon');
  };

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Settings</Text>

      {/* Preferences */}
      <SectionHeader title="Preferences" />
      <NavigationRow
        label="Language"
        value="English"
        onPress={handleComingSoon}
      />
      <ToggleRow
        label="Notification Reminders"
        value={settings.remindersEnabled}
        onValueChange={(val) => updateSettings({ remindersEnabled: val })}
      />
      <ToggleRow
        label="Caregiver Mode"
        value={settings.caregiverMode}
        onValueChange={(val) => updateSettings({ caregiverMode: val })}
      />

      {/* Data & Privacy */}
      <SectionHeader title="Data & Privacy" />
      <ToggleRow
        label="Local Data Storage"
        value={settings.storageOptIn}
        onValueChange={(val) => updateSettings({ storageOptIn: val })}
        description="Save results on your device"
      />
      <NavigationRow
        label="Export Data"
        onPress={handleComingSoon}
      />
      <NavigationRow
        label="Delete All My Data"
        onPress={handleDeleteData}
        destructive
      />

      {/* About */}
      <SectionHeader title="About" />
      <NavigationRow
        label="Privacy Policy"
        onPress={handleComingSoon}
      />
      <NavigationRow
        label="Terms of Service"
        onPress={handleComingSoon}
      />
      <NavigationRow
        label="About SignalJam"
        onPress={handleComingSoon}
      />

      <Text style={styles.version}>SignalJam v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  content: {
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  sectionHeader: {
    fontSize: 13,
    fontFamily: Fonts.semiBold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 24,
  },
  row: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  rowLabel: {
    fontSize: 15,
    fontFamily: Fonts.medium,
    color: Colors.textPrimary,
  },
  rowDescription: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textMuted,
    marginTop: 2,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rowValue: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textMuted,
    marginRight: 4,
  },
  version: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 32,
  },
});
