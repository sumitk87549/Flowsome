// components/audio/AudioManager.tsx
// Headless global ambient audio controller.
// Mount this ONCE on the home screen (app/index.tsx).
// It returns null — no UI, audio only.
import { useAppStore } from '../../store/appStore';
import { useAmbientAudio } from '../../hooks/useAudio';

export function AudioManager(): null {
  const activeTheme = useAppStore((s) => s.activeTheme);
  useAmbientAudio(activeTheme, true);
  return null;
}
