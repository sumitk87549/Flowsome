// components/breathing/BreathingOrb.tsx
import React from 'react';
import { View } from 'react-native';
import { Canvas, Circle } from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';
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

  // Orb radius
  const orbRadius = useDerivedValue(() => {
    if (phase === 'inhale') return minRadius + (maxRadius - minRadius) * phaseProgress.value;
    if (phase === 'exhale') return maxRadius - (maxRadius - minRadius) * phaseProgress.value;
    if (phase === 'holdIn') return maxRadius;
    return minRadius; // holdOut, idle
  });

  // Glow ring radius
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

  // Glow ring opacity
  const glowOpacity = useDerivedValue(() => {
    if (phase === 'holdIn') return 0.25 + 0.2 * Math.sin(phaseProgress.value * Math.PI * 3);
    if (phase === 'holdOut') return 0.12;
    if (phase === 'inhale') return 0.15 + phaseProgress.value * 0.25;
    if (phase === 'exhale') return 0.4 - phaseProgress.value * 0.2;
    return 0.15;
  });

  // Center color (inner orb color)
  const centerColorString = useDerivedValue(() => {
    if (phase === 'inhale') return theme.orbInhale;
    if (phase === 'holdIn') return theme.orbHold;
    if (phase === 'exhale' || phase === 'holdOut') return theme.orbExhale;
    return theme.orb;
  });

  return (
    <View style={{ width: size, height: size }}>
      <Canvas style={{ width: size, height: size }}>
        <Circle cx={cx} cy={cy} r={glowRadius} color={theme.orbGlow} opacity={glowOpacity} />
        {/* Use two overlapping circles instead of RadialGradient as the fallback pattern */}
        <Circle cx={cx} cy={cy} r={orbRadius} color={theme.orb} />
        <Circle cx={cx} cy={cy} r={orbRadius} color={centerColorString} opacity={0.75} />
      </Canvas>
    </View>
  );
}
