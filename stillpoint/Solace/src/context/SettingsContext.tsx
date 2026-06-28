import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SolaceSettings } from '@/types/settings';
import { readJson, writeJson, STORAGE_KEYS } from '@/utils/storage';

const DEFAULT_SETTINGS: SolaceSettings = {
  themeMode: 'system',
  
  workDuration: 25,
  shortRestDuration: 5,
  longRestDuration: 15,
  sessionsUntilLongRest: 4,
  
  restStyle: 'auto',
  visualIntensity: 'balanced',
  showReturnReflection: true,
  
  soundEnabled: true,
  bellsEnabled: true,
  ambientEnabled: true,
  ambientSound: 'forest',
  hapticsEnabled: true,
  bellVolume: 'medium',
  
  reducedMotion: false,
  particlesEnabled: true,
  fullScreenMode: true,
  
  autoStartRest: false,
  autoStartWork: false,
  keepScreenAwake: true,

  transitionsOnly: false,
  intentionWordEnabled: true,
  settleNoticeEnabled: true,
};

interface SettingsContextValue {
  settings: SolaceSettings;
  isLoaded: boolean;
  updateSetting: <K extends keyof SolaceSettings>(key: K, value: SolaceSettings[K]) => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children, onLoaded }: { children: React.ReactNode; onLoaded?: () => void }) {
  const [settings, setSettings] = useState<SolaceSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const stored = await readJson<SolaceSettings>(STORAGE_KEYS.SETTINGS);
        if (stored !== null) {
          // Merge stored settings with defaults in case new fields were added
          setSettings({ ...DEFAULT_SETTINGS, ...stored });
        }
      } catch (e) {
        console.error('[SettingsContext] Failed to load settings, using defaults:', e);
      } finally {
        setIsLoaded(true);
        onLoaded?.();
      }
    }
    loadSettings();
  }, [onLoaded]);

  const updateSetting = useCallback(<K extends keyof SolaceSettings>(key: K, value: SolaceSettings[K]) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      // Fire-and-forget write to AsyncStorage
      writeJson(STORAGE_KEYS.SETTINGS, next).catch((e) => {
        console.error('[SettingsContext] Failed to persist setting:', e);
      });
      return next;
    });
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, isLoaded, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
