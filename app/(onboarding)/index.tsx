import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle, Path, Defs, LinearGradient, Stop } from "react-native-svg";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Typography";
import { getLanguageOption } from "@/constants/Languages";
import { LanguagePickerModal } from "@/components/language-picker-modal";
import { useAppStore } from "@/store/useAppStore";
import { useT } from "@/hooks/useT";

const SLIDE_KEYS = [
  { number: 1, titleKey: 'onboarding.slide1.title', descKey: 'onboarding.slide1.desc' },
  { number: 2, titleKey: 'onboarding.slide2.title', descKey: 'onboarding.slide2.desc' },
  { number: 3, titleKey: 'onboarding.slide3.title', descKey: 'onboarding.slide3.desc' },
] as const;

function SignalJamLogo() {
  return (
    <Svg width={80} height={80} viewBox="0 0 80 80" fill="none">
      <Defs>
        <LinearGradient id="logoGrad" x1="0" y1="0" x2="80" y2="80">
          <Stop offset="0%" stopColor={Colors.accent} />
          <Stop offset="100%" stopColor={Colors.secondary} />
        </LinearGradient>
      </Defs>
      <Circle cx={40} cy={40} r={38} stroke="url(#logoGrad)" strokeWidth={3} fill="none" />
      {/* Signal wave paths */}
      <Path
        d="M20 40 C24 30, 28 50, 32 40 C36 30, 40 50, 44 40 C48 30, 52 50, 56 40 C60 30, 64 50, 60 40"
        stroke={Colors.accent}
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M22 48 C26 42, 30 54, 34 48 C38 42, 42 54, 46 48 C50 42, 54 54, 58 48"
        stroke={Colors.secondary}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
        opacity={0.7}
      />
      <Path
        d="M24 32 C28 26, 32 38, 36 32 C40 26, 44 38, 48 32 C52 26, 56 38, 54 32"
        stroke={Colors.primary}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
        opacity={0.6}
      />
    </Svg>
  );
}

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const updateSettings = useAppStore((s) => s.updateSettings);
  const language = useAppStore((s) => s.settings.language);
  const [activeSlide, setActiveSlide] = useState(0);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const t = useT();

  const currentLanguage = getLanguageOption(language);
  const slides = SLIDE_KEYS.map((s) => ({
    number: s.number,
    title: t(s.titleKey),
    description: t(s.descKey),
  }));

  const slideWidth = width - 64; // horizontal padding 32 each side

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / slideWidth);
    setActiveSlide(index);
  };

  const handleGetStarted = () => {
    updateSettings({ onboardingComplete: true });
    router.replace("/profile");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 },
      ]}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      {/* Logo */}
      <View style={styles.logoContainer}>
        <SignalJamLogo />
        <Text style={styles.appName}>SignalJam</Text>
        <Text style={styles.tagline}>{t('onboarding.tagline')}</Text>
      </View>

      {/* Slides */}
      <View style={styles.slidesWrapper}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={{ flexGrow: 0 }}
          contentContainerStyle={styles.slidesContent}
          snapToInterval={slideWidth}
          decelerationRate="fast"
        >
          {slides.map((slide) => (
            <View
              key={slide.number}
              style={[styles.slideCard, { width: slideWidth }]}
            >
              <View style={styles.slideNumber}>
                <Text style={styles.slideNumberText}>{slide.number}</Text>
              </View>
              <Text style={styles.slideTitle}>{slide.title}</Text>
              <Text style={styles.slideDescription}>{slide.description}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Dot indicators */}
        <View style={styles.dotsContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === activeSlide ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Language selector */}
      <View style={styles.languageContainer}>
        <Pressable
          style={styles.languageButton}
          onPress={() => setShowLanguagePicker(true)}
          accessibilityRole="button"
          accessibilityLabel={`Change language. Current: ${currentLanguage.english}`}
        >
          <Ionicons name="globe-outline" size={18} color={Colors.textSecondary} />
          <Text style={styles.languageText}>{currentLanguage.label}</Text>
          <Ionicons
            name="chevron-down"
            size={14}
            color={Colors.textSecondary}
          />
        </Pressable>
      </View>

      <LanguagePickerModal
        visible={showLanguagePicker}
        selected={language}
        onSelect={(code) => updateSettings({ language: code })}
        onClose={() => setShowLanguagePicker(false)}
      />

      {/* Get Started button */}
      <Pressable
        style={({ pressed }) => [
          styles.ctaButton,
          pressed && styles.ctaButtonPressed,
        ]}
        onPress={handleGetStarted}
      >
        <Text style={styles.ctaButtonText}>{t('onboarding.getStarted')}</Text>
      </Pressable>

      {/* Disclaimer */}
      <Text style={styles.disclaimer}>{t('onboarding.disclaimer')}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 32,
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  appName: {
    fontFamily: Fonts.bold,
    fontSize: 32,
    color: Colors.textPrimary,
    marginTop: 16,
    letterSpacing: 0.5,
  },
  tagline: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: "center",
    lineHeight: 22,
  },
  slidesWrapper: {
    width: "100%",
    marginBottom: 32,
  },
  slidesContent: {
    // No extra padding; slides fill their width
  },
  slideCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    minHeight: 160,
    justifyContent: "center",
  },
  slideNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  slideNumberText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  slideTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: "center",
  },
  slideDescription: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: Colors.accent,
    width: 24,
    borderRadius: 4,
  },
  dotInactive: {
    backgroundColor: Colors.textMuted,
    opacity: 0.5,
  },
  languageContainer: {
    marginBottom: 24,
    alignItems: "center",
  },
  languageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 8,
    minHeight: 44,
  },
  languageText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  ctaButton: {
    width: "100%",
    height: 56,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  ctaButtonPressed: {
    opacity: 0.85,
  },
  ctaButtonText: {
    fontFamily: Fonts.semiBold,
    fontSize: 17,
    color: Colors.textPrimary,
  },
  disclaimer: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 16,
  },
});
