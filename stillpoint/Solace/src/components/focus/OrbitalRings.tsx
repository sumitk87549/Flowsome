// src/components/focus/OrbitalRings.tsx
import React, { useEffect } from 'react';
import { Circle, Group } from '@shopify/react-native-skia';
import {
  useSharedValue,
  useDerivedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { COLORS } from '@/constants/colors';
import {
  ORBITAL_OUTER_PERIOD_WORK,
  ORBITAL_MIDDLE_PERIOD_WORK,
  ORBITAL_INNER_PERIOD_WORK,
  ORBITAL_PERIOD_MULTIPLIER_REST,
} from '@/constants/timing';

interface OrbitalRingsProps {
  cx: number;
  cy: number;
  /** Set to true when the work session timer completes — rings will slow down */
  isSlowingDown?: boolean;
}

// Helper: create a continuously rotating shared value
function useOrbitalRotation(periodMs: number) {
  const rotation = useSharedValue(0);
  useEffect(() => {
    // Continuous linear rotation from 0 to 2π, repeating forever
    rotation.value = withRepeat(
      withTiming(2 * Math.PI, {
        duration: periodMs,
        easing: Easing.linear,
      }),
      -1,
      false  // NEVER reverse
    );
  }, []);
  return rotation;
}

export function OrbitalRings({ cx, cy, isSlowingDown = false }: OrbitalRingsProps) {
  // Three separate rotation shared values for each ring
  const outerRotation = useOrbitalRotation(ORBITAL_OUTER_PERIOD_WORK);
  const middleRotation = useOrbitalRotation(ORBITAL_MIDDLE_PERIOD_WORK);
  const innerRotation = useOrbitalRotation(ORBITAL_INNER_PERIOD_WORK);

  useEffect(() => {
    if (!isSlowingDown) return;
    // Stop current animations and restart with 3× longer period
    const slowOuter  = ORBITAL_OUTER_PERIOD_WORK  * ORBITAL_PERIOD_MULTIPLIER_REST;
    const slowMiddle = ORBITAL_MIDDLE_PERIOD_WORK * ORBITAL_PERIOD_MULTIPLIER_REST;
    const slowInner  = ORBITAL_INNER_PERIOD_WORK  * ORBITAL_PERIOD_MULTIPLIER_REST;

    // Complete current rotation and restart with new period
    // We use withTiming to the next 2π boundary, then repeat slowly
    outerRotation.value = withRepeat(
      withTiming(2 * Math.PI, { duration: slowOuter, easing: Easing.linear }),
      -1,
      false
    );
    middleRotation.value = withRepeat(
      withTiming(2 * Math.PI, { duration: slowMiddle, easing: Easing.linear }),
      -1,
      false
    );
    innerRotation.value = withRepeat(
      withTiming(2 * Math.PI, { duration: slowInner, easing: Easing.linear }),
      -1,
      false
    );
  }, [isSlowingDown]);

  // Ring radii: percentages of half-screen width (cx = half-width)
  const outerRadius  = cx * 0.88;
  const middleRadius = cx * 0.66;
  const innerRadius  = cx * 0.48;

  // Skia 2.x: the whole transform array must be a SharedValue<Transform[]>
  const outerTransform  = useDerivedValue(() => [{ rotate: outerRotation.value }]);
  const middleTransform = useDerivedValue(() => [{ rotate: middleRotation.value }]);
  const innerTransform  = useDerivedValue(() => [{ rotate: innerRotation.value }]);

  // Shared ring stroke style
  const ringColor = `${COLORS.cream}22`;
  const strokeWidth = 1;

  return (
    <>
      {/* Outer ring */}
      <Group origin={{ x: cx, y: cy }} transform={outerTransform}>
        <Circle
          cx={cx}
          cy={cy}
          r={outerRadius}
          style="stroke"
          strokeWidth={strokeWidth}
          color={ringColor}
        />
      </Group>

      {/* Middle ring */}
      <Group origin={{ x: cx, y: cy }} transform={middleTransform}>
        <Circle
          cx={cx}
          cy={cy}
          r={middleRadius}
          style="stroke"
          strokeWidth={strokeWidth}
          color={ringColor}
        />
      </Group>

      {/* Inner ring */}
      <Group origin={{ x: cx, y: cy }} transform={innerTransform}>
        <Circle
          cx={cx}
          cy={cy}
          r={innerRadius}
          style="stroke"
          strokeWidth={strokeWidth}
          color={`${COLORS.amber}22`}
        />
      </Group>
    </>
  );
}
