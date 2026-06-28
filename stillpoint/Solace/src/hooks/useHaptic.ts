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
      const { hapticsEnabled, transitionsOnly } = settings;

      if (!hapticsEnabled) return;

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
