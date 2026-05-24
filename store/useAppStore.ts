import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserProfile, Session, AppSettings, Language } from './types';

interface AppState {
  // User
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;

  // Sessions
  sessions: Session[];
  addSession: (session: Session) => void;
  clearSessions: () => void;

  // Settings
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;

  // Actions
  reset: () => void;
}

const defaultSettings: AppSettings = {
  language: 'en',
  storageOptIn: true,
  remindersEnabled: false,
  caregiverMode: false,
  onboardingComplete: false,
  profileComplete: false,
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (profile) => set({ profile }),

      sessions: [],
      addSession: (session) =>
        set((state) => ({ sessions: [session, ...state.sessions] })),
      clearSessions: () => set({ sessions: [] }),

      settings: defaultSettings,
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      reset: () =>
        set({
          profile: null,
          sessions: [],
          settings: defaultSettings,
        }),
    }),
    {
      name: 'signaljam-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
