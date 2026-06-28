// src/components/focus/ParticleField.tsx
import React, { useEffect, useRef } from 'react';
import { Circle, Group } from '@shopify/react-native-skia';
import {
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  useDerivedValue,
} from 'react-native-reanimated';
import { COLORS } from '@/constants/colors';
import { PARTICLE_ELAPSED_LARGE, WORK_PARTICLES_SLOW } from '@/constants/timing';

const PARTICLE_COUNT = 25;

// Shape for per-particle random constants (generated once, never changes)
interface ParticleConfig {
  baseX: number;      // base x position (offset from center)
  baseY: number;      // base y position (offset from center)
  // X-axis sine wave parameters
  xA1: number; xA2: number; xA3: number; // amplitudes
  xF1: number; xF2: number; xF3: number; // frequencies (radians/second)
  xP1: number; xP2: number; xP3: number; // phase offsets (radians)
  // Y-axis sine wave parameters (different from X)
  yA1: number; yA2: number; yA3: number;
  yF1: number; yF2: number; yF3: number;
  yP1: number; yP2: number; yP3: number;
  // Visual properties
  radius: number;     // 2–4 dp
  opacity: number;    // 0.03–0.08
  color: 'amber' | 'cream';
}

// Generate random constants for all particles once
function generateParticleConfigs(cx: number, cy: number): ParticleConfig[] {
  const configs: ParticleConfig[] = [];
  const ellipseW = cx * 0.9;  // particles spread across 90% of half-width
  const ellipseH = cy * 0.7;  // particles spread across 70% of half-height

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const xF1 = 0.08 + Math.random() * 0.12; // base frequency ~0.08–0.20 rad/s
    const yF1 = 0.07 + Math.random() * 0.11;
    configs.push({
      // Base position: random point inside an ellipse centered at (0,0)
      // We store offsets from center; actual position is cx + baseX, cy + baseY
      baseX: (Math.random() * 2 - 1) * ellipseW,
      baseY: (Math.random() * 2 - 1) * ellipseH,
      // X-axis wave params
      xA1: 8 + Math.random() * 14,       // amplitude 8–22 dp
      xA2: 4 + Math.random() * 8,        // amplitude 4–12 dp
      xA3: 2 + Math.random() * 5,        // amplitude 2–7 dp
      xF1,
      xF2: xF1 * Math.sqrt(2),           // irrational ratio
      xF3: xF1 * (Math.PI / 2),          // irrational ratio
      xP1: Math.random() * 2 * Math.PI,
      xP2: Math.random() * 2 * Math.PI,
      xP3: Math.random() * 2 * Math.PI,
      // Y-axis wave params (different amplitudes and phases)
      yA1: 7 + Math.random() * 12,
      yA2: 3 + Math.random() * 7,
      yA3: 2 + Math.random() * 4,
      yF1,
      yF2: yF1 * Math.sqrt(2),
      yF3: yF1 * (Math.PI / 2),
      yP1: Math.random() * 2 * Math.PI,
      yP2: Math.random() * 2 * Math.PI,
      yP3: Math.random() * 2 * Math.PI,
      // Visual
      radius: 2 + Math.random() * 2,     // 2–4 dp
      opacity: 0.03 + Math.random() * 0.05, // 3–8% opacity
      color: Math.random() > 0.4 ? 'amber' : 'cream',
    });
  }
  return configs;
}

interface ParticleFieldProps {
  cx: number;
  cy: number;
  /** Set to true when work session ends — particles slow down */
  isSlowingDown?: boolean;
}

// Single animated particle — we need a separate component per particle
// so each can have its own useDerivedValue for x and y
interface SingleParticleProps {
  config: ParticleConfig;
  cx: number;
  cy: number;
  elapsedSeconds: ReturnType<typeof useSharedValue<number>>;
  speedMultiplier: ReturnType<typeof useSharedValue<number>>;
}

function AnimatedParticle({ config, cx, cy, elapsedSeconds, speedMultiplier }: SingleParticleProps) {
  const particleCx = useDerivedValue(() => {
    const t = elapsedSeconds.value * speedMultiplier.value;
    return (
      cx +
      config.baseX +
      config.xA1 * Math.sin(config.xF1 * t + config.xP1) +
      config.xA2 * Math.sin(config.xF2 * t + config.xP2) +
      config.xA3 * Math.sin(config.xF3 * t + config.xP3)
    );
  });

  const particleCy = useDerivedValue(() => {
    const t = elapsedSeconds.value * speedMultiplier.value;
    return (
      cy +
      config.baseY +
      config.yA1 * Math.sin(config.yF1 * t + config.yP1) +
      config.yA2 * Math.sin(config.yF2 * t + config.yP2) +
      config.yA3 * Math.sin(config.yF3 * t + config.yP3)
    );
  });

  const colorHex = config.color === 'amber' ? COLORS.amber : COLORS.cream;
  // Convert opacity 0.0–1.0 to 2-digit hex alpha (00–FF)
  const alphaHex = Math.round(config.opacity * 255).toString(16).padStart(2, '0');
  const colorWithAlpha = `${colorHex}${alphaHex}`;

  return (
    <Circle
      cx={particleCx}
      cy={particleCy}
      r={config.radius}
      color={colorWithAlpha}
    />
  );
}

export function ParticleField({ cx, cy, isSlowingDown = false }: ParticleFieldProps) {
  // Generate particle constants once; store in ref so no re-render on change
  const particleConfigsRef = useRef<ParticleConfig[] | null>(null);
  if (!particleConfigsRef.current) {
    particleConfigsRef.current = generateParticleConfigs(cx, cy);
  }

  // Continuously incrementing clock (seconds)
  const elapsedSeconds = useSharedValue(0);
  // Speed multiplier: slows to 0.2 when work ends
  const speedMultiplier = useSharedValue(1.0);

  // Start the clock on mount
  useEffect(() => {
    elapsedSeconds.value = withRepeat(
      withTiming(PARTICLE_ELAPSED_LARGE, {
        duration: PARTICLE_ELAPSED_LARGE * 1000, // convert seconds to ms
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  // Slow particles when work session ends
  useEffect(() => {
    if (isSlowingDown) {
      speedMultiplier.value = withTiming(0.2, { duration: WORK_PARTICLES_SLOW });
    }
  }, [isSlowingDown]);

  return (
    <>
      {particleConfigsRef.current.map((config, index) => (
        <AnimatedParticle
          key={index}
          config={config}
          cx={cx}
          cy={cy}
          elapsedSeconds={elapsedSeconds}
          speedMultiplier={speedMultiplier}
        />
      ))}
    </>
  );
}
