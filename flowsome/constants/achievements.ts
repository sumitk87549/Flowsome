// constants/achievements.ts

export interface AchievementStats {
  totalSessions: number;
  streak: number;
  sessionsByTheme: Record<string, number>;
  sessionsByType: Record<string, number>;
  totalMinutes: number;
  hasCompletedDeepWork90: boolean;
  hasCompletedMeditation30: boolean;
  morningSessionCount: number;   // sessions before 7am
  nightSessionCount: number;     // sessions after 10pm
  breathingSessions: number;
}

export interface Achievement {
  id: string;
  title: string;
  titleHindi: string;
  description: string;
  icon: string;
  checkCondition: (stats: AchievementStats) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-breath',
    title: 'First Breath',
    titleHindi: 'पहली साँस',
    description: 'Complete your first breathing session',
    icon: '🌬️',
    checkCondition: (s) => (s.sessionsByType['breathing'] ?? 0) >= 1,
  },
  {
    id: 'first-focus',
    title: 'First Focus',
    titleHindi: 'पहला ध्यान',
    description: 'Complete your first pomodoro session',
    icon: '⏱️',
    checkCondition: (s) => (s.sessionsByType['pomodoro'] ?? 0) >= 1,
  },
  {
    id: 'first-meditation',
    title: 'First Silence',
    titleHindi: 'पहली चुप्पी',
    description: 'Complete your first meditation session',
    icon: '🧘',
    checkCondition: (s) => (s.sessionsByType['meditation'] ?? 0) >= 1,
  },
  {
    id: 'first-flow',
    title: 'First Flow',
    titleHindi: 'पहला प्रवाह',
    description: 'Complete your first deep work session',
    icon: '✨',
    checkCondition: (s) => (s.sessionsByType['focus'] ?? 0) >= 1,
  },
  {
    id: 'sadhaka',
    title: 'Sādhaka (साधक)',
    titleHindi: 'साधक',
    description: '7-day practice streak',
    icon: '🙏',
    checkCondition: (s) => s.streak >= 7,
  },
  {
    id: 'desert-walker',
    title: 'Desert Walker',
    titleHindi: 'मरुस्थल यात्री',
    description: '10 sessions in Rajasthan',
    icon: '🏜️',
    checkCondition: (s) => (s.sessionsByTheme['rajasthan'] ?? 0) >= 10,
  },
  {
    id: 'snow-silence',
    title: 'Snow Silence',
    titleHindi: 'हिम मौन',
    description: '10 sessions in Himalaya',
    icon: '🏔️',
    checkCondition: (s) => (s.sessionsByTheme['himalaya'] ?? 0) >= 10,
  },
  {
    id: 'backwater-still',
    title: 'Backwater Still',
    titleHindi: 'केरल शांति',
    description: '10 sessions in Kerala',
    icon: '🌴',
    checkCondition: (s) => (s.sessionsByTheme['kerala'] ?? 0) >= 10,
  },
  {
    id: 'forest-breath',
    title: 'Forest Breath',
    titleHindi: 'वन श्वास',
    description: '10 sessions in Assam',
    icon: '🌿',
    checkCondition: (s) => (s.sessionsByTheme['assam'] ?? 0) >= 10,
  },
  {
    id: 'ocean-deep',
    title: 'Ocean Deep',
    titleHindi: 'सागर गहराई',
    description: '10 sessions in Andaman',
    icon: '🌊',
    checkCondition: (s) => (s.sessionsByTheme['andaman'] ?? 0) >= 10,
  },
  {
    id: 'first-mala',
    title: 'First Mala',
    titleHindi: 'प्रथम माला',
    description: '108 total sessions completed',
    icon: '📿',
    checkCondition: (s) => s.totalSessions >= 108,
  },
  {
    id: 'dawn-keeper',
    title: 'Dawn Keeper',
    titleHindi: 'उषा पालक',
    description: '10 sessions before 7am',
    icon: '🌅',
    checkCondition: (s) => s.morningSessionCount >= 10,
  },
  {
    id: 'night-owl',
    title: 'Night Owl',
    titleHindi: 'रात्रि उल्लू',
    description: '10 sessions after 10pm',
    icon: '🦉',
    checkCondition: (s) => s.nightSessionCount >= 10,
  },
  {
    id: 'dharana',
    title: 'Dharaṇā',
    titleHindi: 'धारणा',
    description: 'Complete a 90-minute Deep Work session',
    icon: '🧠',
    checkCondition: (s) => s.hasCompletedDeepWork90,
  },
  {
    id: 'mauna',
    title: 'Mauna (मौन)',
    titleHindi: 'मौन',
    description: 'Complete a 30-minute silent meditation',
    icon: '🤫',
    checkCondition: (s) => s.hasCompletedMeditation30,
  },
  {
    id: 'pranavaka',
    title: 'Prāṇavaka',
    titleHindi: 'प्राणवक',
    description: '50 breathing sessions completed',
    icon: '🫁',
    checkCondition: (s) => s.breathingSessions >= 50,
  },
];
