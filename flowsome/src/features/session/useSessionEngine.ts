import { useEffect, useRef } from 'react';
import { useAppStore } from '../../store/appStore';

/**
 * Single session engine.
 * Drives the timer tick every second.
 * Mount this once at the session screen level.
 */
export function useSessionEngine(): void {
  const tickSession = useAppStore((s) => s.tickSession);
  const isActive = useAppStore((s) => s.session.isActive);
  const isPaused = useAppStore((s) => s.session.isPaused);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        tickSession();
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused, tickSession]);
}
