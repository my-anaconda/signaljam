import React from 'react';
import { Modal, Pressable, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import { LANGUAGES } from '@/constants/Languages';
import { useT } from '@/hooks/useT';
import type { Language } from '@/store/types';

interface LanguagePickerModalProps {
  visible: boolean;
  selected: Language;
  onSelect: (language: Language) => void;
  onClose: () => void;
}

export function LanguagePickerModal({
  visible,
  selected,
  onSelect,
  onClose,
}: LanguagePickerModalProps) {
  const t = useT();
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => {}}>
          <Text style={styles.title}>{t('language.title')}</Text>
          {LANGUAGES.map((lang) => {
            const isSelected = lang.code === selected;
            return (
              <Pressable
                key={lang.code}
                style={({ pressed }) => [
                  styles.row,
                  isSelected && styles.rowSelected,
                  pressed && styles.rowPressed,
                ]}
                onPress={() => {
                  onSelect(lang.code);
                  onClose();
                }}
                accessibilityRole="button"
                accessibilityLabel={`Select language ${lang.english}`}
                accessibilityState={{ selected: isSelected }}
              >
                <View style={styles.rowText}>
                  <Text
                    style={[styles.label, lang.rtl && styles.rtl]}
                  >
                    {lang.label}
                  </Text>
                  <Text style={styles.english}>{lang.english}</Text>
                </View>
                {isSelected && (
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color={Colors.accent}
                  />
                )}
              </Pressable>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
  },
  title: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    color: Colors.textPrimary,
    paddingHorizontal: 8,
    paddingVertical: 10,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
  },
  rowSelected: {
    backgroundColor: Colors.cardBackgroundLight,
  },
  rowPressed: {
    opacity: 0.7,
  },
  rowText: {
    flex: 1,
  },
  label: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  rtl: {
    writingDirection: 'rtl',
  },
  english: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
