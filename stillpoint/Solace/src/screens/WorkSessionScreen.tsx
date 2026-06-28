import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, Platform, BackHandler } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import * as NavigationBar from 'expo-navigation-bar';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAudioPlayer } from 'expo-audio';
import { WorkSessionCanvas } from '@/components/focus/WorkSessionCanvas';
import { useWorkSessionBackground } from '@/hooks/useWorkSessionBackground';
import TimerDisplay from '@/components/focus/TimerDisplay';
import { useBell } from '@/utils/bellPlayer';
import { ConfirmSheet } from '@/components/shared/ConfirmSheet';
import { PeacefulBackground } from '@/components/shared/PeacefulBackground';
import { useTheme } from '@/design/theme';

import { useSessionTimer } from '@/hooks/useSessionTimer';
import { useSettings } from '@/context/SettingsContext';
import { useSession } from '@/context/SessionContext';
import { useHaptic } from '@/hooks/useHaptic';
import { COLORS } from '@/constants/colors';
import { FONT, FS } from '@/constants/typography';
import * as Haptics from 'expo-haptics';
import { RootStackParamList } from '@/types/navigation';

type WorkSessionRouteProp = RouteProp<RootStackParamList, 'WorkSession'>;
type WorkSessionNavProp = NativeStackNavigationProp<RootStackParamList, 'WorkSession'>;

export default function WorkSessionScreen() {
  const navigation = useNavigation<WorkSessionNavProp>();
  const route = useRoute<WorkSessionRouteProp>();
  const { settings } = useSettings();
  const session = useSession();
  const { fire } = useHaptic();
  const theme = useTheme();
  const isNight = theme.mode === 'night';

  const intentionWord = route.params?.intentionWord;

  const [isPaused, setIsPaused] = useState(false);
  const [isSessionEnding, setIsSessionEnding] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  const pauseOverlayOpacity = useRef(new Animated.Value(0)).current;
  const workStartBell = useBell('work_start');

  const handleSessionComplete = useCallback(() => {
    setIsSessionEnding(true);
    session.completeSession();
    navigation.navigate('WorkRestTransition' as any);
  }, [session, navigation]);

  const timer = useSessionTimer({
    durationMinutes: settings.workDuration,
    onComplete: handleSessionComplete,
  });

  const sessionDurationMs = settings.workDuration * 60 * 1000;
  const sessionStartMs = useRef(Date.now()).current;
  const backgroundAnimatedStyle = useWorkSessionBackground(sessionDurationMs, sessionStartMs);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      setShowEndConfirm(true);
      return true;
    });

    activateKeepAwakeAsync();

    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
    }

    session.startSession(intentionWord);
    fire(Haptics.ImpactFeedbackStyle.Medium, true);
    workStartBell.play();

    return () => {
      deactivateKeepAwake();
      if (Platform.OS === 'android') {
        NavigationBar.setVisibilityAsync('visible');
      }
      backHandler.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePausePress = () => {
    fire(Haptics.ImpactFeedbackStyle.Light, false);
    if (isPaused) {
      timer.resume();
      setIsPaused(false);
      Animated.timing(pauseOverlayOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      timer.pause();
      setIsPaused(true);
      Animated.timing(pauseOverlayOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleEndSession = () => {
    setShowEndConfirm(false);
    timer.pause();
    navigation.navigate('Home');
  };

  // Theme-aware colors
  const pauseBtnBg = isNight
    ? 'rgba(241,233,218,0.12)'
    : 'rgba(37,35,31,0.10)';
  const pauseBtnColor = isNight ? '#F1E9DA' : '#25231F';
  const cycleTextColor = isNight ? 'rgba(241,233,218,0.60)' : 'rgba(37,35,31,0.55)';
  const watermarkColor = isNight ? 'rgba(241,233,218,0.04)' : 'rgba(37,35,31,0.05)';

  return (
    <View style={styles.container}>
      <ExpoStatusBar hidden={true} />

      {/* LAYER 1 — Background */}
      <PeacefulBackground isPaused={isPaused} />

      {/* LAYER 2 — Skia canvas rings */}
      <WorkSessionCanvas isSessionEnding={isSessionEnding} />

      {/* LAYER 3 — Intention Word Watermark (bottom, below timer) */}
      {intentionWord ? (
        <Text
          style={[styles.intentionWatermark, { color: watermarkColor }]}
          numberOfLines={1}
        >
          {intentionWord}
        </Text>
      ) : null}

      {/* LAYER 4 — Timer block: timer + cycle info stacked vertically, centered */}
      <View style={styles.timerBlock} pointerEvents="none">
        <TimerDisplay
          minutes={timer.display.minutes}
          seconds={timer.display.seconds}
        />
        {/* Cycle & next-rest info — BELOW the digits, not overlapping */}
        <View style={styles.sessionMeta}>
          <Text style={[styles.cycleProgressText, { color: cycleTextColor }]}>
            Cycle {session.currentCycleNumber} of {settings.sessionsUntilLongRest}
          </Text>
          <Text style={[styles.nextRestText, { color: cycleTextColor }]}>
            Next: {settings.shortRestDuration} min Rest
          </Text>
        </View>
      </View>

      {/* LAYER 5 — Pause Button (top right) */}
      <Pressable
        style={[styles.pauseButton, { backgroundColor: pauseBtnBg }]}
        onPress={handlePausePress}
        hitSlop={{ top: 16, right: 16, bottom: 16, left: 16 }}
      >
        <Text style={[styles.pauseButtonText, { color: pauseBtnColor }]}>
          {isPaused ? '▶' : '⏸'}
        </Text>
      </Pressable>

      {/* LAYER 6 — Pause Overlay */}
      <Animated.View
        style={[styles.pauseOverlay, { opacity: pauseOverlayOpacity }]}
        pointerEvents={isPaused ? 'auto' : 'none'}
      >
        <Text style={styles.pausedLabel}>Paused</Text>
        <Pressable onPress={handlePausePress} style={styles.resumeButton}>
          <Text style={styles.resumeButtonText}>Resume</Text>
        </Pressable>
        <Pressable
          onPress={() => setShowEndConfirm(true)}
          style={[styles.resumeButton, { marginTop: 20, borderColor: 'transparent' }]}
        >
          <Text style={[styles.resumeButtonText, { opacity: 0.55 }]}>End Session</Text>
        </Pressable>
      </Animated.View>

      <ConfirmSheet
        visible={showEndConfirm}
        title="End this focus session?"
        confirmLabel="End Session"
        cancelLabel="Cancel"
        onConfirm={handleEndSession}
        onCancel={() => setShowEndConfirm(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Intention watermark sits at the bottom quarter, not overlapping timer
  intentionWatermark: {
    position: 'absolute',
    bottom: '12%',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontFamily: FONT.thin,
    fontSize: 100,
    zIndex: 2,
  },

  // Timer block: vertically centered, stacked
  timerBlock: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 4,
  },

  // Session info sits BELOW the timer digits
  sessionMeta: {
    alignItems: 'center',
    marginTop: 16,
  },

  cycleProgressText: {
    fontFamily: FONT.medium,
    fontSize: 13,
    letterSpacing: 0.8,
  },

  nextRestText: {
    fontFamily: FONT.regular,
    fontSize: 12,
    marginTop: 4,
    letterSpacing: 0.3,
  },

  // Pause button — top right
  pauseButton: {
    position: 'absolute',
    top: 56,
    right: 24,
    zIndex: 5,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  pauseButtonText: {
    fontSize: 20,
  },

  // Pause overlay — full screen dark veil (always dark regardless of theme)
  pauseOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(10, 10, 14, 0.75)',
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  pausedLabel: {
    fontFamily: FONT.light,
    fontSize: FS.lg,
    color: '#F1E9DA',
    letterSpacing: 4,
    marginBottom: 32,
    opacity: 0.85,
  },

  resumeButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(241, 233, 218, 0.30)',
    borderRadius: 4,
  },

  resumeButtonText: {
    fontFamily: FONT.light,
    fontSize: FS.md,
    color: '#F1E9DA',
    letterSpacing: 2,
    opacity: 0.85,
  },
});
