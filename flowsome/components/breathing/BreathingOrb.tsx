// components/breathing/BreathingOrb.tsx — Sprint 13: Living, layered orb
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Canvas, Circle } from '@shopify/react-native-skia';
import {
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

export interface BreathingOrbProps {
  phase: 'inhale' | 'holdIn' | 'exhale' | 'holdOut' | 'idle';
  phaseProgress: SharedValue<number>;
  theme: any;
  size?: number;
}

export function BreathingOrb({ phase, phaseProgress, theme, size = 220 }: BreathingOrbProps) {
  const minRadius = size * 0.22;
  const maxRadius = size * 0.42;
  const glowExtra = size * 0.12;
  const cx = size / 2;
  const cy = size / 2;

  // Ambient pulse — independent 4s glow cycle (always present)
  const ambientT = useSharedValue(0);
  useEffect(() => {
    ambientT.value = withRepeat(
      withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
    return () => cancelAnimation(ambientT);
  }, []);

  // Orb radius — breathing animation
  const orbRadius = useDerivedValue(() => {
    if (phase === 'inhale') return minRadius + (maxRadius - minRadius) * phaseProgress.value;
    if (phase === 'exhale') return maxRadius - (maxRadius - minRadius) * phaseProgress.value;
    if (phase === 'holdIn') return maxRadius;
    return minRadius;
  });

  // Inner glow ring — leads/lags orb
  const glowRadius = useDerivedValue(() => {
    if (phase === 'inhale') {
      const advancedProgress = Math.min(1, phaseProgress.value + 0.15);
      const advOrb = minRadius + (maxRadius - minRadius) * advancedProgress;
      return advOrb + glowExtra;
    }
    if (phase === 'exhale') {
      const lagProgress = Math.max(0, phaseProgress.value - 0.15);
      const lagOrb = maxRadius - (maxRadius - minRadius) * lagProgress;
      return lagOrb + glowExtra;
    }
    return orbRadius.value + glowExtra;
  });

  // Inner glow opacity
  const glowOpacity = useDerivedValue(() => {
    if (phase === 'holdIn') return 0.25 + 0.2 * Math.sin(phaseProgress.value * Math.PI * 3);
    if (phase === 'holdOut') return 0.12;
    if (phase === 'inhale') return 0.15 + phaseProgress.value * 0.25;
    if (phase === 'exhale') return 0.4 - phaseProgress.value * 0.2;
    return 0.15;
  });

  // Outer ambient glow — always pulsing gently
  const outerGlowRadius = useDerivedValue(() => {
    return orbRadius.value + glowExtra * 2.2 + ambientT.value * 8;
  });
  const outerGlowOpacity = useDerivedValue(() => {
    return 0.04 + ambientT.value * 0.06;
  });

  // Edge diffusion ring — very faint, slightly larger
  const edgeRadius = useDerivedValue(() => orbRadius.value + 2);

  // Center color
  const centerColorString = useDerivedValue(() => {
    if (phase === 'inhale') return theme.orbInhale;
    if (phase === 'holdIn') return theme.orbHold;
    if (phase === 'exhale' || phase === 'holdOut') return theme.orbExhale;
    return theme.orb;
  });

  return (
    <View style={{ width: size, height: size }}>
      <Canvas style={{ width: size, height: size }}>
        {/* Outermost ambient glow — always pulsing */}
        <Circle cx={cx} cy={cy} r={outerGlowRadius} color={theme.orbGlow} opacity={outerGlowOpacity} />
        {/* Inner glow ring */}
        <Circle cx={cx} cy={cy} r={glowRadius} color={theme.orbGlow} opacity={glowOpacity} />
        {/* Edge diffusion — soft edge */}
        <Circle cx={cx} cy={cy} r={edgeRadius} color={theme.orb} opacity={0.05} />
        {/* Main orb */}
        <Circle cx={cx} cy={cy} r={orbRadius} color={theme.orb} />
        <Circle cx={cx} cy={cy} r={orbRadius} color={centerColorString} opacity={0.75} />
      </Canvas>
    </View>
  );
}
