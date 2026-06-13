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
  opacity: number;    // layer opacity
  waveCount: number;  // waves frequency multiplier
}

const getPhaseMultipliers = (phase?: string) => {
  switch (phase) {
    case 'inhale':
      return { amp: 1.4, y: 0.90 }; // Wave swells higher and moves up
    case 'hold':
      return { amp: 1.25, y: 0.92 }; // Stays high and ripples
    case 'exhale':
      return { amp: 0.85, y: 1.05 }; // Recedes and moves down
    case 'rest':
    default:
      return { amp: 0.70, y: 1.08 };  // Calm and low
  }
};

// ─────────────────────────────────────────────────────────────
// SINGLE WAVE LAYER — owns its own phase and scale SharedValues.
// ─────────────────────────────────────────────────────────────
const WaveLayer = memo(function WaveLayer({
  config,
  width,
  height,
  color,
  breathPhase,
}: {
  config: WaveConfig;
  width: number;
  height: number;
  color: string;
  breathPhase?: string;
}) {
  const phase = useSharedValue(0);
  const currentAmplitude = useSharedValue(config.amplitude);
  const currentYFraction = useSharedValue(config.yFraction);

  useEffect(() => {
    phase.value = withRepeat(
      withTiming(Math.PI * 2, {
        duration: config.duration,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
    return () => cancelAnimation(phase);
  }, [config.duration]);

  useEffect(() => {
    const mult = getPhaseMultipliers(breathPhase);
    currentAmplitude.value = withTiming(config.amplitude * mult.amp, {
      duration: 2500,
      easing: Easing.out(Easing.cubic),
    });
    currentYFraction.value = withTiming(config.yFraction * mult.y, {
      duration: 2500,
      easing: Easing.out(Easing.cubic),
    });
  }, [breathPhase, config.amplitude, config.yFraction]);

  // Build the wave path on every animation frame.
  const wavePath = useDerivedValue(() => {
    const path = Skia.Path.Make();
    const baseY = currentYFraction.value * height;
    const steps = 40; // resolution
    const stepW = width / steps;

    // Draw wave surface left → right
    const firstY = baseY + currentAmplitude.value * Math.sin(phase.value);
    path.moveTo(0, firstY);
    for (let i = 1; i <= steps; i++) {
      const x = i * stepW;
      const waveOffset = (i / steps) * Math.PI * config.waveCount;
      const y = baseY + currentAmplitude.value * Math.sin(phase.value + waveOffset);
      path.lineTo(x, y);
    }

    // Close path to the bottom of the screen
    path.lineTo(width, height);
    path.lineTo(0, height);
    path.close();

    return path;
  });

  return <Path path={wavePath} color={color} opacity={config.opacity} />;
});

// ─────────────────────────────────────────────────────────────
// PARENT
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
      {/* Backmost wave — largest, slowest, least wave frequency */}
      <WaveLayer
        config={{ yFraction: 0.72, amplitude: 22, duration: 4200, opacity: 0.38, waveCount: 3 }}
        width={width}
        height={height}
        color={theme.particle}
        breathPhase={breathPhase}
      />
      {/* Middle wave */}
      <WaveLayer
        config={{ yFraction: 0.80, amplitude: 14, duration: 5800, opacity: 0.25, waveCount: 4 }}
        width={width}
        height={height}
        color={theme.particle}
        breathPhase={breathPhase}
      />
      {/* Frontmost wave — smallest, fastest, highest wave frequency */}
      <WaveLayer
        config={{ yFraction: 0.87, amplitude: 8, duration: 7500, opacity: 0.14, waveCount: 5 }}
        width={width}
        height={height}
        color={theme.particle}
        breathPhase={breathPhase}
      />
    </Canvas>
  );
}
