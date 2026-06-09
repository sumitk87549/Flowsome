// hooks/useAudio.ts
import { useAudioPlayer, AudioSource } from 'expo-audio';
import { useEffect } from 'react';
import { useSettingsStore } from '../store/settingsStore';

// ─── Static asset map ────────────────────────────────────────────────────────
// require() calls MUST be static (no computed keys). List every track here.
const AMBIENT_TRACKS: Record<string, AudioSource> = {
  rajasthan: require('../assets/audio/ambient/rajasthan-desert-wind.mp3'),
  himalaya:  require('../assets/audio/ambient/himalaya-mountain-wind.mp3'),
  kerala:    require('../assets/audio/ambient/kerala-rain-river.mp3'),
  assam:     require('../assets/audio/ambient/assam-forest-birds.mp3'),
  andaman:   require('../assets/audio/ambient/andaman-ocean-waves.mp3'),
};

const BINAURAL_TRACKS: Record<string, AudioSource> = {
  alpha: require('../assets/audio/binaural/alpha-10hz.mp3'),
  theta: require('../assets/audio/binaural/theta-6hz.mp3'),
  delta: require('../assets/audio/binaural/delta-2hz.mp3'),
};

export const SFX_TRACKS: Record<string, AudioSource> = {
  ding:        require('../assets/audio/sfx/ding-soft.mp3'),
  singingBowl: require('../assets/audio/sfx/singing-bowl.mp3'),
  breathDone:  require('../assets/audio/sfx/breath-complete.mp3'),
};

// ─── Ambient Audio ────────────────────────────────────────────────────────────
// Loops continuously, changes when theme changes, responds to volume settings.
export function useAmbientAudio(theme: string, autoPlay: boolean = true) {
  const source = AMBIENT_TRACKS[theme] ?? AMBIENT_TRACKS['rajasthan'];
  const player = useAudioPlayer(source);
  const ambientVolume = useSettingsStore((s) => s.ambientVolume);

  useEffect(() => {
    player.loop = true;
    player.volume = ambientVolume;
    if (autoPlay) {
      player.play();
    }
    return () => {
      player.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, autoPlay]);

  // Respond to volume changes without restarting playback
  useEffect(() => {
    player.volume = ambientVolume;
  }, [ambientVolume, player]);

  return player;
}

// ─── Binaural Audio ───────────────────────────────────────────────────────────
// Loops during sessions (theta for meditation, alpha for focus, delta for sleep).
export function useBinauralAudio(mode: 'alpha' | 'theta' | 'delta', autoPlay: boolean = true) {
  const source = BINAURAL_TRACKS[mode];
  const player = useAudioPlayer(source);
  const binauralVolume = useSettingsStore((s) => s.binauralVolume);

  useEffect(() => {
    player.loop = true;
    player.volume = binauralVolume;
    if (autoPlay) {
      player.play();
    }
    return () => {
      player.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, autoPlay]);

  useEffect(() => {
    player.volume = binauralVolume;
  }, [binauralVolume, player]);

  return player;
}

// ─── SFX (one-shot sounds) ────────────────────────────────────────────────────
// Each sound is a separate player. Seeking to 0 before play allows replay.
export function useSFX() {
  const dingPlayer   = useAudioPlayer(SFX_TRACKS['ding']);
  const bowlPlayer   = useAudioPlayer(SFX_TRACKS['singingBowl']);
  const breathPlayer = useAudioPlayer(SFX_TRACKS['breathDone']);
  const sfxVolume    = useSettingsStore((s) => s.sfxVolume);

  const playDing = (): void => {
    dingPlayer.volume = sfxVolume;
    dingPlayer.seekTo(0);
    dingPlayer.play();
  };

  const playSingingBowl = (): void => {
    bowlPlayer.volume = sfxVolume;
    bowlPlayer.seekTo(0);
    bowlPlayer.play();
  };

  const playBreathDone = (): void => {
    breathPlayer.volume = sfxVolume;
    breathPlayer.seekTo(0);
    breathPlayer.play();
  };

  return { playDing, playSingingBowl, playBreathDone };
}
