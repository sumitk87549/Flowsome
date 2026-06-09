# Flowsome - Extensive Developer Technical Guide

## 1. What is Flowsome?
**Flowsome** is a premium, beautifully crafted wellness and productivity application built with a strong Indian identity. It provides users with various mindfulness and focus practices, including Breathing exercises, Pomodoro timers, Meditation, and deep Focus sessions. 

The app is deeply rooted in regional themes of India—**Rajasthan, Himalaya, Kerala, Assam, and Andaman**—each offering a unique visual and auditory experience. It supports both **English and Hindi** localizations and provides a highly immersive experience using dynamic backgrounds, particle systems, haptic feedback, and spatial audio.

---

## 2. Technical Architecture & Tech Stack
The app is built using modern cross-platform mobile technologies:
* **Framework**: React Native with **Expo (SDK 56)**.
* **Routing**: **Expo Router** (File-based routing system).
* **State Management**: **Zustand** (with AsyncStorage for persistence).
* **Styling & Theming**: Custom React Native Styles + dynamic theming hooks based on region and Day/Night mode.
* **Animations & Visuals**: **React Native Reanimated** & **@shopify/react-native-skia** (for high-performance particle backgrounds).
* **Audio & Haptics**: `expo-audio` for ambient/binaural sounds and `expo-haptics` for tactile feedback.

### Directory Structure Overview
If you need to edit or add functionality, here is where things live:
* `app/` - Contains all screens and routing logic (Expo Router).
* `components/` - Reusable UI components grouped by feature (`home`, `ui`, `audio`, `particles`, `meditation`, etc.).
* `constants/` - Static configurations like `themes.ts`, typography, breathing patterns, focus modes.
* `hooks/` - Custom React hooks (`useTheme`, `useSettings`, `useAudio`, `useTimer`, etc.).
* `store/` - Zustand global state definitions (`appStore.ts`, `settingsStore.ts`, `sessionStore.ts`).
* `utils/` - Utility functions (e.g., `hapticUtils.ts`).

---

## 3. Core Modules & Where to Find Them

### A. The Root Layout (`app/_layout.tsx`)
This is the entry point of the app UI. 
* **What it does**: Loads custom fonts (`CormorantGaramond`, `DMSans`), sets up the global `ThemeProvider`, handles the Splash Screen, and syncs the Android System Navigation bar with the active theme. It also auto-detects the device language on the first launch.
* **Files to check**:
  * `app/_layout.tsx` (Root Setup)
  * `app.json` & `eas.json` (Expo config & build settings)

### B. The Home Screen (`app/index.tsx`)
The main dashboard where users select their region/theme and choose a practice.
* **What it does**: Displays the top navigation, Region/Theme selector, and the 4 main Session Cards (Breathe, Focus, Meditate, Flow). It also renders the `ParticleCanvas` as a background layer behind everything.
* **Files to check**:
  * `app/index.tsx` (Home layout)
  * `components/home/ThemeSelector.tsx` (Theme carousel)
  * `components/home/SessionCard.tsx` (Grid cards for navigating to sessions)
  * `components/particles/ParticleCanvas.tsx` (Skia-based dynamic background)

### C. The Theming System (`constants/themes.ts`)
Flowsome has a highly advanced theming system. Instead of simple Light/Dark modes, themes are based on Indian regions, and each region has a "Day" and "Night" palette.
* **Regions**: `rajasthan` (Desert), `himalaya` (Snow), `kerala` (Monsoon), `assam` (Forest), `andaman` (Ocean).
* **What it does**: Each theme defines colors for background, gradients, primary elements, cards, orbs, and the specific `particleType` (e.g., snow for Himalaya, dust for Rajasthan). 
* **Files to check**:
  * `constants/themes.ts` (Theme data and palettes)
  * `store/appStore.ts` (Holds the currently selected `activeTheme` and `dayNight` state)
  * `hooks/useTheme.ts` (Hook used by all components to get current colors)

### D. Settings & Preferences (`app/settings/index.tsx`)
The user configuration hub.
* **What it does**: Allows users to change Language (English/Hindi), Audio mix (Ambient, Binaural, SFX volumes), toggle Haptics, and Keep Screen Awake.
* **Files to check**:
  * `app/settings/index.tsx` (Settings UI screen)
  * `store/settingsStore.ts` (Zustand store persisting preferences)
  * `hooks/useSettings.ts` (Convenience hook for accessing settings)

### E. Sessions (The Core Functionality)
Practices are separated into sub-directories inside `app/(sessions)/`.
* **What it does**: Each session folder contains an `index.tsx` (the picker/setup screen) and usually a `session.tsx` (the actual active timer/experience screen).
* **Files to check**:
  * **Meditation**: `app/(sessions)/meditation/index.tsx` & `components/meditation/MeditationCard.tsx`
  * **Breathing**: `app/(sessions)/breathing/`
  * **Pomodoro/Focus**: `app/(sessions)/pomodoro/` or `focus/`
  * **Shared Session State**: `store/sessionStore.ts`

---

## 4. Developer Guide: How to Modify the App

### Scenario 1: I need to add a new Region/Theme
1. Open `constants/themes.ts`.
2. Add your new theme (e.g., `goa`) to the `ThemeId` type and `THEME_ORDER` array.
3. Add the `goa` object to the `THEMES` dictionary, defining its Day/Night colors, particle type (e.g., `ocean`), icon, and English/Hindi names.

### Scenario 2: I need to change how the Home Screen looks
1. Open `app/index.tsx`.
2. You can rearrange the layout, tweak spacing, or add new components. 
3. If you want to change the Session Cards (e.g., add a new practice), modify the `SESSION_CARDS` array inside `components/home/SessionCard.tsx`.

### Scenario 3: I need to add a new Setting (e.g., "Daily Reminders")
1. Open `store/settingsStore.ts` and add `dailyRemindersEnabled: boolean` to the state interface and default values.
2. Open `app/settings/index.tsx`.
3. Add a new `<SettingRow>` containing a `<Switch>` hooked up to your new state variable.

### Scenario 4: I need to update text or add translations
1. Most static configurations have `name` and `nameHindi` properties (e.g., in `themes.ts` or `constants/meditation-types.ts`).
2. Global language state is controlled by `useSettingsStore().language`. 
3. In components, check `language === 'hi-IN'` to display the Hindi string instead of English.

### Scenario 5: I need to edit the Particle Animation
1. Open `components/particles/ParticleCanvas.tsx` or `components/ui/iridescence.tsx`.
2. Animations are driven by `@shopify/react-native-skia` and `react-native-reanimated`. You can adjust vectors, velocities, and shapes here.

---

## 5. Summary
Flowsome uses a highly decoupled architecture. If you are touching **UI/Layout**, look in `app/` and `components/`. If you are touching **Data/State**, look in `store/`. If you are tweaking **Colors/Text/Configs**, look in `constants/`. This strict separation ensures the app remains scalable and easy to maintain.
