import { useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import {
  translate,
  type InterpolationValues,
  type StringKey,
} from '@/constants/Translations';

export function useT() {
  const language = useAppStore((s) => s.settings.language);
  return useCallback(
    (key: StringKey, values?: InterpolationValues) =>
      translate(language, key, values),
    [language]
  );
}
