// hooks/useTimer.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSharedValue, cancelAnimation } from 'react-native-reanimated';
import { HapticUtils } from '../utils/hapticUtils';

export type TimerPhase = 'work' | 'break' | 'idle';
export type TimerStatus = 'idle' | 'running' | 'paused' | 'complete';

interface UseTimerOptions {
  workMinutes: number;
  breakMinutes: number;
  totalPomodoros: number;
  onWorkComplete?: () => void;
  onBreakComplete?: () => void;
  onAllComplete?: () => void;
}

export function useTimer(options: UseTimerOptions) {
  const { workMinutes, breakMinutes, totalPomodoros, onWorkComplete, onBreakComplete, onAllComplete } = options;

  const [status, setStatus] = useState<TimerStatus>('idle');
  const [phase, setPhase] = useState<TimerPhase>('idle');
  const [secondsLeft, setSecondsLeft] = useState(workMinutes * 60);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);

  const progressShared = useSharedValue(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSeconds = phase === 'work' ? workMinutes * 60 : breakMinutes * 60;
  const progress = 1 - secondsLeft / totalSeconds;

  const startWork = useCallback(() => {
    setPhase('work');
    setSecondsLeft(workMinutes * 60);
    setStatus('running');
  }, [workMinutes]);

  const startBreak = useCallback(() => {
    setPhase('break');
    setSecondsLeft(breakMinutes * 60);
    setStatus('running');
  }, [breakMinutes]);

  const start = useCallback(() => {
    startWork();
    HapticUtils.medium();
  }, [startWork]);

  const pause = useCallback(() => {
    setStatus('paused');
    HapticUtils.light();
  }, []);

  const resume = useCallback(() => {
    setStatus('running');
    HapticUtils.light();
  }, []);

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setStatus('idle');
    setPhase('idle');
    setSecondsLeft(workMinutes * 60);
    setCompletedPomodoros(0);
  }, [workMinutes]);

  useEffect(() => {
    if (status !== 'running') {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          progressShared.value = 1;
          if (phase === 'work') {
            HapticUtils.success();
            onWorkComplete?.();
            const next = completedPomodoros + 1;
            setCompletedPomodoros(next);
            if (next >= totalPomodoros) {
              setStatus('complete');
              onAllComplete?.();
              return 0;
            } else {
              startBreak();
            }
          } else {
            HapticUtils.success();
            onBreakComplete?.();
            startWork();
          }
          return 0;
        }
        
        const newProgress = 1 - (prev - 1) / totalSeconds;
        progressShared.value = newProgress;
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status, phase, completedPomodoros, totalPomodoros, startWork, startBreak, onWorkComplete, onBreakComplete, onAllComplete]);

  return {
    status,
    phase,
    secondsLeft,
    completedPomodoros,
    totalPomodoros,
    progress,
    progressShared,
    start,
    pause,
    resume,
    stop,
  };
}
