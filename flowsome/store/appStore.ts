// store/appStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeId, DayNight } from '../constants/themes';

interface AppState {
  activeTheme: ThemeId;
  dayNight: DayNight;
  isSessionActive: boolean;
  setTheme: (theme: ThemeId) => void;
  setDayNight: (mode: DayNight) => void;
  setSessionActive: (active: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      activeTheme: 'rajasthan',
      dayNight: 'day',
      isSessionActive: false,
      setTheme: (theme) => set({ activeTheme: theme }),
      setDayNight: (mode) => set({ dayNight: mode }),
      setSessionActive: (active) => set({ isSessionActive: active }),
    }),
    {
      name: 'flowsome-app-state',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        activeTheme: state.activeTheme,
        dayNight: state.dayNight,
      }),
    }
  )
);
