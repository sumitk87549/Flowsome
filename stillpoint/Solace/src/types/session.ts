export type RestMode =
  | 'eyesAway'
  | 'listen'
  | 'breatheAndDrift'
  | 'quickSettle'
  | 'moveAndSee'
  | 'senseAndGround'
  | 'storyMoment'
  | 'memory'
  | 'walk';

// Panel types for the rest system (types 1–4 have different behaviors)
export interface Panel {
  type: 1 | 2 | 3 | 4;
  text: string;
  holdMs: number;
  hapticOnEntry?: 'light' | 'medium' | 'heavy';
  isEmpty?: boolean;
  emptyDurationMs?: number;
}

export type StoryTheme =
  | 'forest'
  | 'ocean'
  | 'mountain'
  | 'desertNight'
  | 'winterRoom'
  | 'morningLight';

export interface StoryPanel extends Panel {
  theme?: StoryTheme;
}

export interface SessionState {
  isSessionActive: boolean;
  isRestActive: boolean;
  sessionsCompletedToday: number;
  totalMinutesToday: number;
  intentionWordsToday: string[];
  currentIntentionWord: string | undefined;
  currentCycleNumber: number;
  sessionStartTimestamp: number | null;
  streak: number;
  lastSessionDate: string | null;
  restModeQueue: RestMode[];
}

// Computed/derived values exposed by SessionContext on top of SessionState
export interface SessionComputedValues {
  totalCycles: number;      // = settings.sessionsUntilLongRest
  isLongBreakNext: boolean; // true when currentCycleNumber === totalCycles
}
