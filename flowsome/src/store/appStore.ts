import { create } from 'zustand';
import { AppTheme, SessionState, SettingsState, ProgressState, SessionMode, SessionConfig } from '../types';
import { THEMES, DEFAULT_THEME_ID } from '../constants/themes';
import { SESSION_CONFIGS } from '../constants/sessions';

// ─── Theme Slice ────────────────────────────────────────────────────────────

interface ThemeSlice {
  currentTheme: AppTheme;
  setTheme: (id: string) => void;
}

// ─── Session Slice ───────────────────────────────────────────────────────────

interface SessionSlice {
  session: SessionState;
  startSession: (mode: SessionMode) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: () => void;
  tickSession: () => void;
}

// ─── Settings Slice ──────────────────────────────────────────────────────────

interface SettingsSlice {
  settings: SettingsState;
  setUiLanguage: (lang: string) => void;
  setSessionLanguage: (lang: string) => void;
  toggleDarkMode: () => void;
}

// ─── Progress Slice ──────────────────────────────────────────────────────────

interface ProgressSlice {
  progress: ProgressState;
  recordSession: (minutes: number) => void;
}

// ─── Full Store ───────────────────────────────────────────────────────────────

export type AppStore = ThemeSlice & SessionSlice & SettingsSlice & ProgressSlice;

const DEFAULT_SESSION: SessionState = {
  isActive: false,
  isPaused: false,
  mode: null,
  currentPhaseIndex: 0,
  currentCycle: 1,
  elapsedSeconds: 0,
  totalSeconds: 0,
  config: null,
};

const DEFAULT_SETTINGS: SettingsState = {
  uiLanguage: 'English',
  sessionLanguage: 'English',
  darkMode: false,
};

const DEFAULT_PROGRESS: ProgressState = {
  totalSessionsCompleted: 0,
  totalMinutes: 0,
  lastSessionDate: null,
};

export const useAppStore = create<AppStore>((set, get) => ({
  // ── Theme ──
  currentTheme: THEMES.find((t) => t.id === DEFAULT_THEME_ID) ?? THEMES[0],
  setTheme: (id) => {
    const theme = THEMES.find((t) => t.id === id);
    if (theme) set({ currentTheme: theme });
  },

  // ── Session ──
  session: DEFAULT_SESSION,

  startSession: (mode) => {
    const config: SessionConfig = SESSION_CONFIGS[mode];
    set({
      session: {
        ...DEFAULT_SESSION,
        isActive: true,
        mode,
        config,
        totalSeconds: config.phases[0].durationSeconds,
        elapsedSeconds: 0,
      },
    });
  },

  pauseSession: () =>
    set((state) => ({ session: { ...state.session, isPaused: true } })),

  resumeSession: () =>
    set((state) => ({ session: { ...state.session, isPaused: false } })),

  endSession: () => {
    const { session, progress } = get();
    const minutes = Math.floor(session.elapsedSeconds / 60);
    if (minutes > 0) {
      set({
        progress: {
          totalSessionsCompleted: progress.totalSessionsCompleted + 1,
          totalMinutes: progress.totalMinutes + minutes,
          lastSessionDate: new Date().toISOString(),
        },
      });
    }
    set({ session: DEFAULT_SESSION });
  },

  tickSession: () => {
    const { session } = get();
    if (!session.isActive || session.isPaused || !session.config) return;

    const { elapsedSeconds, totalSeconds, currentPhaseIndex, currentCycle, config } = session;
    const nextElapsed = elapsedSeconds + 1;

    if (nextElapsed >= totalSeconds) {
      // Advance phase
      const phases = config.phases;
      const nextPhaseIndex = currentPhaseIndex + 1;

      if (nextPhaseIndex >= phases.length) {
        // Advance cycle
        const nextCycle = currentCycle + 1;
        if (nextCycle > config.cycles) {
          // Session complete
          set({ session: { ...session, isActive: false, elapsedSeconds: totalSeconds } });
          get().recordSession(Math.floor(totalSeconds / 60));
        } else {
          set({
            session: {
              ...session,
              currentPhaseIndex: 0,
              currentCycle: nextCycle,
              elapsedSeconds: 0,
              totalSeconds: phases[0].durationSeconds,
            },
          });
        }
      } else {
        set({
          session: {
            ...session,
            currentPhaseIndex: nextPhaseIndex,
            elapsedSeconds: 0,
            totalSeconds: phases[nextPhaseIndex].durationSeconds,
          },
        });
      }
    } else {
      set({ session: { ...session, elapsedSeconds: nextElapsed } });
    }
  },

  // ── Settings ──
  settings: DEFAULT_SETTINGS,
  setUiLanguage: (uiLanguage) =>
    set((state) => ({ settings: { ...state.settings, uiLanguage } })),
  setSessionLanguage: (sessionLanguage) =>
    set((state) => ({ settings: { ...state.settings, sessionLanguage } })),
  toggleDarkMode: () =>
    set((state) => ({
      settings: { ...state.settings, darkMode: !state.settings.darkMode },
    })),

  // ── Progress ──
  progress: DEFAULT_PROGRESS,
  recordSession: (minutes) =>
    set((state) => ({
      progress: {
        totalSessionsCompleted: state.progress.totalSessionsCompleted + 1,
        totalMinutes: state.progress.totalMinutes + minutes,
        lastSessionDate: new Date().toISOString(),
      },
    })),
}));
