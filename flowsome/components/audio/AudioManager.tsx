// Sprint 9 — components/audio/AudioManager.tsx
// Headless global ambient audio controller.
// Mount this ONCE on the home screen (app/index.tsx).
// It returns null — no UI, audio only.
import { useEffect } from 'react';
import { useAppStore } from '../../store/appStore';
import { useAmbientAudio } from '../../hooks/useAudio';

export function AudioManager(): null {
  const activeTheme = useAppStore((s) => s.activeTheme);
  const player = useAmbientAudio(activeTheme, true);

  useEffect(() => {
    return () => {
      const { isSessionActive } = useAppStore.getState();
      if (!isSessionActive) {
        if (player) {
          try {
            if (typeof player.pause === 'function') {
              player.pause();
            } else if (typeof (player as any).stopAsync === 'function') {
              (player as any).stopAsync();
            }
          } catch (_) {}
        }
      }
    };
  }, [player]);

  return null;
}
