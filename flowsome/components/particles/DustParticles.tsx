// components/particles/DustParticles.tsx — Sprint 13: Enhanced desert dust
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
  theme: any;
  breathPhase?: string;
}

interface DustSeed {
  startX: number;
  startY: number;
  radius: number;
  driftAmpX: number;
  driftAmpY: number;
  driftSpeedX: number;
  driftSpeedY: number;
  baseOpacity: number;
  isGust: boolean;        // 20% of particles are fast-moving gusts
  isStreak: boolean;      // some are near-horizontal streaks (flat radius)
}

const DustParticle = memo(function DustParticle({
  seed,
  color,
  breathPhase,
}: {
  seed: DustSeed;
  color: string;
  breathPhase?: string;
}) {
  const t = useSharedValue(seed.startX * 100);

  useEffect(() => {
    const speed = seed.isGust ? seed.driftSpeedX * 0.4 : seed.driftSpeedX;
    t.value = withRepeat(
      withTiming(1000, { duration: speed }),
      -1,
      false,
    );
    return () => cancelAnimation(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const cx = useDerivedValue(() => {
    const phase = (t.value % 1000) / 1000;
    let breathOffset = 0;
    if (breathPhase === 'inhale') breathOffset = -10 * Math.sin(phase * Math.PI);
    if (breathPhase === 'exhale') breathOffset = 10 * Math.sin(phase * Math.PI);
    const amp = seed.isGust ? seed.driftAmpX * 2.5 : seed.driftAmpX;
    return seed.startX + amp * Math.sin(phase * Math.PI * 2) + breathOffset;
  });

  const cy = useDerivedValue(() => {
    const phase = (t.value % 1000) / 1000;
    const amp = seed.isStreak ? seed.driftAmpY * 0.3 : seed.driftAmpY;
    return seed.startY + amp * Math.cos(phase * Math.PI * 2 * seed.driftSpeedY);
  });

  const opacity = useDerivedValue(() => {
    const phase = (t.value % 1000) / 1000;
    return seed.baseOpacity * (0.4 + 0.6 * Math.sin(phase * Math.PI * 2));
  });

  return (
    <Circle cx={cx} cy={cy} r={seed.radius} color={color} opacity={opacity} />
  );
});

export default function DustParticles({
  width,
  height,
  theme,
  breathPhase,
}: ParticleProps) {
  const PARTICLE_COUNT = 45; // increased from 35

  const seeds: DustSeed[] = useMemo(
    () =>
      Array(PARTICLE_COUNT)
        .fill(0)
        .map((_, i) => {
          const isGust = Math.random() < 0.2;
          const isStreak = Math.random() < 0.15;
          return {
            startX:      Math.random() * width,
            startY:      Math.random() * height,
            radius:      isStreak ? 1 : (1 + Math.random() * 3), // varied 1–4px
            driftAmpX:   isStreak ? 60 : (20 + Math.random() * 40),
            driftAmpY:   isStreak ? 5 : (15 + Math.random() * 30),
            driftSpeedX: 4000 + Math.random() * 8000,
            driftSpeedY: 0.3 + Math.random() * 0.7,
            baseOpacity: 0.25 + Math.random() * 0.30, // brighter: 0.25–0.55
            isGust,
            isStreak,
          };
        }),
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
