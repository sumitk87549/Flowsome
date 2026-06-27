import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, Platform } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import * as NavigationBar from 'expo-navigation-bar';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAudioPlayer } from 'expo-audio';

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

const formatTime = (value: number): string => {
  return value < 10 ? `0${value}` : `${value}`;
};

export default function WorkSessionScreen() {
  const navigation = useNavigation<WorkSessionNavProp>();
  const route = useRoute<WorkSessionRouteProp>();
  const { settings } = useSettings();
  const session = useSession();
  const { fire } = useHaptic();

  // Extract intentionWord from navigation params. It may be undefined.
  const intentionWord = route.params?.intentionWord;

  // Pause state — use useState here because the UI needs to react to it
  const [isPaused, setIsPaused] = useState(false);

  // Pause overlay opacity — use React Native's Animated.Value
  const pauseOverlayOpacity = useRef(new Animated.Value(0)).current;

  // Audio player for bell sound
  const bellPlayer = useAudioPlayer(require('../../assets/sounds/bell-work-start.mp3'));

  const handleSessionComplete = useCallback(() => {
    session.completeSession();
    navigation.navigate('WorkRestTransition' as any); // Or 'Transition' if defined in types
  }, [session, navigation]);

  const timer = useSessionTimer({
    durationMinutes: settings.workDuration,
    onComplete: handleSessionComplete,
  });

  useEffect(() => {
    // 1. Activate keep-awake so screen doesn't dim
    activateKeepAwakeAsync();

    // 2. Hide Android navigation bar
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
    }

    // 3. Call SessionContext to record session start
    session.startSession(intentionWord);

    // 4. Fire entry haptic (medium, this is a transition moment)
    fire(Haptics.ImpactFeedbackStyle.Medium, true);

    // 5. Play bell sound on entry (only for 'full' or 'still' sensory profiles)
    if (settings.sensoryProfile === 'full' || settings.sensoryProfile === 'still') {
      bellPlayer.play();
    }

    // Cleanup: runs when screen unmounts
    return () => {
      deactivateKeepAwake();
      if (Platform.OS === 'android') {
        NavigationBar.setVisibilityAsync('visible');
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePausePress = () => {
    fire(Haptics.ImpactFeedbackStyle.Light, false);
    if (isPaused) {
      // Resuming
      timer.resume();
      setIsPaused(false);
      Animated.timing(pauseOverlayOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      // Pausing
      timer.pause();
      setIsPaused(true);
      Animated.timing(pauseOverlayOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <View style={styles.container}>
      {/* Hide status bar */}
      <ExpoStatusBar hidden={true} />

      {/* LAYER 1 — Background */}
      <View style={styles.backgroundLayer} />

      {/* LAYER 2 — Skia Canvas Placeholder */}
      <View style={styles.canvasPlaceholder} />

      {/* LAYER 3 — Intention Word Watermark */}
      {intentionWord ? (
        <Text style={styles.intentionWatermark} numberOfLines={1}>
          {intentionWord}
        </Text>
      ) : null}

      {/* LAYER 4 — Timer Display */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerDigits}>
          {formatTime(timer.display.minutes)}
        </Text>
        <Text style={styles.timerColon}>:</Text>
        <Text style={styles.timerDigits}>
          {formatTime(timer.display.seconds)}
        </Text>
      </View>

      {/* LAYER 5 — Pause Button (top right) */}
      <Pressable
        style={styles.pauseButton}
        onPress={handlePausePress}
        hitSlop={{ top: 16, right: 16, bottom: 16, left: 16 }}
      >
        <Text style={styles.pauseButtonText}>
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
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  // LAYER 1 - Root container doubles as background
  container: {
    flex: 1,
    backgroundColor: COLORS.workBlue,
  },

  // Also used as background layer (explicit layer 1 view)
  backgroundLayer: {
    ...StyleSheet.absoluteFill,
    backgroundColor: COLORS.workBlue,
    zIndex: 0,
  },

  // LAYER 2 - Canvas placeholder (invisible)
  canvasPlaceholder: {
    ...StyleSheet.absoluteFill,
    zIndex: 1,
  },

  // LAYER 3 - Intention watermark
  intentionWatermark: {
    position: 'absolute',
    top: '57%',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontFamily: FONT.thin,
    fontSize: 130,
    color: COLORS.warmWhite,
    opacity: 0.05,
    zIndex: 2,
  },

  // LAYER 4 - Timer display container
  timerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },

  timerDigits: {
    fontFamily: FONT.thin,
    fontSize: 88,
    fontVariant: ['tabular-nums'],
    color: COLORS.warmWhite,
    opacity: 1.0,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  timerColon: {
    fontFamily: FONT.thin,
    fontSize: 88,
    color: COLORS.warmWhite,
    opacity: 0.55,
    includeFontPadding: false,
    textAlignVertical: 'center',
    marginHorizontal: 2,
  },

  // LAYER 5 - Pause button (top right corner)
  pauseButton: {
    position: 'absolute',
    top: 56,
    right: 24,
    zIndex: 5,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  pauseButtonText: {
    fontSize: 20,
    color: COLORS.warmWhite,
    opacity: 0.6,
  },

  // LAYER 6 - Pause overlay (full screen dark veil)
  pauseOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.62)',
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  pausedLabel: {
    fontFamily: FONT.light,
    fontSize: FS.lg,
    color: COLORS.warmWhite,
    letterSpacing: 4,
    marginBottom: 32,
    opacity: 0.85,
  },

  resumeButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(232, 223, 208, 0.35)',
    borderRadius: 4,
  },

  resumeButtonText: {
    fontFamily: FONT.light,
    fontSize: FS.md,
    color: COLORS.warmWhite,
    letterSpacing: 2,
    opacity: 0.8,
  },
});
