// src/hooks/useWorkSessionBackground.ts
//
// Animates the background color of the Work Session screen across 5 keyframes
// over the full session duration. Updates on a 30-second tick.

import { useEffect } from 'react';
import {
  useSharedValue,
  withTiming,
  interpolateColor,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import { COLORS } from '@/constants/colors';

// The 5 background keyframes as [timeOffsetFraction, color] pairs
// Fraction is 0.0–1.0 where 1.0 = end of session
const BG_KEYFRAMES: Array<[number, string]> = [
  [0.0,    COLORS.workBg_0min],
  [0.24,   COLORS.workBg_6min],
  [0.48,   COLORS.workBg_12min],
  [0.72,   COLORS.workBg_18min],
  [0.92,   COLORS.workBg_23min],
];

/**
 * Returns an animated style to apply to the background View (Layer 1).
 * @param sessionDurationMs  Total work session duration in milliseconds
 * @param sessionStartMs     Timestamp (Date.now()) when the session started
 */
export function useWorkSessionBackground(
  sessionDurationMs: number,
  sessionStartMs: number
) {
  // Progress from 0.0 (start) to 1.0 (end)
  const progress = useSharedValue(0);

  useEffect(() => {
    // Animate progress from 0 to 1 over the full session duration
    // This is a slow, linear change — barely noticeable tick by tick
    progress.value = withTiming(1, {
      duration: sessionDurationMs,
      easing: Easing.linear,
    });
  }, [sessionDurationMs]);

  const animatedStyle = useAnimatedStyle(() => {
    // Extract keyframe fractions and colors for interpolateColor
    const inputRange  = BG_KEYFRAMES.map(([t]) => t);
    const outputRange = BG_KEYFRAMES.map(([, c]) => c);

    const backgroundColor = interpolateColor(
      progress.value,
      inputRange,
      outputRange
    );
    return { backgroundColor };
  });

  return animatedStyle;
}
