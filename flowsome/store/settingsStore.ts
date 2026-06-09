// store/settingsStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'en-IN' | 'hi-IN';

interface SettingsState {
  language: Language;
  ambientVolume: number;
  binauralVolume: number;
  sfxVolume: number;
  hapticsEnabled: boolean;
  keepAwakeEnabled: boolean;
  setLanguage: (lang: Language) => void;
  setAmbientVolume: (v: number) => void;
  setBinauralVolume: (v: number) => void;
  setSfxVolume: (v: number) => void;
  setHapticsEnabled: (v: boolean) => void;
  setKeepAwakeEnabled: (v: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: 'en-IN',
      ambientVolume: 0.6,
      binauralVolume: 0.3,
      sfxVolume: 0.8,
      hapticsEnabled: true,
      keepAwakeEnabled: true,
      setLanguage: (language) => set({ language }),
      setAmbientVolume: (ambientVolume) => set({ ambientVolume }),
      setBinauralVolume: (binauralVolume) => set({ binauralVolume }),
      setSfxVolume: (sfxVolume) => set({ sfxVolume }),
      setHapticsEnabled: (hapticsEnabled) => set({ hapticsEnabled }),
      setKeepAwakeEnabled: (keepAwakeEnabled) => set({ keepAwakeEnabled }),
    }),
    {
      name: 'flowsome-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
