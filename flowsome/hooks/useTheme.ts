// hooks/useTheme.ts
import { useAppStore } from '../store/appStore';
import { THEMES, ThemeColors, ThemeConfig } from '../constants/themes';

export function useTheme(): ThemeColors {
  const { activeTheme, dayNight } = useAppStore();
  const config = THEMES[activeTheme];
  return dayNight === 'day' ? config.dayColors : config.nightColors;
}

export function useThemeConfig(): ThemeConfig {
  const { activeTheme } = useAppStore();
  return THEMES[activeTheme];
}
