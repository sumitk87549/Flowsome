// app/(sessions)/focus/session.tsx
import { View, useWindowDimensions, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as KeepAwake from 'expo-keep-awake';
import {
  useSharedValue,
  withTiming,
  useDerivedValue,
  interpolateColor,
  useAnimatedStyle,
  withSequence,
  cancelAnimation,
} from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import { SafeScreen } from '../../../components/ui/SafeScreen';
import AmbientWave from '../../../components/focus/AmbientWave';
import { FlowText } from '../../../components/ui/FlowText';
import { FlowButton } from '../../../components/ui/FlowButton';
import { CircularTimer } from '../../../components/timer/CircularTimer';
import { ParticleCanvas } from '../../../components/particles/ParticleCanvas';
import { useAmbientAudio, useBinauralAudio } from '../../../hooks/useAudio';
import { useTimer } from '../../../hooks/useTimer';
import { useAppStore } from '../../../store/appStore';
import { useTheme, useThemeConfig } from '../../../hooks/useTheme';
import { useSessionStore } from '../../../store/sessionStore';
import { useSettingsStore } from '../../../store/settingsStore';
import { FOCUS_MODES } from '../../../constants/focus-modes';
import { formatTime } from '../../../utils/timeUtils';
import { HapticUtils } from '../../../utils/hapticUtils';
import { QUOTES } from '../../../constants/quotes';

export default function FocusSession() {
  const router = useRouter();
  const navigation = useNavigation();
  const theme = useTheme();
  const themeConfig = useThemeConfig();
  const activeThemeName = themeConfig.name;
  const { activeTheme } = useAppStore();
  const intention = useSessionStore((s) => s.intention);
  const { keepAwakeEnabled, language } = useSettingsStore();
  const params = useLocalSearchParams<{ modeId: string; workMin: string; breakMin: string; intention: string }>();

  const focusMode = FOCUS_MODES.find(m => m.id === params.modeId) ?? FOCUS_MODES[0];
  const workMin = parseInt(params.workMin ?? String(focusMode.defaultWorkMinutes), 10);

  const { width } = useWindowDimensions();

  const bgPhase = useSharedValue(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [completionCountdown, setCompletionCountdown] = useState(5);
  const [accomplishment, setAccomplishment] = useState('');
  const completionBgOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const sessionDurationSeconds = (workMin ?? 25) * 60;
  const totalSessionMinutes = Math.floor(sessionDurationSeconds / 60);

  const { status, phase, secondsLeft, progressShared, start, pause, resume, stop } = useTimer({
    workMinutes: workMin,
    breakMinutes: 0,
    totalPomodoros: 1,
    onAllComplete: () => {
      HapticUtils.success();
    },
  });

  const themeQuotes = QUOTES[activeTheme] || QUOTES['rajasthan'];
  const activeQuote = themeQuotes[0];

  useAmbientAudio(activeTheme, true);
  useBinauralAudio(focusMode.binauralMode, status === 'running');

  useEffect(() => {
    if (keepAwakeEnabled) KeepAwake.activateKeepAwakeAsync();
    return () => { KeepAwake.deactivateKeepAwake(); };
  }, [keepAwakeEnabled]);

  useEffect(() => {
    const t = setTimeout(() => { start(); }, 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (status === 'running') {
      bgPhase.value = withTiming(1, { duration: sessionDurationSeconds * 1000 });
    }
    return () => {
      cancelAnimation(bgPhase);
    };
  }, [status]);

  const bgColor = useDerivedValue(() =>
    interpolateColor(
      bgPhase.value,
      [0, 0.5, 1],
      ['#060A12', '#060C0A', '#0A0612'],
    )
  );

  const bgStyle = useAnimatedStyle(() => ({
    backgroundColor: bgColor.value,
  }));

  useEffect(() => {
    if (status === 'complete' && !showCompletion) {
      setShowCompletion(true);

      completionBgOpacity.value = withTiming(1, { duration: 2000 });
      textOpacity.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(1, { duration: 1000 }),
      );

      const interval = setInterval(() => {
        setCompletionCountdown((c) => {
          if (c <= 1) {
            clearInterval(interval);
            router.replace('/');
            return 0;
          }
          return c - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status]);

  const completionBgStyle = useAnimatedStyle(() => ({
    opacity: completionBgOpacity.value,
    backgroundColor: theme.background,
  }));
  const completionTextStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
      if (status === 'running') {
        e.preventDefault();
        setShowExitConfirm(true);
      }
    });
    return unsubscribe;
  }, [navigation, status]);

  const saveAccomplishmentNote = async (note: string, minutes: number) => {
    try {
      const key = `flowsome:accomplishment:${Date.now()}`;
      await AsyncStorage.setItem(
        key,
        JSON.stringify({ note, minutes, date: new Date().toISOString() })
      );
    } catch (_) {}
  };

  const phaseLabel =
    status === 'complete' ? (language === 'hi-IN' ? '✅ पूर्ण' : '✅ Complete') :
    phase === 'work' ? (language === 'hi-IN' ? '🎯 ध्यान केंद्रित' : '🎯 Focus') :
    'Ready';

  return (
    <View style={{ flex: 1 }}>
      <Animated.View style={[StyleSheet.absoluteFill, bgStyle]} />

      <View style={styles.waveContainer}>
        <AmbientWave width={width} color={theme.text} />
      </View>

      <View style={styles.timerBlock}>
        {intention ? (
          <Text
            style={[
              styles.intentionWatermark,
              { color: theme.text, fontFamily: 'CormorantGaramond-Italic' },
            ]}
          >
            {intention}
          </Text>
        ) : null}

        <Text
          style={[
            styles.focusTime,
            { color: theme.text, fontFamily: 'CormorantGaramond-Light' },
          ]}
        >
          {formatTime(secondsLeft)}
        </Text>
        <Text style={[styles.focusPhase, { color: theme.textMuted }]}>
          DEEP WORK
        </Text>
      </View>

      <View style={{ paddingBottom: 80, alignItems: 'center', width: '100%' }}>
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
          {status === 'complete' && (
            <FlowText variant="heading" size="xl" color={theme.primary}>
              {language === 'hi-IN' ? 'शानदार सत्र! 🎉' : 'Great session! 🎉'}
            </FlowText>
          )}
          <FlowButton
            label="End Session"
            variant="ghost"
            onPress={() => { stop(); router.back(); }}
            style={{ width: '100%', alignItems: 'center' }}
          />
        </View>
      </View>

      {showExitConfirm && (
        <View style={[StyleSheet.absoluteFill, styles.exitOverlay]}>
          <Text
            style={[
              styles.exitTitle,
              { color: theme.text, fontFamily: 'CormorantGaramond-Medium' },
            ]}
          >
            {`${Math.floor((sessionDurationSeconds - secondsLeft) / 60)} minutes of deep focus is rare and valuable.`}
          </Text>

          <TouchableOpacity
            style={[styles.stayBtn, { backgroundColor: theme.primary }]}
            onPress={() => setShowExitConfirm(false)}
          >
            <Text style={[styles.stayBtnText, { color: theme.background }]}>
              Keep going
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.endBtn}
            onPress={() => {
              setShowExitConfirm(false);
              router.replace('/');
            }}
          >
            <Text style={[styles.endBtnText, { color: theme.textMuted }]}>
              End session
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {showCompletion && (
        <Animated.View
          style={[StyleSheet.absoluteFill, completionBgStyle, styles.completionScreen]}
        >
          <Animated.View style={[completionTextStyle, styles.completionContent]}>
            <Text
              style={[
                styles.sankritTerm,
                { color: theme.primary, fontFamily: 'CormorantGaramond-Italic' },
              ]}
            >
              Dharaṇā
            </Text>
            <Text style={[styles.sankritSub, { color: theme.textMuted }]}>
              Sustained concentration
            </Text>

            <Text
              style={[
                styles.completionDuration,
                { color: theme.text, fontFamily: 'CormorantGaramond-Light' },
              ]}
            >
              {totalSessionMinutes} minutes
            </Text>
            <Text style={[styles.completionRegion, { color: theme.textMuted }]}>
              {activeThemeName}
            </Text>

            <TextInput
              style={[
                styles.accomplishmentInput,
                {
                  color: theme.text,
                  borderBottomColor: theme.cardBorder,
                  fontFamily: 'DMSans-Regular',
                },
              ]}
              placeholder="What did you accomplish?"
              placeholderTextColor={theme.textMuted}
              value={accomplishment}
              onChangeText={setAccomplishment}
              onSubmitEditing={() => {
                if (accomplishment.trim()) {
                  saveAccomplishmentNote(accomplishment.trim(), totalSessionMinutes);
                }
                router.replace('/');
              }}
              returnKeyType="done"
              maxLength={120}
            />

            <TouchableOpacity onPress={() => router.replace('/')}>
              <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 20 }}>
                {`Continuing in ${completionCountdown}s · tap to return`}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  waveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  timerBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  intentionWatermark: {
    position: 'absolute',
    fontSize: 28,
    opacity: 0.07,
    textAlign: 'center',
    width: '85%',
    lineHeight: 36,
  },
  focusTime: {
    fontSize: 72,
    letterSpacing: -2,
  },
  focusPhase: {
    fontSize: 11,
    letterSpacing: 5,
    marginTop: 8,
    fontFamily: 'DMSans-Regular',
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
  completionScreen: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
  },
  completionContent: {
    alignItems: 'center',
    paddingHorizontal: 32,
    width: '100%',
  },
  sankritTerm: {
    fontSize: 48,
    letterSpacing: 2,
  },
  sankritSub: {
    fontSize: 14,
    letterSpacing: 2,
    marginBottom: 40,
  },
  completionDuration: {
    fontSize: 56,
    letterSpacing: -1,
  },
  completionRegion: {
    fontSize: 13,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginTop: 4,
    marginBottom: 32,
  },
  accomplishmentInput: {
    width: '100%',
    borderBottomWidth: 1,
    paddingVertical: 12,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24,
  },
});

