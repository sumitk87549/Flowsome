# Flowsome - Comprehensive Developer Technical Guide

**Last Updated:** 2024  
**Framework:** React Native with Expo SDK 56  
**Purpose:** Complete reference for developers/AI to understand, navigate, and modify any part of the app

---

## Table of Contents

1. [What is Flowsome?](#1-what-is-flowsome)
2. [Tech Stack & Dependencies](#2-tech-stack--dependencies)
3. [Complete Directory Structure](#3-complete-directory-structure)
4. [Architecture Overview](#4-architecture-overview)
5. [Core Systems Deep Dive](#5-core-systems-deep-dive)
6. [File-by-File Reference](#6-file-by-file-reference)
7. [Modification Scenarios (Playbook)](#7-modification-scenarios-playbook)
8. [Data Flow Diagrams](#8-data-flow-diagrams)
9. [Key Patterns & Conventions](#9-key-patterns--conventions)
10. [Build & Deployment](#10-build--deployment)

---

## 1. What is Flowsome?

**Flowsome** is a premium wellness and productivity application with a strong Indian cultural identity. It offers:

### Four Core Practices (Sessions)
| Session | Purpose | Routes | Key Components |
|---------|---------|--------|----------------|
| **Breathe** 🌬️ | Breathing exercises (Box, 4-7-8, Nadi Shodhana) | `/(sessions)/breathing/` | `BreathingOrb`, `BreathingPhaseLabel`, `useBreathing` hook |
| **Focus** ⏱️ | Pomodoro & Deep Work timers | `/(sessions)/pomodoro/` | `useTimer` hook, `CircularTimer` |
| **Meditate** 🧘 | Mindfulness, Vipassana, Yoga Nidra | `/(sessions)/meditation/` | `MeditationCard`, `MeditationAmbient` |
| **Flow** ✨ | Creative deep work sessions | `/(sessions)/focus/` | `IntentionInput`, `FocusAmbient` |

### Five Regional Themes (Indian Identity)
| Theme | Icon | Particle Effect | Audio Ambience |
|-------|------|-----------------|----------------|
| **Rajasthan** 🏜️ | Desert | Dust particles | Desert wind |
| **Himalaya** 🏔️ | Mountains | Snow particles | Mountain wind |
| **Kerala** 🌴 | Backwaters | Rain particles | Rain & river |
| **Assam** 🌿 | Forest | Rain particles | Forest birds |
| **Andaman** 🌊 | Ocean | Ocean waves | Ocean waves |

### Key Features
- **Bilingual Support:** English (en-IN) and Hindi (hi-IN) with auto-detection
- **Day/Night Mode:** Each region has distinct day and night color palettes
- **Dynamic Particle System:** Skia-based animations tied to themes
- **Spatial Audio:** Ambient sounds, binaural beats (alpha/theta/delta), SFX
- **Haptic Feedback:** Contextual haptics for interactions and phase transitions
- **Keep Awake:** Optional screen awake during sessions

---

## 2. Tech Stack & Dependencies

### Core Framework
```json
{
  "expo": "^56.0.4",
  "react": "19.2.3",
  "react-native": "0.85.3"
}
```

### Routing
- **expo-router** (~56.2.9): File-based routing system
  - `_layout.tsx` files define nested routes
  - `(sessions)` is a route group (doesn't affect URL)

### State Management
- **Zustand** (^5.0.14): Global state with middleware
  - `persist` + `createJSONStorage` for AsyncStorage persistence
  - Three stores: `appStore`, `settingsStore`, `sessionStore`

### Animations & Graphics
- **@shopify/react-native-skia** (2.6.2): High-performance particle canvas
- **react-native-reanimated** (4.3.1): Smooth animations
- **react-native-worklets** (0.8.3): Reanimated worklet support

### Audio & Haptics
- **expo-audio** (~56.0.11): Ambient, binaural, SFX playback
- **expo-haptics** (~56.0.3): Tactile feedback
- **expo-speech** (~56.0.3): Voice cues for breathing phases

### UI & Theming
- **expo-blur** (~56.0.3): Glassmorphism card effects
- **expo-linear-gradient** (~56.0.4): Background gradients
- **expo-system-ui** (~56.0.5): System navigation bar sync
- Custom theming via `useTheme()` hook

### Utilities
- **@react-native-async-storage/async-storage** (2.2.0): Persistence
- **expo-localization** (~56.0.6): Language detection
- **expo-keep-awake** (~56.0.3): Prevent screen sleep
- **react-native-gesture-handler** (~2.31.1): Touch gestures (ThemeSelector)

---

## 3. Complete Directory Structure

```
flowsome/
├── app/                          # EXPO ROUTER - All screens & routing
│   ├── _layout.tsx               # ROOT LAYOUT: Fonts, theme provider, splash, nav bar sync
│   ├── index.tsx                 # HOME SCREEN: Theme selector, session cards, particle background
│   ├── settings/
│   │   └── index.tsx             # SETTINGS SCREEN: Language, audio volumes, haptics, keep-awake
│   └── (sessions)/               # ROUTE GROUP for all practice sessions
│       ├── _layout.tsx           # Shared layout for sessions (optional)
│       ├── breathing/
│       │   ├── index.tsx         # Breathing picker (select pattern)
│       │   └── session.tsx       # Active breathing session (orb animation)
│       ├── pomodoro/
│       │   ├── index.tsx         # Focus mode picker + duration setup
│       │   └── session.tsx       # Active pomodoro timer
│       ├── meditation/
│       │   ├── index.tsx         # Meditation type picker
│       │   └── session.tsx       # Active meditation session
│       └── focus/
│           ├── index.tsx         # Flow mode picker + intention input
│           └── session.tsx       # Active flow session
│
├── components/                   # REUSABLE UI COMPONENTS
│   ├── ui/                       # Generic UI primitives
│   │   ├── FlowText.tsx          # Themed text with typography variants
│   │   ├── FlowCard.tsx          # Glassmorphism card with blur
│   │   ├── FlowButton.tsx        # Themed button component
│   │   └── SafeScreen.tsx        # Safe area wrapper
│   ├── home/                     # Home screen specific
│   │   ├── ThemeSelector.tsx     # Horizontal scrollable theme carousel
│   │   ├── SessionCard.tsx       # Grid cards for session navigation
│   │   └── DayNightToggle.tsx    # Day/night switch toggle
│   ├── breathing/                # Breathing session components
│   │   ├── BreathingOrb.tsx      # Animated orb (expands/contracts with breath)
│   │   ├── BreathingPhaseLabel.tsx # Current phase label (Inhale/Hold/etc.)
│   │   └── BreathingProgress.tsx # Cycle progress dots
│   ├── meditation/
│   │   ├── MeditationCard.tsx    # Meditation type selection card
│   │   └── MeditationAmbient.tsx # Meditation-specific audio controller
│   ├── focus/
│   │   ├── IntentionInput.tsx    # Text input for session intention
│   │   └── FocusAmbient.tsx      # Focus-specific audio controller
│   ├── timer/
│   │   ├── TimeDisplay.tsx       # MM:SS timer display
│   │   └── CircularTimer.tsx     # Circular progress timer (Skia)
│   ├── particles/                # Skia particle systems
│   │   ├── ParticleCanvas.tsx    # Main canvas wrapper (full-screen, absolute)
│   │   ├── DustParticles.tsx     # Rajasthan desert dust
│   │   ├── SnowParticles.tsx     # Himalaya snowflakes
│   │   ├── RainParticles.tsx     # Kerala/Assam rain
│   │   ├── WaterRipple.tsx       # Alternative water effect
│   │   └── OceanWave.tsx         # Andaman ocean waves
│   ├── audio/
│   │   └── AudioManager.tsx      # Headless ambient audio controller (home only)
│   ├── async-skia.tsx            # Web fallback for Skia
│   ├── async-skia.native.tsx     # Native Skia loader
│   └── iridescence.tsx           # Decorative gradient overlay
│
├── constants/                    # STATIC CONFIGURATION DATA
│   ├── themes.ts                 # ALL THEMES: colors, particle types, names (EN/HI)
│   ├── breathing-patterns.ts     # Breathing patterns (box, 4-7-8, nadi shodhana)
│   ├── meditation-types.ts       # Meditation types (mindfulness, vipassana, yoga nidra)
│   ├── focus-modes.ts            # Focus modes (deep work, pomodoro, creative flow)
│   ├── quotes.ts                 # Inspirational quotes (if used)
│   └── typography.ts             # Font families, sizes, line heights, letter spacing
│
├── hooks/                        # CUSTOM REACT HOOKS
│   ├── useTheme.ts               # Get current theme colors (based on activeTheme + dayNight)
│   ├── useSettings.ts            # Proxy to settings store
│   ├── useAudio.ts               # Audio hooks: useAmbientAudio, useBinauralAudio, useSFX
│   ├── useBreathing.ts           # Breathing logic engine (phase timing, cycles)
│   ├── useTimer.ts               # Timer logic engine (work/break cycles)
│   └── useSpeech.ts              # Text-to-speech for phase cues
│
├── store/                        # ZUSTAND GLOBAL STATE
│   ├── appStore.ts               # App-level: activeTheme, dayNight, isSessionActive
│   ├── settingsStore.ts          # User prefs: language, volumes, haptics, keepAwake
│   └── sessionStore.ts           # Session state: activeMode, timerState, breathingPhase, etc.
│
├── utils/                        # UTILITY FUNCTIONS
│   ├── hapticUtils.ts            # Haptic feedback wrappers (light, medium, heavy, success)
│   ├── colorUtils.ts             # Color manipulation utilities
│   └── timeUtils.ts              # Time formatting utilities
│
├── services/
│   └── speechService.ts          # Speech synthesis service configuration
│
├── assets/
│   ├── fonts/                    # CormorantGaramond-*, DMSans-*
│   └── audio/
│       ├── ambient/              # Region-specific ambient tracks
│       ├── binaural/             # alpha-10hz, theta-6hz, delta-2hz
│       └── sfx/                  # ding-soft, singing-bowl, breath-complete
│
├── public/                       # Static assets for web build
│
├── config files
│ ├── app.json                    # Expo app configuration
│ ├── eas.json                    # EAS Build profiles (dev, preview, production)
│ ├── package.json                # Dependencies & scripts
│ ├── tsconfig.json               # TypeScript configuration
│ ├── babel.config.js             # Babel config (Reanimated plugin)
│ └── fonts.css                   # Web font loading
│
└── copy-canvaskit.js             # Script to copy CanvasKit for web
```

---

## 4. Architecture Overview

### State Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      ZUSTAND STORES                         │
├──────────────────┬──────────────────┬───────────────────────┤
│   appStore       │  settingsStore   │    sessionStore       │
│──────────────────│──────────────────│───────────────────────│
│ • activeTheme    │ • language       │ • activeMode          │
│ • dayNight       │ • ambientVolume  │ • timerState          │
│ • isSessionActive│ • binauralVolume │ • breathingPhase      │
│                  │ • sfxVolume      │ • currentCycle        │
│                  │ • hapticsEnabled │ • totalCycles         │
│                  │ • keepAwakeEnabled│ • secondsRemaining   │
│                  │                  │ • selectedPatternId   │
│                  │                  │ • selectedMeditationId│
│                  │                  │ • intention           │
└──────────────────┴──────────────────┴───────────────────────┘
                            ↓
        All components read/write via custom hooks
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    CUSTOM HOOKS LAYER                       │
├─────────────┬─────────────┬──────────────┬──────────────────┤
│ useTheme()  │ useSettings()│ useAudio()   │ useBreathing()   │
│ useTimer()  │ useSpeech()  │              │                  │
└─────────────┴─────────────┴──────────────┴──────────────────┘
                            ↓
                    UI COMPONENTS
```

### Routing Architecture (Expo Router)

```
app/
├── _layout.tsx          ← Root: Fonts, ThemeProvider, StatusBar, NavBar sync
│
├── index.tsx            ← / (Home)
│   ├─ ParticleCanvas (background layer)
│   ├─ AudioManager (headless)
│   ├─ ThemeSelector
│   └─ SessionCards Grid
│
├── settings/
│   └── index.tsx        ← /settings
│
└── (sessions)/          ← Route group (URL: /(sessions)/X → /X)
    ├── _layout.tsx      ← Optional shared session layout
    │
    ├── breathing/
    │   ├── index.tsx    ← /breathing (picker)
    │   └── session.tsx  ← /breathing/session (active)
    │
    ├── pomodoro/
    │   ├── index.tsx    ← /pomodoro (picker)
    │   └── session.tsx  ← /pomodoro/session (active)
    │
    ├── meditation/
    │   ├── index.tsx    ← /meditation (picker)
    │   └── session.tsx  ← /meditation/session (active)
    │
    └── focus/
        ├── index.tsx    ← /focus (picker)
        └── session.tsx  ← /focus/session (active)
```

### Rendering Layers (Home Screen)

```
┌─────────────────────────────────────────────────────────────┐
│  Layer 4: UI Overlay (TouchableOpacity, Text, etc.)         │
│  - Header (Flowsome title, Settings icon, DayNight toggle)  │
│  - ThemeSelector carousel                                   │
│  - SessionCards grid                                        │
├─────────────────────────────────────────────────────────────┤
│  Layer 3: SafeScreen (SafeAreaProvider wrapper)             │
├─────────────────────────────────────────────────────────────┤
│  Layer 2: ParticleCanvas (absolute, pointerEvents="none")   │
│  - Full-screen Skia Canvas                                  │
│  - Theme-specific particle animation                        │
├─────────────────────────────────────────────────────────────┤
│  Layer 1: Background (from theme.colors.background)         │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Core Systems Deep Dive

### 5.1 Theming System (`constants/themes.ts`)

**Purpose:** Define all visual aspects of each regional theme with day/night variants.

**Structure:**
```typescript
type ThemeId = 'rajasthan' | 'himalaya' | 'kerala' | 'assam' | 'andaman';
type DayNight = 'day' | 'night';

interface ThemeColors {
  background: string;          // Main screen background
  backgroundSecondary: string; // Secondary areas
  gradientStart: string;       // Gradient top color
  gradientEnd: string;         // Gradient bottom color
  primary: string;             // Primary accent (buttons, highlights)
  primaryLight: string;        // Lighter variant of primary
  text: string;                // Main text color
  textSecondary: string;       // Secondary text
  textMuted: string;           // Muted/de-emphasized text
  card: string;                // Card background (rgba for transparency)
  cardBorder: string;          // Card border color
  orb: string;                 // Breathing orb color
  orbGlow: string;             // Orb glow effect (rgba)
  particle: string;            // Particle color
}

interface ThemeConfig {
  id: ThemeId;
  name: string;           // English name
  nameHindi: string;      // Hindi name
  tagline: string;        // English tagline
  taglineHindi: string;   // Hindi tagline
  dayColors: ThemeColors;
  nightColors: ThemeColors;
  particleType: 'dust' | 'snow' | 'rain' | 'ripple' | 'ocean';
  audioKey: string;       // Maps to ambient audio file
  icon: string;           // Emoji icon
}
```

**Usage in components:**
```typescript
// In any component:
const theme = useTheme();  // Returns ThemeColors for current theme+dayNight
const config = useThemeConfig();  // Returns ThemeConfig (metadata)

// Access colors:
theme.background      // e.g., '#2D1B00' for Rajasthan day
theme.primary         // e.g., '#F59E0B'
theme.text            // e.g., '#FEF3C7'

// Access metadata:
config.name           // "Rajasthan"
config.nameHindi      // "राजस्थान"
config.particleType   // "dust"
```

**How Day/Night works:**
- Stored in `appStore.dayNight` ('day' or 'night')
- `useTheme()` hook checks `dayNight` and returns appropriate colors
- `DayNightToggle` component toggles this value
- All components using `useTheme()` automatically re-render with new colors

---

### 5.2 State Stores

#### `appStore.ts` - Application State
```typescript
interface AppState {
  activeTheme: ThemeId;      // Current region (rajasthan, himalaya, etc.)
  dayNight: DayNight;        // 'day' or 'night'
  isSessionActive: boolean;  // True when any session is running
  
  setTheme: (theme: ThemeId) => void;
  setDayNight: (mode: DayNight) => void;
  setSessionActive: (active: boolean) => void;
}

// Persistence: Only activeTheme and dayNight are saved to AsyncStorage
```

#### `settingsStore.ts` - User Preferences
```typescript
interface SettingsState {
  language: 'en-IN' | 'hi-IN';   // App language
  ambientVolume: number;         // 0.0 to 1.0
  binauralVolume: number;        // 0.0 to 1.0
  sfxVolume: number;             // 0.0 to 1.0
  hapticsEnabled: boolean;       // Toggle haptics
  keepAwakeEnabled: boolean;     // Keep screen on during sessions
  
  // Setters for each field
}

// Auto-detection: On first launch, checks device language via expo-localization
```

#### `sessionStore.ts` - Session Runtime State
```typescript
type SessionMode = 'breathing' | 'pomodoro' | 'meditation' | 'focus' | null;
type BreathingPhase = 'inhale' | 'holdIn' | 'exhale' | 'holdOut' | 'idle';
type TimerState = 'idle' | 'running' | 'paused' | 'complete';

interface SessionState {
  activeMode: SessionMode;
  timerState: TimerState;
  breathingPhase: BreathingPhase;
  currentCycle: number;
  totalCycles: number;
  secondsRemaining: number;
  selectedPatternId: string | null;    // For breathing
  selectedMeditationId: string | null; // For meditation
  intention: string;                   // For focus sessions
  
  // Setters + resetSession()
}

// Note: This store is NOT persisted (ephemeral session data)
```

---

### 5.3 Audio System (`hooks/useAudio.ts`)

**Three audio layers:**

1. **Ambient Audio** (looping, theme-based)
   ```typescript
   useAmbientAudio(theme: string, autoPlay: boolean = true)
   // Maps theme to audio file:
   // rajasthan → assets/audio/ambient/rajasthan-desert-wind.mp3
   // himalaya → assets/audio/ambient/himalaya-mountain-wind.mp3
   // etc.
   ```

2. **Binaural Audio** (looping, brainwave-based)
   ```typescript
   useBinauralAudio(mode: 'alpha' | 'theta' | 'delta', autoPlay: boolean = true)
   // alpha → 10hz (focus, alertness)
   // theta → 6hz (meditation, creativity)
   // delta → 2hz (deep sleep, relaxation)
   ```

3. **SFX** (one-shot sounds)
   ```typescript
   const { playDing, playSingingBowl, playBreathDone } = useSFX();
   // ding → Timer complete
   // singingBowl → Meditation start/end
   // breathDone → Breathing cycle complete
   ```

**Volume control:** Each layer reads its volume from `settingsStore` and applies it dynamically.

**AudioManager component:** Mount once on home screen to handle ambient audio globally.

---

### 5.4 Breathing Engine (`hooks/useBreathing.ts`)

**Purpose:** Manage breathing phase timing, cycles, and synchronization.

**Input:** A `BreathingPattern` object from `constants/breathing-patterns.ts`

**Output:**
```typescript
interface UseBreathingReturn {
  state: 'idle' | 'running' | 'paused' | 'complete';
  currentPhase: BreathingPhaseObject;  // {name, durationSeconds, etc.}
  phaseProgress: number;               // 0 to 1 within current phase
  currentCycle: number;
  phaseSecondsRemaining: number;
  start, pause, resume, stop: () => void;
}
```

**How it works:**
1. Filters out phases with `durationSeconds === 0`
2. Runs a 100ms interval timer while `state === 'running'`
3. On phase completion:
   - Triggers haptic feedback
   - Speaks next phase cue via `useSpeech`
   - Updates `sessionStore.breathingPhase`
   - Increments cycle counter
4. On all cycles complete: sets `state = 'complete'`

**Example pattern (Box Breathing):**
```typescript
{
  id: 'box-breathing',
  cycles: 8,
  phases: [
    { name: 'inhale',  durationSeconds: 4 },
    { name: 'holdIn',  durationSeconds: 4 },
    { name: 'exhale',  durationSeconds: 4 },
    { name: 'holdOut', durationSeconds: 4 },
  ]
}
```

---

### 5.5 Timer Engine (`hooks/useTimer.ts`)

**Purpose:** Manage Pomodoro-style work/break cycles.

**Input:**
```typescript
{
  workMinutes: number;
  breakMinutes: number;
  totalPomodoros: number;
  onWorkComplete?: () => void;
  onBreakComplete?: () => void;
  onAllComplete?: () => void;
}
```

**Output:**
```typescript
{
  status: 'idle' | 'running' | 'paused' | 'complete';
  phase: 'work' | 'break' | 'idle';
  secondsLeft: number;
  completedPomodoros: number;
  progress: number;  // 0 to 1 within current phase
  start, pause, resume, stop: () => void;
}
```

**How it works:**
1. Starts in 'work' phase
2. Counts down every second
3. On work complete: triggers haptic, calls callback, switches to 'break'
4. On break complete: switches back to 'work'
5. After `totalPomodoros` cycles: sets `status = 'complete'`

---

### 5.6 Particle System (`components/particles/`)

**Architecture:**
```
ParticleCanvas.tsx (wrapper)
  ↓
Selects particle type based on theme.particleType
  ↓
Renders one of:
  - DustParticles.tsx   (Rajasthan)
  - SnowParticles.tsx   (Himalaya)
  - RainParticles.tsx   (Kerala, Assam)
  - WaterRipple.tsx     (alternative)
  - OceanWave.tsx       (Andaman)
```

**Key characteristics:**
- Full-screen absolute positioning
- `pointerEvents="none"` (doesn't block touches)
- Uses `@shopify/react-native-skia` Canvas
- Animations driven by `react-native-reanimated`
- Colors pulled from `theme.particle`

---

## 6. File-by-File Reference

### Root Level

#### `app/_layout.tsx`
**Purpose:** App entry point, global setup  
**Key responsibilities:**
- Loads custom fonts (CormorantGaramond, DMSans variants)
- Hides splash screen after fonts load
- Syncs Android navigation bar color to active theme
- Auto-detects device language on first launch
- Wraps app in GestureHandlerRootView and SafeAreaProvider

**Modify when:** Adding global providers, changing font loading, adjusting splash behavior

---

#### `app/index.tsx`
**Purpose:** Home screen dashboard  
**Key responsibilities:**
- Renders ParticleCanvas as background layer
- Mounts AudioManager for global ambient audio
- Displays header (title, settings button, day/night toggle)
- Shows ThemeSelector carousel
- Displays 4 session cards in a grid

**Modify when:** Changing home layout, adding new session types, rearranging UI elements

---

### Components

#### `components/ui/FlowText.tsx`
**Purpose:** Centralized text component with typography system  
**Props:**
- `variant`: 'heading' | 'headingLight' | 'headingItalic' | 'body' | 'bodyMedium' | 'label'
- `size`: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'hero'
- `color`: optional override (defaults to theme.text)

**Modify when:** Adding new typography variants, changing font mappings

---

#### `components/ui/FlowCard.tsx`
**Purpose:** Glassmorphism card container  
**Props:**
- `intensity`: blur intensity (default 20)
- `useBlur`: toggle blur vs solid background (default true)

**Modify when:** Changing card styling, blur behavior

---

#### `components/ui/FlowButton.tsx`
**Purpose:** Themed button component  
**Variants:** primary, secondary, ghost  
**Sizes:** sm, md, lg

**Modify when:** Adding button styles, changing button behavior

---

#### `components/ui/SafeScreen.tsx`
**Purpose:** Safe area wrapper for screens  
**Modify when:** Adjusting safe area handling

---

#### `components/home/ThemeSelector.tsx`
**Purpose:** Horizontal scrollable theme carousel  
**Key features:**
- Uses react-native-gesture-handler for swipe
- Shows all 5 themes with icons and names
- Highlights active theme with border
- Triggers `setTheme()` on tap

**Modify when:** Changing theme selection UI, adding gesture handling

---

#### `components/home/SessionCard.tsx`
**Purpose:** Grid card for session navigation  
**Data source:** `SESSION_CARDS` array (defined in same file)  
**Current cards:** Breathe, Focus, Meditate, Flow

**Modify when:** Adding new session types, changing card design

**To add a new session:**
1. Add entry to `SESSION_CARDS` array
2. Create route folder in `app/(sessions)/your-session/`
3. Update `sessionStore.ts` if new state needed

---

#### `components/home/DayNightToggle.tsx`
**Purpose:** Toggle between day and night mode  
**Uses:** `useAppStore().dayNight` and `setDayNight()`

**Modify when:** Changing toggle design or behavior

---

### Session Components

#### `components/breathing/BreathingOrb.tsx`
**Purpose:** Animated orb that expands/contracts with breathing  
**Input:** `phase` (current phase), `progress` (0-1 within phase)  
**Animation:** Scales based on phase (expand on inhale, contract on exhale)

**Modify when:** Changing orb visuals, animation curves

---

#### `components/breathing/BreathingPhaseLabel.tsx`
**Purpose:** Display current phase name and countdown  
**Shows:** Phase name (EN or HI based on language) + seconds remaining

**Modify when:** Changing label format, adding translations

---

#### `components/breathing/BreathingProgress.tsx`
**Purpose:** Show cycle progress with dots  
**Displays:** Filled dots for completed cycles, empty for remaining

**Modify when:** Changing progress indicator style

---

#### `components/meditation/MeditationCard.tsx`
**Purpose:** Meditation type selection card  
**Data source:** `MEDITATION_TYPES` from constants

**Modify when:** Adding meditation types, changing card design

---

#### `components/focus/IntentionInput.tsx`
**Purpose:** Text input for session intention  
**Stores:** Value in `sessionStore.intention`

**Modify when:** Changing input behavior, validation

---

### Particle Components

#### `components/particles/ParticleCanvas.tsx`
**Purpose:** Main particle system wrapper  
**Logic:** Selects particle component based on `theme.particleType`

**Modify when:** Adding new particle types, changing canvas setup

---

#### `components/particles/DustParticles.tsx`
**Purpose:** Rajasthan desert dust animation  
**Technique:** Skia circles with random drift

**Modify when:** Tuning dust behavior, colors

---

#### `components/particles/SnowParticles.tsx`
**Purpose:** Himalaya snowflake animation  
**Technique:** Skia circles with downward drift + sway

**Modify when:** Tuning snow behavior

---

#### `components/particles/RainParticles.tsx`
**Purpose:** Kerala/Assam rain animation  
**Technique:** Skia lines with fast downward motion

**Modify when:** Tuning rain intensity

---

#### `components/particles/OceanWave.tsx`
**Purpose:** Andaman ocean wave animation  
**Technique:** Skia paths with sine wave motion

**Modify when:** Tuning wave patterns

---

### Hooks

#### `hooks/useTheme.ts`
**Returns:** `ThemeColors` for current theme + day/night  
**Also exports:** `useThemeConfig()` for theme metadata

**Modify when:** Changing theme resolution logic

---

#### `hooks/useSettings.ts`
**Returns:** All settings from `settingsStore`

**Modify when:** Adding new settings fields

---

#### `hooks/useAudio.ts`
**Exports:**
- `useAmbientAudio(theme, autoPlay)`
- `useBinauralAudio(mode, autoPlay)`
- `useSFX()` → `{playDing, playSingingBowl, playBreathDone}`

**Modify when:** Adding new audio tracks, changing audio behavior

---

#### `hooks/useBreathing.ts`
**Input:** `BreathingPattern` object  
**Returns:** Breathing state machine with controls

**Modify when:** Changing breathing logic, phase transitions

---

#### `hooks/useTimer.ts`
**Input:** Timer configuration  
**Returns:** Timer state machine with controls

**Modify when:** Changing timer logic, work/break transitions

---

#### `hooks/useSpeech.ts`
**Purpose:** Text-to-speech for phase cues  
**Methods:** `speakCue(phaseName)`

**Modify when:** Adding new speech cues, changing voice settings

---

### Constants

#### `constants/themes.ts`
**Defines:** All 5 themes with day/night colors, particle types, names

**Modify when:** Adding new themes, changing colors, updating translations

---

#### `constants/breathing-patterns.ts`
**Defines:** Breathing patterns (box, 4-7-8, nadi shodhana, coherent)

**Modify when:** Adding new patterns, changing durations

---

#### `constants/meditation-types.ts`
**Defines:** Meditation types (mindfulness, vipassana, yoga nidra, trataka)

**Modify when:** Adding meditation types, changing descriptions

---

#### `constants/focus-modes.ts`
**Defines:** Focus modes (deep work, pomodoro-focus, creative flow)

**Modify when:** Adding focus modes, changing defaults

---

#### `constants/typography.ts`
**Defines:** Font families, sizes, line heights, letter spacings

**Modify when:** Changing typography scale, adding fonts

---

### Utils

#### `utils/hapticUtils.ts`
**Methods:** `light()`, `medium()`, `heavy()`, `success()`, `warning()`  
**Respects:** `settingsStore.hapticsEnabled`

**Modify when:** Adding new haptic patterns

---

#### `utils/colorUtils.ts`
**Purpose:** Color manipulation utilities

**Modify when:** Adding color utilities

---

#### `utils/timeUtils.ts`
**Purpose:** Time formatting (MM:SS, etc.)

**Modify when:** Adding time formatting options

---

## 7. Modification Scenarios (Playbook)

### Scenario 1: Add a New Regional Theme

**Goal:** Add "Goa" theme with beach/ocean aesthetics

**Files to modify:**
1. `constants/themes.ts`
   ```typescript
   // Add to ThemeId type:
   type ThemeId = 'rajasthan' | 'himalaya' | 'kerala' | 'assam' | 'andaman' | 'goa';
   
   // Add to THEME_ORDER array:
   export const THEME_ORDER: ThemeId[] = ['rajasthan', 'himalaya', 'kerala', 'assam', 'andaman', 'goa'];
   
   // Add goa object to THEMES dictionary:
   goa: {
     id: 'goa',
     name: 'Goa',
     nameHindi: 'गोवा',
     tagline: 'Sunset Beaches & Tropical Breeze',
     taglineHindi: 'सूर्यास्त समुद्र तट और उष्णकटिबंधीय हवा',
     particleType: 'ocean',  // or new type
     audioKey: 'goa',
     icon: '🏖️',
     dayColors: { /* define all 13 color fields */ },
     nightColors: { /* define all 13 color fields */ },
   }
   ```

2. `hooks/useAudio.ts` (if new ambient track needed)
   ```typescript
   const AMBIENT_TRACKS: Record<string, AudioSource> = {
     // ... existing
     goa: require('../assets/audio/ambient/goa-beach-waves.mp3'),
   };
   ```

3. `assets/audio/ambient/` - Add the MP3 file

**No other changes needed!** The theme will automatically appear in ThemeSelector.

---

### Scenario 2: Add a New Breathing Pattern

**Goal:** Add "Wim Hof Method" breathing

**Files to modify:**
1. `constants/breathing-patterns.ts`
   ```typescript
   export const BREATHING_PATTERNS: BreathingPattern[] = [
     // ... existing patterns
     {
       id: 'wim-hof',
       name: 'Wim Hof Method',
       nameHindi: 'विम हॉफ विधि',
       description: 'Deep rhythmic breathing with retention. Increases oxygen saturation.',
       descriptionHindi: 'गहरी लयबद्ध श्वास और धारण। ऑक्सीजन संतृप्ति बढ़ाता है।',
       cycles: 3,
       recommendedFor: 'Energy, Immunity, Cold Exposure',
       phases: [
         { name: 'inhale',  nameHindi: 'गहरा श्वास', nameEnglish: 'Deep Inhale', durationSeconds: 2 },
         { name: 'exhale',  nameHindi: 'छोड़ें',       nameEnglish: 'Release',     durationSeconds: 2 },
         // Repeat 30 times, then hold...
       ],
     },
   ];
   ```

**That's it!** The pattern will automatically appear in the breathing picker screen.

---

### Scenario 3: Add a New Setting (e.g., "Daily Reminders")

**Goal:** Add toggle for daily practice reminders

**Files to modify:**
1. `store/settingsStore.ts`
   ```typescript
   interface SettingsState {
     // ... existing fields
     dailyRemindersEnabled: boolean;
     reminderTime: string;  // e.g., "08:00"
     
     setDailyRemindersEnabled: (v: boolean) => void;
     setReminderTime: (time: string) => void;
   }
   
   // In create() function:
   dailyRemindersEnabled: false,
   reminderTime: '08:00',
   setDailyRemindersEnabled: (dailyRemindersEnabled) => set({ dailyRemindersEnabled }),
   setReminderTime: (reminderTime) => set({ reminderTime }),
   ```

2. `app/settings/index.tsx`
   ```typescript
   // Import and destructure:
   const { dailyRemindersEnabled, setDailyRemindersEnabled, reminderTime, setReminderTime } = useSettingsStore();
   
   // Add new section:
   <FlowText variant="label" size="xs" color={theme.textMuted} style={{ marginTop: 24, marginBottom: 8 }}>
     Reminders
   </FlowText>
   <FlowCard style={{ padding: 16 }}>
     <SettingRow label="Daily Reminders">
       <Switch
         value={dailyRemindersEnabled}
         onValueChange={setDailyRemindersEnabled}
         trackColor={{ false: theme.cardBorder, true: theme.primary }}
         thumbColor={theme.background}
       />
     </SettingRow>
     {dailyRemindersEnabled && (
       <SettingRow label="Reminder Time">
         {/* Add time picker component */}
       </SettingRow>
     )}
   </FlowCard>
   ```

3. Implement reminder logic (expo-notifications) in a new service file

---

### Scenario 4: Change Home Screen Layout

**Goal:** Rearrange elements, change spacing, add new sections

**Files to modify:**
1. `app/index.tsx`
   ```typescript
   // Rearrange the JSX structure
   // Change flex values, padding, margins
   // Add new components between existing ones
   ```

2. If adding a new feature section, create component in `components/home/`

**Common modifications:**
- Change session cards from 2-column grid to horizontal scroll
- Add inspirational quote section above cards
- Add stats summary (total sessions completed)
- Change theme selector from carousel to grid

---

### Scenario 5: Add a New Session Type

**Goal:** Add "Gratitude Journal" session

**Files to create/modify:**

1. **Create route folder:** `app/(sessions)/gratitude/`
   - `index.tsx` (picker/setup screen)
   - `session.tsx` (active journaling screen)

2. **Add to session cards:** `components/home/SessionCard.tsx`
   ```typescript
   export const SESSION_CARDS: SessionCardData[] = [
     // ... existing
     {
       id: 'gratitude',
       title: 'Gratitude',
       titleHindi: 'कृतज्ञता',
       subtitle: 'Journal · Reflect',
       icon: '🙏',
       route: '/(sessions)/gratitude/',
       accent: 'pink',
     },
   ];
   ```

3. **Update session store (if needed):** `store/sessionStore.ts`
   ```typescript
   type SessionMode = 'breathing' | 'pomodoro' | 'meditation' | 'focus' | 'gratitude' | null;
   // Add gratitude-specific fields if needed
   ```

4. **Create components:** `components/gratitude/`
   - `GratitudePrompt.tsx`
   - `JournalEntry.tsx`
   - etc.

5. **Add constants (if needed):** `constants/gratitude-prompts.ts`

---

### Scenario 6: Change Typography/Fonts

**Goal:** Use different fonts or adjust sizes

**Files to modify:**
1. `constants/typography.ts`
   ```typescript
   export const FONTS = {
     heading: 'NewFont-Bold',
     body: 'NewFont-Regular',
     // ...
   };
   
   export const FONT_SIZES = {
     xs: 10,  // Changed from 11
     sm: 12,  // Changed from 13
     // ...
   };
   ```

2. `app/_layout.tsx` - Update font loading
   ```typescript
   const [fontsLoaded] = useFonts({
     'NewFont-Bold': require('../assets/fonts/NewFont-Bold.ttf'),
     // ...
   });
   ```

3. Add font files to `assets/fonts/`

---

### Scenario 7: Modify Particle Animation

**Goal:** Change how particles behave for a theme

**Files to modify:**
1. Find the particle component for your theme:
   - Rajasthan → `components/particles/DustParticles.tsx`
   - Himalaya → `components/particles/SnowParticles.tsx`
   - Kerala/Assam → `components/particles/RainParticles.tsx`
   - Andaman → `components/particles/OceanWave.tsx`

2. Adjust animation parameters:
   ```typescript
   // Example: Make snow fall faster
   const speed = 2;  // Increase from 1
   
   // Example: Change particle size
   const radius = 3;  // Increase from 2
   
   // Example: Change color
   const color = theme.particle;  // Or hardcode '#FFFFFF'
   ```

3. To add a new particle type:
   - Create new component in `components/particles/`
   - Add case to `ParticleCanvas.tsx` switch statement
   - Add particleType to `ThemeConfig` interface
   - Reference in theme definition

---

### Scenario 8: Add Hindi Translations

**Goal:** Ensure all new text has Hindi translation

**Pattern to follow:**
1. In constants files, always include both `name` and `nameHindi` fields
2. In components, check language:
   ```typescript
   const { language } = useSettings();
   <FlowText>
     {language === 'hi-IN' ? textHindi : textEnglish}
   </FlowText>
   ```

3. For dynamic text, consider creating translation objects:
   ```typescript
   const LABELS = {
     start: { en: 'Start', hi: 'शुरू करें' },
     pause: { en: 'Pause', hi: 'रोकें' },
   };
   
   <FlowText>{LABELS.start[language === 'hi-IN' ? 'hi' : 'en']}</FlowText>
   ```

---

### Scenario 9: Change Audio Tracks

**Goal:** Replace or add new ambient/binaural/SFX tracks

**Files to modify:**
1. `hooks/useAudio.ts`
   ```typescript
   const AMBIENT_TRACKS: Record<string, AudioSource> = {
     rajasthan: require('../assets/audio/ambient/new-track.mp3'),
     // ...
   };
   ```

2. Add MP3 files to appropriate `assets/audio/` subfolder

3. Update `constants/themes.ts` if changing `audioKey` for a theme

---

### Scenario 10: Modify Timer Behavior

**Goal:** Change how Pomodoro timer works (e.g., add long break after 4 cycles)

**Files to modify:**
1. `hooks/useTimer.ts`
   ```typescript
   // Add logic for long break:
   if (next >= totalPomodoros) {
     // Start long break instead of completing
     startLongBreak();
   }
   ```

2. `constants/focus-modes.ts` - Add long break duration to config
   ```typescript
   interface FocusConfig {
     // ...
     longBreakMinutes: number;  // After every 4 pomodoros
   }
   ```

3. Update session UI in `app/(sessions)/pomodoro/session.tsx` to show long break option

---

## 8. Data Flow Diagrams

### Theme Selection Flow
```
User taps theme in ThemeSelector
        ↓
HapticUtils.light() triggered
        ↓
useAppStore.setTheme('himalaya') called
        ↓
AsyncStorage updated (persistence)
        ↓
All components using useTheme() re-render
        ↓
ParticleCanvas detects theme change
        ↓
SnowParticles rendered instead of DustParticles
        ↓
AudioManager detects theme change
        ↓
Himalaya ambient track loads and plays
```

### Starting a Breathing Session
```
User taps "Breathe" card on home
        ↓
Router navigates to /(sessions)/breathing/
        ↓
BreathingPicker renders with BREATHING_PATTERNS list
        ↓
User selects "Box Breathing"
        ↓
useSessionStore.setSelectedPattern('box-breathing')
        ↓
User taps "Begin Session"
        ↓
Router navigates to /(sessions)/breathing/session
        ↓
useBreathing hook initializes with pattern
        ↓
Auto-start after 800ms
        ↓
KeepAwake activated (if enabled)
        ↓
Ambient audio continues playing
        ↓
BreathingOrb animates with phases
        ↓
On cycle complete: Haptic + SFX
        ↓
On all cycles complete: Navigate home
```

### Language Detection Flow
```
App launches (_layout.tsx mounts)
        ↓
useFonts loads custom fonts
        ↓
SplashScreen hides
        ↓
Language auto-detect effect runs:
  - Checks useSettingsStore.getState().language
  - If still 'en-IN' (default):
    - Calls Localization.getLocales()
    - Gets device language code
    - If 'hi': setLanguage('hi-IN')
        ↓
Settings persist to AsyncStorage
        ↓
All components using language re-render with Hindi text
```

---

## 9. Key Patterns & Conventions

### Naming Conventions
- **Components:** PascalCase (e.g., `BreathingOrb`, `FlowCard`)
- **Hooks:** camelCase with `use` prefix (e.g., `useTheme`, `useBreathing`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `THEMES`, `BREATHING_PATTERNS`)
- **Types/Interfaces:** PascalCase (e.g., `ThemeConfig`, `BreathingPattern`)
- **Files:** Match component/hook name (e.g., `BreathingOrb.tsx`, `useTheme.ts`)

### File Organization
- One component/hook per file (with rare exceptions like `SessionCard.tsx`)
- Related components grouped in feature folders
- Constants separated by domain (themes, breathing, meditation, focus)

### State Management Rules
1. **Global state** → Zustand stores in `store/`
2. **Local UI state** → `useState` in component
3. **Derived state** → Compute from props/state, don't store
4. **Persistence** → Only user preferences in `settingsStore`, theme in `appStore`
5. **Session state** → Ephemeral, not persisted

### Hook Patterns
```typescript
// Custom hook pattern:
export function useSomething(initialValue?: Type) {
  // Local state
  const [state, setState] = useState(initialValue);
  
  // Store access
  const storeValue = useStore(s => s.value);
  
  // Computed values
  const derived = useMemo(() => compute(state), [state]);
  
  // Callbacks wrapped in useCallback
  const action = useCallback(() => {
    // do something
  }, [deps]);
  
  // Effects for side effects
  useEffect(() => {
    // side effect
  }, [deps]);
  
  return { state, derived, action };
}
```

### Component Patterns
```typescript
// Functional component pattern:
interface MyComponentProps {
  prop1: string;
  prop2?: number;  // Optional
}

export function MyComponent({ prop1, prop2 = 10 }: MyComponentProps) {
  const theme = useTheme();
  const { someSetting } = useSettings();
  
  return (
    <View style={[styles.container, style]}>
      <FlowText color={theme.text}>{prop1}</FlowText>
    </View>
  );
}
```

### Styling Approach
- Inline styles with template literals for dynamic values
- Theme colors accessed via `useTheme()` hook
- Consistent spacing: 4, 8, 12, 16, 20, 24, 32
- Border radius: 12, 16, 20, 24
- Use `gap` for spacing between children

### Accessibility Considerations
- All interactive elements have haptic feedback
- Important events have audio cues
- Sufficient color contrast in all themes
- Touch targets minimum 44x44 points

---

## 10. Build & Deployment

### Development Commands
```bash
# Start development server
npm start

# Run on Android emulator
npm run android

# Build APK for testing
npm run build:apk

# Build AAB for Play Store
npm run build:aab
```

### EAS Build Profiles (`eas.json`)
```json
{
  "cli": { "version": ">= 5.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "android": { "buildType": "apk" },
      "distribution": "internal"
    },
    "production": {
      "android": { "buildType": "app-bundle" }
    }
  }
}
```

### Pre-Build Checklist
1. Update version in `app.json` and `package.json`
2. Test all sessions with both languages
3. Verify all themes render correctly (day and night)
4. Check audio levels in settings
5. Test haptics toggle
6. Verify keep-awake behavior
7. Run TypeScript check: `npx tsc --noEmit`

### Publishing to Play Store
1. Build AAB: `npm run build:aab`
2. Download from EAS dashboard
3. Upload to Google Play Console
4. Fill release notes (EN and HI)
5. Roll out to production

---

## Quick Reference: Common Paths

| Task | File(s) to Open |
|------|-----------------|
| Change theme colors | `constants/themes.ts` |
| Add breathing pattern | `constants/breathing-patterns.ts` |
| Add meditation type | `constants/meditation-types.ts` |
| Add focus mode | `constants/focus-modes.ts` |
| Change fonts | `constants/typography.ts` + `app/_layout.tsx` |
| Modify home screen | `app/index.tsx` |
| Modify settings | `app/settings/index.tsx` + `store/settingsStore.ts` |
| Change session cards | `components/home/SessionCard.tsx` |
| Change particle animation | `components/particles/[Type]Particles.tsx` |
| Modify breathing logic | `hooks/useBreathing.ts` |
| Modify timer logic | `hooks/useTimer.ts` |
| Add audio track | `hooks/useAudio.ts` + `assets/audio/` |
| Add haptic pattern | `utils/hapticUtils.ts` |
| Add global state | `store/appStore.ts` or create new store |
| Change routing | `app/` folder structure |

---

## Troubleshooting Guide

### Issue: Theme not changing
**Check:** 
1. Is `activeTheme` updating in `appStore`?
2. Is `useTheme()` being called in the component?
3. Is the theme defined in `THEMES` object?

### Issue: Audio not playing
**Check:**
1. Is `AudioManager` mounted on home screen?
2. Is volume > 0 in settings?
3. Does the audio file exist at the required path?
4. Is the track mapped in `AMBIENT_TRACKS`/`BINAURAL_TRACKS`/`SFX_TRACKS`?

### Issue: Particles not showing
**Check:**
1. Is `ParticleCanvas` rendered in the screen?
2. Is `ready` state true after onLayout?
3. Does the theme's `particleType` match a case in the switch?
4. Is the particle component importing correct Skia primitives?

### Issue: Hindi text not appearing
**Check:**
1. Is `language` set to 'hi-IN' in settings?
2. Does the constant/object have a `nameHindi` or equivalent field?
3. Is the component checking `language === 'hi-IN'` correctly?

### Issue: Haptics not working
**Check:**
1. Is `hapticsEnabled` true in settings?
2. Is the device capable of haptics (physical device, not simulator)?
3. Is `HapticUtils` being imported and called correctly?

---

## Additional Resources

- **Expo Docs:** https://docs.expo.dev
- **Expo Router:** https://docs.expo.dev/router/introduction/
- **Zustand:** https://github.com/pmndrs/zustand
- **React Native Skia:** https://shopify.github.io/react-native-skia/
- **React Native Reanimated:** https://docs.swmansion.com/react-native-reanimated/

---

*This guide is maintained alongside the codebase. Update relevant sections when making structural changes.*
