import { create } from 'zustand';
import { AppLanguage, AppTheme, ProgressState, SceneId, SessionConfig, SessionMode, SessionState, SettingsState, ThemeMode } from '../types';
import { DEFAULT_THEME_ID, THEMES } from '../constants/themes';
import { SESSION_CONFIGS } from '../constants/sessions';
import { loadSceneId, loadSettings, saveSceneId, saveSettings } from '../services/storage';

interface ThemeSlice {
  currentTheme: AppTheme;
  setTheme: (id: SceneId) => void;
}

interface SessionSlice {
  session: SessionState;
  startSession: (mode: SessionMode) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: () => void;
  tickSession: () => void;
}

interface SettingsSlice {
  settings: SettingsState;
  setUiLanguage: (lang: AppLanguage) => void;
  setSessionLanguage: (lang: AppLanguage) => void;
  setThemeMode: (mode: ThemeMode) => void;
}

interface ProgressSlice {
  progress: ProgressState;
  recordSession: (minutes: number) => void;
}

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
  uiLanguage: 'en',
  sessionLanguage: 'en',
  themeMode: 'auto',
};

const DEFAULT_PROGRESS: ProgressState = {
  totalSessionsCompleted: 0,
  totalMinutes: 0,
  lastSessionDate: null,
};

const initialSceneId = loadSceneId(DEFAULT_THEME_ID);
const initialSettings = loadSettings(DEFAULT_SETTINGS);

function getThemeById(id: SceneId): AppTheme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}

export const useAppStore = create<AppStore>((set, get) => ({
  currentTheme: getThemeById(initialSceneId),
  setTheme: (id) => {
    const theme = THEMES.find((t) => t.id === id);
    if (theme) {
      saveSceneId(id);
      set({ currentTheme: theme });
    }
  },

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
      const phases = config.phases;
      const nextPhaseIndex = currentPhaseIndex + 1;

      if (nextPhaseIndex >= phases.length) {
        const nextCycle = currentCycle + 1;
        if (nextCycle > config.cycles) {
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

  settings: initialSettings,
  setUiLanguage: (uiLanguage) =>
    set((state) => {
      const settings = { ...state.settings, uiLanguage };
      saveSettings(settings);
      return { settings };
    }),
  setSessionLanguage: (sessionLanguage) =>
    set((state) => {
      const settings = { ...state.settings, sessionLanguage };
      saveSettings(settings);
      return { settings };
    }),
  setThemeMode: (themeMode) =>
    set((state) => {
      const settings = { ...state.settings, themeMode };
      saveSettings(settings);
      return { settings };
    }),

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
