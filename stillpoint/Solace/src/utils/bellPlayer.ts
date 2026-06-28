import { useAudioPlayer } from 'expo-audio';
import { useCallback } from 'react';
import { useSettings } from '@/context/SettingsContext';

// Maps bell name to asset require
const BELL_ASSETS = {
  work_start: require('../../assets/sounds/bell_work_start.mp3'),
  work_end:   require('../../assets/sounds/bell_work_end.mp3'),
  long_break: require('../../assets/sounds/bell_long_break.mp3'),
} as const;

export type BellName = keyof typeof BELL_ASSETS;

export function useBell(bellName: BellName) {
  const { settings } = useSettings();
  const player = useAudioPlayer(BELL_ASSETS[bellName]);

  const play = useCallback(() => {
    const allowed = settings.soundEnabled && settings.bellsEnabled;
    if (!allowed) return;
    // One-shot: rewind to start, then play
    player.seekTo(0);
    player.play();
  }, [player, settings.soundEnabled, settings.bellsEnabled]);

  return { play };
}
