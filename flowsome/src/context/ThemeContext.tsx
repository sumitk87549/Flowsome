import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { Easing, SharedValue, useSharedValue, withTiming } from 'react-native-reanimated';
import { AppTheme } from '../types';
import { useAppStore } from '../store/appStore';

export interface SceneValues {
  transition: SharedValue<number>;
  prevTheme: AppTheme;
  nextTheme: AppTheme;
  theme: AppTheme;
  isDark: boolean;
  darkValue: SharedValue<number>;
}

const SceneContext = createContext<SceneValues | null>(null);

function resolveDarkMode(themeMode: 'auto' | 'light' | 'dark', scheme: ColorSchemeName): boolean {
  if (themeMode === 'dark') return true;
  if (themeMode === 'light') return false;
  return scheme === 'dark';
}

export function SceneEngine({ children }: { children: React.ReactNode }) {
  const theme = useAppStore((s) => s.currentTheme);
  const themeMode = useAppStore((s) => s.settings.themeMode);
  const [scheme, setScheme] = useState<ColorSchemeName>(Appearance.getColorScheme() ?? 'light');

  const prevThemeRef = useRef<AppTheme>(theme);
  const activeThemeRef = useRef<AppTheme>(theme);
  const transition = useSharedValue(1);
  const darkValue = useSharedValue(resolveDarkMode(themeMode, scheme) ? 1 : 0);
  const isFirstMount = useRef(true);
  const prevThemeId = useRef(theme.id);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setScheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      prevThemeId.current = theme.id;
      return;
    }

    if (theme.id !== prevThemeId.current) {
      prevThemeRef.current = activeThemeRef.current;
      activeThemeRef.current = theme;
      prevThemeId.current = theme.id;
      transition.value = 0;
      transition.value = withTiming(1, {
        duration: 950,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
      });
    }
  }, [theme.id, transition]);

  const isDark = resolveDarkMode(themeMode, scheme);

  useEffect(() => {
    darkValue.value = withTiming(isDark ? 1 : 0, {
      duration: 550,
      easing: Easing.inOut(Easing.ease),
    });
  }, [darkValue, isDark]);

  const value: SceneValues = useMemo(
    () => ({
      transition,
      prevTheme: prevThemeRef.current,
      nextTheme: theme,
      theme,
      isDark,
      darkValue,
    }),
    [darkValue, isDark, theme, transition]
  );

  return <SceneContext.Provider value={value}>{children}</SceneContext.Provider>;
}

export function useScene(): SceneValues {
  const ctx = useContext(SceneContext);
  if (!ctx) throw new Error('useScene() must be called inside <SceneEngine>.');
  return ctx;
}

export function useTheme(): AppTheme {
  return useScene().theme;
}
