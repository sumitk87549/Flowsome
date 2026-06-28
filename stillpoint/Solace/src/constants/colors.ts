export const COLORS = {
  // Base backgrounds
  neutralDark: '#0D0D0E',
  workBlue: '#0E1420',
  restSlate: '#101318',

  // Accent
  amber: '#D4956A',
  amberDim: 'rgba(212, 149, 106, 0.85)',
  amberSubtle: 'rgba(212, 149, 106, 0.14)',

  // Text
  cream: '#E8DFD0',
  warmWhite: '#F6F3EC',
  creamDim: 'rgba(232, 223, 208, 0.72)',
  creamFaint: 'rgba(232, 223, 208, 0.40)',
  creamGhost: 'rgba(232, 223, 208, 0.14)',

  // Work session background keyframes (6 stops for color ramp over session duration)
  workBg0: '#0E1420',
  workBg1: '#0F1822',
  workBg2: '#101C26',
  workBg3: '#112028',
  workBg4: '#12222A',
  workBg5: '#13242C',

  // Story theme gradient stops (6 themes, 2 colors each: [top, bottom])
  storyTheme0: ['#0E1420', '#101C26'],
  storyTheme1: ['#0F1520', '#111E28'],
  storyTheme2: ['#0D1318', '#101A22'],
  storyTheme3: ['#0E1622', '#121E2A'],
  storyTheme4: ['#0F1218', '#111820'],
  storyTheme5: ['#0E1520', '#131E28'],

  // Toggle
  toggleTrackOff: 'rgba(232, 223, 208, 0.14)',
  toggleTrackOn: 'rgba(212, 149, 106, 0.85)',

  // Borders
  borderFaint: 'rgba(232, 223, 208, 0.10)',
  borderAmber: 'rgba(212, 149, 106, 0.60)',

  // Work session background keyframes (name → hex)
  workBg_0min:  '#1A1B2E',  // deep navy — session start
  workBg_6min:  '#1C1F33',  // slightly cooler
  workBg_12min: '#1E2038',  // mid-session deepening
  workBg_18min: '#1F2140',  // darker blue
  workBg_23min: '#1F2337',  // near-final (final color used by Transition screen)

  // Sprint 7 additions
  forestNight: '#141E1A',     // the dark green background for rest screens
  restText:    '#EAE4D9',     // cream-warm text color for all rest mode panels
  sageGreen:  '#8BAF9A',   // breathing dot and ripple color
} as const;
