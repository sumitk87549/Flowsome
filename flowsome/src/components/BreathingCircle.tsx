import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';
import { SessionPhase } from '../types';

interface BreathingCircleProps {
  phase: SessionPhase;
  /** Diameter of the inner circle in px */
  size?: number;
}

function getTargetScale(phase: SessionPhase): number {
  switch (phase) {
    case 'inhale': return 1.42;
    case 'hold':   return 1.42;
    case 'exhale': return 0.68;
    case 'rest':   return 0.68;
    default:       return 1.0;
  }
}

function getPhaseDuration(phase: SessionPhase): number {
  switch (phase) {
    case 'inhale': return 4000;
    case 'hold':   return 300;
    case 'exhale': return 6000;
    case 'rest':   return 2000;
    default:       return 1500;
  }
}

export function BreathingCircle({ phase, size = 210 }: BreathingCircleProps) {
  const theme = useTheme();

  const scale      = useSharedValue(1);
  const innerAlpha = useSharedValue(0.12);
  const ring1Alpha = useSharedValue(0.10);
  const ring2Alpha = useSharedValue(0.05);
  const ring3Alpha = useSharedValue(0.03);

  useEffect(() => {
    const target   = getTargetScale(phase);
    const dur      = getPhaseDuration(phase);
    const easeType = Easing.bezier(0.4, 0, 0.2, 1);

    // Core scale
    scale.value = withTiming(target, { duration: dur, easing: easeType });

    // Inner fill pulse — breathes independently
    innerAlpha.value = withRepeat(
      withSequence(
        withTiming(0.28, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.09, { duration: 2200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Ring 1 — slower pulse
    ring1Alpha.value = withRepeat(
      withSequence(
        withTiming(0.20, { duration: 2800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.05, { duration: 2800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Ring 2 — offset
    ring2Alpha.value = withDelay(700,
      withRepeat(
        withSequence(
          withTiming(0.13, { duration: 3200, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.02, { duration: 3200, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );

    // Ring 3 — slowest, outermost
    ring3Alpha.value = withDelay(1400,
      withRepeat(
        withSequence(
          withTiming(0.08, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.01, { duration: 4000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );
  }, [phase]);

  // ── Animated styles ────────────────────────────────────────────────────────

  const innerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: innerAlpha.value + 0.65,  // base 0.65 + pulse
  }));

  const ring1Style = useAnimatedStyle(() => ({
    opacity: ring1Alpha.value,
    transform: [{ scale: scale.value * 1.20 }],
  }));

  const ring2Style = useAnimatedStyle(() => ({
    opacity: ring2Alpha.value,
    transform: [{ scale: scale.value * 1.45 }],
  }));

  const ring3Style = useAnimatedStyle(() => ({
    opacity: ring3Alpha.value,
    transform: [{ scale: scale.value * 1.75 }],
  }));

  const accent = theme.accentColor;

  return (
    <View style={[styles.container, { width: size * 2.2, height: size * 2.2 }]}>

      {/* Ring 3 — outermost whisper */}
      <Animated.View style={[styles.ring, ring3Style, {
        width: size, height: size, borderRadius: size / 2, borderColor: accent,
      }]} />

      {/* Ring 2 */}
      <Animated.View style={[styles.ring, ring2Style, {
        width: size, height: size, borderRadius: size / 2, borderColor: accent,
      }]} />

      {/* Ring 1 */}
      <Animated.View style={[styles.ring, ring1Style, {
        width: size, height: size, borderRadius: size / 2, borderColor: accent,
      }]} />

      {/* Inner filled circle */}
      <Animated.View style={[styles.inner, innerStyle, {
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: accent + '0F',
        borderColor: accent + '38',
      }]} />

      {/* Center anchor dot */}
      <View style={[styles.centerDot, { backgroundColor: accent + '55' }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    borderWidth: StyleSheet.hairlineWidth,
  },
  inner: {
    borderWidth: 1,
  },
  centerDot: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
});
