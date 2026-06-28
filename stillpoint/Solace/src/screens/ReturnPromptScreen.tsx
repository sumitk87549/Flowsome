import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  withDelay,
  withTiming,
  withRepeat,
  withSequence,
  useAnimatedStyle,
  Easing,
  interpolateColor,
} from 'react-native-reanimated';
import { Canvas, Circle, RadialGradient, vec } from '@shopify/react-native-skia';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import { COLORS } from '@/constants/colors';
import { FONT } from '@/constants/typography';
import { useHaptic } from '@/hooks/useHaptic';
import { useSettings } from '@/context/SettingsContext';
import { useTheme } from '@/design/theme';
import {
  RETURN_BG_TRANSITION,
  RETURN_ORB_DELAY,
  RETURN_READY_DELAY,
  RETURN_READY_DURATION,
  RETURN_SUB_DELAY,
  RETURN_COUNTER_DELAY,
} from '@/constants/timing';
import { useBell } from '@/utils/bellPlayer';

type Props = NativeStackScreenProps<RootStackParamList, 'ReturnPrompt'>;

export default function ReturnPromptScreen({ navigation, route }: Props) {
  const { sessionNumber, totalSessions } = route.params;
  const { fire: hapticFire } = useHaptic();
  const { width } = useWindowDimensions();
  const theme = useTheme();
  const hapticTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bellTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const workStartBell = useBell('work_start');

  // Animation shared values
  const bgProgress = useSharedValue(0);     // 0 = forestNight, 1 = neutralDark
  const orbOpacity = useSharedValue(0);
  const orbScale = useSharedValue(0.96);
  const readyOpacity = useSharedValue(0);
  const readyTranslateY = useSharedValue(8);
  const subOpacity = useSharedValue(0);
  const counterOpacity = useSharedValue(0);

  useEffect(() => {
    // Background transitions from forestNight to neutralDark over RETURN_BG_TRANSITION
    bgProgress.value = withTiming(1, {
      duration: RETURN_BG_TRANSITION,
      easing: Easing.out(Easing.quad),
    });

    // Orb fades in
    orbOpacity.value = withDelay(RETURN_ORB_DELAY, withTiming(1, { duration: 600 }));

    // Orb breathes
    orbScale.value = withDelay(
      RETURN_ORB_DELAY + 600,
      withRepeat(
        withSequence(
          withTiming(1.04, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.96, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      ),
    );

    // "Ready?" fades in + rises
    readyOpacity.value = withDelay(RETURN_READY_DELAY, withTiming(1, {
      duration: RETURN_READY_DURATION,
      easing: Easing.out(Easing.quad),
    }));
    readyTranslateY.value = withDelay(RETURN_READY_DELAY, withTiming(0, {
      duration: RETURN_READY_DURATION,
      easing: Easing.out(Easing.quad),
    }));

    // Sub-label fades in
    subOpacity.value = withDelay(RETURN_SUB_DELAY, withTiming(1, { duration: 500 }));

    // Counter fades in
    counterOpacity.value = withDelay(RETURN_COUNTER_DELAY, withTiming(1, { duration: 500 }));

    return () => {
      if (hapticTimerRef.current) clearTimeout(hapticTimerRef.current);
      if (bellTimerRef.current) clearTimeout(bellTimerRef.current);
    };
  }, []);

  const bgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      bgProgress.value,
      [0, 1],
      [theme.colors.restBg, theme.colors.background],
    ),
  }));

  const orbStyle = useAnimatedStyle(() => ({
    opacity: orbOpacity.value,
    transform: [{ scale: orbScale.value }],
  }));

  const readyStyle = useAnimatedStyle(() => ({
    opacity: readyOpacity.value,
    transform: [{ translateY: readyTranslateY.value }],
  }));

  const subStyle = useAnimatedStyle(() => ({ opacity: subOpacity.value }));
  const counterStyle = useAnimatedStyle(() => ({ opacity: counterOpacity.value }));

  const handleReadyPress = () => {
    // Haptic at 300ms delay, isTransition: true
    import('expo-haptics').then((Haptics) => {
        hapticTimerRef.current = setTimeout(() => {
          hapticFire(Haptics.ImpactFeedbackStyle.Medium, true);
        }, 300);
    });

    bellTimerRef.current = setTimeout(() => {
      workStartBell.play();
    }, 300);

    navigation.navigate('WorkSession', { intentionWord: undefined });
  };

  const handleFinish = () => {
    navigation.navigate('Home');
  };

  const handleChangeIntention = () => {
    navigation.navigate('FocusIntention');
  };

  return (
    <Animated.View style={[styles.container, bgStyle]}>
      {/* Small ambient orb using Skia */}
      <Animated.View style={[styles.orbContainer, orbStyle]} pointerEvents="none">
        <Canvas style={{ width: width * 0.5, height: width * 0.5 }}>
          <Circle
            cx={width * 0.25}
            cy={width * 0.25}
            r={width * 0.18}
          >
            <RadialGradient
              c={vec(width * 0.25, width * 0.25)}
              r={width * 0.18}
              colors={[`${theme.colors.accent}33`, `${theme.colors.accent}00`]}
            />
          </Circle>
        </Canvas>
      </Animated.View>

      <Animated.Text style={[styles.readyText, readyStyle, { color: theme.colors.text }]}>
        Ready?
      </Animated.Text>

      <Animated.View style={[styles.buttonsContainer, subStyle]}>
        <Pressable style={[styles.button, { backgroundColor: theme.colors.surface }]} onPress={handleReadyPress}>
          <Text style={[styles.buttonText, { color: theme.colors.text }]}>Begin next focus</Text>
        </Pressable>
        <Pressable style={[styles.button, { backgroundColor: theme.colors.surface }]} onPress={handleChangeIntention}>
          <Text style={[styles.buttonText, { color: theme.colors.textMuted }]}>Change intention</Text>
        </Pressable>
        <Pressable style={styles.textButton} onPress={handleFinish}>
          <Text style={[styles.buttonText, { color: theme.colors.textMuted }]}>Finish for now</Text>
        </Pressable>
      </Animated.View>

      <Animated.Text style={[styles.counterText, counterStyle, { color: theme.colors.textMuted }]}>
        {`Session ${sessionNumber} of ${totalSessions}`}
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbContainer: {
    position: 'absolute',
    alignSelf: 'center',
    top: '25%',
  },
  tapArea: {
    width: '80%',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  readyText: {
    fontFamily: FONT.thin,
    fontSize: 48,
    letterSpacing: 3,
    marginBottom: 40,
  },
  buttonsContainer: {
    alignItems: 'center',
    gap: 16,
    width: '100%',
    paddingHorizontal: 32,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  textButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: FONT.regular,
    fontSize: 16,
    letterSpacing: 0.5,
  },
  counterText: {
    position: 'absolute',
    bottom: '24%',
    fontFamily: FONT.light,
    fontSize: 11,
    letterSpacing: 0.5,
  },
});
