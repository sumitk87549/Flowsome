// constants/themes.ts — Sprint 13: Dramatic, immersive palettes

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
  // ═══════════════════════════════════════════════
  // RAJASTHAN — Haveli at sunset / Indigo desert moon
  // ═══════════════════════════════════════════════
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
      background: '#1C0F02',       // deep burnt umber — warm, not grey
      backgroundSecondary: '#2A1705',
      gradientStart: '#E8920A',    // liquid saffron
      gradientEnd: '#8B4513',      // burnt sienna
      primary: '#F0A030',          // marigold gold
      primaryLight: '#FFCC66',     // pale gold
      text: '#FFF5E0',             // warm cream — glowing parchment
      textSecondary: '#FFDEA0',    // soft gold
      textMuted: '#C4A070',        // sandstone
      card: 'rgba(240,160,48,0.10)',
      cardBorder: 'rgba(240,160,48,0.22)',
      orb: '#F0A030',
      orbGlow: 'rgba(240,160,48,0.40)',
      particle: '#FFD080',         // golden dust motes
      orbInhale: '#FFDD88',
      orbExhale: '#8B4513',
      orbHold: '#E8920A',
    },
    nightColors: {
      background: '#0A0820',       // midnight indigo — desert sky
      backgroundSecondary: '#120E30',
      gradientStart: '#3A2570',    // deep violet
      gradientEnd: '#0A0820',
      primary: '#D4A030',          // moonlit gold
      primaryLight: '#F0C060',
      text: '#E8E0F0',             // moonlight white — cool
      textSecondary: '#C8B8D8',
      textMuted: '#8878A8',        // dusty lavender
      card: 'rgba(212,160,48,0.08)',
      cardBorder: 'rgba(212,160,48,0.18)',
      orb: '#D4A030',
      orbGlow: 'rgba(212,160,48,0.35)',
      particle: '#F0C060',         // gold against indigo
      orbInhale: '#FFE090',
      orbExhale: '#2A1860',
      orbHold: '#D4A030',
    },
  },

  // ═══════════════════════════════════════════════
  // HIMALAYA — Crystalline altitude / Milky Way at 4000m
  // ═══════════════════════════════════════════════
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
      background: '#0C1628',       // pale arctic navy
      backgroundSecondary: '#101E38',
      gradientStart: '#6CB4F0',    // glacier blue
      gradientEnd: '#1E3A6A',
      primary: '#70B8F8',          // ice crystal blue
      primaryLight: '#A0D4FF',
      text: '#F0F6FF',             // crisp snow white
      textSecondary: '#C8DCFF',
      textMuted: '#7898C8',        // frosted steel
      card: 'rgba(112,184,248,0.08)',
      cardBorder: 'rgba(112,184,248,0.18)',
      orb: '#70B8F8',
      orbGlow: 'rgba(112,184,248,0.38)',
      particle: '#D0E8FF',         // snowflake white-blue
      orbInhale: '#B8DCFF',
      orbExhale: '#1A3060',
      orbHold: '#5CA8E8',
    },
    nightColors: {
      background: '#04081A',       // near-black navy — starfield depth
      backgroundSecondary: '#0A1028',
      gradientStart: '#182860',    // midnight cobalt
      gradientEnd: '#04081A',
      primary: '#5090E0',          // electric blue-violet
      primaryLight: '#78B0F8',
      text: '#E0E8F8',             // starlight silver
      textSecondary: '#B0C4E8',
      textMuted: '#6080B0',        // deep frost
      card: 'rgba(80,144,224,0.07)',
      cardBorder: 'rgba(80,144,224,0.16)',
      orb: '#5090E0',
      orbGlow: 'rgba(80,144,224,0.35)',
      particle: '#C0D8F8',
      orbInhale: '#D8ECFF',
      orbExhale: '#0C1838',
      orbHold: '#4080D0',
    },
  },

  // ═══════════════════════════════════════════════
  // KERALA — Lush backwater / Monsoon night lantern
  // ═══════════════════════════════════════════════
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
      background: '#061A0E',       // deep emerald forest
      backgroundSecondary: '#0A2416',
      gradientStart: '#30B870',    // malachite green
      gradientEnd: '#0A3820',
      primary: '#40C878',          // vivid jade
      primaryLight: '#70E0A0',
      text: '#E8FFF0',             // warm cream on green
      textSecondary: '#B0E8C8',
      textMuted: '#68A880',        // moss green
      card: 'rgba(64,200,120,0.08)',
      cardBorder: 'rgba(64,200,120,0.18)',
      orb: '#40C878',
      orbGlow: 'rgba(64,200,120,0.38)',
      particle: '#A0E8C0',
      orbInhale: '#90E0B0',
      orbExhale: '#083018',
      orbHold: '#30B060',
    },
    nightColors: {
      background: '#020E08',       // very dark forest
      backgroundSecondary: '#041810',
      gradientStart: '#0A3020',    // deep canopy
      gradientEnd: '#020E08',
      primary: '#28A868',          // bioluminescent green
      primaryLight: '#48D088',
      text: '#E0F0E8',             // pale lantern light
      textSecondary: '#A8D8B8',
      textMuted: '#508868',        // deep moss
      card: 'rgba(40,168,104,0.07)',
      cardBorder: 'rgba(40,168,104,0.16)',
      orb: '#28A868',
      orbGlow: 'rgba(40,168,104,0.35)',
      particle: '#78D8A0',
      orbInhale: '#C8F0D8',
      orbExhale: '#041808',
      orbHold: '#20985C',
    },
  },

  // ═══════════════════════════════════════════════
  // ASSAM — Morning mist tea gardens / Deep forest dark
  // ═══════════════════════════════════════════════
  assam: {
    id: 'assam',
    name: 'Assam',
    nameHindi: 'असम',
    tagline: 'Forest Birds & Brahmaputra Mist',
    taglineHindi: 'वन के पक्षी और ब्रह्मपुत्र की धुंध',
    particleType: 'rain',
    audioKey: 'assam',
    icon: '🌿',
    dayColors: {
      background: '#101810',       // misty sage-dark
      backgroundSecondary: '#182218',
      gradientStart: '#78A848',    // fresh grass green
      gradientEnd: '#283828',
      primary: '#88B850',          // tea-garden chartreuse
      primaryLight: '#B0D878',
      text: '#F0F0E0',             // warm golden-white
      textSecondary: '#D0D8B8',
      textMuted: '#88A070',        // sage mist
      card: 'rgba(136,184,80,0.08)',
      cardBorder: 'rgba(136,184,80,0.18)',
      orb: '#88B850',
      orbGlow: 'rgba(136,184,80,0.38)',
      particle: '#C8E8A0',         // misty green-gold
      orbInhale: '#D0E8A8',
      orbExhale: '#1A2818',
      orbHold: '#78A840',
    },
    nightColors: {
      background: '#060A06',       // almost-black green undertone
      backgroundSecondary: '#0A100A',
      gradientStart: '#1A2818',    // deep forest
      gradientEnd: '#060A06',
      primary: '#68A040',          // phosphorescent green
      primaryLight: '#88C060',
      text: '#D8E0D0',             // pale ghost-green
      textSecondary: '#A8B898',
      textMuted: '#588050',        // deep fern
      card: 'rgba(104,160,64,0.07)',
      cardBorder: 'rgba(104,160,64,0.15)',
      orb: '#68A040',
      orbGlow: 'rgba(104,160,64,0.35)',
      particle: '#A0D078',
      orbInhale: '#C8E8B0',
      orbExhale: '#081008',
      orbHold: '#589838',
    },
  },

  // ═══════════════════════════════════════════════
  // ANDAMAN — Turquoise lagoon / Bioluminescent shore
  // ═══════════════════════════════════════════════
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
      background: '#021824',       // deep azure
      backgroundSecondary: '#042030',
      gradientStart: '#20B8D8',    // electric cyan
      gradientEnd: '#083848',
      primary: '#30C8E0',          // bright lagoon
      primaryLight: '#60E0F0',
      text: '#E8FCFF',             // bleached coral white
      textSecondary: '#A0E8F8',
      textMuted: '#5898B0',        // ocean mist
      card: 'rgba(48,200,224,0.08)',
      cardBorder: 'rgba(48,200,224,0.18)',
      orb: '#30C8E0',
      orbGlow: 'rgba(48,200,224,0.38)',
      particle: '#90E8F8',         // pale cyan foam
      orbInhale: '#A8F0FF',
      orbExhale: '#0C3848',
      orbHold: '#28B0D0',
    },
    nightColors: {
      background: '#020C18',       // midnight blue-black
      backgroundSecondary: '#041420',
      gradientStart: '#0C2838',    // deep ocean
      gradientEnd: '#020C18',
      primary: '#1CA8C8',          // glowing teal
      primaryLight: '#38C8E0',
      text: '#D8F0F8',             // palest blue-white
      textSecondary: '#90D0E8',
      textMuted: '#487898',        // deep ocean
      card: 'rgba(28,168,200,0.07)',
      cardBorder: 'rgba(28,168,200,0.15)',
      orb: '#1CA8C8',
      orbGlow: 'rgba(28,168,200,0.35)',
      particle: '#68D8F0',         // bioluminescent teal
      orbInhale: '#B8F0FF',
      orbExhale: '#061820',
      orbHold: '#1898B8',
    },
  },
};

export const THEME_ORDER: ThemeId[] = ['rajasthan', 'himalaya', 'kerala', 'assam', 'andaman'];
