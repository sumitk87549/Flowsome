export interface SessionConfig {
  type: 'Focus' | 'Pomodoro' | 'Meditation' | 'Breathing';
  duration?: number;
  workDuration?: number;
  breakDuration?: number;
  cycles?: number;
  workAudio?: string;
  breakAudio?: string;
  bell?: string;
  breathingPattern?: string;
  guided?: boolean;
  theme?: string;
}

export type Route =
  | { name: 'Home' }
  | { name: 'Config'; sessionType: SessionConfig['type'] }
  | { name: 'Session'; config: SessionConfig };

export interface NavigationProps {
  navigate: (route: Route) => void;
  goBack: () => void;
}
