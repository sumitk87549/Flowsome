// components/focus/AmbientWave.tsx — Sprint 13: Triple standing wave field
import React, { memo, useEffect } from 'react';
import { View } from 'react-native';
import { Canvas, Path } from '@shopify/react-native-skia';
import { Skia } from '@shopify/react-native-skia';
import {
  useSharedValue,
  withRepeat,
  withTiming,
  useDerivedValue,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';

interface WaveLineProps {
  width: number;
  canvasHeight: number;
  color: string;
  yOffset: number;     // vertical position offset from center
  amplitude: number;   // wave height
  duration: number;    // ms per cycle
  opacity: number;     // layer opacity
  wavelengths: number; // how many full wavelengths across width
}

// Each wave is its own component to respect hook-at-top-level law
const WaveLine = memo(function WaveLine({
  width, canvasHeight, color, yOffset, amplitude, duration, opacity, wavelengths,
}: WaveLineProps) {
  const phase = useSharedValue(0);

  useEffect(() => {
    phase.value = withRepeat(
      withTiming(Math.PI * 2, { duration, easing: Easing.linear }),
      -1, false,
    );
    return () => cancelAnimation(phase);
  }, []);

  const path = useDerivedValue(() => {
    const p = Skia.Path.Make();
    const steps = 80;
    const stepW = width / steps;
    const baseY = canvasHeight / 2 + yOffset;

    p.moveTo(0, baseY);
    for (let i = 1; i <= steps; i++) {
      const x = i * stepW;
      const y = baseY + amplitude * Math.sin(phase.value + (i / steps) * Math.PI * 2 * wavelengths);
      p.lineTo(x, y);
    }
    return p;
  });

  return (
    <Path path={path} color={color} opacity={opacity} style="stroke" strokeWidth={1.5} />
  );
});

interface AmbientWaveProps {
  width: number;
  color: string;
}

export default function AmbientWave({ width, color }: AmbientWaveProps) {
  const CANVAS_H = 80;

  return (
    <View pointerEvents="none" style={{ width, height: CANVAS_H }}>
      <Canvas style={{ width, height: CANVAS_H }}>
        {/* Three stacked waves at different Y positions, speeds, amplitudes */}
        <WaveLine width={width} canvasHeight={CANVAS_H} color={color}
          yOffset={-8} amplitude={10} duration={4000} opacity={0.08} wavelengths={2} />
        <WaveLine width={width} canvasHeight={CANVAS_H} color={color}
          yOffset={0} amplitude={7} duration={5500} opacity={0.05} wavelengths={3} />
        <WaveLine width={width} canvasHeight={CANVAS_H} color={color}
          yOffset={8} amplitude={4} duration={7200} opacity={0.03} wavelengths={4} />
      </Canvas>
    </View>
  );
}
