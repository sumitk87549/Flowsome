export const FONT = {
  thin: 'DMSans-Thin',
  light: 'DMSans-Light',
  regular: 'DMSans-Regular',
} as const;

// Font sizes (sp values)
export const FS = {
  xs: 10,
  sm: 12,
  md: 13,
  base: 15,
  body: 17,
  title: 19,
  display: 20,
  lg: 24,
  wordmark: 28,
} as const;

// Letter spacing (dp values)
export const TRACKING = {
  none: 0,
  tight: 0.5,
  base: 1,
  wide: 1.5,
  wider: 4,
  widest: 7,
} as const;
