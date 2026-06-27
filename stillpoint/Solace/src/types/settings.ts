export type AmbientSound = 'forest' | 'rain' | 'ocean' | 'desert' | 'mountain';

export type SensoryProfile = 'full' | 'still' | 'quiet' | 'screenOnly';

export type RestStyle = 'auto' | 'listen' | 'breathe' | 'drift' | 'quickSettle' | 'move' | 'senseAndGround' | 'storyMoment';

export interface SolaceSettings {
  sensoryProfile: SensoryProfile;
  transitionsOnly: boolean;
  workDuration: number;          // in minutes: 15 | 20 | 25 | 30 | 45 | 60
  shortRestDuration: number;     // in minutes: 5 | 10 | 15
  longRestDuration: number;      // in minutes: 15 | 20 | 30
  sessionsUntilLongRest: number; // 2 | 3 | 4
  autoStartRest: boolean;
  autoStartWork: boolean;
  restStyle: RestStyle;
  ambientSound: AmbientSound;
  intentionWordEnabled: boolean;
  settleNoticeEnabled: boolean;
  eveningNoteEnabled: boolean;
  eveningNoteTime: string;        // "HH:MM" 24-hour format
}
