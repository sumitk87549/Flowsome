export type ThemeMode = 'system' | 'dawn' | 'night';

export const NIGHT_THEME = {
  mode: 'night' as const,
  colors: {
    background: '#0B0D10', // ink
    surface: '#101318',
    workBg: '#0E1624', // deepBlue
    restBg: '#10201A', // forestNight
    text: '#EEE6D8', // warmCream
    textMuted: 'rgba(238,230,216,0.68)',
    accent: '#D59A72', // amber
    accentSecondary: '#94B8A2', // sage
    line: 'rgba(238,230,216,0.12)',
    danger: '#B36B6B', // muted rose
  },
};

export const DAWN_THEME = {
  mode: 'dawn' as const,
  colors: {
    background: '#F4EFE5', // paper
    surface: '#E8E1D3', // mist
    workBg: '#DDE7E6', // skyWash
    restBg: '#E8E1D3', // mist
    text: '#25231F', // inkText
    textMuted: 'rgba(37,35,31,0.62)',
    accent: '#C9825E', // clay
    accentSecondary: '#6E927D', // leaf
    line: 'rgba(37,35,31,0.12)',
    danger: '#A85A5A',
  },
};

export type ThemeTokens = {
  mode: ThemeMode;
  colors: {
    background: string;
    surface: string;
    workBg: string;
    restBg: string;
    text: string;
    textMuted: string;
    accent: string;
    accentSecondary: string;
    line: string;
    danger: string;
  };
};
