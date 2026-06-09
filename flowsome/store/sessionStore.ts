// store/sessionStore.ts
import { create } from 'zustand';

export type SessionMode = 'breathing' | 'pomodoro' | 'meditation' | 'focus' | null;
export type BreathingPhase = 'inhale' | 'holdIn' | 'exhale' | 'holdOut' | 'idle';
export type TimerState = 'idle' | 'running' | 'paused' | 'complete';

interface SessionState {
  activeMode: SessionMode;
  timerState: TimerState;
  breathingPhase: BreathingPhase;
  currentCycle: number;
  totalCycles: number;
  secondsRemaining: number;
  selectedPatternId: string | null;
  selectedMeditationId: string | null;
  intention: string;
  setActiveMode: (mode: SessionMode) => void;
  setTimerState: (state: TimerState) => void;
  setBreathingPhase: (phase: BreathingPhase) => void;
  setCycle: (current: number, total: number) => void;
  setSecondsRemaining: (seconds: number) => void;
  setSelectedPattern: (id: string) => void;
  setSelectedMeditation: (id: string) => void;
  setIntention: (text: string) => void;
  resetSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  activeMode: null,
  timerState: 'idle',
  breathingPhase: 'idle',
  currentCycle: 0,
  totalCycles: 0,
  secondsRemaining: 0,
  selectedPatternId: null,
  selectedMeditationId: null,
  intention: '',
  setActiveMode: (activeMode) => set({ activeMode }),
  setTimerState: (timerState) => set({ timerState }),
  setBreathingPhase: (breathingPhase) => set({ breathingPhase }),
  setCycle: (currentCycle, totalCycles) => set({ currentCycle, totalCycles }),
  setSecondsRemaining: (secondsRemaining) => set({ secondsRemaining }),
  setSelectedPattern: (selectedPatternId) => set({ selectedPatternId }),
  setSelectedMeditation: (selectedMeditationId) => set({ selectedMeditationId }),
  setIntention: (intention) => set({ intention }),
  resetSession: () =>
    set({
      timerState: 'idle',
      breathingPhase: 'idle',
      currentCycle: 0,
      secondsRemaining: 0,
    }),
}));
