// components/particles/DustParticles.tsx
import React, { memo, useMemo, useEffect } from 'react';
import { Canvas, Circle } from '@shopify/react-native-skia';
import {
  useSharedValue,
  useDerivedValue,
  withRepeat,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated';

interface ParticleProps {
  width: number;
  height: number;
  theme: any; // ThemeColors from useTheme()
  breathPhase?: string;
}

interface DustSeed {
  startX: number;
  startY: number;
  radius: number;
  driftAmpX: number;   // horizontal oscillation amplitude (px)
  driftAmpY: number;   // vertical oscillation amplitude (px)
  driftSpeedX: number; // animation cycle duration (ms, 4000–12000)
  driftSpeedY: number; // vertical oscillation frequency multiplier
  baseOpacity: number;
}

// ─────────────────────────────────────────────────────────────
// SINGLE PARTICLE — owns its own hooks at the top level.
// Never call useSharedValue/useDerivedValue in the parent.
// ─────────────────────────────────────────────────────────────
const DustParticle = memo(function DustParticle({
  seed,
  color,
  breathPhase,
}: {
  seed: DustSeed;
  color: string;
  breathPhase?: string;
}) {
  // t cycles from (seed.startX * 100) to 1000 and repeats.
  // The starting offset gives each particle a different initial phase,
  // which creates visual variety without calling hooks differently per particle.
  const t = useSharedValue(seed.startX * 100);

  // Use standard React useEffect — NOT useReanimatedEffect.
  // cancelAnimation on cleanup prevents memory leaks when component unmounts.
  useEffect(() => {
    t.value = withRepeat(
      withTiming(1000, { duration: seed.driftSpeedX }),
      -1,   // infinite loops
      false, // do not reverse (restart from beginning each time)
    );
    return () => {
      cancelAnimation(t);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // cx — horizontal position (figure-8 orbital drift + breath response)
  const cx = useDerivedValue(() => {
    const phase = (t.value % 1000) / 1000; // 0.0 → 1.0 cycle
    let breathOffset = 0;
    if (breathPhase === 'inhale') breathOffset = -8 * Math.sin(phase * Math.PI);
    if (breathPhase === 'exhale') breathOffset = 8 * Math.sin(phase * Math.PI);
    return seed.startX + seed.driftAmpX * Math.sin(phase * Math.PI * 2) + breathOffset;
  });

  // cy — vertical position (sinusoidal drift)
  const cy = useDerivedValue(() => {
    const phase = (t.value % 1000) / 1000;
    return seed.startY + seed.driftAmpY * Math.cos(phase * Math.PI * 2 * seed.driftSpeedY);
  });

  // opacity — gently pulses in time with movement
  const opacity = useDerivedValue(() => {
    const phase = (t.value % 1000) / 1000;
    return seed.baseOpacity * (0.5 + 0.5 * Math.sin(phase * Math.PI * 2));
  });

  return (
    <Circle cx={cx} cy={cy} r={seed.radius} color={color} opacity={opacity} />
  );
});

// ─────────────────────────────────────────────────────────────
// PARENT — generates seeds, renders N DustParticle components.
// Does NOT call useSharedValue here. Seeds are plain JS objects.
// ─────────────────────────────────────────────────────────────
export default function DustParticles({
  width,
  height,
  theme,
  breathPhase,
}: ParticleProps) {
  const PARTICLE_COUNT = 35;

  const seeds: DustSeed[] = useMemo(
    () =>
      Array(PARTICLE_COUNT)
        .fill(0)
        .map(() => ({
          startX:      Math.random() * width,
          startY:      Math.random() * height,
          radius:      1 + Math.random() * 2.5,
          driftAmpX:   20 + Math.random() * 40,
          driftAmpY:   15 + Math.random() * 30,
          driftSpeedX: 4000 + Math.random() * 8000, // 4–12 seconds per cycle
          driftSpeedY: 0.3 + Math.random() * 0.7,
          baseOpacity: 0.15 + Math.random() * 0.35,
        })),
    [width, height],
  );

  if (width === 0) return null;

  return (
    <Canvas style={{ width, height }}>
      {seeds.map((seed, i) => (
        <DustParticle
          key={i}
          seed={seed}
          color={theme.particle}
          breathPhase={breathPhase}
        />
      ))}
    </Canvas>
  );
}
