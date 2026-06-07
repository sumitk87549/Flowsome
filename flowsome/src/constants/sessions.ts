import { SessionConfig, SessionMode, PhaseConfig } from '../types';

const POMODORO_PHASES: PhaseConfig[] = [
  { phase: 'work', durationSeconds: 25 * 60, label: 'Focus' },
  { phase: 'short_break', durationSeconds: 5 * 60, label: 'Rest' },
];

const FOCUS_PHASES: PhaseConfig[] = [
  { phase: 'active', durationSeconds: 50 * 60, label: 'Deep Focus' },
  { phase: 'rest', durationSeconds: 10 * 60, label: 'Break' },
];

const BREATHING_PHASES: PhaseConfig[] = [
  { phase: 'inhale', durationSeconds: 4, label: 'Inhale' },
  { phase: 'hold', durationSeconds: 4, label: 'Hold' },
  { phase: 'exhale', durationSeconds: 6, label: 'Exhale' },
  { phase: 'rest', durationSeconds: 2, label: 'Rest' },
];

const MEDITATION_PHASES: PhaseConfig[] = [
  { phase: 'active', durationSeconds: 10 * 60, label: 'Meditate' },
];

export const SESSION_CONFIGS: Record<SessionMode, SessionConfig> = {
  pomodoro: {
    mode: 'pomodoro',
    durationSeconds: 25 * 60,
    phases: POMODORO_PHASES,
    cycles: 4,
  },
  focus: {
    mode: 'focus',
    durationSeconds: 50 * 60,
    phases: FOCUS_PHASES,
    cycles: 1,
  },
  breathing: {
    mode: 'breathing',
    durationSeconds: 16 * 60,
    phases: BREATHING_PHASES,
    cycles: 60,
  },
  meditation: {
    mode: 'meditation',
    durationSeconds: 10 * 60,
    phases: MEDITATION_PHASES,
    cycles: 1,
  },
};

export const SESSION_LABELS: Record<SessionMode, string> = {
  pomodoro: 'Pomodoro',
  focus: 'Focus',
  breathing: 'Breathing',
  meditation: 'Meditation',
};

export const SESSION_EMOJIS: Record<SessionMode, string> = {
  pomodoro: '🍅',
  focus: '🎯',
  breathing: '🫁',
  meditation: '🧘',
};
