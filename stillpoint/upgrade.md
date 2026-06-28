## Role and seriousness

You are an expert React Native / Expo 56 product engineer, UX designer, motion designer, and calm-tech product thinker. Upgrade **Solace**, a peaceful Pomodoro app, from a vibe-coded prototype into a publishable Android-first app.

This is not a generic timer. Solace should feel like a small, beautiful, carefully cared-for object: minimal, quiet, warm, full-screen, useful, scientific enough to be credible, and emotionally gentle. It must help users move through **work → real rest → return** without dopamine-driven addiction.

Do **not** turn it into a meditation/social/habit-tracker app. It remains a Pomodoro app with guided real-time rest.

---

## Hard constraints

1. **Tech stack:** React Native with Expo SDK 56.
2. **Before coding:** read the versioned Expo 56 docs where APIs are unclear: <https://docs.expo.dev/versions/v56.0.0/>.
3. **Do not add heavy dependencies** unless absolutely necessary. Prefer current dependencies: React Navigation, Reanimated, Skia, Expo Audio, Expo Haptics, Expo Font, AsyncStorage.
4. **No try/catch around imports.**
5. **Android first.** Keep iOS safe, but Android publishability matters most.
6. **Full-screen calm:** hide status/navigation bars during session experiences, but keep explicit in-app navigation controls so the user is never trapped.
7. **Respect accessibility:** large tap targets, readable contrast, reduce-motion mode, haptic/sound toggles, clear labels.
8. **No fake medical claims.** You can say “designed to help you reset attention,” not “repairs your brain.”
9. **Use local generated/vector/Skia assets when possible.** If you create raster assets, add them under `assets/` and wire them correctly in `app.json`.
10. **End state must pass TypeScript.**

---

## Current app audit — what must be fixed

The current project already contains a promising concept: dark peaceful colors, DM Sans, ambient sounds, work/rest modes, haptics, Skia background elements, and session persistence. However it has structural and UX issues that must be corrected before release.

### Critical correctness issues

- `src/navigation/RootNavigator.tsx` imports missing screens: `WorkRestTransitionScreen`, `RestSessionScreen`, and `CycleCompleteScreen`. TypeScript currently fails because these files do not exist. Remove these dead routes/imports or implement equivalent routes properly using the existing `Transition`, `RestExperience`, `SettleNotice`, `ReturnPrompt`, and `LongBreak` flow.
- `RootStackParamList` still includes obsolete route names (`WorkRestTransition`, `RestSession`, `CycleComplete`). Clean the navigation type model so it exactly matches actual screens.
- `app.json` declares `RECORD_AUDIO` permission even though Solace does not need microphone input. Remove it unless you implement a feature that truly records audio. A Pomodoro app asking for mic permission damages trust.
- Android adaptive icon config is incomplete: it has only background color and no foreground/monochrome image references despite assets existing. Wire icon assets correctly.
- Settings are too sparse and not arranged around user goals. Rebuild settings into meaningful sections.
- Back/close controls are missing on several screens; users can feel trapped.
- Rest modes are mostly text-on-background. They need richer but still calm, purpose-built visual and interaction systems.
- Home starts beautifully but then becomes static/boring. It needs a living yet non-addictive daily dashboard and better session entry.

### UX issues to solve

- The app needs an obvious **day/night mode** system, not only dark colors.
- Work screen needs better affordances: pause/resume, end session, timer mode, intention, cycle progress, rest preview.
- Session config must become useful: duration presets, custom duration, cycle count, rest style, sound, haptics, transition behavior, visual intensity, full-screen behavior.
- Rest screen should guide the user in real time using sensory prompts, micro-movement, looking away, and peaceful illustrated moments.
- Long rest should feel earned and more spacious than short rest.
- Return-to-work should feel like a soft landing, not an abrupt timer reset.
- Settings must be navigable, beautiful, and have back buttons.
- Animations should be smooth and intentional, not flashy.

---

## Product vision

Solace is a **focus/rest companion**.

The user opens Solace when they want to work. The app asks for one intention, protects the work interval, guides a real nervous-system-friendly rest, and then helps them return.

Core feeling:

- **Work:** deep, quiet, blue-black, steady, low distraction.
- **Rest:** nature-tinted, warmer, embodied, gently alive.
- **Return:** amber dawn, concise, confidence-building.
- **Settings:** practical, calm, not a laboratory panel.

The app should feel like GNOME Pomodoro’s minimal spirit, but with a more modern, tactile, mobile-native, peaceful visual identity.

---

## Evidence-informed rest design

Use this as design rationale, not as claim-heavy marketing:

- Short breaks can improve well-being and reduce fatigue; performance effects vary by activity and context. Use this to justify short, structured breaks rather than endless scrolling. Reference: “Give me a break!” systematic review/meta-analysis, PLOS ONE / PMC: <https://pmc.ncbi.nlm.nih.gov/articles/PMC9432722/>.
- The 20-20-20 rule is widely recommended for digital eye strain: every 20 minutes, look about 20 feet away for at least 20 seconds. Use this as a rest prompt pattern. Reference: American Optometric Association: <https://www.aoa.org/healthy-eyes/eye-and-vision-conditions/computer-vision-syndrome>.
- Brief walking/movement breaks may support working memory/executive function in some contexts. Use light movement prompts, not intense exercise. Reference example: <https://pmc.ncbi.nlm.nih.gov/articles/PMC11295579/>.
- Nature exposure / attention restoration theory suggests natural environments or nature imagery can support directed attention recovery. Use nature-like visuals, soft soundscapes, and “look outside” prompts. Reference: <https://pmc.ncbi.nlm.nih.gov/articles/PMC8125471/>.

Design principle: during rest, gently move attention **away from the phone** when useful. The phone should guide, not consume.

---

## New information architecture

### Main flow

1. `Home`
2. `FocusIntention`
3. `SessionSetup` or compact setup sheet from Home
4. `WorkSession`
5. `TransitionToRest`
6. `RestExperience`
7. `ReturnPrompt`
8. back to `WorkSession` or `Home`
9. after N cycles: `LongBreak`

You may either add dedicated screens or reuse existing ones, but the route model must be clean and typed.

### Persistent state

Keep tracking:

- sessions completed today
- total focused minutes today
- current cycle number
- streak/last date if already implemented
- last selected intention
- chosen preset/profile
- current theme mode

Add if feasible:

- `themeMode`: `system | dawn | night`
- `visualIntensity`: `minimal | balanced | immersive`
- `soundscapeEnabled`: boolean
- `bellVolume`: low/medium/high or numeric
- `hapticsEnabled`: boolean
- `keepScreenAwake`: boolean
- `showReturnReflection`: boolean
- `defaultRestPath`: `auto | eyes | move | senses | story | listen`
- custom duration support

---

## Visual identity system

Create a central design token system. Do not scatter colors.

### Typography

Keep DM Sans. Use it intentionally:

- Wordmark: DM Sans Light, uppercase, letter spacing 6–10.
- Timer: DM Sans Thin or Light, tabular numbers, very large.
- Body: DM Sans Regular/Light.
- Microcopy: Light, high tracking, calm opacity.

If adding fonts, only add one complementary serif or keep DM Sans only. Simpler is better.

### Color palettes

Implement theme objects instead of one flat color file.

#### Night / default

- `ink`: `#0B0D10`
- `deepBlue`: `#0E1624`
- `forestNight`: `#10201A`
- `warmCream`: `#EEE6D8`
- `mutedCream`: `rgba(238,230,216,0.68)`
- `amber`: `#D59A72`
- `sage`: `#94B8A2`
- `line`: `rgba(238,230,216,0.12)`

#### Dawn / day

Not white. Use soft paper and morning warmth:

- `paper`: `#F4EFE5`
- `mist`: `#E8E1D3`
- `skyWash`: `#DDE7E6`
- `leaf`: `#6E927D`
- `clay`: `#C9825E`
- `inkText`: `#25231F`
- `mutedInk`: `rgba(37,35,31,0.62)`
- `line`: `rgba(37,35,31,0.12)`

#### Accent mapping

- Work = blue/ink.
- Short rest = forest/sage.
- Long rest = dawn/clay/gold.
- Danger/stop = muted rose, never bright red.

### Shapes

- Use large rounded cards: 24–32 radius.
- Buttons: pill-shaped or soft cards, 48–56 px tall minimum.
- Avoid tiny gear-only controls unless paired with label or sufficient hit area.

### Motion

- Screen transitions: fade/soft slide, 250–600 ms.
- Timer background: very slow gradient drift.
- Rest story: slow parallax, particles, soft illustration layers.
- Press feedback: scale 0.97 + opacity, light haptic.
- Respect reduce-motion setting.

---

## Day/night mode

Add a beautiful mode system:

- `System`: follows OS if available.
- `Dawn`: light calming palette.
- `Night`: dark calming palette.

Home should expose this gently, perhaps via a small sun/moon pill in top-left or settings. Do not use harsh white.

Behavior:

- Theme applies to every screen.
- Rest visuals adapt: dawn rest becomes misty garden; night rest becomes moonlit forest.
- Sounds do not auto-play if disabled.
- Save preference in AsyncStorage.

---

## Home screen upgrade

Home should feel alive and useful after the intro.

### Layout

Top:

- small theme toggle pill: `Dawn` / `Night` icon
- settings button with label or accessible hit area

Center:

- `SOLACE` wordmark
- one-line calm tagline that rotates slowly once per app launch, e.g.:
  - “Work deeply. Return softly.”
  - “A quiet timer for serious focus.”
  - “Rest is part of the work.”
- ambient orb or illustrated horizon behind wordmark

Primary action:

- large pill/card: `Begin a focus session`
- secondary: `Adjust session`

Below:

- today summary card: sessions, focused minutes, next long rest progress
- tiny cycle dots with labels
- last intention chip if available

Bottom sheet:

- Replace hidden swipe-only summary with discoverable `Today` card. Swipes are okay, but never the only way.

### Required improvements

- Make settings accessible and beautiful.
- Add back/close handling.
- Add session setup entry.
- Add subtle idle animation to prevent the screen from feeling dead.

---

## Session setup / config upgrade

Current config feels useless because it exposes too few relevant choices. Build a proper but minimal setup experience.

### Presets

Add preset cards:

1. **Classic** — 25 work / 5 rest / long rest after 4.
2. **Deep Work** — 50 work / 10 rest / long rest after 2.
3. **Gentle Start** — 15 work / 5 rest / long rest after 3.
4. **Custom** — user chooses durations.

### Custom controls

Use calm chips/steppers, not raw text inputs where possible:

- Work: 10, 15, 20, 25, 30, 45, 50, 60, custom.
- Short rest: 3, 5, 7, 10, 15.
- Long rest: 15, 20, 25, 30.
- Long rest after: 2, 3, 4 cycles.

### Rest path choice

Rename rest styles into user-friendly cards:

- **Auto Path** — Solace chooses based on time.
- **Eyes Away** — look far, soften eyes, reduce screen strain.
- **Move & See** — shoulders, neck, gaze, light movement.
- **Sense Grounding** — 5-4-3-2-1 sensory reset.
- **Quiet Listening** — sound-focused rest with minimal visuals.
- **Story Garden** — peaceful illustrated story/rest sequence.

### Toggles

- Auto-start rest.
- Auto-start next work.
- Bells at transitions.
- Ambient sound during rest.
- Haptics.
- Keep screen awake during session.
- Full-screen immersive mode.
- Reduce motion / minimal visuals.

### Save behavior

- Changes save immediately.
- Presets update underlying settings.
- Show a short preview line: `25 min work · 5 min rest · long rest after 4`.

---

## Focus intention upgrade

Keep the “What are you here to do?” idea, but improve utility.

### Required

- Add back button.
- Add custom intention input or “Write my own” chip.
- Keep quick chips: Write, Code, Design, Study, Read, Plan, Review, Build, Think, Create.
- Add `Skip` but make it gentle and visible.
- If user selected last intention, show it first.

### Copy

Use:

- Title: `What is this session for?`
- Helper: `One word is enough.`
- CTA after selection: automatic or `Begin` button.

Do not overcomplicate.

---

## Work session screen upgrade

Work should feel serious and settled.

### Visual

- Full-screen dark/dawn work palette.
- Large timer in center.
- Slow gradient drift or orbital rings behind timer.
- Current intention small above timer.
- Cycle progress below timer: `Cycle 2 of 4` + dots.
- Rest preview: `Next: 5 min Eyes Away`.

### Controls

Controls can be hidden until tap, but must exist:

- Pause / Resume.
- End session.
- Back/home with confirmation.
- Settings unavailable or limited during active timer; if available, pause first.

### Timer behavior

- When paused, background stills and controls become visible.
- Completion plays work-end bell if enabled.
- If auto-start rest is off, show transition screen with clear CTA.
- If app backgrounds, timer should resume accurately based on timestamps, not only intervals.

### Anti-distraction

- No constant interactive widgets.
- No productivity gamification.
- No badges beyond gentle streak/today summary.

---

## Transition to rest

Create a short bridge screen after work.

### Copy examples

- `Let the task go.`
- `Your eyes can leave the screen now.`
- `Rest is part of the session.`

### Behavior

- 3–8 seconds if auto-start enabled.
- If not auto-start: button `Begin rest` and secondary `Skip rest`.
- Bell/haptic at state change if enabled.
- Show what rest path is coming.

---

## Rest experience — most important upgrade

Rest is the soul of Solace. It must not feel like boring text panels. Create multiple rest experiences that are visually distinct but share a common engine.

### Shared rest shell

Every rest screen should have:

- fullscreen background using current theme
- top-left close/back button, subdued but present
- optional tiny timer/progress indicator, not dominant
- bottom `Skip rest` or `End` available after tap/long press
- ambient sound toggle if sound is playing
- safe-area aware layout
- completion callback to return prompt

### Rest modes to implement/refine

#### 1. Eyes Away

Purpose: reduce screen fatigue and restore directed attention.

Flow:

- `Look at something far away.`
- Fade phone screen to very dim.
- Tiny horizon line / distant star / window illustration.
- Prompt: `Keep your gaze soft.`
- 20-second eyes-away segment during any rest.
- Then optional: `Notice one color in the room.`

User should not need to stare at the phone.

#### 2. Move & See

Purpose: light physical reset after sitting.

Flow:

- Drop shoulders.
- Unclench jaw.
- Roll neck slowly.
- Look left/right/far.
- Stand or step if safe.

Visual:

- Slow animated line figure or rings responding to steps in script.
- No exercise intensity, no calories.

#### 3. Sense Grounding

Purpose: bring awareness to present environment.

Flow:

- 5 things you see.
- 4 textures you feel.
- 3 sounds.
- 2 smells.
- 1 breath/taste.

Visual:

- Five small dots gently appear/disappear.
- Haptics mark steps if enabled.

#### 4. Quiet Listening

Purpose: silence/audio rest.

Flow:

- Minimal text.
- Ambient sound optional.
- Prompts leave long empty spaces.

Visual:

- Nearly blank field with faint soundwave/ripple.

#### 5. Story Garden / peaceful story

Purpose: comic-like peaceful images/story with smooth transitions.

Implement a small illustrated sequence using Skia/vector layers rather than external copyrighted images. It should feel like panels in a silent comic, not a video.

Story: **“Forest After Rain”** or **“The Window Garden.”**

Panel beats for 5-minute rest:

1. A dark window / quiet desk.
2. Raindrops on leaves.
3. A small path appears.
4. Light through branches.
5. A bird/leaf movement in distance.
6. A still pond reflection.
7. The path returns to the room.
8. `Bring one calm thing back.`

Visual implementation options:

- Skia gradients, circles, paths, translucent layers.
- Simple generated PNGs are acceptable if you create/import them cleanly and optimize size.
- No network image fetching at runtime.
- Add `assets/rest/` if using raster assets.

Motion:

- Crossfade panels every 20–35 seconds.
- Parallax drift, very slow.
- Text appears briefly, then leaves blank space.

#### 6. Quick Settle

For very short rests (≤5 min): direct compact reset.

Flow:

- Feet.
- Shoulders.
- Eyes far.
- One breath.
- Return.

### Rest path selection logic

- If user selected a rest path, respect it.
- If `Auto Path`:
  - 3–5 min: Quick Settle or Eyes Away.
  - 7–10 min: Move & See / Sense Grounding / Quiet Listening.
  - 15+ min: Story Garden / Walk / Memory.
- Rotate modes, but avoid surprising the user. Show the next mode before it starts.

---

## Long break upgrade

Long break should feel earned and roomy.

### Screen

Title: `A longer rest is ready.`
Subtitle: `Choose how you want to return.`

Options:

- `Walk outside` — timer continues, phone mostly blank.
- `Story Garden` — immersive illustrated sequence.
- `Quiet room` — minimal listening/rest.
- `Memory place` — guided pleasant memory.

Add back/home. Add timer. Add ambient options.

---

## Return prompt upgrade

The return should be soft but purposeful.

### Flow

After rest completes:

- Bell/haptic.
- Screen warms subtly.
- Copy:
  - `Come back slowly.`
  - `What is the next small action?`
- Buttons:
  - `Begin next focus`
  - `Change intention`
  - `Finish for now`

Optional one-line intention input:

- `Next: ______`

If auto-start work is enabled:

- show 5-second countdown with cancel.

---

## Settings screen redesign

Make settings feel like part of the app, not a debug page.

### Required structure

Top:

- Back button.
- Title: `Settings`.
- Short preview: current preset summary.

Sections:

1. **Session rhythm**
   - preset cards
   - work/rest durations
   - long rest after N cycles
2. **Rest guidance**
   - default rest path
   - auto path explanation
   - story visuals intensity
3. **Sound & touch**
   - bells
   - ambient sound
   - ambient sound choice
   - haptics
   - volume/intensity if feasible
4. **Appearance**
   - theme mode system/dawn/night
   - reduce motion
   - visual intensity
   - full-screen immersive mode
5. **Flow**
   - auto-start rest
   - auto-start work
   - keep screen awake
6. **Data**
   - reset today
   - maybe reset all settings

### Interaction

- Use cards/chips/toggles consistently.
- No cramped rows.
- Avoid irrelevant settings like “evening note” unless implemented fully; remove or hide incomplete features.

---

## Sound and haptics

### Bells

Use distinct but gentle sounds:

- work start: soft single chime
- work end: warmer two-tone chime
- long break: deeper soft chime

Ensure duplicate sound files are cleaned or referenced consistently.

### Ambient

Ambient should never be forced.

- Choices: forest, rain, ocean, mountain, desert.
- Add `none` option.
- Fade in/out sounds; do not abruptly cut.
- Respect silent settings where possible.

### Haptics

- Light haptic on important transitions.
- Heavy haptic only for long break or completion, and only if user enabled.
- Do not overuse.

---

## App icon and splash

Make the icon publishable.

### Direction

Create a simple Solace icon:

- dark or dawn background
- central warm orb/sun/moon
- subtle leaf/ring/horizon mark
- no text if possible
- works as Android adaptive icon

### Required files/config

- Use existing icon asset names if suitable or replace them.
- Wire Android adaptive icon foreground/background/monochrome in `app.json`.
- Make splash match theme: dark warm background with simple orb/wordmark.
- Remove unused bad/duplicate assets if safe.

If generating raster images, create them under `assets/` and keep dimensions appropriate for Expo icons.

---

## Navigation and back behavior

Every non-home screen needs a visible back/close control unless it is a timed transition with a clear cancel.

Rules:

- Settings: back to Home.
- FocusIntention: back to Home.
- WorkSession: back/end opens confirm sheet: `End this focus session?`.
- RestExperience: back opens confirm sheet: `Skip this rest?`.
- LongBreak: back/home allowed.
- ReturnPrompt: finish or continue.

Use Android hardware back handling to match visible behavior.

---

## Full-screen behavior

The app should be immersive during work/rest but not hostile.

- Hide status bar on home/session screens if current design wants it.
- Hide Android navigation bar during work/rest if `immersiveMode` enabled.
- Show bars or keep controls accessible in Settings.
- Ensure no content is blocked by safe areas.

---

## Implementation architecture recommendations

Add or refactor toward:

```text
src/design/
  theme.ts
  tokens.ts
  motion.ts
src/components/shared/
  BackButton.tsx
  Screen.tsx
  SoftButton.tsx
  Card.tsx
  SettingRow.tsx
  SegmentedControl.tsx
  ConfirmSheet.tsx
src/components/session/
  CycleProgress.tsx
  SessionSetupSheet.tsx
  TimerControls.tsx
src/components/rest/
  RestShell.tsx
  RestProgress.tsx
  IllustratedPanel.tsx
  HorizonScene.tsx
src/rest-modes/
  EyesAwayMode.tsx
  MoveAndSeeMode.tsx
  SenseAndGroundMode.tsx
  ListenMode.tsx
  StoryGardenMode.tsx
  QuickSettleMode.tsx
```

Do not over-refactor everything if unnecessary, but create enough shared components to make the UI consistent.

---

## Specific code tasks

1. Fix TypeScript errors from missing navigation imports/routes.
2. Clean `RootStackParamList` and navigator route list.
3. Add theme mode to settings context and storage.
4. Replace flat `COLORS` usage gradually with theme-aware tokens, or create a compatibility layer while migrating.
5. Add reusable back button and apply to Settings, FocusIntention, WorkSession, RestExperience, LongBreak, ReturnPrompt.
6. Redesign Home with discoverable session setup and today summary.
7. Redesign Settings into sections with meaningful controls.
8. Upgrade WorkSession controls, timer display, cycle progress, pause/resume/end behavior.
9. Build/refine rest shell and rest modes with richer visuals.
10. Add Eyes Away mode.
11. Upgrade Story mode with illustrated peaceful sequence.
12. Remove unnecessary microphone permission.
13. Wire adaptive icon assets correctly.
14. Ensure audio/haptics respect settings.
15. Ensure timer completion flow is correct for short and long rests.
16. Run TypeScript and fix all errors.

---

## Copy system

Use short, human, quiet text.

### Good

- `Begin a focus session`
- `One word is enough.`
- `Let the task go.`
- `Look far away.`
- `Rest is part of the work.`
- `Bring one calm thing back.`

### Avoid

- “Optimize productivity”
- “Hack your brain”
- “Dopamine detox”
- “Unlock your full potential”
- Too much neuroscience language

---

## Acceptance checklist

Before you finish, verify:

- [ ] `npx tsc --noEmit` passes.
- [ ] App launches without missing route imports.
- [ ] Home, Settings, FocusIntention, WorkSession, RestExperience, LongBreak, ReturnPrompt all have back/close paths.
- [ ] Day/night mode affects every major screen.
- [ ] Settings contain useful session configuration.
- [ ] Work timer can pause/resume/end.
- [ ] Rest modes feel visibly different and not text-only.
- [ ] Eyes Away mode exists.
- [ ] Story Garden/Forest rest has peaceful visuals and transitions.
- [ ] Sounds/haptics can be disabled.
- [ ] Android permissions are minimal.
- [ ] App icon/adaptive icon config is complete.
- [ ] No new heavy dependency was added without strong reason.

---

## Final product bar

The upgraded app should feel publishable. It should be calm enough to trust, beautiful enough to reopen, and practical enough to use every day.

If you must choose between more features and more polish, choose polish.
