import { Redirect } from "expo-router";
import { useAppStore } from "@/store/useAppStore";

export default function Index() {
  const settings = useAppStore((state) => state.settings);

  if (!settings.onboardingComplete) {
    return <Redirect href="/(onboarding)" />;
  }

  if (!settings.profileComplete) {
    return <Redirect href="/profile" />;
  }

  return <Redirect href="/(tabs)/home" />;
}
