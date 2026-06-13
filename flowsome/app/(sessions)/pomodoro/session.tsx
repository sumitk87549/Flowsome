// Sprint 9 — app/(sessions)/pomodoro/session.tsx
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { useEffect, useState, useCallback, useMemo } from 'react';
import * as KeepAwake from 'expo-keep-awake';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence, withRepeat, withTiming, cancelAnimation } from 'react-native-reanimated';
import { SafeScreen } from '../../../components/ui/SafeScreen';
import { CircularTimer } from '../../../components/timer/CircularTimer';
import { TimeDisplay } from '../../../components/timer/TimeDisplay';
import { FlowButton } from '../../../components/ui/FlowButton';
import { FlowText } from '../../../components/ui/FlowText';
import { ParticleCanvas } from '../../../components/particles/ParticleCanvas';
import { useTimer } from '../../../hooks/useTimer';
import { useAmbientAudio, useBinauralAudio, useSFX } from '../../../hooks/useAudio';
import { useAppStore } from '../../../store/appStore';
import { useTheme } from '../../../hooks/useTheme';
import { useSessionStore } from '../../../store/sessionStore';
import { useSettingsStore } from '../../../store/settingsStore';
import { HapticUtils } from '../../../utils/hapticUtils';
import { QUOTES, getQuoteForSession } from '../../../constants/quotes';
import { useHistoryStore } from '../../../store/historyStore';
import { checkAndAwardBadges } from '../../../utils/achievementUtils';

function PomodoroDot({ completed, active, theme }: { completed: boolean; active: boolean; theme: any }) {
  const scale = useSharedValue(1);
  const breathe = useSharedValue(1);

  useEffect(() => {
    if (completed) {
      scale.value = withSpring(1.3, { damping: 5 }, () => {
        scale.value = withSpring(1.0);
      });
    }
  }, [completed]);

  useEffect(() => {
    if (active) {
      breathe.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 2000 }),
          withTiming(1.0,  { duration: 2000 }),
        ),
        -1, false,
      );
    } else {
      cancelAnimation(breathe);
      breathe.value = withTiming(1.0, { duration: 200 });
    }
    return () => cancelAnimation(breathe);
  }, [active]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * breathe.value }],
  }));

  return (
    <Animated.View
      style={[
        animStyle,
        {
          width: 12, height: 12, borderRadius: 6,
          backgroundColor: completed
            ? theme.primary
            : active ? theme.primaryLight : theme.cardBorder,
          shadowColor: completed ? theme.primary : 'transparent',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: completed ? 0.8 : 0,
          shadowRadius: 6,
          elevation: completed ? 4 : 0,
        },
      ]}
    />
  );
}

// Ensure formatTime function is available for TimeDisplay manual usage or write it
function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export default function PomodoroSession() {
  const router = useRouter();
  const navigation = useNavigation();
  const theme = useTheme();
  const { activeTheme } = useAppStore();
  const { keepAwakeEnabled, language } = useSettingsStore();
  const params = useLocalSearchParams<{ workMin: string; breakMin: string; count: string }>();

  const workMin = parseInt(params.workMin ?? '25', 10);
  const breakMin = parseInt(params.breakMin ?? '5', 10);
  const count = parseInt(params.count ?? '4', 10);

  const totalWorkSeconds = workMin * 60;
  const intention = useSessionStore((s) => s.intention);
  const { playDing, playSingingBowl, playSessionBegin, playSessionEnd } = useSFX();

  const addSession = useHistoryStore((s) => s.addSession);
  const awardBadge = useHistoryStore((s) => s.awardBadge);
  const showBadgeToast = useCallback((_badge: any) => {}, []);

  const totalSessionSeconds = workMin * count * 60;

  const {
    status,
    phase: timerPhase,
    secondsLeft,
    completedPomodoros,
    progressShared,
    start,
    pause,
    resume,
    stop,
  } = useTimer({
    workMinutes: workMin,
    breakMinutes: breakMin,
    totalPomodoros: count,
    onWorkComplete: () => {
      playDing();
    },
    onBreakComplete: () => {
      playDing();
    },
    onAllComplete: () => {
      playSingingBowl();
      HapticUtils.success();
      playSessionEnd();
    },
  });

  const themeQuotes = QUOTES.filter((q) => q.region === activeTheme || q.region === 'all');
  const activeQuote = themeQuotes.length > 0 ? themeQuotes[0] : QUOTES[0];

  const completionQuote = useMemo(
    () => getQuoteForSession('focus', activeTheme),
    [activeTheme],
  );

  useAmbientAudio(activeTheme, true);
  const binauralPlayer = useBinauralAudio('alpha', status === 'running' && timerPhase === 'work');

  // Mark session as active
  useEffect(() => {
    const appState = useAppStore.getState() as any;
    appState.setSessionActive?.(true);
    return () => {
      appState.setSessionActive?.(false);
    };
  }, []);

  // Session begin timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      playSessionBegin();
    }, 300);
    return () => clearTimeout(timer);
  }, [playSessionBegin]);

  // Unmount binaural
  useEffect(() => {
    return () => {
      try {
        if (typeof binauralPlayer.pause === 'function') binauralPlayer.pause();
      } catch (_) {}
    };
  }, [binauralPlayer]);

  useEffect(() => {
    if (keepAwakeEnabled) {
      KeepAwake.activateKeepAwakeAsync().catch(() => {});
    }
    return () => {
      KeepAwake.deactivateKeepAwake();
    };
  }, [keepAwakeEnabled]);

  useEffect(() => {
    const t = setTimeout(() => {
      start();
    }, 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status === 'complete') {
      addSession({
        type: 'pomodoro',
        durationMinutes: Math.max(1, Math.floor(totalSessionSeconds / 60)),
        theme: activeTheme,
        practiceId: null,
        intention: intention ?? null,
        moodBefore: null,
        moodAfter: null,
        accomplishmentNote: null,
      });
      checkAndAwardBadges(awardBadge, showBadgeToast);

      const t = setTimeout(() => {
        router.replace('/' as any);
      }, 4000);
      return () => clearTimeout(t);
    }
  }, [status]);

  // Flow State logic
  const [flowEntered, setFlowEntered] = useState(false);
  const [showFlowBanner, setShowFlowBanner] = useState(false);
  const bannerOpacity = useSharedValue(0);

  useEffect(() => {
    if (status === 'running' && timerPhase === 'work') {
      const elapsed = totalWorkSeconds - secondsLeft;
      if (elapsed >= 600 && !flowEntered) {
        setFlowEntered(true);
        setShowFlowBanner(true);
        HapticUtils.heavy();
        bannerOpacity.value = withSequence(
          withTiming(1, { duration: 400 }),
          withTiming(1, { duration: 2200 }),
          withTiming(0, { duration: 400 }),
        );
        setTimeout(() => setShowFlowBanner(false), 3000);
      }
    }
  }, [secondsLeft, status, timerPhase, flowEntered, totalWorkSeconds, bannerOpacity]);

  // Exit Ritual logic
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
      if (status === 'running') {
        e.preventDefault();
        setShowExitConfirm(true);
      }
    });
    return unsubscribe;
  }, [navigation, status]);

  return (
    <SafeScreen>
      <LinearGradient
        colors={[theme.gradientStart, theme.gradientEnd]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <ParticleCanvas />
      
      {showFlowBanner && (
        <Animated.View
          style={[styles.flowBanner, useAnimatedStyle(() => ({ opacity: bannerOpacity.value }))]}
          pointerEvents="none"
        >
          <Text style={[styles.flowBannerText, { color: theme.text, fontFamily: 'CormorantGaramond-Italic' }]}>
            Flow state entered 🌊
          </Text>
        </Animated.View>
      )}

      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 60,
        }}
      >
        <View style={{ alignItems: 'center', width: '100%', gap: 8, paddingHorizontal: 24 }}>
          <FlowText variant="heading" size="xl" color={theme.textMuted}>
            {status === 'complete'
              ? (language === 'hi-IN' ? '✅ सत्र पूर्ण!' : '✅ Session Complete!')
              : `${completedPomodoros + 1} of ${count}`}
          </FlowText>
          {status !== 'complete' && (
            <FlowText size="xs" color={theme.textMuted} style={{ textAlign: 'center', fontStyle: 'italic', marginTop: 4, lineHeight: 18, opacity: 0.85 }}>
              "{language === 'hi-IN' ? activeQuote.textHindi : activeQuote.text}"
            </FlowText>
          )}
          {status === 'complete' && completionQuote && (
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
          <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center', marginTop: 20 }}>
            {Array(count).fill(0).map((_, i) => (
              <PomodoroDot
                key={i}
                completed={i < completedPomodoros}
                active={i === completedPomodoros && status === 'running'}
                theme={theme}
              />
            ))}
          </View>
        </View>

        <View style={styles.timerContainer}>
          {intention ? (
            <Text
              style={[styles.intentionWatermark, { color: theme.text, fontFamily: 'CormorantGaramond-Italic' }]}
              numberOfLines={3}
            >
              {intention}
            </Text>
          ) : null}

          <View style={styles.timerWrapper}>
            <CircularTimer progress={progressShared} size={240} theme={theme} isBreak={timerPhase === 'break'} />
            <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]} pointerEvents="none">
              <Text style={[styles.timeText, { color: theme.text, fontFamily: 'CormorantGaramond-Medium' }]}>
                {formatTime(secondsLeft)}
              </Text>
              <Text style={[styles.phaseLabel, { color: theme.textMuted }]}>
                {timerPhase === 'work' ? 'Focus' : 'Break'}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ gap: 12, width: '80%', alignItems: 'center' }}>
          {status === 'running' && (
            <FlowButton
              label="Pause"
              variant="secondary"
              onPress={pause}
              style={{ width: '100%', alignItems: 'center' }}
            />
          )}
          {status === 'paused' && (
            <FlowButton
              label="Resume"
              onPress={resume}
              style={{ width: '100%', alignItems: 'center' }}
            />
          )}
          <FlowButton
            label="End Session"
            variant="ghost"
            onPress={() => {
              if (status === 'running') {
                setShowExitConfirm(true);
              } else {
                stop();
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace('/');
                }
              }
            }}
            style={{ width: '100%', alignItems: 'center' }}
          />
        </View>
      </View>

      {showExitConfirm && (
        <View style={[StyleSheet.absoluteFill, styles.exitOverlay]}>
          <Text style={[styles.exitTitle, { color: theme.text, fontFamily: 'CormorantGaramond-Medium' }]}>
            {Math.floor((totalWorkSeconds - secondsLeft) / 60)} minutes of deep focus is rare and valuable.
          </Text>

          <TouchableOpacity
            style={[styles.stayBtn, { backgroundColor: theme.primary }]}
            onPress={() => setShowExitConfirm(false)}
          >
            <Text style={[styles.stayBtnText, { color: theme.background }]}>
              Stay in flow
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.endBtn}
            onPress={() => {
              setShowExitConfirm(false);
              stop();
              router.replace('/');
            }}
          >
            <Text style={[styles.endBtnText, { color: theme.textMuted }]}>
              Yes, end session
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  flowBanner: {
    position: 'absolute',
    top: 60,
    left: 0, right: 0,
    alignItems: 'center',
    zIndex: 50,
  },
  flowBannerText: {
    fontSize: 18,
    letterSpacing: 1,
    opacity: 0.9,
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  intentionWatermark: {
    position: 'absolute',
    fontSize: 22,
    opacity: 0.08,
    textAlign: 'center',
    width: 260,
    zIndex: 0,
    lineHeight: 30,
  },
  timerWrapper: {
    position: 'relative',
    zIndex: 1,
  },
  timeText: {
    fontSize: 42,
    letterSpacing: 2,
  },
  phaseLabel: {
    fontSize: 13,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  exitOverlay: {
    backgroundColor: 'rgba(0,0,0,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    zIndex: 200,
  },
  exitTitle: {
    fontSize: 22,
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 40,
  },
  stayBtn: {
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    width: '80%',
    alignItems: 'center',
  },
  stayBtnText: {
    fontSize: 18,
    fontFamily: 'DMSans-Medium',
  },
  endBtn: {
    padding: 12,
  },
  endBtnText: {
    fontSize: 14,
  },
});
