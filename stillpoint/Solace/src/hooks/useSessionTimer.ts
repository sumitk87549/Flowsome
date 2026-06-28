import { useRef, useState, useEffect, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';

interface UseSessionTimerOptions {
  durationMinutes: number;
  onComplete: () => void;
}

interface TimerDisplay {
  minutes: number;
  seconds: number;
}

export function useSessionTimer({ durationMinutes, onComplete }: UseSessionTimerOptions) {
  const totalSeconds = durationMinutes * 60;

  // Core refs — these do NOT trigger re-renders
  const remainingRef = useRef(totalSeconds);
  const isPausedRef = useRef(false);
  const isCompletedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTickTimestampRef = useRef<number>(Date.now());
  const sessionStartTimestampRef = useRef<number>(Date.now());

  // Display state — only this triggers re-renders (once per second)
  const [display, setDisplay] = useState<TimerDisplay>({
    minutes: Math.floor(totalSeconds / 60),
    seconds: totalSeconds % 60,
  });

  const updateDisplay = useCallback((remaining: number) => {
    const clamped = Math.max(0, remaining);
    setDisplay({
      minutes: Math.floor(clamped / 60),
      seconds: clamped % 60,
    });
  }, []);

  const tick = useCallback(() => {
    if (isPausedRef.current || isCompletedRef.current) return;

    // Timestamp-based delta — handles backgrounding correctly
    const now = Date.now();
    const elapsed = Math.floor((now - lastTickTimestampRef.current) / 1000);
    lastTickTimestampRef.current = now;

    // Subtract actual elapsed seconds (usually 1, but may be more after backgrounding)
    remainingRef.current = Math.max(0, remainingRef.current - elapsed);
    updateDisplay(remainingRef.current);

    if (remainingRef.current <= 0 && !isCompletedRef.current) {
      isCompletedRef.current = true;
      if (intervalRef.current) clearInterval(intervalRef.current);
      onComplete();
    }
  }, [onComplete, updateDisplay]);

  // Handle app returning from background — recalculate remaining time
  useEffect(() => {
    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        // App came back from background — recalculate based on session start timestamp
        if (!isPausedRef.current && !isCompletedRef.current) {
          const elapsedSinceStart = Math.floor(
            (Date.now() - sessionStartTimestampRef.current) / 1000
          );
          remainingRef.current = Math.max(0, totalSeconds - elapsedSinceStart);
          lastTickTimestampRef.current = Date.now();
          updateDisplay(remainingRef.current);

          if (remainingRef.current <= 0 && !isCompletedRef.current) {
            isCompletedRef.current = true;
            if (intervalRef.current) clearInterval(intervalRef.current);
            onComplete();
          }
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [totalSeconds, onComplete, updateDisplay]);

  // Start interval
  useEffect(() => {
    sessionStartTimestampRef.current = Date.now();
    lastTickTimestampRef.current = Date.now();

    intervalRef.current = setInterval(tick, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [tick]);

  const pause = useCallback(() => {
    isPausedRef.current = true;
  }, []);

  const resume = useCallback(() => {
    // Reset the tick timestamp so the resumed tick doesn't count pause time as elapsed
    lastTickTimestampRef.current = Date.now();
    isPausedRef.current = false;
  }, []);

  return { display, pause, resume };
}
