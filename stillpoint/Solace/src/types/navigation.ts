import type { RestMode } from './session';

export type RootStackParamList = {
  Home: undefined;
  FocusIntention: undefined;
  WorkSession: { intentionWord: string | undefined };

  ReturnPrompt: { sessionNumber: number; totalSessions: number };
  LongBreak: undefined;
  Settings: undefined;
  RestExperience: {
    mode: RestMode;
    duration: number;  // in minutes
  };
  SettleNotice: { sessionNumber: number; totalSessions: number };
  Transition: undefined;
};
