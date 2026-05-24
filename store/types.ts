export interface Preferences {}

export type Language = 'en' | 'es' | 'fr' | 'zh' | 'hi' | 'ar';
export type AgeRange = '18-40' | '41-60' | '61-75' | '75+';
export type BiologicalSex = 'male' | 'female' | 'other';
export type ScoreLabel = 'Stable' | 'Watch & Track' | 'Check In';

export interface UserProfile {
  id: string;
  nickname?: string;
  ageRange: AgeRange;
  biologicalSex: BiologicalSex;
  caregiverMode: boolean;
  language: Language;
  createdAt: string;
}

export interface Session {
  id: string;
  userId: string;
  date: string;
  neuroScore: number;
  scoreLabel: ScoreLabel;
  vocalStabilityScore: number;
  speechRhythmScore: number;
  motorCoordinationScore: number;
  baselineDrift: number;
  tasksCompleted: string[];
  isBaseline: boolean;
}

export interface Baseline {
  userId: string;
  sessionId: string;
  mfccHash: string;
  createdAt: string;
}

export interface AppSettings {
  language: Language;
  storageOptIn: boolean;
  remindersEnabled: boolean;
  reminderTime?: string;
  caregiverMode: boolean;
  onboardingComplete: boolean;
  profileComplete: boolean;
}
