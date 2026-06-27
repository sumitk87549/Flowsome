import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { SessionState, RestMode, SessionComputedValues } from '@/types/session';
import { readJson, writeJson, removeKey, STORAGE_KEYS } from '@/utils/storage';
import { useSettings } from '@/context/SettingsContext';

const ALL_REST_MODES: RestMode[] = [
  'listen',
  'breathe',
  'drift',
  'move',
  'senseAndGround',
  'storyMoment',
];

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getTodayUTCDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

// ── Context shape ──
interface SessionContextValue extends SessionState, SessionComputedValues {
  isLoaded: boolean;
  // Actions
  startSession: (intentionWord?: string) => void;
  completeSession: () => void;
  startRest: () => void;
  completeRest: () => void;
  resetDay: () => void;
  getNextRestMode: () => RestMode;
}

const DEFAULT_STATE: SessionState = {
  isSessionActive: false,
  isRestActive: false,
  sessionsCompletedToday: 0,
  totalMinutesToday: 0,
  intentionWordsToday: [],
  currentIntentionWord: undefined,
  currentCycleNumber: 1,
  sessionStartTimestamp: null,
  streak: 0,
  lastSessionDate: null,
  restModeQueue: [],
};

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({
  children,
  onLoaded,
}: {
  children: React.ReactNode;
  onLoaded?: () => void;
}) {
  const [state, setState] = useState<SessionState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);
  const { settings } = useSettings();
  const hasLoaded = useRef(false);

  // ── Load from AsyncStorage on mount ──
  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    async function load() {
      try {
        const today = getTodayUTCDateString();

        const [
          lastSessionDate,
          sessionsToday,
          totalMins,
          intentionWords,
          streak,
          restModeQueue,
          cycleNumber,
        ] = await Promise.all([
          readJson<string>(STORAGE_KEYS.LAST_SESSION_DATE),
          readJson<number>(STORAGE_KEYS.SESSIONS_TODAY),
          readJson<number>(STORAGE_KEYS.TOTAL_MINS_TODAY),
          readJson<string[]>(STORAGE_KEYS.INTENTION_WORDS),
          readJson<number>(STORAGE_KEYS.STREAK),
          readJson<RestMode[]>(STORAGE_KEYS.REST_MODE_QUEUE),
          readJson<number>('solace:cycleNumber'),
        ]);

        let resolvedSessions = sessionsToday ?? 0;
        let resolvedMins = totalMins ?? 0;
        let resolvedWords = intentionWords ?? [];
        let resolvedStreak = streak ?? 0;
        let resolvedCycle = cycleNumber ?? 1;

        // Daily reset
        if (lastSessionDate !== null && lastSessionDate !== today) {
          const lastDate = new Date(lastSessionDate);
          const todayDate = new Date(today);
          const daysDiff = Math.round(
            (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
          );

          resolvedSessions = 0;
          resolvedMins = 0;
          resolvedWords = [];
          resolvedCycle = 1;

          if (daysDiff > 1) {
            resolvedStreak = 0;
          }

          await Promise.all([
            writeJson(STORAGE_KEYS.SESSIONS_TODAY, 0),
            writeJson(STORAGE_KEYS.TOTAL_MINS_TODAY, 0),
            writeJson(STORAGE_KEYS.INTENTION_WORDS, []),
            writeJson(STORAGE_KEYS.STREAK, resolvedStreak),
            writeJson('solace:cycleNumber', 1),
          ]);
        }

        const resolvedQueue =
          restModeQueue && restModeQueue.length > 0
            ? restModeQueue
            : shuffleArray(ALL_REST_MODES);

        setState((prev) => ({
          ...prev,
          sessionsCompletedToday: resolvedSessions,
          totalMinutesToday: resolvedMins,
          intentionWordsToday: resolvedWords,
          streak: resolvedStreak,
          lastSessionDate: lastSessionDate ?? null,
          restModeQueue: resolvedQueue,
          currentCycleNumber: resolvedCycle,
        }));
      } catch (e) {
        console.error('[SessionContext] load error:', e);
      } finally {
        setIsLoaded(true);
        onLoaded?.();
      }
    }

    load();
  }, [onLoaded]);

  // ── Derived values ──
  const totalCycles = settings.sessionsUntilLongRest;
  const isLongBreakNext = state.currentCycleNumber >= totalCycles;

  // ── Actions ──
  const startSession = useCallback((intentionWord?: string) => {
    setState((prev) => ({
      ...prev,
      isSessionActive: true,
      currentIntentionWord: intentionWord,
      sessionStartTimestamp: Date.now(),
    }));
  }, []);

  const completeSession = useCallback(() => {
    setState((prev) => {
      const today = getTodayUTCDateString();
      const newSessions = prev.sessionsCompletedToday + 1;
      const newMins = prev.totalMinutesToday + settings.workDuration;
      const newWords =
        prev.currentIntentionWord
          ? [...prev.intentionWordsToday, prev.currentIntentionWord]
          : prev.intentionWordsToday;
      const newStreak =
        prev.lastSessionDate === today ? prev.streak : prev.streak + 1;

      // Cycle counter: increment, wrap at totalCycles back to 1
      const newCycle =
        prev.currentCycleNumber >= settings.sessionsUntilLongRest
          ? 1
          : prev.currentCycleNumber + 1;

      Promise.all([
        writeJson(STORAGE_KEYS.SESSIONS_TODAY, newSessions),
        writeJson(STORAGE_KEYS.TOTAL_MINS_TODAY, newMins),
        writeJson(STORAGE_KEYS.INTENTION_WORDS, newWords),
        writeJson(STORAGE_KEYS.LAST_SESSION_DATE, today),
        writeJson(STORAGE_KEYS.STREAK, newStreak),
        writeJson('solace:cycleNumber', newCycle),
      ]).catch((e) => console.error('[SessionContext] completeSession persist error:', e));

      return {
        ...prev,
        isSessionActive: false,
        sessionsCompletedToday: newSessions,
        totalMinutesToday: newMins,
        intentionWordsToday: newWords,
        lastSessionDate: today,
        streak: newStreak,
        currentCycleNumber: newCycle,
        sessionStartTimestamp: null,
      };
    });
  }, [settings.workDuration, settings.sessionsUntilLongRest]);

  const startRest = useCallback(() => {
    setState((prev) => ({ ...prev, isRestActive: true }));
  }, []);

  const completeRest = useCallback(() => {
    setState((prev) => ({ ...prev, isRestActive: false }));
  }, []);

  const resetDay = useCallback(async () => {
    await Promise.all([
      removeKey(STORAGE_KEYS.SESSIONS_TODAY),
      removeKey(STORAGE_KEYS.TOTAL_MINS_TODAY),
      removeKey(STORAGE_KEYS.INTENTION_WORDS),
      removeKey(STORAGE_KEYS.LAST_SESSION_DATE),
      removeKey(STORAGE_KEYS.STREAK),
      removeKey(STORAGE_KEYS.REST_MODE_QUEUE),
      removeKey('solace:cycleNumber'),
    ]);
    setState({ ...DEFAULT_STATE, restModeQueue: shuffleArray(ALL_REST_MODES) });
  }, []);

  const getNextRestMode = useCallback((): RestMode => {
    // If restStyle is pinned to a specific mode, always return it
    if (settings.restStyle !== 'auto') {
      // quickSettle override: use quickSettle for short rests (≤5 min) regardless of restStyle
      if (settings.shortRestDuration <= 5) {
        return 'quickSettle';
      }
      return settings.restStyle as RestMode;
    }

    // quickSettle override for short rest durations
    if (settings.shortRestDuration <= 5) {
      return 'quickSettle';
    }

    // Auto: pop from shuffled queue
    let nextMode: RestMode = 'listen'; // fallback
    setState((prev) => {
      const queue =
        prev.restModeQueue.length > 0
          ? prev.restModeQueue
          : shuffleArray(ALL_REST_MODES);

      const [first, ...rest] = queue;
      nextMode = first;
      const newQueue = rest.length > 0 ? rest : shuffleArray(ALL_REST_MODES);

      writeJson(STORAGE_KEYS.REST_MODE_QUEUE, newQueue).catch((e) =>
        console.error('[SessionContext] queue persist error:', e)
      );

      return { ...prev, restModeQueue: newQueue };
    });

    return nextMode;
  }, [settings.restStyle, settings.shortRestDuration]);

  return (
    <SessionContext.Provider
      value={{
        ...state,
        isLoaded,
        totalCycles,
        isLongBreakNext,
        startSession,
        completeSession,
        startRest,
        completeRest,
        resetDay,
        getNextRestMode,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
