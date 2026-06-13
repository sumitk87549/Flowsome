import re

with open('flowsome/tech_guide.md', 'r') as f:
    content = f.read()

# 1. Update Key Features
features_replacement = """### Key Features
- **Bilingual Support:** English (en-IN) and Hindi (hi-IN) with auto-detection
- **Day/Night Mode:** Each region has distinct day and night color palettes
- **Dynamic Particle System:** Skia-based animations tied to themes
- **Spatial Audio:** Ambient sounds, binaural beats (alpha/theta/delta), SFX
- **Haptic Feedback:** Contextual haptics for interactions and phase transitions
- **Gamification & Stats:** 108-bead Mala counter, daily streaks, achievement badges, and 365-day heatmap
- **Wisdom System:** Cultural quotes and seasonal greetings on the home screen
- **Onboarding Flow:** First-run experience capturing user name and preferences"""

content = re.sub(r'### Key Features.*?Keep Awake.*?\n', features_replacement + '\n', content, flags=re.DOTALL)

# 2. Update Directory Structure
dir_replacement = """├── app/                          # EXPO ROUTER - All screens & routing
│   ├── _layout.tsx               # ROOT LAYOUT: Fonts, theme provider, splash, nav bar sync
│   ├── index.tsx                 # HOME SCREEN: Theme selector, session cards, particle background
│   ├── onboarding.tsx            # ONBOARDING: First-run setup
│   ├── settings/
│   │   └── index.tsx             # SETTINGS SCREEN: Language, audio volumes, haptics, keep-awake
│   ├── (screens)/
│   │   └── stats.tsx             # STATS SCREEN: 365-day heatmap, mala progress, streak
│   └── (sessions)/               # ROUTE GROUP for all practice sessions
│       ├── _layout.tsx           # Shared layout for sessions
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
│   ├── achievements/             # Gamification UI
│   │   └── BadgeToast.tsx        # Toast notification for unlocking badges
│   ├── ui/                       # Generic UI primitives
│   │   ├── FlowText.tsx          # Themed text with typography variants
│   │   ├── FlowCard.tsx          # Glassmorphism card with blur
│   │   ├── FlowButton.tsx        # Themed button component
│   │   └── SafeScreen.tsx        # Safe area wrapper
│   ├── home/                     # Home screen specific
│   │   ├── ThemeSelector.tsx     # Horizontal scrollable theme carousel
│   │   ├── SessionCard.tsx       # Grid cards for session navigation
│   │   ├── DayNightToggle.tsx    # Day/night switch toggle
│   │   ├── MalaIndicator.tsx     # 108-bead progress arc
│   │   └── StreakIndicator.tsx   # Fire icon and daily streak count
│   ├── breathing/                # Breathing session components
│   │   ├── BreathingOrb.tsx      # Animated orb (expands/contracts with breath)
│   │   ├── BreathingPhaseLabel.tsx # Current phase label (Inhale/Hold/etc.)
│   │   └── BreathingProgress.tsx # Cycle progress dots
│   ├── meditation/
│   │   ├── MeditationCard.tsx    # Meditation type selection card
│   │   ├── MeditationAmbient.tsx # Meditation-specific audio controller
│   │   ├── MandalaView.tsx       # Rotating Skia mandala for mindfulness
│   │   └── TratakaFlame.tsx      # Skia flame simulation for gazing
│   ├── focus/
│   │   ├── IntentionInput.tsx    # Text input for session intention
│   │   ├── FocusAmbient.tsx      # Focus-specific audio controller
│   │   └── AmbientWave.tsx       # Triple standing wave animation
│   ├── timer/
│   │   ├── TimeDisplay.tsx       # MM:SS timer display
│   │   └── CircularTimer.tsx     # Circular liquid progress timer (Skia)
│   ├── session/
│   │   └── NowPlayingBar.tsx     # Persistent audio controls for active sessions
│   ├── stats/
│   │   └── HeatmapCalendar.tsx   # 365-day Skia-based session heatmap
│   ├── particles/                # Skia particle systems
│   │   ├── ParticleCanvas.tsx    # Main canvas wrapper (full-screen, absolute)
│   │   ├── DustParticles.tsx     # Rajasthan desert dust
│   │   ├── SnowParticles.tsx     # Himalaya snowflakes
│   │   ├── RainParticles.tsx     # Kerala/Assam rain
│   │   ├── WaterRipple.tsx       # Alternative water effect
│   │   └── OceanWave.tsx         # Andaman ocean waves
│   ├── audio/
│   │   └── AudioManager.tsx      # Headless ambient audio controller (home only)"""

content = re.sub(r'├── app/.*?└── AudioManager.tsx      # Headless ambient audio controller \(home only\)', dir_replacement, content, flags=re.DOTALL)


# 3. Update State Management Flow
state_replacement = """┌────────────────────────────────────────────────────────────────────────┐
│                              ZUSTAND STORES                            │
├──────────────────┬──────────────────┬──────────────────┬───────────────────┤
│   appStore       │  settingsStore   │  historyStore    │   sessionStore    │
│──────────────────│──────────────────│──────────────────│───────────────────│
│ • activeTheme    │ • language       │ • sessions       │ • activeMode      │
│ • dayNight       │ • ambientVolume  │ • streak         │ • timerState      │
│ • isSessionActive│ • binauralVolume │ • lastSessionDate│ • breathingPhase  │
│ • hasSeenOnboarding│ • sfxVolume    │ • badges         │ • currentCycle    │
│ • username       │ • hapticsEnabled │                  │ • totalCycles     │
│                  │ • keepAwake      │                  │ • secondsRemaining│
└──────────────────┴──────────────────┴──────────────────┴───────────────────┘"""

content = re.sub(r'┌─────────────────────────────────────────────────────────────┐\n│                      ZUSTAND STORES.*?└──────────────────┴──────────────────┴───────────────────────┘', state_replacement, content, flags=re.DOTALL)


# 4. Add Core Systems Deep Dive entry for historyStore
history_system = """### 5.7 Gamification Engine (`store/historyStore.ts`)

**Purpose:** Track user progress, daily streaks, 108-bead mala counting, and achievement badges.

**Output:**
```typescript
interface SessionRecord {
  id: string;
  typeId: string;
  category: 'breathing' | 'meditation' | 'pomodoro' | 'focus';
  durationMinutes: number;
  completedAt: string;
  theme: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
}
```

**Key Features:**
- `getStreak()`: Calculates consecutive days of practice.
- `getMalaProgress()`: Returns current count towards 108 sessions (Mala cycle).
- `getTotalMinutes()`: Aggregates total practice time.
- Badges are awarded automatically at end-of-session via `checkAndAwardBadges()` utility.

---

### 5.8 Wisdom & Quotes System (`constants/quotes.ts`)

**Purpose:** Provide context-aware inspirational quotes before/after sessions and on the home screen.
- Fetches daily quotes specific to session types (focus vs breathe).
- Automatically selects Hindi/English based on `settingsStore.language`.

---
"""

content = content.replace("## 6. File-by-File Reference", history_system + "\n## 6. File-by-File Reference")

with open('flowsome/tech_guide.md', 'w') as f:
    f.write(content)
