// components/timer/CircularTimer.tsx — Sprint 13: Enhanced liquid fill with secondary wave
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Canvas, Circle, Path, Group, Skia } from '@shopify/react-native-skia';
import {
  useSharedValue,
  withRepeat,
  withTiming,
  useDerivedValue,
  interpolateColor,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

export interface CircularTimerProps {
  progress: SharedValue<number>;
  size?: number;
  theme: {
    primary: string;
    primaryLight: string;
    background: string;
    cardBorder: string;
    text: string;
  };
  isBreak?: boolean;
}

export function CircularTimer({ progress, size = 240, theme, isBreak }: CircularTimerProps) {
  const wavePhase = useSharedValue(0);
  const wavePhase2 = useSharedValue(0); // second wave, phase offset

  useEffect(() => {
    wavePhase.value = withRepeat(
      withTiming(Math.PI * 2, { duration: 3000, easing: Easing.linear }),
      -1, false,
    );
    wavePhase2.value = withRepeat(
      withTiming(Math.PI * 2, { duration: 4200, easing: Easing.linear }),
      -1, false,
    );
    return () => {
      cancelAnimation(wavePhase);
      cancelAnimation(wavePhase2);
    };
  }, [wavePhase, wavePhase2]);

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.44;

  const fillY = useDerivedValue(() => cy + r - progress.value * (2 * r));

  const waveAmp = useDerivedValue(() => {
    const edgeDamp = Math.min(progress.value * 8, (1 - progress.value) * 8, 1);
    return 6 * edgeDamp;
  });

  // Primary wave
  const liquidPath = useDerivedValue(() => {
    const path = Skia.Path.Make();
    const steps = 60;
    const stepW = (r * 2) / steps;
    const startX = cx - r;
    for (let i = 0; i <= steps; i++) {
      const x = startX + i * stepW;
      const waveY = fillY.value + waveAmp.value * Math.sin(wavePhase.value + (i / steps) * Math.PI * 4);
      if (i === 0) path.moveTo(x, waveY);
      else path.lineTo(x, waveY);
    }
    path.lineTo(cx + r, cy + r);
    path.lineTo(startX, cy + r);
    path.close();
    return path;
  });

  // Secondary wave — phase offset by PI for depth
  const liquidPath2 = useDerivedValue(() => {
    const path = Skia.Path.Make();
    const steps = 60;
    const stepW = (r * 2) / steps;
    const startX = cx - r;
    for (let i = 0; i <= steps; i++) {
      const x = startX + i * stepW;
      const waveY = fillY.value + (waveAmp.value * 0.7) * Math.sin(wavePhase2.value + Math.PI + (i / steps) * Math.PI * 3);
      if (i === 0) path.moveTo(x, waveY);
      else path.lineTo(x, waveY);
    }
    path.lineTo(cx + r, cy + r);
    path.lineTo(startX, cy + r);
    path.close();
    return path;
  });

  const liquidColor = useDerivedValue(() => {
    const p = progress.value;
    if (p <= 0.25) {
      return interpolateColor(p / 0.25, [0, 1], ['#2DD4BF', '#6366F1']);
    } else if (p <= 0.75) {
      return interpolateColor((p - 0.25) / 0.5, [0, 1], ['#6366F1', '#8B5CF6']);
    } else {
      return interpolateColor((p - 0.75) / 0.25, [0, 1], ['#8B5CF6', theme.primary]);
    }
  });

  return (
    <View style={{ width: size, height: size }}>
      <Canvas style={{ width: size, height: size }}>
        {/* Outer ring — subtle glow */}
        <Circle cx={cx} cy={cy} r={r + 3} color={theme.primary} style="stroke" strokeWidth={0.5} opacity={0.2} />
        {/* Circle track */}
        <Circle cx={cx} cy={cy} r={r} color={theme.cardBorder} style="stroke" strokeWidth={2} />

        {/* Liquid fill clipped to circle */}
        <Group clip={Skia.Path.Make().addCircle(cx, cy, r)}>
          {/* Secondary wave — behind, 25% opacity for depth */}
          <Path path={liquidPath2} color={liquidColor} opacity={0.25} />
          {/* Primary wave */}
          <Path path={liquidPath} color={liquidColor} opacity={0.85} />
        </Group>

        {/* Circle outline on top */}
        <Circle cx={cx} cy={cy} r={r} color={theme.cardBorder} style="stroke" strokeWidth={1.5} />
      </Canvas>
    </View>
  );
}
