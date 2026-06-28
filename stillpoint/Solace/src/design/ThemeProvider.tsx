import React, { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeContext, getThemeTokens } from './theme';
import { useSettings } from '@/context/SettingsContext';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { settings, isLoaded } = useSettings();
  const systemColorScheme = useColorScheme();

  const themeTokens = useMemo(() => {
    if (!isLoaded) return getThemeTokens('system', systemColorScheme);
    return getThemeTokens(settings.themeMode, systemColorScheme);
  }, [settings.themeMode, systemColorScheme, isLoaded]);

  return (
    <ThemeContext.Provider value={themeTokens}>
      {children}
    </ThemeContext.Provider>
  );
}
