// hooks/useSpeech.ts
import { useSettingsStore } from '../store/settingsStore';
import { SpeechService, BREATHING_CUES } from '../services/speechService';
import { useAudioPlayer } from 'expo-audio';
import { TTS_TRACKS } from './useAudio';
import * as Speech from 'expo-speech';

export function useSpeech() {
  const language = useSettingsStore((s) => s.language) as 'en-IN' | 'hi-IN';

  const inhaleEnPlayer = useAudioPlayer(TTS_TRACKS['inhale-en']);
  const inhaleHiPlayer = useAudioPlayer(TTS_TRACKS['inhale-hi']);
  const holdEnPlayer = useAudioPlayer(TTS_TRACKS['hold-en']);
  const holdHiPlayer = useAudioPlayer(TTS_TRACKS['hold-hi']);
  const exhaleEnPlayer = useAudioPlayer(TTS_TRACKS['exhale-en']);
  const exhaleHiPlayer = useAudioPlayer(TTS_TRACKS['exhale-hi']);
  const restEnPlayer = useAudioPlayer(TTS_TRACKS['rest-en']);
  const restHiPlayer = useAudioPlayer(TTS_TRACKS['rest-hi']);

  const playLocalCue = (cueKey: string) => {
    const isHi = language === 'hi-IN';
    let player = null;
    if (cueKey === 'inhale') player = isHi ? inhaleHiPlayer : inhaleEnPlayer;
    else if (cueKey === 'hold') player = isHi ? holdHiPlayer : holdEnPlayer;
    else if (cueKey === 'exhale') player = isHi ? exhaleHiPlayer : exhaleEnPlayer;
    else if (cueKey === 'rest') player = isHi ? restHiPlayer : restEnPlayer;

    if (player) {
      try {
        player.seekTo(0);
        player.play();
      } catch (_) {}
    }
  };

  const speakCue = (key: keyof typeof BREATHING_CUES): void => {
    const cue = BREATHING_CUES[key];
    const text = language === 'hi-IN' ? cue.hi : cue.en;
    
    let localKey = '';
    if (key === 'inhale') localKey = 'inhale';
    else if (key === 'holdIn') localKey = 'hold';
    else if (key === 'exhale') localKey = 'exhale';
    else if (key === 'holdOut') localKey = 'rest';

    try {
      Speech.stop();
      Speech.speak(text, {
        language,
        rate: 0.85,
        pitch: 1.0,
        onError: () => {
          if (localKey) {
            playLocalCue(localKey);
          }
        }
      });
    } catch (e) {
      if (localKey) {
        playLocalCue(localKey);
      }
    }
  };

  const speak = (text: string): void => {
    SpeechService.speak(text, language);
  };

  const stop = (): void => {
    SpeechService.stop();
  };

  return { speak, speakCue, stop, language };
}
