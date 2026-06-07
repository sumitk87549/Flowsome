export type SessionMode = 'pomodoro' | 'focus' | 'breathing' | 'meditation';

export type SessionPhase =
  | 'work'
  | 'short_break'
  | 'long_break'
  | 'inhale'
  | 'hold'
  | 'exhale'
  | 'rest'
  | 'active';

export interface SessionConfig {
  mode: SessionMode;
  durationSeconds: number;
  phases: PhaseConfig[];
  cycles: number;
}

export interface PhaseConfig {
  phase: SessionPhase;
  durationSeconds: number;
  label: string;
}

export interface SessionState {
  isActive: boolean;
  isPaused: boolean;
  mode: SessionMode | null;
  currentPhaseIndex: number;
  currentCycle: number;
  elapsedSeconds: number;
  totalSeconds: number;
  config: SessionConfig | null;
}

export interface AppTheme {
  id: string;
  name: string;
  accentColor: string;
  backgroundGradient: [string, string, ...string[]];
  particleDensity: number;
  textColor: string;
  subtextColor: string;
  ambientSound: string;
}

export interface SettingsState {
  uiLanguage: string;
  sessionLanguage: string;
  darkMode: boolean;
}

export interface ProgressState {
  totalSessionsCompleted: number;
  totalMinutes: number;
  lastSessionDate: string | null;
}

export type RootStackParamList = {
  Home: undefined;
  Session: { mode: SessionMode };
  Themes: undefined;
  Settings: undefined;
};
