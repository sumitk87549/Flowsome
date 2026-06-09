// hooks/useBreathing.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import { BreathingPattern, BreathingPhase as BreathingPhaseObject } from '../constants/breathing-patterns';
import { useSessionStore } from '../store/sessionStore';
import { useSpeech } from './useSpeech';
import { HapticUtils } from '../utils/hapticUtils';

// NOTE: 'BreathingPhaseString' is the store's string-union type for setBreathingPhase
type BreathingPhaseString = 'inhale' | 'holdIn' | 'exhale' | 'holdOut' | 'idle';

export type BreathingState = 'idle' | 'running' | 'paused' | 'complete';

export interface UseBreathingReturn {
  state: BreathingState;
  currentPhase: BreathingPhaseObject;
  phaseProgress: number;          // 0 → 1 within current phase
  currentCycle: number;
  phaseSecondsRemaining: number;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
}

export function useBreathing(pattern: BreathingPattern): UseBreathingReturn {
  const [state, setState] = useState<BreathingState>('idle');
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [phaseElapsed, setPhaseElapsed] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { speakCue } = useSpeech();
  const { setBreathingPhase, setCycle: storeSetCycle } = useSessionStore();

  const activePhaseDefs = pattern.phases.filter((p) => p.durationSeconds > 0);
  const currentPhaseDef = activePhaseDefs[phaseIndex % activePhaseDefs.length];
  const phaseProgress = currentPhaseDef
    ? Math.min(phaseElapsed / currentPhaseDef.durationSeconds, 1)
    : 0;

  const speakPhase = useCallback(
    (phaseName: string) => {
      const map: Record<string, 'inhale' | 'holdIn' | 'exhale' | 'holdOut'> = {
        inhale: 'inhale',
        holdIn: 'holdIn',
        exhale: 'exhale',
        holdOut: 'holdOut',
      };
      const key = map[phaseName];
      if (key) speakCue(key);
    },
    [speakCue]
  );

  const tick = useCallback(() => {
    setPhaseElapsed((prev) => {
      const next = prev + 0.1; // 100ms ticks
      const phaseDuration =
        activePhaseDefs[phaseIndex % activePhaseDefs.length]?.durationSeconds ?? 4;

      if (next >= phaseDuration) {
        setTimeout(() => {
          const nextPhaseIndex = (phaseIndex + 1) % activePhaseDefs.length;
          setPhaseIndex(nextPhaseIndex);

          if (nextPhaseIndex === 0) {
            const nextCycle = cycle + 1;
            setCycle(nextCycle);
            storeSetCycle(nextCycle, pattern.cycles);
            HapticUtils.medium();

            if (nextCycle >= pattern.cycles) {
              setState('complete');
              speakCue('complete');
              HapticUtils.success();
              return;
            }
          }

          const nextPhase = activePhaseDefs[nextPhaseIndex];
          if (nextPhase) {
            setBreathingPhase(nextPhase.name as BreathingPhaseString);
            speakPhase(nextPhase.name);
            HapticUtils.light();
          }
        }, 0);

        return 0;
      }

      return next;
    });
  }, [phaseIndex, cycle, activePhaseDefs, pattern.cycles, storeSetCycle, speakCue, speakPhase, setBreathingPhase]);

  useEffect(() => {
    if (state === 'running') {
      intervalRef.current = setInterval(tick, 100);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state, tick]);

  const start = useCallback(() => {
    setPhaseIndex(0);
    setCycle(0);
    setPhaseElapsed(0);
    setState('running');
    setBreathingPhase('inhale');
    speakCue('begin');
    HapticUtils.medium();
    setTimeout(() => speakPhase('inhale'), 1500);
  }, [setBreathingPhase, speakCue, speakPhase]);

  const pause = useCallback(() => setState('paused'), []);
  const resume = useCallback(() => setState('running'), []);

  const stop = useCallback(() => {
    setState('idle');
    setPhaseIndex(0);
    setCycle(0);
    setPhaseElapsed(0);
    setBreathingPhase('idle');
  }, [setBreathingPhase]);

  return {
    state,
    currentPhase: currentPhaseDef ?? pattern.phases[0],
    phaseProgress,
    currentCycle: cycle,
    phaseSecondsRemaining: Math.max(
      0,
      (currentPhaseDef?.durationSeconds ?? 0) - phaseElapsed
    ),
    start,
    pause,
    resume,
    stop,
  };
}
