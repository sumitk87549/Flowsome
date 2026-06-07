import React, {
  createContext,
  useContext,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import {
  useSharedValue,
  withTiming,
  Easing,
  SharedValue,
} from 'react-native-reanimated';
import { AppTheme } from '../types';
import { useAppStore } from '../store/appStore';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SceneValues {
  /** 0 = previous theme fully visible, 1 = new theme fully visible */
  transition: SharedValue<number>;
  /** The theme that is animating OUT (used for cross-fade layer) */
  prevTheme: AppTheme;
  /** The theme that is animating IN */
  nextTheme: AppTheme;
  /** Convenience: the currently-active theme object (instant, for logic) */
  theme: AppTheme;
  /** Dark mode flag */
  darkMode: boolean;
  /** Dark mode shared value: 0 = light, 1 = dark */
  darkValue: SharedValue<number>;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const SceneContext = createContext<SceneValues | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

/**
 * SceneEngine drives animated cross-fades between themes.
 * When the active theme changes in Zustand, `transition` animates 0→1
 * over 600ms.  The ThemedBackground renders two gradient layers:
 *   - prevTheme layer at (1 - transition) opacity
 *   - nextTheme layer at (transition) opacity
 * All other color-driven values (accent, text) animate via `transition`.
 *
 * Architecture is unchanged: Zustand is still the source of truth.
 * Navigation, session engine, and store slices are untouched.
 */
export function SceneEngine({ children }: { children: React.ReactNode }) {
  const theme    = useAppStore((s) => s.currentTheme);
  const settings = useAppStore((s) => s.settings);

  // Track the previous theme so we can cross-fade
  const prevThemeRef = useRef<AppTheme>(theme);
  const prevTheme    = prevThemeRef.current;

  // Shared values
  const transition = useSharedValue(1);
  const darkValue  = useSharedValue(settings.darkMode ? 1 : 0);

  // When theme changes: snapshot the outgoing theme, reset transition to 0,
  // then animate to 1.
  const isFirstMount = useRef(true);
  const prevThemeId  = useRef(theme.id);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    if (theme.id !== prevThemeId.current) {
      // Snapshot outgoing
      prevThemeRef.current = prevTheme;
      prevThemeId.current  = theme.id;
      // Kick cross-fade
      transition.value = 0;
      transition.value = withTiming(1, {
        duration: 650,
        easing: Easing.inOut(Easing.ease),
      });
    }
  }, [theme.id]);

  // Animate dark mode
  useEffect(() => {
    darkValue.value = withTiming(settings.darkMode ? 1 : 0, {
      duration: 400,
      easing: Easing.inOut(Easing.ease),
    });
  }, [settings.darkMode]);

  const value: SceneValues = useMemo(
    () => ({
      transition,
      prevTheme: prevThemeRef.current,
      nextTheme: theme,
      theme,
      darkMode: settings.darkMode,
      darkValue,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme, settings.darkMode]
  );

  return (
    <SceneContext.Provider value={value}>
      {children}
    </SceneContext.Provider>
  );
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useScene(): SceneValues {
  const ctx = useContext(SceneContext);
  if (!ctx) throw new Error('useScene() must be called inside <SceneEngine>.');
  return ctx;
}

/** Shorthand for just the active theme object */
export function useTheme(): AppTheme {
  return useScene().theme;
}
