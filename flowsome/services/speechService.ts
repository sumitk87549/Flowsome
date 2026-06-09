// services/speechService.ts
import * as Speech from 'expo-speech';
import { useSettingsStore } from '../store/settingsStore';

export type Language = 'en-IN' | 'hi-IN';

export const SpeechService = {
  speak(text: string, languageOverride?: Language): void {
    const language = languageOverride ?? (useSettingsStore.getState().language as Language);
    Speech.stop();
    Speech.speak(text, {
      language,
      rate: 0.85,
      pitch: 1.0,
    });
  },

  stop(): void {
    Speech.stop();
  },

  async isSpeaking(): Promise<boolean> {
    return Speech.isSpeakingAsync();
  },
};

// Pre-built cue library — used by useSpeech hook and breathing session
export const BREATHING_CUES = {
  inhale:   { en: 'Inhale slowly',    hi: 'श्वास लें' },
  holdIn:   { en: 'Hold',             hi: 'रोकें' },
  exhale:   { en: 'Exhale slowly',    hi: 'श्वास छोड़ें' },
  holdOut:  { en: 'Rest',             hi: 'रुकें' },
  begin:    { en: 'Begin',            hi: 'शुरू करें' },
  complete: { en: 'Session complete', hi: 'सत्र पूर्ण' },
} as const;
