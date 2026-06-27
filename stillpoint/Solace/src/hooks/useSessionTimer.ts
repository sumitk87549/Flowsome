import { useRef, useState, useEffect, useCallback } from 'react';

interface TimerDisplay {
  minutes: number;
  seconds: number;
}

interface UseSessionTimerOptions {
  durationMinutes: number;
  onComplete: () => void;
}

interface UseSessionTimerReturn {
  display: TimerDisplay;
  pause: () => void;
  resume: () => void;
}

export function useSessionTimer({
  durationMinutes,
  onComplete,
}: UseSessionTimerOptions): UseSessionTimerReturn {
  const remainingSecondsRef = useRef(durationMinutes * 60);
  const isPausedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [displayMinutes, setDisplayMinutes] = useState(durationMinutes);
  const [displaySeconds, setDisplaySeconds] = useState(0);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (isPausedRef.current) {
        return;
      }

      remainingSecondsRef.current -= 1;

      if (remainingSecondsRef.current <= 0) {
        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        onComplete();
        // Force display to 0 manually when complete
        setDisplayMinutes(0);
        setDisplaySeconds(0);
        return;
      }

      const newMinutes = Math.floor(remainingSecondsRef.current / 60);
      const newSeconds = remainingSecondsRef.current % 60;

      setDisplayMinutes(newMinutes);
      setDisplaySeconds(newSeconds);
    }, 1000);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [onComplete]);

  const pause = useCallback(() => {
    isPausedRef.current = true;
  }, []);

  const resume = useCallback(() => {
    isPausedRef.current = false;
  }, []);

  return {
    display: { minutes: displayMinutes, seconds: displaySeconds },
    pause,
    resume,
  };
}
