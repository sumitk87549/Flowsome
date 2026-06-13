// Sprint 9 — app/(sessions)/meditation/session.tsx
import { View, Animated, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as KeepAwake from 'expo-keep-awake';
import { useSharedValue } from 'react-native-reanimated';
import { SafeScreen } from '../../../components/ui/SafeScreen';
import MandalaView from '../../../components/meditation/MandalaView';
import TratakaFlame from '../../../components/meditation/TratakaFlame';
import { FlowText } from '../../../components/ui/FlowText';
import { FlowButton } from '../../../components/ui/FlowButton';
import { ParticleCanvas } from '../../../components/particles/ParticleCanvas';
import { useAmbientAudio, useBinauralAudio, useSFX } from '../../../hooks/useAudio';
import { useSpeech } from '../../../hooks/useSpeech';
import { MEDITATION_TYPES } from '../../../constants/meditation-types';
import { useTimer } from '../../../hooks/useTimer';
import { useAppStore } from '../../../store/appStore';
import { useSessionStore } from '../../../store/sessionStore';
import { useTheme } from '../../../hooks/useTheme';
import { useSettingsStore } from '../../../store/settingsStore';
import { formatTime } from '../../../utils/timeUtils';
import { HapticUtils } from '../../../utils/hapticUtils';
import { QUOTES, getQuoteForSession } from '../../../constants/quotes';
import { useHistoryStore } from '../../../store/historyStore';
import { checkAndAwardBadges } from '../../../utils/achievementUtils';

export default function MeditationSession() {
  const router = useRouter();
  const theme = useTheme();
  const { activeTheme } = useAppStore();
  const selectedMeditationId = useSessionStore((s) => s.selectedMeditationId);
  const { keepAwakeEnabled, language } = useSettingsStore();
  const params = useLocalSearchParams<{ typeId: string; durationMin: string }>();

  const meditationType = MEDITATION_TYPES.find(t => t.id === params.typeId) ?? MEDITATION_TYPES[0];
  const durationMin = parseInt(params.durationMin ?? '10', 10);

  const { speak } = useSpeech();
  const { playSingingBowl, playSessionBegin, playSessionEnd } = useSFX();

  const [timerVisible, setTimerVisible] = useState(false);
  const [hasDiscoveredToggle, setHasDiscoveredToggle] = useState(false);
  const hintOpacity = useState(() => new Animated.Value(0))[0];

  const addSession = useHistoryStore((s) => s.addSession);
  const awardBadge = useHistoryStore((s) => s.awardBadge);
  const showBadgeToast = useCallback((_badge: any) => {}, []);

  const totalSessionSeconds = durationMin * 60;

  const { status, secondsLeft, progress, progressShared, start, pause, resume, stop } = useTimer({
    workMinutes: durationMin,
    breakMinutes: 0,
    totalPomodoros: 1,
    onAllComplete: () => {
      playSingingBowl();
      HapticUtils.success();
      playSessionEnd();
    },
  });

  const themeQuotes = QUOTES.filter((q) => q.region === activeTheme || q.region === 'all');
  const activeQuote = themeQuotes.length > 0 ? themeQuotes[0] : QUOTES[0];

  const completionQuote = useMemo(
    () => getQuoteForSession('meditation', activeTheme),
    [activeTheme],
  );

  useAmbientAudio(activeTheme, true);
  const binauralPlayer = useBinauralAudio(meditationType.binauralMode, status === 'running');

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
    if (keepAwakeEnabled) KeepAwake.activateKeepAwakeAsync();
    return () => { KeepAwake.deactivateKeepAwake(); };
  }, [keepAwakeEnabled]);

  useEffect(() => {
    const t = setTimeout(() => {
      start();
      playSingingBowl();
      setTimeout(() => speak(meditationType.ttsIntroEn), 2000);
    }, 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (status === 'complete') {
      addSession({
        type: 'meditation',
        durationMinutes: Math.max(1, Math.floor(totalSessionSeconds / 60)),
        theme: activeTheme,
        practiceId: selectedMeditationId ?? null,
        intention: null,
        moodBefore: null,
        moodAfter: null,
        accomplishmentNote: null,
      });
      checkAndAwardBadges(awardBadge, showBadgeToast);

      const t = setTimeout(() => router.replace('/' as any), 4000);
      return () => clearTimeout(t);
    }
  }, [status]);

  useEffect(() => {
    AsyncStorage.getItem('flowsome:meditation:timerDiscovered').then((val) => {
      if (val === 'true') setHasDiscoveredToggle(true);
    });
  }, []);

  useEffect(() => {
    if (!hasDiscoveredToggle) {
      const timer = setTimeout(() => {
        Animated.sequence([
          Animated.timing(hintOpacity, { toValue: 0.6, duration: 600, useNativeDriver: true }),
          Animated.timing(hintOpacity, { toValue: 0.6, duration: 4000, useNativeDriver: true }),
          Animated.timing(hintOpacity, { toValue: 0, duration: 600, useNativeDriver: true }),
        ]).start();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [hasDiscoveredToggle]);

  const toggleTimer = () => {
    setTimerVisible((v) => !v);
    if (!hasDiscoveredToggle) {
      setHasDiscoveredToggle(true);
      AsyncStorage.setItem('flowsome:meditation:timerDiscovered', 'true');
    }
  };

  return (
    <SafeScreen>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={toggleTimer}
        activeOpacity={1}
      >
        <LinearGradient
          colors={[theme.gradientStart, theme.gradientEnd]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
        <ParticleCanvas />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 60 }}>
          <View style={{ alignItems: 'center', gap: 4, paddingHorizontal: 24 }}>
            <FlowText variant="heading" size="2xl" color={theme.primary}>
              {language === 'hi-IN' ? meditationType.nameHindi : meditationType.name}
            </FlowText>
            <FlowText size="sm" color={theme.textMuted}>{durationMin} min</FlowText>
            {status !== 'complete' && (
              <FlowText size="xs" color={theme.textMuted} style={{ textAlign: 'center', fontStyle: 'italic', marginTop: 10, lineHeight: 18, opacity: 0.85 }}>
                "{language === 'hi-IN' ? activeQuote.textHindi : activeQuote.text}"
              </FlowText>
            )}
            {status === 'complete' && (
              <>
                <FlowText variant="heading" size="xl" color={theme.primary} style={{ marginTop: 8 }}>
                  {language === 'hi-IN' ? '🙏 सत्र पूर्ण' : '🙏 Session Complete'}
                </FlowText>
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
              </>
            )}
          </View>

          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            {timerVisible && (
              <View style={styles.timerArea}>
                <FlowText variant="heading" size="4xl" color={theme.primary}>
                  {formatTime(secondsLeft)}
                </FlowText>
              </View>
            )}

            {selectedMeditationId === 'trataka' ? (
              <View style={styles.tratakaContainer}>
                <View style={[StyleSheet.absoluteFill, { backgroundColor: '#000000' }]} />
                <TratakaFlame isActive={status === 'running'} />
                <Text
                  style={[
                    styles.tratakaLabel,
                    { color: 'rgba(255,255,255,0.3)' },
                  ]}
                >
                  Fix your gaze gently on the flame
                </Text>
              </View>
            ) : (
              <MandalaView
                progress={progressShared}
                meditationType={selectedMeditationId}
                theme={theme}
                size={280}
              />
            )}
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
              label="End"
              variant="ghost"
              onPress={() => { stop(); router.canGoBack() ? router.back() : router.replace('/'); }}
              style={{ width: '100%', alignItems: 'center' }}
            />
          </View>

          {!hasDiscoveredToggle && (
            <Animated.Text
              style={[
                styles.hintText,
                { color: theme.textMuted, opacity: hintOpacity },
              ]}
            >
              Tap to reveal timer
            </Animated.Text>
          )}
        </View>
      </TouchableOpacity>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  timerArea: {
    position: 'absolute',
    top: '15%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  hintText: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 12,
    letterSpacing: 1.5,
    fontFamily: 'DMSans-Regular',
  },
  tratakaContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tratakaLabel: {
    marginTop: 40,
    fontSize: 13,
    letterSpacing: 1,
    fontFamily: 'DMSans-Regular',
  },
});
