// All timing values in milliseconds. Never hardcode ms values in components — import from here.
export const TIMING = {
  // Home screen entry sequence
  HOME_BG_FADE: 1100,
  HOME_ORB_FADE: 900,
  HOME_WORDMARK_DELAY: 850,
  HOME_WORDMARK_DURATION: 950,
  HOME_TAGLINE_DELAY: 1050,
  HOME_TAGLINE_DURATION: 700,
  HOME_DOT_FIRST_DELAY: 1350,
  HOME_DOT_STAGGER: 90,
  HOME_DOT_DURATION: 350,
  HOME_BEGIN_DELAY: 1700,
  HOME_BEGIN_DURATION: 750,
  HOME_STAT_DELAY: 2000,
  HOME_STAT_DURATION: 600,

  // Begin tap exit sequence
  BEGIN_PRESS_DURATION: 120,
  BEGIN_FADE_OUT_START: 250,
  BEGIN_FADE_OUT_DURATION: 350,
  BEGIN_DOTS_FADE: 400,
  BEGIN_BG_TRANSITION: 550,
  BEGIN_BG_DURATION: 700,
  SCREEN_B_FADE_IN: 1100,
  SCREEN_B_FADE_DURATION: 600,

  // AmbientOrb breathing
  ORB_BREATHE_HALF_PERIOD: 5500,

  // Animations (shared)
  CHIP_TRANSITION: 150,
  TOGGLE_TRANSITION: 250,
  TILE_TRANSITION: 200,
  SENSORY_CARD_TRANSITION: 200,

  // Work session timer
  TIMER_TICK_INTERVAL: 1000,

  // Transition durations
  WORK_END_TRANSITION: 600,
  REST_END_TRANSITION: 500,

  // Panel animation
  PANEL_FADE_IN: 400,
  PANEL_FADE_OUT: 300,
  PANEL_EMPTY_GAP: 180,

  // Sheet spring
  SHEET_SPRING_STIFFNESS: 280,
  SHEET_SPRING_DAMPING: 36,
  SHEET_SPRING_MASS: 1,

  // Begin press feedback
  BEGIN_PRESSED_OPACITY_DURATION: 120,

  // Focus Intention auto-advance
  FOCUS_AUTO_ADVANCE_MS: 3000,
  FOCUS_TILE_NAV_DELAY: 120,
} as const;

// Sprint 6 additions
export const BREATHING_RING_PERIOD = 6000;
export const ORBITAL_OUTER_PERIOD_WORK = 90000;
export const ORBITAL_MIDDLE_PERIOD_WORK = 55000;
export const ORBITAL_INNER_PERIOD_WORK = 35000;
export const ORBITAL_PERIOD_MULTIPLIER_REST = 3;
export const WORK_RINGS_SLOW = 300;
export const WORK_PARTICLES_SLOW = 500;
export const PARTICLE_ELAPSED_LARGE = 86400; // seconds in 1 day — safe for withTiming duration

// Sprint 7 additions
// TransitionScreen sequence timings
export const TRANSITION_HAPTIC_1_DELAY     = 0;     // T=0ms: first heavy haptic
export const TRANSITION_HAPTIC_2_DELAY     = 600;   // T=600ms: second heavy haptic
export const TRANSITION_BG_START_DELAY     = 1000;  // T=1000ms: start bg color ramp
export const TRANSITION_BG_DURATION        = 3200;  // duration of bg ramp (ms)
export const TRANSITION_AMBIENT_START      = 2600;  // T=2600ms: begin ambient fade-in
export const TRANSITION_AMBIENT_FADE_MS    = 4000;  // ambient fade-in duration (ms)
export const TRANSITION_REST_LABEL_DELAY   = 3000;  // T=3000ms: show "Rest" label
export const TRANSITION_REST_LABEL_IN      = 400;   // fade-in duration for "Rest" label
export const TRANSITION_MODE_LABEL_DELAY   = 4400;  // T=4400ms: show mode name
export const TRANSITION_MODE_LABEL_IN      = 300;   // fade-in for mode name
export const TRANSITION_NAVIGATE_DELAY     = 5200;  // T=5200ms: navigate to RestExperience

// PanelText timings
export const PANEL_FADE_IN_DURATION        = 700;   // panel entry fade-in (ms)
export const PANEL_FADE_IN_TRANSLATE_Y     = 10;    // dp rise during entry (types 1 and 4)
export const PANEL_FADE_OUT_DURATION       = 600;   // panel exit fade-out (ms)
export const PANEL_GUTTER_DURATION         = 180;   // silence gap between panels (ms)

// Ambient sound
export const AMBIENT_FADE_IN_MS            = 4000;  // total ambient fade-in duration
export const AMBIENT_FADE_OUT_MS           = 2000;  // total ambient fade-out duration
export const AMBIENT_VOLUME_STEP_INTERVAL  = 100;   // ms between each volume step

// Sprint 8 additions
// Breathe & Drift — BreathingDot
export const BREATHE_INHALE_MS      = 2000;  // inhale duration (ms)
export const BREATHE_EXHALE_MS      = 2000;  // exhale duration (ms)
export const BREATHE_DOT_SCALE_MIN  = 0.7;   // contracted dot scale
export const BREATHE_DOT_SCALE_MAX  = 1.3;   // expanded dot scale
export const BREATHE_LABEL_FADE_MS  = 300;   // "Breathe in/out" label fade duration

// Breathe & Drift — Drift Blob
export const DRIFT_BLOB_PERIOD_H    = 47000; // horizontal drift period (ms) — prime number avoids patterns
export const DRIFT_BLOB_PERIOD_V    = 61000; // vertical drift period (ms) — different prime

// Quick Settle — Ripple System
export const RIPPLE_CYCLE_MS        = 4000;  // one ripple expands and fades over 4000ms
export const RIPPLE_STAGGER_MS      = 1333;  // delay between each ripple's start (4000/3 ≈ 1333ms)
export const RIPPLE_COUNT           = 3;     // number of simultaneous ripple circles

// Rest mode fade-out (when onSessionComplete fires)
export const REST_MODE_EXIT_FADE_MS = 500;   // how long visual elements fade out before onSessionComplete

// Sprint 9 additions
export const RETURN_BG_TRANSITION = 2000;
export const RETURN_ORB_DELAY = 900;
export const RETURN_READY_DELAY = 300;
export const RETURN_READY_DURATION = 900;
export const RETURN_SUB_DELAY = 700;
export const RETURN_COUNTER_DELAY = 1100;
