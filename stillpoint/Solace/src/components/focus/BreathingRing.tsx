// src/components/focus/BreathingRing.tsx
import React, { useEffect } from 'react';
import { Circle, Group, RadialGradient, vec } from '@shopify/react-native-skia';
import {
  useSharedValue,
  useDerivedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { COLORS } from '@/constants/colors';
import { BREATHING_RING_PERIOD } from '@/constants/timing';
import { BREATHING_RING_SCALE_MIN, BREATHING_RING_SCALE_MAX } from '@/constants/layout';

interface BreathingRingProps {
  cx: number;
  cy: number;
  /** When true, the ring should slow its breathing (work session ending) */
  isSlowingDown?: boolean;
}

export function BreathingRing({ cx, cy, isSlowingDown = false }: BreathingRingProps) {
  const breathScale = useSharedValue(BREATHING_RING_SCALE_MIN);
  const breathPeriodMultiplier = useSharedValue(1.0);

  // Half-period for one direction of the breath (in ms)
  const halfPeriod = BREATHING_RING_PERIOD / 2; // 3000ms

  // Start the infinite breathing loop on mount
  // CRITICAL: withRepeat(..., -1, false) — never use true (reverse) with sine easing
  useEffect(() => {
    breathScale.value = withRepeat(
      withSequence(
        withTiming(BREATHING_RING_SCALE_MAX, {
          duration: halfPeriod,
          easing: Easing.inOut(Easing.sin),
        }),
        withTiming(BREATHING_RING_SCALE_MIN, {
          duration: halfPeriod,
          easing: Easing.inOut(Easing.sin),
        })
      ),
      -1,
      false  // NEVER true here
    );
  }, []);

  // When the work session ends, smoothly lengthen the breath period
  useEffect(() => {
    if (isSlowingDown) {
      breathPeriodMultiplier.value = withTiming(2.5, { duration: 2000 });
    }
  }, [isSlowingDown]);

  // Main ring radius: roughly 18% of the screen width passed in via cx*2
  const ringRadius = cx * 0.36;
  // Outer bloom is 25% larger than the main ring
  const bloomRadius = ringRadius * 1.25;

  // Skia 2.x requires the entire transform array to be a SharedValue<Transform[]>
  // — not a SharedValue nested inside a plain JS array
  const groupTransform = useDerivedValue(() => [{ scale: breathScale.value }]);

  return (
    // Group uses origin for scale transform so it scales around the center point
    <Group origin={vec(cx, cy)} transform={groupTransform}>
      {/* Outer soft bloom — very low opacity radial gradient */}
      <Circle cx={cx} cy={cy} r={bloomRadius}>
        <RadialGradient
          c={vec(cx, cy)}
          r={bloomRadius}
          colors={[`${COLORS.amber}18`, 'transparent']}
        />
      </Circle>

      {/* Main breathing ring with amber-to-transparent radial gradient */}
      <Circle cx={cx} cy={cy} r={ringRadius}>
        <RadialGradient
          c={vec(cx, cy)}
          r={ringRadius}
          colors={[`${COLORS.amber}55`, `${COLORS.amber}22`, 'transparent']}
        />
      </Circle>
    </Group>
  );
}
