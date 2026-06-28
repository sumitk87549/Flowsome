// src/screens/TransitionScreen.tsx
import React, { useEffect, useRef } from 'react';
import { StyleSheet, BackHandler, Pressable, Text } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  interpolateColor,
  Easing,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { COLORS } from '@/constants/colors';
import { FONT, FS, TRACKING } from '@/constants/typography';
import {
  TRANSITION_HAPTIC_1_DELAY,
  TRANSITION_HAPTIC_2_DELAY,
  TRANSITION_BG_START_DELAY,
  TRANSITION_BG_DURATION,
  TRANSITION_AMBIENT_START,
  TRANSITION_REST_LABEL_DELAY,
  TRANSITION_REST_LABEL_IN,
  TRANSITION_MODE_LABEL_DELAY,
  TRANSITION_MODE_LABEL_IN,
  TRANSITION_NAVIGATE_DELAY,
} from '@/constants/timing';
import { useHaptic } from '@/hooks/useHaptic';
import { useSession } from '@/context/SessionContext';
import { useSettings } from '@/context/SettingsContext';
import { useAmbientSound } from '@/hooks/useAmbientSound';
import { useBell } from '@/utils/bellPlayer';
import type { RootStackParamList } from '@/types/navigation';
import type { RestMode } from '@/types/session';

// Human-readable display names for each rest mode
const REST_MODE_DISPLAY_NAMES: Record<RestMode, string> = {
  eyesAway:       'Eyes Away',
  listen:         'Listen',
  quietListening: 'Quiet Listening',
  breatheAndDrift:'Breathe & Drift',
  quickSettle:    'Quick Settle',
  moveAndSee:     'Move & See',
  move:           'Move',
  senseAndGround: 'Sense & Ground',
  storyMoment:    'Story Moment',
  storyGarden:    'Story Garden',
  memory:         'Memory',
  walk:           'Walk',
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function TransitionScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { fire } = useHaptic();
  const session = useSession();
  const { settings } = useSettings();
  const ambient = useAmbientSound();
  const workEndBell = useBell('work_end');

  // ⚠️ Determine next rest mode at mount time, not in a timeout
  const nextRestModeRef = useRef<RestMode>(session.getNextRestMode());

  // Timeout cleanup ref — all scheduled timeouts go in here
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const schedule = (fn: () => void, delay: number) => {
    timeoutsRef.current.push(setTimeout(fn, delay));
  };

  // ----- Animated values -----

  // Background color progress: 0 = work-end blue (#1F2337), 1 = forest night (#141E1A)
  const bgProgress = useSharedValue(0);

  const restLabelOpacity = useSharedValue(0);
  const restLabelTranslateY = useSharedValue(8);

  // Mode name label
  const modeLabelOpacity = useSharedValue(0);

  // Buttons for non-auto
  const buttonsOpacity = useSharedValue(0);

  // ----- Animated styles -----

  const backgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      bgProgress.value,
      [0, 1],
      [COLORS.workBg_23min, COLORS.forestNight]  // from work-end color to forest night
    ),
  }));

  const restLabelStyle = useAnimatedStyle(() => ({
    opacity: restLabelOpacity.value,
    transform: [{ translateY: restLabelTranslateY.value }],
  }));

  const modeLabelStyle = useAnimatedStyle(() => ({
    opacity: modeLabelOpacity.value,
  }));

  const buttonsStyle = useAnimatedStyle(() => ({
    opacity: buttonsOpacity.value,
  }));

  // ----- Main sequence -----

  useEffect(() => {
    // 0. Disable back button
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });

    // T = 0ms — First heavy haptic (work session end pulse)
    // Also the "hand on shoulder" first beat
    fire(Haptics.ImpactFeedbackStyle.Heavy, true); // isTransition: true
    workEndBell.play();

    // T = 600ms — Second heavy haptic (the echo pulse)
    schedule(() => {
      fire(Haptics.ImpactFeedbackStyle.Heavy, true);
    }, TRANSITION_HAPTIC_2_DELAY);

    // T = 1000ms — Begin background color transition from work-blue to forest-night
    schedule(() => {
      bgProgress.value = withTiming(1, {
        duration: TRANSITION_BG_DURATION,
        easing: Easing.inOut(Easing.quad),
      });
    }, TRANSITION_BG_START_DELAY);

    // T = 2600ms — Begin ambient sound fade-in
    schedule(() => {
      ambient.startAmbient(4000);
    }, TRANSITION_AMBIENT_START);

    // T = 3000ms — Show "Rest" label with fade-in + rise
    schedule(() => {
      restLabelOpacity.value = withTiming(1, {
        duration: TRANSITION_REST_LABEL_IN,
        easing: Easing.out(Easing.quad),
      });
      restLabelTranslateY.value = withTiming(0, {
        duration: TRANSITION_REST_LABEL_IN,
        easing: Easing.out(Easing.quad),
      });
    }, TRANSITION_REST_LABEL_DELAY);

    // T = 4400ms — Show rest mode name below "Rest"
    schedule(() => {
      modeLabelOpacity.value = withTiming(1, {
        duration: TRANSITION_MODE_LABEL_IN,
        easing: Easing.out(Easing.quad),
      });
      if (!settings.autoStartRest) {
        buttonsOpacity.value = withTiming(1, {
          duration: TRANSITION_MODE_LABEL_IN,
          easing: Easing.out(Easing.quad),
        });
      }
    }, TRANSITION_MODE_LABEL_DELAY);

    // T = 5200ms — Navigate to RestExperience (if autoStartRest is true)
    if (settings.autoStartRest) {
      schedule(() => {
        navigation.navigate('RestExperience', {
          mode: nextRestModeRef.current,
          duration: settings.shortRestDuration,
        });
      }, TRANSITION_NAVIGATE_DELAY);
    }

    // Cleanup: cancel all pending timeouts if screen unmounts early
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      backHandler.remove();
    };
  }, []); // empty deps — runs once on mount

  const modeDisplayName = REST_MODE_DISPLAY_NAMES[nextRestModeRef.current] ?? 'Rest';

  return (
    <Animated.View style={[styles.container, backgroundStyle]}>
      {/* "Rest" — the main word, large, gentle */}
      <Animated.Text style={[styles.restLabel, restLabelStyle]}>
        Rest
      </Animated.Text>

      {/* Mode name — smaller, below "Rest", 55% opacity */}
      <Animated.Text style={[styles.modeLabel, modeLabelStyle]}>
        {modeDisplayName}
      </Animated.Text>

      {!settings.autoStartRest && (
        <Animated.View style={[styles.buttonsContainer, buttonsStyle]}>
          <Pressable 
            style={styles.primaryButton}
            onPress={() => {
              navigation.navigate('RestExperience', {
                mode: nextRestModeRef.current,
                duration: settings.shortRestDuration,
              });
            }}
          >
            <Text style={styles.primaryButtonText}>Begin Rest</Text>
          </Pressable>
          
          <Pressable 
            style={styles.secondaryButton}
            onPress={() => {
              // skip rest => return prompt
              navigation.navigate('ReturnPrompt', {
                sessionNumber: session.currentCycleNumber,
                totalSessions: session.totalCycles,
              });
            }}
          >
            <Text style={styles.secondaryButtonText}>Skip Rest</Text>
          </Pressable>
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restLabel: {
    fontFamily: FONT.thin,
    fontSize: 52,
    color: COLORS.cream,
    letterSpacing: TRACKING.base,
    marginBottom: 16,
  },
  modeLabel: {
    fontFamily: FONT.light,
    fontSize: 14,
    color: COLORS.cream,
    letterSpacing: TRACKING.base,
    opacity: 0.55,
  },
  buttonsContainer: {
    marginTop: 64,
    width: '100%',
    paddingHorizontal: 40,
    gap: 16,
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
  },
  primaryButtonText: {
    fontFamily: FONT.regular,
    fontSize: FS.base,
    color: COLORS.cream,
    letterSpacing: 0.5,
  },
  secondaryButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontFamily: FONT.regular,
    fontSize: FS.base,
    color: COLORS.cream,
    opacity: 0.6,
    letterSpacing: 0.5,
  }
});
