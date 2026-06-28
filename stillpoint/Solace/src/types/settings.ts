export type AmbientSound = 'none' | 'rain' | 'forest' | 'ocean' | 'night' | 'wind';

export type RestStyle = 'auto' | 'eyesAway' | 'move' | 'senseAndGround' | 'quietListening' | 'storyGarden';

export type ThemeMode = 'system' | 'dawn' | 'night';

export type BellVolume = 'low' | 'medium' | 'high';

export interface SolaceSettings {
  themeMode: ThemeMode;
  
  // Session Rhythm
  workDuration: number;          
  shortRestDuration: number;     
  longRestDuration: number;      
  sessionsUntilLongRest: number; 

  // Rest Guidance
  restStyle: RestStyle;
  visualIntensity: 'minimal' | 'balanced' | 'immersive';
  showReturnReflection: boolean;

  // Sound & Touch
  soundEnabled: boolean;
  bellsEnabled: boolean;
  ambientEnabled: boolean;
  ambientSound: AmbientSound;
  hapticsEnabled: boolean;
  bellVolume: BellVolume;

  // Appearance
  reducedMotion: boolean;
  particlesEnabled: boolean;
  fullScreenMode: boolean;

  // Flow
  autoStartRest: boolean;
  autoStartWork: boolean;
  keepScreenAwake: boolean;

  // Existing properties that might still be used temporarily
  transitionsOnly?: boolean;
  intentionWordEnabled?: boolean;
  settleNoticeEnabled?: boolean;
}
