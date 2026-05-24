import type { Language } from '@/store/types';

export interface LanguageOption {
  code: Language;
  label: string;     // shown to user, in native script
  english: string;   // English name for accessibility/fallback
  rtl?: boolean;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English',   english: 'English' },
  { code: 'es', label: 'Español',   english: 'Spanish' },
  { code: 'fr', label: 'Français',  english: 'French' },
  { code: 'zh', label: '中文',       english: 'Chinese' },
  { code: 'hi', label: 'हिन्दी',      english: 'Hindi' },
  { code: 'ar', label: 'العربية',   english: 'Arabic', rtl: true },
];

export function getLanguageOption(code: Language | undefined | null): LanguageOption {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
}
