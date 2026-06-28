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
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PeacefulBackground } from '@/components/shared/PeacefulBackground';
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
  const bgOpacity = useSharedValue(0);
  const readyOpacity = useSharedValue(0);
  const readyTranslateY = useSharedValue(8);
  const subOpacity = useSharedValue(0);
  const counterOpacity = useSharedValue(0);

  useEffect(() => {
    // Fade in background
    bgOpacity.value = withTiming(1, {
      duration: RETURN_BG_TRANSITION,
      easing: Easing.out(Easing.quad),
    });

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
    opacity: bgOpacity.value,
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
    <View style={styles.container}>
      <Animated.View style={[StyleSheet.absoluteFill, bgStyle]} pointerEvents="none">
        <PeacefulBackground />
      </Animated.View>

      <Animated.View style={[styles.textContainer, readyStyle]}>
        <Text style={[styles.readyText, { color: theme.colors.textPrimary }]}>
          Come back slowly.
        </Text>
        <Text style={[styles.helperText, { color: theme.colors.textMuted }]}>
          What is the next small action?
        </Text>
      </Animated.View>

      <Animated.View style={[styles.buttonsContainer, subStyle]}>
        <Pressable style={[styles.button, { backgroundColor: theme.colors.surface }]} onPress={handleReadyPress}>
          <Text style={[styles.buttonText, { color: theme.colors.textPrimary }]}>Begin next focus</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  readyText: {
    fontFamily: FONT.medium,
    fontSize: 28,
    marginBottom: 8,
  },
  helperText: {
    fontFamily: FONT.regular,
    fontSize: 16,
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
