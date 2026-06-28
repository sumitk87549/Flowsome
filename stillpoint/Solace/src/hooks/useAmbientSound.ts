import { useEffect, useRef, useState } from 'react';
import { useAudioPlayer } from 'expo-audio';
import { useSettings } from '@/context/SettingsContext';
import { AMBIENT_FADE_IN_MS, AMBIENT_FADE_OUT_MS } from '@/constants/timing';

// Map from the settings ambientSound value to the actual audio file
const AMBIENT_SOUND_FILES: Record<string, any> = {
  forest:   require('../../assets/sounds/ambient_forest.mp3'),
  rain:     require('../../assets/sounds/ambient_rain.mp3'),
  ocean:    require('../../assets/sounds/ambient_ocean.mp3'),
  desert:   require('../../assets/sounds/ambient_desert.mp3'),
  mountain: require('../../assets/sounds/ambient_mountain.mp3'),
};

interface UseAmbientSoundReturn {
  startAmbient: (fadeInMs?: number) => void;
  stopAmbient: (fadeOutMs?: number, onComplete?: () => void) => void;
  isPlaying: boolean;
}

export function useAmbientSound(): UseAmbientSoundReturn {
  const { settings } = useSettings();
  const sensoryProfile = settings.sensoryProfile;
  const ambientSound = settings.ambientSound;
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Determine which audio file to load based on settings
  const soundFile = AMBIENT_SOUND_FILES[ambientSound] ?? AMBIENT_SOUND_FILES.forest;

  // Load the audio player for the correct file
  const player = useAudioPlayer(soundFile);

  // Clear any running fade interval on unmount
  useEffect(() => {
    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
    };
  }, []);

  /**
   * Start ambient sound with a fade-in over fadeInMs.
   */
  function startAmbient(fadeInMs: number = AMBIENT_FADE_IN_MS) {
    // Respect sensory profile — 'still' and 'screenOnly' suppress ambient audio
    const shouldPlayAmbient = sensoryProfile === 'full' || sensoryProfile === 'quiet';
    if (!shouldPlayAmbient) {
      return;
    }

    // Clear any existing fade
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    // Start playing at volume 0
    player.volume = 0;
    player.loop = true;
    player.play();
    setIsPlaying(true);

    const steps = fadeInMs / 100;
    const stepSize = 1 / steps;
    let currentVolume = 0;

    fadeIntervalRef.current = setInterval(() => {
      currentVolume = Math.min(currentVolume + stepSize, 1);
      player.volume = currentVolume;
      if (currentVolume >= 1) {
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      }
    }, 100);
  }

  /**
   * Fade out ambient sound over fadeOutMs, then stop.
   */
  function stopAmbient(fadeOutMs: number = AMBIENT_FADE_OUT_MS, onComplete?: () => void) {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    const steps = fadeOutMs / 100;
    const stepSize = 1 / steps;
    let currentVolume = player.volume ?? 1;

    fadeIntervalRef.current = setInterval(() => {
      currentVolume = Math.max(currentVolume - stepSize, 0);
      player.volume = currentVolume;
      
      if (currentVolume <= 0) {
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        player.pause();
        setIsPlaying(false);
        onComplete?.();
      }
    }, 100);
  }

  return { startAmbient, stopAmbient, isPlaying };
}
