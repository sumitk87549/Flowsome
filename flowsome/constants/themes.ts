// constants/themes.ts

export type ThemeId = 'rajasthan' | 'himalaya' | 'kerala' | 'assam' | 'andaman';
export type DayNight = 'day' | 'night';

export interface ThemeColors {
  background: string;
  backgroundSecondary: string;
  gradientStart: string;
  gradientEnd: string;
  primary: string;
  primaryLight: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  card: string;
  cardBorder: string;
  orb: string;
  orbGlow: string;
  particle: string;
  orbInhale: string;
  orbExhale: string;
  orbHold: string;
}

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  nameHindi: string;
  tagline: string;
  taglineHindi: string;
  dayColors: ThemeColors;
  nightColors: ThemeColors;
  particleType: 'dust' | 'snow' | 'rain' | 'ripple' | 'ocean';
  audioKey: string;
  icon: string;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  rajasthan: {
    id: 'rajasthan',
    name: 'Rajasthan',
    nameHindi: 'राजस्थान',
    tagline: 'Desert Wind & Golden Sands',
    taglineHindi: 'रेगिस्तान की हवा और सुनहरी रेत',
    particleType: 'dust',
    audioKey: 'rajasthan',
    icon: '🏜️',
    dayColors: {
      background: '#2D1B00',
      backgroundSecondary: '#3D2400',
      gradientStart: '#F59E0B',
      gradientEnd: '#B45309',
      primary: '#F59E0B',
      primaryLight: '#FCD34D',
      text: '#FEF3C7',
      textSecondary: '#FDE68A',
      textMuted: '#CDB496',
      card: 'rgba(245,158,11,0.08)',
      cardBorder: 'rgba(245,158,11,0.2)',
      orb: '#F59E0B',
      orbGlow: 'rgba(245,158,11,0.35)',
      particle: '#FCD34D',
      orbInhale: '#FDE68A',
      orbExhale: '#B45309',
      orbHold: '#F59E0B',
    },
    nightColors: {
      background: '#0F0A00',
      backgroundSecondary: '#1A1000',
      gradientStart: '#78350F',
      gradientEnd: '#1A0F00',
      primary: '#D97706',
      primaryLight: '#F59E0B',
      text: '#FEF3C7',
      textSecondary: '#FDE68A',
      textMuted: '#A58B70',
      card: 'rgba(217,119,6,0.08)',
      cardBorder: 'rgba(217,119,6,0.2)',
      orb: '#D97706',
      orbGlow: 'rgba(217,119,6,0.35)',
      particle: '#F59E0B',
      orbInhale: '#FEF08A',
      orbExhale: '#92400E',
      orbHold: '#D97706',
    },
  },
  himalaya: {
    id: 'himalaya',
    name: 'Himalaya',
    nameHindi: 'हिमालय',
    tagline: 'Snow Peaks & Mountain Silence',
    taglineHindi: 'हिमाच्छादित शिखर और पर्वत की शांति',
    particleType: 'snow',
    audioKey: 'himalaya',
    icon: '🏔️',
    dayColors: {
      background: '#0F1729',
      backgroundSecondary: '#162038',
      gradientStart: '#60A5FA',
      gradientEnd: '#1E40AF',
      primary: '#60A5FA',
      primaryLight: '#93C5FD',
      text: '#EFF6FF',
      textSecondary: '#BFDBFE',
      textMuted: '#7DA2CE',
      card: 'rgba(96,165,250,0.08)',
      cardBorder: 'rgba(96,165,250,0.2)',
      orb: '#60A5FA',
      orbGlow: 'rgba(96,165,250,0.35)',
      particle: '#E0F2FE',
      orbInhale: '#BAE6FD',
      orbExhale: '#1E3A5F',
      orbHold: '#60A5FA',
    },
    nightColors: {
      background: '#050A1A',
      backgroundSecondary: '#0A1228',
      gradientStart: '#1E3A8A',
      gradientEnd: '#0F172A',
      primary: '#3B82F6',
      primaryLight: '#60A5FA',
      text: '#EFF6FF',
      textSecondary: '#BFDBFE',
      textMuted: '#6C8BB5',
      card: 'rgba(59,130,246,0.08)',
      cardBorder: 'rgba(59,130,246,0.2)',
      orb: '#3B82F6',
      orbGlow: 'rgba(59,130,246,0.35)',
      particle: '#DBEAFE',
      orbInhale: '#E0F2FE',
      orbExhale: '#0C2340',
      orbHold: '#3B82F6',
    },
  },
  kerala: {
    id: 'kerala',
    name: 'Kerala',
    nameHindi: 'केरल',
    tagline: 'Monsoon Rain & Backwater Calm',
    taglineHindi: 'मानसून की बारिश और शांत बैकवाटर',
    particleType: 'rain',
    audioKey: 'kerala',
    icon: '🌴',
    dayColors: {
      background: '#0A1F0A',
      backgroundSecondary: '#0F2B0F',
      gradientStart: '#4ADE80',
      gradientEnd: '#15803D',
      primary: '#4ADE80',
      primaryLight: '#86EFAC',
      text: '#F0FDF4',
      textSecondary: '#BBF7D0',
      textMuted: '#7DB992',
      card: 'rgba(74,222,128,0.08)',
      cardBorder: 'rgba(74,222,128,0.2)',
      orb: '#4ADE80',
      orbGlow: 'rgba(74,222,128,0.35)',
      particle: '#BBF7D0',
      orbInhale: '#A7F3D0',
      orbExhale: '#065F46',
      orbHold: '#34D399',
    },
    nightColors: {
      background: '#021005',
      backgroundSecondary: '#041A07',
      gradientStart: '#166534',
      gradientEnd: '#052E16',
      primary: '#22C55E',
      primaryLight: '#4ADE80',
      text: '#F0FDF4',
      textSecondary: '#BBF7D0',
      textMuted: '#629F78',
      card: 'rgba(34,197,94,0.08)',
      cardBorder: 'rgba(34,197,94,0.2)',
      orb: '#22C55E',
      orbGlow: 'rgba(34,197,94,0.35)',
      particle: '#86EFAC',
      orbInhale: '#D1FAE5',
      orbExhale: '#022C22',
      orbHold: '#10B981',
    },
  },
  assam: {
    id: 'assam',
    name: 'Assam',
    nameHindi: 'असम',
    tagline: 'Forest Birds & Brahmaputra Mist',
    taglineHindi: 'वन के पक्षी और ब्रह्मपुत्र की靄',
    particleType: 'rain',
    audioKey: 'assam',
    icon: '🌿',
    dayColors: {
      background: '#1A0F2E',
      backgroundSecondary: '#241540',
      gradientStart: '#A78BFA',
      gradientEnd: '#6D28D9',
      primary: '#A78BFA',
      primaryLight: '#C4B5FD',
      text: '#F5F3FF',
      textSecondary: '#DDD6FE',
      textMuted: '#AC9CCF',
      card: 'rgba(167,139,250,0.08)',
      cardBorder: 'rgba(167,139,250,0.2)',
      orb: '#A78BFA',
      orbGlow: 'rgba(167,139,250,0.35)',
      particle: '#E9D5FF',
      orbInhale: '#FEF3C7',
      orbExhale: '#3B1F00',
      orbHold: '#A3E635',
    },
    nightColors: {
      background: '#0A0415',
      backgroundSecondary: '#10081E',
      gradientStart: '#4C1D95',
      gradientEnd: '#1E1035',
      primary: '#7C3AED',
      primaryLight: '#A78BFA',
      text: '#F5F3FF',
      textSecondary: '#DDD6FE',
      textMuted: '#8F7CB5',
      card: 'rgba(124,58,237,0.08)',
      cardBorder: 'rgba(124,58,237,0.2)',
      orb: '#7C3AED',
      orbGlow: 'rgba(124,58,237,0.35)',
      particle: '#C4B5FD',
      orbInhale: '#F0FDF4',
      orbExhale: '#1A0F00',
      orbHold: '#4ADE80',
    },
  },
  andaman: {
    id: 'andaman',
    name: 'Andaman',
    nameHindi: 'अंडमान',
    tagline: 'Ocean Depths & Tidal Silence',
    taglineHindi: 'समुद्र की गहराई और लहरों की शांति',
    particleType: 'ocean',
    audioKey: 'andaman',
    icon: '🌊',
    dayColors: {
      background: '#001A2C',
      backgroundSecondary: '#002438',
      gradientStart: '#22D3EE',
      gradientEnd: '#0E7490',
      primary: '#22D3EE',
      primaryLight: '#67E8F9',
      text: '#ECFEFF',
      textSecondary: '#A5F3FC',
      textMuted: '#6BA4B8',
      card: 'rgba(34,211,238,0.08)',
      cardBorder: 'rgba(34,211,238,0.2)',
      orb: '#22D3EE',
      orbGlow: 'rgba(34,211,238,0.35)',
      particle: '#A5F3FC',
      orbInhale: '#BAE6FD',
      orbExhale: '#0C4A6E',
      orbHold: '#38BDF8',
    },
    nightColors: {
      background: '#000D18',
      backgroundSecondary: '#001220',
      gradientStart: '#164E63',
      gradientEnd: '#0A2035',
      primary: '#06B6D4',
      primaryLight: '#22D3EE',
      text: '#ECFEFF',
      textSecondary: '#A5F3FC',
      textMuted: '#53879F',
      card: 'rgba(6,182,212,0.08)',
      cardBorder: 'rgba(6,182,212,0.2)',
      orb: '#06B6D4',
      orbGlow: 'rgba(6,182,212,0.35)',
      particle: '#67E8F9',
      orbInhale: '#E0F2FE',
      orbExhale: '#082F49',
      orbHold: '#0284C7',
    },
  },
};

export const THEME_ORDER: ThemeId[] = ['rajasthan', 'himalaya', 'kerala', 'assam', 'andaman'];
