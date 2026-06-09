// constants/typography.ts

export const FONTS = {
  heading: 'CormorantGaramond-SemiBold',
  headingLight: 'CormorantGaramond-Light',
  headingItalic: 'CormorantGaramond-Italic',
  body: 'DMSans-Regular',
  bodyMedium: 'DMSans-Medium',
  bodySemiBold: 'DMSans-SemiBold',
} as const;

export const FONT_SIZES = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
  hero: 64,
} as const;

export const LINE_HEIGHTS = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.8,
} as const;

export const LETTER_SPACINGS = {
  tight: -0.5,
  normal: 0,
  wide: 1.5,
  wider: 3,
} as const;
