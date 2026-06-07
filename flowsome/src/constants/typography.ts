/**
 * Typography scale — applied consistently across all screens.
 * Weights follow the "Air / Water / Earth" philosophy:
 *   Display → ultra-light, enormous presence
 *   Title   → light, generous
 *   Body    → regular, readable
 *   Caption → tracked uppercase, small
 */

export const TYPE = {
  /** Hero numerals: session timer */
  DISPLAY: {
    fontSize: 88,
    fontWeight: '100' as const,
    letterSpacing: -4,
    includeFontPadding: false,
  },
  /** Page titles */
  TITLE: {
    fontSize: 48,
    fontWeight: '200' as const,
    letterSpacing: -1.5,
  },
  /** Section headings */
  HEADING: {
    fontSize: 22,
    fontWeight: '300' as const,
    letterSpacing: -0.3,
  },
  /** Sub-heading / card labels */
  SUBHEADING: {
    fontSize: 17,
    fontWeight: '400' as const,
    letterSpacing: 0.2,
  },
  /** Body copy */
  BODY: {
    fontSize: 15,
    fontWeight: '400' as const,
    letterSpacing: 0.2,
  },
  /** Phase labels / mode names */
  LABEL: {
    fontSize: 13,
    fontWeight: '400' as const,
    letterSpacing: 2.5,
  },
  /** OVERLINE / section labels */
  CAPTION: {
    fontSize: 10,
    fontWeight: '500' as const,
    letterSpacing: 3,
  },
  /** Tiny pill text */
  MICRO: {
    fontSize: 9,
    fontWeight: '500' as const,
    letterSpacing: 1.5,
  },
} as const;
