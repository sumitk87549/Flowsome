// Sprint 9 — app/(sessions)/breathing/session.tsx
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState, useCallback, useMemo } from 'react';
import * as KeepAwake from 'expo-keep-awake';
import { useSharedValue, cancelAnimation } from 'react-native-reanimated';
import { SafeScreen } from '../../../components/ui/SafeScreen';
import { FlowText } from '../../../components/ui/FlowText';
import { BreathingOrb } from '../../../components/breathing/BreathingOrb';
import { BreathingPhaseLabel } from '../../../components/breathing/BreathingPhaseLabel';
import { BreathingProgress } from '../../../components/breathing/BreathingProgress';
import { FlowButton } from '../../../components/ui/FlowButton';
import { ParticleCanvas } from '../../../components/particles/ParticleCanvas';
import { useBreathing } from '../../../hooks/useBreathing';
import { useSessionStore } from '../../../store/sessionStore';
import { BREATHING_PATTERNS } from '../../../constants/breathing-patterns';
import { useAmbientAudio, useSFX, useBinauralAudio } from '../../../hooks/useAudio';
import { useTheme } from '../../../hooks/useTheme';
import { useAppStore } from '../../../store/appStore';
import { useSettingsStore } from '../../../store/settingsStore';
import { HapticUtils } from '../../../utils/hapticUtils';
import { QUOTES, getQuoteForSession } from '../../../constants/quotes';
import { useHistoryStore } from '../../../store/historyStore';
import { checkAndAwardBadges } from '../../../utils/achievementUtils';

export default function BreathingSession() {
  const router = useRouter();
  const theme = useTheme();
  const { activeTheme } = useAppStore();
  const { selectedPatternId } = useSessionStore();
  const { keepAwakeEnabled, language } = useSettingsStore();
  const { playSingingBowl, playSessionBegin, playSessionEnd, playPhaseTransition } = useSFX();

  const [showCompletion, setShowCompletion] = useState(false);
  const [completionTimer, setCompletionTimer] = useState(5);
  const [moodAfter, setMoodAfter] = useState<number | null>(null);
  const staticZeroShared = useSharedValue(0);

  const addSession = useHistoryStore((s) => s.addSession);
  const awardBadge = useHistoryStore((s) => s.awardBadge);
  const showBadgeToast = useCallback((_badge: any) => {}, []);

  const pattern =
    BREATHING_PATTERNS.find((p) => p.id === selectedPatternId) ??
    BREATHING_PATTERNS[0];

  const totalSessionSeconds = pattern.cycles * pattern.phases.reduce((sum, p) => sum + p.durationSeconds, 0);

  const {
    state,
    currentPhase,
    phaseProgress,
    phaseProgressShared,
    currentCycle,
    phaseSecondsRemaining,
    start,
    pause,
    resume,
    stop,
  } = useBreathing(pattern, {
    onPhaseChange: (phaseName) => {
      playPhaseTransition();
    }
  });
  
  const totalCycles = pattern.cycles;

  // Get active quote for theme
  const themeQuotes = QUOTES.filter((q) => q.region === activeTheme || q.region === 'all');
  const activeQuote = themeQuotes.length > 0 ? themeQuotes[0] : QUOTES[0];

  const completionQuote = useMemo(
    () => getQuoteForSession('breathing', activeTheme),
    [activeTheme],
  );

  // Mark session as active
  useEffect(() => {
    const appState = useAppStore.getState() as any;
    appState.setSessionActive?.(true);
    return () => {
      appState.setSessionActive?.(false);
    };
  }, []);

  // Keep screen awake during session
  useEffect(() => {
    if (keepAwakeEnabled) {
      KeepAwake.activateKeepAwakeAsync().catch(() => {
        // silently ignore if not supported
      });
    }
    return () => {
      KeepAwake.deactivateKeepAwake();
    };
  }, [keepAwakeEnabled]);

  // Session begin timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      playSessionBegin();
    }, 300);
    return () => clearTimeout(timer);
  }, [playSessionBegin]);

  // Auto-start 800ms after screen mounts
  useEffect(() => {
    const timer = setTimeout(() => start(), 800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (state === 'complete' && !showCompletion) {
      setShowCompletion(true);
      playSingingBowl();
      playSessionEnd();

      addSession({
        type: 'breathing',
        durationMinutes: Math.max(1, Math.floor(totalSessionSeconds / 60)),
        theme: activeTheme,
        practiceId: selectedPatternId ?? null,
        intention: null,
        moodBefore: null,
        moodAfter: moodAfter ?? null,
        accomplishmentNote: null,
      });
      checkAndAwardBadges(awardBadge, showBadgeToast);

      const interval = setInterval(() => {
        setCompletionTimer((t) => {
          if (t <= 1) {
            clearInterval(interval);
            router.replace('/');
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [state, showCompletion, playSingingBowl, playSessionEnd, router]);

  // Ambient audio (loops, plays for duration of screen)
  useAmbientAudio(activeTheme, true);
  
  // Binaural audio
  const binauralPlayer = useBinauralAudio('alpha', state === 'running');
  useEffect(() => {
    return () => {
      try {
        if (typeof binauralPlayer.pause === 'function') binauralPlayer.pause();
      } catch (_) {}
    };
  }, [binauralPlayer]);

  const handleStop = () => {
    stop();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <SafeScreen>
      <LinearGradient
        colors={[theme.gradientStart, theme.gradientEnd]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <ParticleCanvas breathPhase={currentPhase.name as any} opacity={0.45} />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 60,
          paddingHorizontal: 24,
        }}
      >
        {/* Top: Cycle progress dots and regional quote */}
        <View style={{ alignItems: 'center', width: '100%', gap: 12 }}>
          <BreathingProgress
            currentCycle={currentCycle}
            totalCycles={pattern.cycles}
          />
          {state !== 'complete' && (
            <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
              <FlowText size="xs" color={theme.textMuted} style={{ textAlign: 'center', fontStyle: 'italic', lineHeight: 18, opacity: 0.85 }}>
                "{language === 'hi-IN' ? activeQuote.textHindi : activeQuote.text}"
              </FlowText>
            </View>
          )}
        </View>

        {/* Center: Orb + Phase label */}
        <View style={{ alignItems: 'center', gap: 32 }}>
          <BreathingOrb phase={currentPhase.name as any} phaseProgress={phaseProgressShared} theme={theme} size={220} />
          {state !== 'idle' && state !== 'complete' && (
            <BreathingPhaseLabel
              phase={currentPhase.name}
              secondsRemaining={phaseSecondsRemaining}
              theme={{ text: theme.text, textMuted: theme.textMuted }}
            />
          )}
          {state === 'complete' && (
            <BreathingPhaseLabel
              phase="idle"
              secondsRemaining={0}
              theme={{ text: theme.text, textMuted: theme.textMuted }}
            />
          )}
        </View>

        {/* Bottom: Controls */}
        <View style={{ gap: 12, width: '100%' }}>
          {state === 'running' && (
            <FlowButton
              label="Pause"
              variant="secondary"
              onPress={pause}
              style={{ alignSelf: 'center', width: '60%', alignItems: 'center' }}
            />
          )}
          {state === 'paused' && (
            <FlowButton
              label="Resume"
              onPress={resume}
              style={{ alignSelf: 'center', width: '60%', alignItems: 'center' }}
            />
          )}
          <FlowButton
            label="End Session"
            variant="ghost"
            onPress={handleStop}
            style={{ alignSelf: 'center', width: '60%', alignItems: 'center' }}
          />
        </View>
      </View>

      {showCompletion && (
        <View style={[StyleSheet.absoluteFill, styles.completionOverlay]}>
          {/* Static orb in rest state */}
          <View style={{ marginBottom: 32, opacity: 0.8 }}>
            <BreathingOrb
              phase="holdOut"
              phaseProgress={staticZeroShared}
              theme={theme}
              size={140}
            />
          </View>

          {/* Session summary */}
          <Text style={[styles.completionTitle, { color: theme.text, fontFamily: 'CormorantGaramond-Medium' }]}>
            Session Complete
          </Text>
          <Text style={[styles.completionStats, { color: theme.textMuted }]}>
            {totalCycles} cycles · {(selectedPatternId ?? '').replace(/-/g, ' ')}
          </Text>

          {completionQuote && (
            <View style={{ paddingHorizontal: 24, marginTop: 20 }}>
              <Text style={{
                color: theme.textMuted,
                fontSize: 14,
                fontFamily: 'CormorantGaramond-Italic',
                textAlign: 'center',
                lineHeight: 22,
              }}>
                "{language === 'hi-IN' && completionQuote.textHindi ? completionQuote.textHindi : completionQuote.text}"
              </Text>
              <Text style={{ color: theme.textMuted, fontSize: 11, textAlign: 'center', marginTop: 8 }}>
                — {completionQuote.attribution}
              </Text>
            </View>
          )}

          {/* Mood selector — 5 dots */}
          <View style={styles.moodRow}>
            {[1, 2, 3, 4, 5].map((n) => (
              <TouchableOpacity
                key={n}
                onPress={() => { setMoodAfter(n); HapticUtils.light(); }}
                style={[
                  styles.moodDot,
                  { backgroundColor: moodAfter === n ? theme.primary : theme.cardBorder },
                ]}
              />
            ))}
          </View>
          <Text style={{ color: theme.textMuted, fontSize: 11, marginTop: 6 }}>
            How do you feel?
          </Text>

          {/* Auto-dismiss hint */}
          <TouchableOpacity onPress={() => router.replace('/')} style={{ marginTop: 24 }}>
            <Text style={{ color: theme.textMuted, fontSize: 12 }}>
              Continuing in {completionTimer}s · tap to return
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  completionOverlay: {
    backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  completionTitle: {
    fontSize: 28,
    letterSpacing: 2,
  },
  completionStats: {
    fontSize: 14,
    marginTop: 8,
    letterSpacing: 1,
  },
  moodRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 28,
  },
  moodDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});
