// hooks/useSpeech.ts
import { useSettingsStore } from '../store/settingsStore';
import { SpeechService, BREATHING_CUES } from '../services/speechService';

export function useSpeech() {
  const language = useSettingsStore((s) => s.language) as 'en-IN' | 'hi-IN';

  const speakCue = (key: keyof typeof BREATHING_CUES): void => {
    const cue = BREATHING_CUES[key];
    SpeechService.speak(language === 'hi-IN' ? cue.hi : cue.en, language);
  };

  const speak = (text: string): void => {
    SpeechService.speak(text, language);
  };

  const stop = (): void => {
    SpeechService.stop();
  };

  return { speak, speakCue, stop, language };
}
