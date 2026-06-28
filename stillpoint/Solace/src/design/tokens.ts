export type ThemeMode = 'system' | 'dawn' | 'night';

export const NIGHT_THEME = {
  mode: 'night' as const,
  colors: {
    background: '#080B10',
    backgroundDeep: '#0D1320',
    surface: 'rgba(255, 250, 238, 0.07)',
    surfaceStrong: 'rgba(255, 250, 238, 0.12)',
    textPrimary: '#F1E9DA',
    textSecondary: 'rgba(241, 233, 218, 0.72)',
    textMuted: 'rgba(241, 233, 218, 0.50)',
    line: 'rgba(241, 233, 218, 0.14)',
    accent: '#D39A72',
    accentSoft: 'rgba(211, 154, 114, 0.22)',
    sage: '#91B7A0',
    danger: '#D98C8C',
  },
};

export const DAWN_THEME = {
  mode: 'dawn' as const,
  colors: {
    background: '#F3EEE4',
    backgroundDeep: '#E7DED0',
    surface: 'rgba(255, 255, 255, 0.48)',
    surfaceStrong: 'rgba(255, 255, 255, 0.72)',
    textPrimary: '#25231F',
    textSecondary: 'rgba(37, 35, 31, 0.70)',
    textMuted: 'rgba(37, 35, 31, 0.52)',
    line: 'rgba(37, 35, 31, 0.13)',
    accent: '#C9825E',
    accentSoft: 'rgba(201, 130, 94, 0.20)',
    sage: '#6E927D',
    danger: '#B56F6F',
  },
};

export type ThemeTokens = {
  mode: ThemeMode;
  colors: {
    background: string;
    backgroundDeep: string;
    surface: string;
    surfaceStrong: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    line: string;
    accent: string;
    accentSoft: string;
    sage: string;
    danger: string;
  };
};
