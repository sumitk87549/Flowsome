import { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { DAWN_THEME, NIGHT_THEME, ThemeMode, ThemeTokens } from './tokens';

export const ThemeContext = createContext<ThemeTokens>(NIGHT_THEME);

export function useTheme() {
  return useContext(ThemeContext);
}

export function getThemeTokens(mode: ThemeMode, systemColorScheme: 'light' | 'dark' | null | undefined | 'unspecified'): ThemeTokens {
  if (mode === 'dawn') return DAWN_THEME;
  if (mode === 'night') return NIGHT_THEME;
  return systemColorScheme === 'light' ? DAWN_THEME : NIGHT_THEME;
}
