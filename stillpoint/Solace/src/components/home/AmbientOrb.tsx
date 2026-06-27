import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Canvas, Circle, RadialGradient, vec } from '@shopify/react-native-skia';
import {
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  useDerivedValue,
} from 'react-native-reanimated';
import { LAYOUT } from '@/constants/layout';
import { COLORS } from '@/constants/colors';
import { TIMING } from '@/constants/timing';
import { EASE } from '@/constants/easing';

const ORB_RADIUS = LAYOUT.screenWidth * 0.55;

export default function AmbientOrb() {
  const orbOpacity = useSharedValue(0);
  const breathScale = useSharedValue(1.0);

  useEffect(() => {
    // Fade in
    orbOpacity.value = withDelay(
      TIMING.HOME_ORB_FADE,
      withTiming(1, { duration: 800 })
    );

    // Start breathing loop after fade-in
    breathScale.value = withDelay(
      TIMING.HOME_ORB_FADE + 800,
      withRepeat(
        withSequence(
          withTiming(1.04, {
            duration: TIMING.ORB_BREATHE_HALF_PERIOD,
            easing: EASE.inOutSin,
          }),
          withTiming(0.96, {
            duration: TIMING.ORB_BREATHE_HALF_PERIOD,
            easing: EASE.inOutSin,
          })
        ),
        -1,
        false // NEVER use true here — reverse mode breaks sine easing
      )
    );
  }, [orbOpacity, breathScale]);

  // Drive Skia values from Reanimated shared values
  const skiaOpacity = useDerivedValue(() => orbOpacity.value);
  const skiaRadius = useDerivedValue(() => ORB_RADIUS * breathScale.value);

  return (
    <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
      <Circle
        cx={LAYOUT.cx}
        cy={LAYOUT.cy}
        r={skiaRadius}
        opacity={skiaOpacity}
      >
        <RadialGradient
          c={vec(LAYOUT.cx, LAYOUT.cy)}
          r={ORB_RADIUS}
          colors={['rgba(212,149,106,0.18)', 'rgba(212,149,106,0.06)', 'transparent']}
        />
      </Circle>
    </Canvas>
  );
}
