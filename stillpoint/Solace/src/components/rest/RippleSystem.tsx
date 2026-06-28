// src/components/rest/RippleSystem.tsx
import React, { useEffect } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { Canvas, Circle, Group } from '@shopify/react-native-skia';
import {
  useSharedValue,
  useDerivedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { COLORS } from '@/constants/colors';
import { RIPPLE_CYCLE_MS, RIPPLE_STAGGER_MS, RIPPLE_COUNT } from '@/constants/timing';

// Base radius for the ripple — starts small, expands to this max
// Use a fraction of screen width so it fills the screen nicely
const RIPPLE_MAX_RADIUS_FRACTION = 0.48; // 48% of screen width

interface SingleRippleProps {
  cx: number;
  cy: number;
  maxRadius: number;
  delayMs: number; // initial stagger delay before the loop starts
}

function SingleRipple({ cx, cy, maxRadius, delayMs }: SingleRippleProps) {
  // Scale goes from 0 (tiny) to 1 (full radius)
  // We use scale on a Group rather than animating radius directly —
  // this is more performant in Skia (avoids re-path calculations)
  const scale = useSharedValue(0.1);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Wait for the initial stagger delay, then start the repeating loop
    const startTimer = setTimeout(() => {
      // Scale: expand from 0.1 to 1.2 (slightly past max for a fading-out feel)
      scale.value = withRepeat(
        withTiming(1.2, {
          duration: RIPPLE_CYCLE_MS,
          easing: Easing.out(Easing.quad),
        }),
        -1,
        false
      );

      // Opacity: fade in from 0 to 0.4, then fade out to 0 — all within one cycle
      // We simulate this with a withRepeat on the full opacity arc
      // Since withSequence + withRepeat works well for opacity:
      opacity.value = withRepeat(
        withTiming(0, {
          duration: RIPPLE_CYCLE_MS,
          easing: Easing.in(Easing.quad),
        }),
        -1,
        false
      );
      // Set initial opacity for the first frame
      opacity.value = 0.4;
    }, delayMs);

    return () => clearTimeout(startTimer);
  }, []);

  // Skia 2.x requires the entire transform array to be a SharedValue
  const transformArray = useDerivedValue(() => [{ scale: scale.value }]);

  return (
    // Group with origin-centered scale transform
    <Group origin={{ x: cx, y: cy }} transform={transformArray} opacity={opacity}>
      <Circle
        cx={cx}
        cy={cy}
        r={maxRadius}
        style="stroke"
        strokeWidth={1.5}
        color={`${COLORS.sageGreen}66`} // sageGreen at ~40% opacity (controlled by animated opacity above)
      />
    </Group>
  );
}

export function RippleSystem() {
  const { width, height } = useWindowDimensions();
  const cx = width / 2;
  const cy = height / 2;
  const maxRadius = width * RIPPLE_MAX_RADIUS_FRACTION;

  return (
    <Canvas style={StyleSheet.absoluteFill}>
      {Array.from({ length: RIPPLE_COUNT }, (_, i) => (
        <SingleRipple
          key={i}
          cx={cx}
          cy={cy}
          maxRadius={maxRadius}
          delayMs={i * RIPPLE_STAGGER_MS}
        />
      ))}
    </Canvas>
  );
}
