// components/particles/OceanWave.tsx
import React, { memo, useEffect } from 'react';
import { Canvas, Path } from '@shopify/react-native-skia';
import { Skia } from '@shopify/react-native-skia';
import {
  useSharedValue,
  useDerivedValue,
  withRepeat,
  withTiming,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';

interface ParticleProps {
  width: number;
  height: number;
  theme: any;
  breathPhase?: string;
}

interface WaveConfig {
  yFraction: number;  // base Y as fraction of screen height (e.g. 0.75 = 75% down)
  amplitude: number;  // wave crest/trough height in pixels
  duration: number;   // ms per one full animation cycle
  opacity: number;    // layer opacity (backmost is highest)
}

// ─────────────────────────────────────────────────────────────
// SINGLE WAVE LAYER — owns its own phase SharedValue.
// Renders a closed filled-path: wave surface → bottom of screen.
// ─────────────────────────────────────────────────────────────
const WaveLayer = memo(function WaveLayer({
  config,
  width,
  height,
  color,
}: {
  config: WaveConfig;
  width: number;
  height: number;
  color: string;
}) {
  const phase = useSharedValue(0);

  useEffect(() => {
    // Animate phase from 0 → 2π continuously (one full sine cycle)
    phase.value = withRepeat(
      withTiming(Math.PI * 2, {
        duration: config.duration,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
    return () => cancelAnimation(phase);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Build the wave path on every animation frame.
  // Skia.Path.Make() inside useDerivedValue is valid — runs in the worklet.
  const wavePath = useDerivedValue(() => {
    const path = Skia.Path.Make();
    const baseY = config.yFraction * height;
    const steps = 40; // resolution: 40 points across the screen width
    const stepW = width / steps;

    // Draw wave surface left → right
    const firstY = baseY + config.amplitude * Math.sin(phase.value);
    path.moveTo(0, firstY);
    for (let i = 1; i <= steps; i++) {
      const x = i * stepW;
      // Two full wavelengths across the screen for a natural wave look
      const waveOffset = (i / steps) * Math.PI * 4;
      const y = baseY + config.amplitude * Math.sin(phase.value + waveOffset);
      path.lineTo(x, y);
    }

    // Close path: fill from wave surface down to screen bottom
    path.lineTo(width, height);
    path.lineTo(0, height);
    path.close();

    return path;
  });

  return <Path path={wavePath} color={color} opacity={config.opacity} />;
});

// ─────────────────────────────────────────────────────────────
// PARENT — renders 3 WaveLayer components hardcoded (not in a loop).
// Three hardcoded instances is fine — Law 2 only forbids hooks in loops.
// ─────────────────────────────────────────────────────────────
export default function OceanWave({
  width,
  height,
  theme,
  breathPhase,
}: ParticleProps) {
  if (width === 0) return null;

  return (
    <Canvas style={{ width, height }}>
      {/* Backmost wave — largest, slowest */}
      <WaveLayer
        config={{ yFraction: 0.72, amplitude: 22, duration: 4200, opacity: 0.38 }}
        width={width}
        height={height}
        color={theme.particle}
      />
      {/* Middle wave */}
      <WaveLayer
        config={{ yFraction: 0.80, amplitude: 14, duration: 5800, opacity: 0.25 }}
        width={width}
        height={height}
        color={theme.particle}
      />
      {/* Frontmost wave — smallest, fastest */}
      <WaveLayer
        config={{ yFraction: 0.87, amplitude: 8, duration: 7500, opacity: 0.14 }}
        width={width}
        height={height}
        color={theme.particle}
      />
    </Canvas>
  );
}
