import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { useSettings } from '@/context/SettingsContext';

export function useHaptic() {
  const { settings } = useSettings();

  const fire = useCallback(
    (
      style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light,
      isTransition: boolean = false
    ) => {
      const { sensoryProfile, transitionsOnly } = settings;

      // screenOnly — no haptics at all
      if (sensoryProfile === 'screenOnly') return;

      // still — no haptics at all
      if (sensoryProfile === 'still') return;

      // transitionsOnly — only fire for transition-moment haptics
      if (transitionsOnly && !isTransition) return;

      Haptics.impactAsync(style).catch(() => {
        // Haptics are non-critical — silently ignore errors
      });
    },
    [settings]
  );

  return { fire };
}
