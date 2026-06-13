# 🎧 Flowsome — Audio Master Guide
### TTS Prompts · Sound Specs · Sourcing · Placement Logic

> **For:** All 25 audio files across `ambient/`, `binaural/`, `sfx/`, `tts/`  

> **TTS Engine:** Gemini 2.5 Pro TTS   
# https://aistudio.google.com/generate-speech?model=gemini-2.5-pro-preview-tts

> **App context:** Expo 56, React Native, bilingual EN/HI

---

## 1. How the User Experiences Sound (Layered Audio Model)

Understanding the *perception* of sound in Flowsome first — this shapes how you source and tune each file.

```
USER EAR
    ↑
┌─────────────────────────────────────────────────────┐
│  Layer 4: TTS Voice Cues                            │  ← Foreground, 1-1.5s bursts
│  "Inhale" / "Hold" / "Exhale" / "Rest"             │     User consciously hears
├─────────────────────────────────────────────────────┤
│  Layer 3: SFX (Micro-interactions)                  │  ← Flash moments, 0.3-5s
│  singing bowls, chimes, taps, streaks               │     Punctuate key events
├─────────────────────────────────────────────────────┤
│  Layer 2: Binaural Beats                            │  ← Sub-conscious, felt not heard
│  alpha / theta / delta drone                        │     Only in active sessions
├─────────────────────────────────────────────────────┤
│  Layer 1: Ambient Track (always on, loops)          │  ← Background constant
│  Desert wind / Mountain wind / Rain / Birds / Ocean │     Sets the mood floor
└─────────────────────────────────────────────────────┘
```

**Key principle:** Lower layers must never fight upper layers. The ambient track is the quietest (set ~60% of max volume by default), binaural even quieter (set ~30%), SFX slightly louder than ambient, and TTS is the clearest at the top.

---

## 2. Complete File Spec Sheet (All 25 Files)

### 2A — Ambient Tracks (`assets/audio/ambient/`)

| File | Length | Loop? | Perception | What user feels |
|------|--------|-------|------------|-----------------|
| `rajasthan-desert-wind.mp3` | 90–120s | Yes | Warm sub-bass wind sweep, occasional faint chime ghost | Dry heat, ancient spaciousness, focused isolation |
| `himalaya-mountain-wind.mp3` | 90–120s | Yes | Cold crisp high-pitched wind, spatial echo | Vast emptiness, altitude clarity, inner stillness |
| `kerala-rain-river.mp3` | 90–120s | Yes | Medium-soft monsoon rain on broad leaves + slow gurgling water | Warm tropical calm, rhythmic, cleansing |
| `assam-forest-birds.mp3` | 90–120s | Yes | Multiple soft bird calls layered, leaf rustle, distant water | Morning freshness, alive, grounded in nature |
| `andaman-ocean-waves.mp3` | 90–120s | Yes | Slow deep wave cycles (full inhale-exhale rhythm ~8s per cycle) | Deep breath of the ocean, meditative rhythm |

**Loop note:** The track must end on the same sonic "texture" it begins on. Fade out the last 3s and fade in the first 3s at the same amplitude. Use Audacity's "Crossfade Loops" tool.

**Volume matching:** Normalize all 5 tracks to –14 LUFS. This prevents a volume shock when switching from Andaman to Rajasthan.

---

### 2B — Binaural Beats (`assets/audio/binaural/`)

| File | Beat Freq | Carrier | Used In | Duration | What user feels |
|------|-----------|---------|---------|----------|-----------------|
| `alpha-10hz.mp3` | 10 Hz | 200 Hz L / 210 Hz R | Breathing, Focus/Pomodoro | 90–120s loop | Light alertness, mild concentration, calm-aware |
| `theta-6hz.mp3` | 6 Hz | 200 Hz L / 206 Hz R | Meditation | 90–120s loop | Deep relaxation, inward focus, light drowsiness |
| `delta-2hz.mp3` | 2 Hz | 200 Hz L / 202 Hz R | Deep Rest | 90–120s loop | Very heavy, sub-bass pulse, deep stillness |

**How to generate (free, 10 minutes):**
1. Download **Audacity** (free, audacityteam.org)
2. `Generate → Tone` → Waveform: Sine, Frequency: 200 Hz, Amplitude: 0.5, Duration: 2 min → this is the LEFT channel
3. `Generate → Tone` again → Frequency: 210 Hz (for alpha), Amplitude: 0.5 → this is the RIGHT channel
4. Select both tracks → `Tracks → Mix → Mix and Render to New Track`
5. Use `Tracks → Stereo` to assign L/R properly
6. Export as MP3 (128kbps is fine for a drone)

**Aesthetic:** These should sound like a barely-audible hum. User should feel it in their chest/head, not consciously hear a "sound effect." Keep amplitude low (–24 LUFS).

---

### 2C — Sound Effects (`assets/audio/sfx/`)

| File | Duration | Trigger | Organic feel target |
|------|----------|---------|---------------------|
| `singing-bowl.mp3` | 3–5s | Meditation start/end, session completions | Rich metallic ring, warm overtones, natural fade |
| `ding-soft.mp3` | 0.5–1s | Timer complete, soft notifications | Gentle single bell, barely-there |
| `breath-complete.mp3` | 1–2s | One full breathing cycle done | Soft whoosh + faint rising tone |
| `sfx-region-select.mp3` | 0.3–0.5s | Tapping a new landscape theme | Polished wood "thok", almost no reverb |
| `sfx-session-begin.mp3` | 2–3s | Entering any session screen | Single Tibetan bowl strike, inviting, rising energy |
| `sfx-phase-transition.mp3` | 0.3–0.5s | Inhale→Hold, Hold→Exhale transitions | Almost inaudible faint "tick" or soft micro-chime |
| `sfx-session-end.mp3` | 4–5s | Session complete screen appears | Singing bowl with longer reverb, descending, ceremonial |
| `sfx-streak-milestone.mp3` | 2–2.5s | Hitting a streak (3, 7, 21 days) | Magical ascending glass chimes, like wind chimes |
| `sfx-badge-earned.mp3` | 1–1.5s | Unlocking a gamification badge | Two ascending soft chime notes, soft sparkle |

**Volume at playback:** `sfx-phase-transition` should play at **40% of sfxVolume** (already in your Sprint 9 code: `play('phase-transition', 0.4)`). All others at 100%.

---

### 2D — TTS Files (`assets/audio/tts/`)
# https://aistudio.google.com/generate-speech?model=gemini-2.5-pro-preview-tts

*(Full Gemini prompts in Section 4 below)*

| File | Duration | Trigger moment | Voice feel |
|------|----------|----------------|------------|
| `inhale-en.mp3` | 1–1.5s | Phase begins: Inhale | Soft, slightly rising, inviting |
| `hold-en.mp3` | 0.8–1s | Phase begins: HoldIn | Even, calm, suspended |
| `exhale-en.mp3` | 1–1.5s | Phase begins: Exhale | Sighing, slightly descending, releasing |
| `rest-en.mp3` | 0.8–1s | Phase begins: HoldOut | Near-whisper, dissolving into silence |
| `inhale-hi.mp3` | 1.5–2s | Phase begins: Inhale (HI) | Same feel, Hindi pacing is slightly longer |
| `hold-hi.mp3` | 1–1.2s | Phase begins: HoldIn (HI) | Compact, even |
| `exhale-hi.mp3` | 1.5–2s | Phase begins: Exhale (HI) | Releasing, flowing |
| `rest-hi.mp3` | 1–1.2s | Phase begins: HoldOut (HI) | Hushed, reverential |

---

## 3. Breathing × TTS — Where and How to Place

### Pattern timing reference

| Pattern | Inhale | HoldIn | Exhale | HoldOut | Cycles | TTS files used |
|---------|--------|--------|--------|---------|--------|----------------|
| **Box Breathing** | 4s | 4s | 4s | 4s | 8 | all 4 |
| **4-7-8** | 4s | 7s | 8s | — | 6 | inhale, hold, exhale |
| **Nadi Shodhana** | 4s | 4s | 8s | — | variable | inhale, hold, exhale |
| **Coherent Breathing** | 5s | — | 5s | — | continuous | inhale, exhale |

### TTS trigger placement rule

TTS should fire at the **very start of each phase** (time = 0ms into the phase). Since your `useBreathing` hook already handles phase transitions, the TTS call goes in the `onPhaseChange` callback:

```typescript
// In session.tsx (breathing)
const { speak } = useSpeech();
const breathing = useBreathing({
  pattern: selectedPattern,
  onPhaseChange: (newPhase) => {
    speak(newPhase); // triggers the right TTS file
    playPhaseTransition(); // SFX (very quiet)
    hapticForBreathingPhase(newPhase); // haptic
  }
});
```

### TTS duration vs phase duration

The TTS word should **never be longer than the phase itself**. The files are 1–1.5s, the shortest phase in any pattern is 4s — so there is no conflict. But here's the perceptual map:

```
Box Breathing — 4s phases:
├── [0.0s] "Inhale" spoken  (1.2s)
│       Orb expands for remaining 2.8s in silence ← user breathes
├── [4.0s] "Hold" spoken    (0.9s)
│       Orb holds for remaining 3.1s in silence ← user holds
├── [8.0s] "Exhale" spoken  (1.3s)
│       Orb contracts for remaining 2.7s in silence ← user exhales
└── [12.0s] "Rest" spoken   (0.9s)
        Orb rests for remaining 3.1s in silence ← user holds out

4-7-8 Breathing:
├── [0.0s] "Inhale" spoken  (for 4s phase)
├── [4.0s] "Hold" spoken    (for 7s phase — word plays, 5.5s of silence follows)
└── [11.0s] "Exhale" spoken (for 8s phase)
```

**The silence after the spoken word is intentional — it is the breath itself.**

---

## 4. TTS Generation: Full Gemini 2.5 Pro Guide
# https://aistudio.google.com/generate-speech?model=gemini-2.5-pro-preview-tts

### Voice selection recommendation

Test these Gemini 2.5 Pro voice presets and pick the warmest one:

| Language | Recommended Voice | Alternative |
|----------|------------------|-------------|
| English | **Aoede** (warm female, conversational) | Leda, Kore |
| Hindi | **Aoede** (test first) | Despina, Callirrhoe |

Generate a test batch with 2-3 voices per language, then A/B test on the actual app.

---

### 4A — CONTEXT BOX (System Instruction — same for all 4 English files)

Use this as your **system_instruction** or **Context** field in Gemini AI Studio:

```
You are a calm, warm wellness breathing guide. Your voice is soft, close, 
and intimate — like a whisper in a still room. You are guiding someone 
through a breathing meditation with eyes closed. Speak very slowly, with 
great intentionality. Use a warm Indian-English accent. Your tone is gentle, 
grounded, and never clinical. There is quiet authority in your softness. 
Each word you speak should feel like it has space around it — as if the 
silence after the word is as important as the word itself.
```

---

### 4B — English TTS — Per-File Prompts

#### File 1: `inhale-en.mp3`

**Text to speak:**
```
Inhale...
```

**Scene box (user turn / prompt):**
```
Speak the single word "Inhale" slowly and softly. A slightly rising, 
inviting inflection — as if gently drawing someone inward and upward. 
The 'In' begins quietly and the 'hale' opens slightly, like a door being 
gently opened. There is a soft ellipsis of silence after the word. 
Target duration: approximately 1.2 seconds.
```

---

#### File 2: `hold-en.mp3`

**Text to speak:**
```
Hold...
```

**Scene box:**
```
Speak the single word "Hold" with a calm, even, suspended quality. 
The voice neither rises nor falls — it is like a held breath itself, 
flat and still. The word should feel like pressing a gentle pause button. 
Very soft, barely above a whisper. Target duration: approximately 0.9 seconds.
```

---

#### File 3: `exhale-en.mp3`

**Text to speak:**
```
Exhale...
```

**Scene box:**
```
Speak the word "Exhale" with a soft sighing quality — as if the word 
itself is a gentle sigh or release. Begin the 'Ex' quietly and let 'hale' 
trail off and descend slightly, like a breath slowly releasing. 
The ending should dissolve gently into silence. 
Target duration: approximately 1.3 seconds.
```

---

#### File 4: `rest-en.mp3`

**Text to speak:**
```
Rest...
```

**Scene box:**
```
Speak the word "Rest" as barely more than a whisper — hushed, 
gentle, almost reverential. It is the quietest of the four cues. 
The voice should feel like it is dissolving into silence even as 
it speaks. No inflection, completely flat and still. 
Target duration: approximately 0.9 seconds.
```

---

### 4C — HINDI CONTEXT BOX (System Instruction — same for all 4 Hindi files)

```
आप एक शांत, कोमल ध्यान-निर्देशक हैं। आपकी आवाज़ धीमी, उष्ण और 
घनिष्ठ है — जैसे किसी शांत कमरे में कानों में फुसफुसाना। आप किसी को 
आँखें बंद करके साँस की ध्यान-क्रिया में मार्गदर्शन दे रहे हैं। 
बहुत धीरे और सावधानी से बोलें। आपका स्वर कोमल, भरोसेमंद है — 
कभी रोबोटिक नहीं। हर शब्द के बाद का मौन भी उतना ही महत्वपूर्ण है।

(Translation: You are a calm, gentle meditation guide. Your voice is soft, 
warm and intimate. Guide breathing meditation very slowly and deliberately.)
```

> **Note:** If Gemini doesn't accept Devanagari in the system instruction, use the English version of the Context Box — it will still influence the Hindi voice quality.

---

### 4D — Hindi TTS — Per-File Prompts

#### File 5: `inhale-hi.mp3`

**Text to speak:**
```
सांस लें...
```

**Transliteration (for reference):** *Saans lein*

**Scene box:**
```
Speak the phrase "सांस लें" (Saans lein — meaning "Breathe in") 
slowly and gently. "सांस" (Saans) begins softly, and "लें" (lein) 
lifts slightly at the end — an inviting, upward inflection, 
like an open invitation to breathe. Warm and unhurried. 
Target duration: approximately 1.5–1.8 seconds.
```

---

#### File 6: `hold-hi.mp3`

**Text to speak:**
```
रोकें...
```

**Transliteration:** *Rokein*

**Scene box:**
```
Speak the single word "रोकें" (Rokein — meaning "Hold/Pause") 
with a calm, flat, even quality. The voice should feel like it 
is itself pausing — held in place, neither rising nor falling. 
Slightly hushed. Target duration: approximately 1 second.
```

---

#### File 7: `exhale-hi.mp3`

**Text to speak:**
```
सांस छोड़ें...
```

**Transliteration:** *Saans chhodein*

**Scene box:**
```
Speak the phrase "सांस छोड़ें" (Saans chhodein — meaning "Release 
the breath") with a soft, releasing quality. "छोड़ें" (chhodein) 
should trail off gently, like a breath being let go. 
Slightly descending inflection on the last syllable, 
dissolving into silence. Target duration: approximately 1.8–2 seconds.
```

---

#### File 8: `rest-hi.mp3`

**Text to speak:**
```
विश्राम...
```

**Transliteration:** *Vishram*

**Scene box:**
```
Speak the word "विश्राम" (Vishram — meaning "Rest/Repose") 
as a near-whisper with quiet reverence. This is a beautiful 
Sanskrit-origin word — let it be spoken with that weight. 
Completely flat and still, like a person settling into silence. 
Almost inaudible by the end. Target duration: approximately 1.1 seconds.
```

---

### 4E — Post-Generation Checklist

After generating all 8 TTS files, do this before placing them in the app:

1. **Trim silence:** Use Audacity → `Effect → Truncate Silence`. Keep max 200ms of silence at start, max 400ms at end (the trailing silence creates the "ellipsis" feel).
2. **Normalize:** `Effect → Normalize` to –3 dBFS peak.
3. **Check length:** If any file exceeds 2 seconds, regenerate with a faster prompt (add "slightly faster pacing" to scene box).
4. **A/B test languages:** Play the English and Hindi versions back-to-back — the emotional tone must match even though the words are different languages.
5. **Device test:** Always test on physical Android device at low volume (50% phone volume) — TTS files that sound perfect in speakers can sound thin on phone speakers.

---

## 5. Ambient Track Sourcing Guide

### Best free sources (CC0 / royalty-free)

| Platform | Best for | URL | License |
|----------|----------|-----|---------|
| **Freesound.org** | Everything organic — wind, rain, birds | freesound.org | CC0 filter available |
| **Pixabay** | Clean ambient + nature sounds | pixabay.com/sound-effects | CC0 |
| **Mixkit** | Chimes, bowls, short SFX | mixkit.co/free-sound-effects | Free, no attribution |
| **Zapsplash** | Nature ambience | zapsplash.com | Free |
| **BBC Sound Effects** | Professional broadcast-quality | bbcrewind.co.uk/sound-effects | Personal/research use |

---

### Per-track search terms

#### `rajasthan-desert-wind.mp3`
**Freesound.org search terms:** `"desert wind loop"`, `"hot wind ambience"`, `"wind drone warm"`  
**What to look for:** A low-frequency (50–300 Hz dominant) wind sweep. No sudden gusts. Should sound like standing in an open sandy plain on a hot afternoon. If you find a track with too much treble (hissing wind), use Audacity `Effect → Equalization` to roll off above 3kHz.  
**Optional layer:** If you find a bare wind track, you can layer a *very* faint Rajasthani sarangi or flute note from Pixabay (search `"bansuri flute note"`) at –20dB underneath.

#### `himalaya-mountain-wind.mp3`
**Search terms:** `"mountain wind cold"`, `"high altitude wind ambience"`, `"winter wind exterior"`  
**What to look for:** Crisp, higher-pitched than Rajasthan. Has a slight echo/reverb (spatial distance). Can have gentle howling. No rain, no birds. Should feel isolating and crystal-clear.  
**Tip:** A slightly hollow, empty quality works perfectly — the "vacancy" of mountain air.

#### `kerala-rain-river.mp3`
**Search terms:** `"monsoon rain leaves"`, `"rain on broad leaves"`, `"tropical rain gentle"`, `"river stream gentle"`  
**Strategy:** Source two separate clips — one of soft rain on leaves, one of a gentle river — and layer them in Audacity. Set rain at 70% volume, river at 30%. The rain should be the dominant texture.  
**What to avoid:** Thunder, harsh rain splashing on hard surfaces, intense downpours. You want the *padded* sound of rain absorbed by vegetation.

#### `assam-forest-birds.mp3`
**Search terms:** `"morning forest ambience"`, `"jungle birds calm"`, `"tropical forest dawn"`, `"birds chirping gentle forest"`  
**What to look for:** Multiple bird species audible at the same time but in the distance, not sharp or jarring. Rustling leaves in background. If you find a good bird track that has one loud close-up bird call, use Audacity `Effect → Noise Reduction` to soften it.  
**Tip:** Prefer tracks recorded in India or Southeast Asia — the bird species will match the cultural context.

#### `andaman-ocean-waves.mp3`
**Search terms:** `"ocean waves slow loop"`, `"beach waves relaxing"`, `"deep ocean waves gentle"`, `"sea waves shore meditation"`  
**What to look for:** A slow wave rhythm — each wave cycle (approach + crash + retreat) should take 6–10 seconds. This naturally mirrors the breathing cycle and is deeply meditative. Avoid rocky coastlines (sharp crash sounds). Sandy beach recording preferred.  
**Loop tip:** Ocean waves are easy to loop. Find the point just before a wave begins and cut there — the loop sounds natural because each wave sounds like the next.

---

## 6. SFX Sourcing Guide

### Freesound.org specific searches (use CC0 filter)

| SFX File | Search Query | What to pick |
|----------|-------------|--------------|
| `singing-bowl.mp3` | `"tibetan singing bowl single"` | Single clean strike, 3–5s, warm C or D note, natural fade |
| `ding-soft.mp3` | `"soft bell notification"` or `"light chime single"` | Very gentle, barely-there, under 1s |
| `breath-complete.mp3` | `"wind chime soft"` + a subtle whoosh | Layer a breath-exit sound with a faint rising tone |
| `sfx-region-select.mp3` | `"wood tap"` or `"wooden knock soft"` | Like tapping polished teak — one sound, 0.3s |
| `sfx-session-begin.mp3` | `"tibetan bowl strike"` | Same bowl as singing-bowl but shorter, more inviting |
| `sfx-phase-transition.mp3` | `"faint chime"` or `"micro bell"` | Should be barely audible even at 100% SFX volume |
| `sfx-session-end.mp3` | `"singing bowl long reverb"` | Same as singing bowl but with more tail, more ceremonial |
| `sfx-streak-milestone.mp3` | `"ascending chimes"` or `"glass chimes magical"` | Multiple ascending notes, 2–2.5s |
| `sfx-badge-earned.mp3` | `"two note chime ascending"` | Just 2 notes, higher than streak milestone, sparkle feel |

### Quick Mixkit links (no attribution needed)

- Notification chimes: `mixkit.co/free-sound-effects/notification/`
- Bells and chimes: `mixkit.co/free-sound-effects/bell/`
- Game UI sounds: `mixkit.co/free-sound-effects/game/` (look for "coins", "level up" — adapt)

### Audacity post-processing for all SFX

1. **Fade in:** 10ms fade in (removes click at file start)
2. **Fade out:** Varies — 200ms for short SFX, 1s for singing bowl
3. **Normalize:** –3 dBFS
4. **Export:** MP3, 128kbps, 44.1kHz

---

## 7. Implementation Integration Notes

### When each audio layer starts/stops

```
HOME SCREEN
├── Ambient: AUTO-STARTS, loops forever
└── Binaural: OFF

USER ENTERS SESSION
├── Ambient: CONTINUES (AudioManager stays mounted under sessions)
├── Binaural: STARTS (alpha for breathing/focus, theta for meditation)
├── SFX (session-begin): plays 300ms after navigation complete
└── TTS: fires on each phase transition

SESSION COMPLETE
├── SFX (session-end): plays immediately
├── Binaural: STOPS
└── TTS: STOPS
└── Ambient: CONTINUES back to home screen
```

### Volume hierarchy (default values in settingsStore)

```typescript
ambientVolume: 0.6,    // 60% — background floor
binauralVolume: 0.25,  // 25% — sub-conscious, felt not heard
sfxVolume: 0.75,       // 75% — clear but not jarring
// TTS uses expo-speech or TTS audio volume:
ttsVolume: 0.9,        // 90% — foreground, must be clear
```

### TTS file naming in useSpeech.ts

Map phase names → TTS files based on language:

```typescript
const TTS_FILES = {
  'en-IN': {
    inhale:   require('../assets/audio/tts/inhale-en.mp3'),
    holdIn:   require('../assets/audio/tts/hold-en.mp3'),
    exhale:   require('../assets/audio/tts/exhale-en.mp3'),
    holdOut:  require('../assets/audio/tts/rest-en.mp3'),
  },
  'hi-IN': {
    inhale:   require('../assets/audio/tts/inhale-hi.mp3'),
    holdIn:   require('../assets/audio/tts/hold-hi.mp3'),
    exhale:   require('../assets/audio/tts/exhale-hi.mp3'),
    holdOut:  require('../assets/audio/tts/rest-hi.mp3'),
  }
};
```

Note: `holdOut` maps to `rest` files — "Rest" is the more calming word than "Hold Out" for the bottom of the cycle.

---

## 8. Quick Reference Checklist

### Before placing any audio in the app

- [ ] All ambient tracks normalized to –14 LUFS
- [ ] All ambient tracks tested as seamless loop (no click at wrap point)
- [ ] Binaural beats: test with headphones (they only work with stereo separation)
- [ ] All SFX normalized to –3 dBFS
- [ ] TTS files trimmed (no more than 200ms silence at start, 400ms at end)
- [ ] All files encoded as `.mp3`, 128kbps minimum
- [ ] Test on physical Android device at 50% volume
- [ ] Test EN and HI TTS back-to-back — emotional tone must match
- [ ] Switch regions 3x rapidly on home screen — no audio gap or double-play

---

*Built for Flowsome — Rajasthan · Himalaya · Kerala · Assam · Andaman 🇮🇳*
