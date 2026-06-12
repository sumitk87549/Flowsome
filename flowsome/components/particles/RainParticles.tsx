// components/particles/RainParticles.tsx
import React, { memo, useMemo, useEffect } from 'react';
import { Canvas, Circle } from '@shopify/react-native-skia';
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

interface RainSeed {
  startX: number;
  initialOffset: number; // 0 to height — stagger: 0 enters first, height enters last
  radius: number;
  fallDuration: number;  // ms per full screen fall (350–950 = fast rain)
  diagonalFactor: number; // total horizontal drift over full height (px)
  opacity: number;
}

const RainDrop = memo(function RainDrop({
  seed,
  color,
  height,
}: {
  seed: RainSeed;
  color: string;
  height: number;
}) {
  // Starts above screen at -initialOffset, falls to height+20, repeats.
  const t = useSharedValue(-seed.initialOffset);

  useEffect(() => {
    t.value = withRepeat(
      withTiming(height + 20, {
        duration: seed.fallDuration,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
    return () => cancelAnimation(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // cy — direct Y position
  const cy = useDerivedValue(() => t.value);

  // cx — subtle diagonal drift as drop falls (simulates wind)
  const cx = useDerivedValue(() => {
    const progress = Math.max(0, t.value) / height; // 0.0 → 1.0 while visible
    return seed.startX + progress * seed.diagonalFactor;
  });

  return (
    <Circle cx={cx} cy={cy} r={seed.radius} color={color} opacity={seed.opacity} />
  );
});

export default function RainParticles({
  width,
  height,
  theme,
  breathPhase,
}: ParticleProps) {
  const PARTICLE_COUNT = 55;

  const seeds: RainSeed[] = useMemo(
    () =>
      Array(PARTICLE_COUNT)
        .fill(0)
        .map(() => ({
          startX:         Math.random() * width,
          initialOffset:  Math.random() * height, // stagger: 0 to full height above screen
          radius:         0.8 + Math.random() * 1.2,
          fallDuration:   350 + Math.random() * 600, // fast: 350–950 ms
          diagonalFactor: 8 + Math.random() * 22,   // total horizontal drift (px)
          opacity:        0.35 + Math.random() * 0.45,
        })),
    [width, height],
  );

  if (width === 0) return null;

  return (
    <Canvas style={{ width, height }}>
      {seeds.map((seed, i) => (
        <RainDrop
          key={i}
          seed={seed}
          color={theme.particle}
          height={height}
        />
      ))}
    </Canvas>
  );
}
