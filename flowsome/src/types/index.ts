import { ImageSourcePropType } from 'react-native';

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

export type SceneId = 'rajasthan' | 'kerala' | 'assam' | 'himalaya' | 'andaman';
export type ParticlePreset = 'sand' | 'mistLeaves' | 'fog' | 'snow' | 'bubbles';
export type AmbientPreset = 'desertWind' | 'rainforestWater' | 'teaGardenWind' | 'mountainWind' | 'oceanWaves';
export type AnimationStyle = 'heatShimmer' | 'waterMist' | 'grassSway' | 'movingFog' | 'waterShimmer';
export type ThemeMode = 'auto' | 'light' | 'dark';
export type AppLanguage = 'en' | 'hi' | 'bn' | 'ta' | 'te';

export interface SceneButtonStyle {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
}

export interface AppTheme {
  id: SceneId;
  name: string;
  subtitle: string;
  feeling: string;
  backgroundImage: ImageSourcePropType;
  backgroundGradient: [string, string, ...string[]];
  lightGradient: [string, string, ...string[]];
  accentColor: string;
  secondaryAccentColor: string;
  buttonStyle: SceneButtonStyle;
  particlePreset: ParticlePreset;
  particleDensity: number;
  ambientPreset: AmbientPreset;
  ambientSound: string;
  animationStyle: AnimationStyle;
  voicePreset: string;
  textColor: string;
  subtextColor: string;
}

export interface SettingsState {
  uiLanguage: AppLanguage;
  sessionLanguage: AppLanguage;
  themeMode: ThemeMode;
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
