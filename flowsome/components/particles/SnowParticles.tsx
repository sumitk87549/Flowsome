// components/particles/SnowParticles.tsx
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

interface SnowSeed {
  startX: number;
  initialOffset: number; // how far above screen to start (20 to height px)
  radius: number;
  fallDuration: number;  // ms to fall from top to bottom (7000–15000 = slow, dreamy)
  swayAmpX: number;      // horizontal sway amplitude (px)
  swayFreq: number;      // sway cycles during one full fall
  opacity: number;
}

const SnowFlake = memo(function SnowFlake({
  seed,
  color,
  height,
}: {
  seed: SnowSeed;
  color: string;
  height: number;
}) {
  // t starts above the screen (negative y) and falls to below the screen (height + 40).
  // withRepeat restarts from the same initial value, so flake always enters from
  // the same point above the screen. Different initialOffsets create stagger.
  const t = useSharedValue(-seed.initialOffset);

  useEffect(() => {
    t.value = withRepeat(
      withTiming(height + 40, {
        duration: seed.fallDuration,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
    return () => cancelAnimation(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // cy — directly maps t to Y position (above screen → below screen)
  const cy = useDerivedValue(() => t.value);

  // cx — gentle sinusoidal sway as the flake falls
  const cx = useDerivedValue(() => {
    const totalRange = height + 40 + seed.initialOffset;
    const progress = (t.value + seed.initialOffset) / totalRange; // 0.0 → 1.0
    return seed.startX + seed.swayAmpX * Math.sin(progress * Math.PI * 2 * seed.swayFreq);
  });

  // opacity — fade in at top edge, fade out at bottom edge, full in middle
  const opacity = useDerivedValue(() => {
    if (t.value < 30)             return seed.opacity * Math.max(0, (t.value + 30) / 60);
    if (t.value > height - 30)   return seed.opacity * Math.max(0, (height + 40 - t.value) / 70);
    return seed.opacity;
  });

  return <Circle cx={cx} cy={cy} r={seed.radius} color={color} opacity={opacity} />;
});

export default function SnowParticles({
  width,
  height,
  theme,
  breathPhase,
}: ParticleProps) {
  const PARTICLE_COUNT = 28;

  const seeds: SnowSeed[] = useMemo(
    () =>
      Array(PARTICLE_COUNT)
        .fill(0)
        .map(() => ({
          startX:        Math.random() * width,
          initialOffset: 20 + Math.random() * height, // stagger: 20 to height px above screen
          radius:        2 + Math.random() * 3,
          fallDuration:  7000 + Math.random() * 8000,  // slow: 7–15 seconds
          swayAmpX:      12 + Math.random() * 25,
          swayFreq:      0.5 + Math.random() * 1.5,
          opacity:       0.5 + Math.random() * 0.4,
        })),
    [width, height],
  );

  if (width === 0) return null;

  return (
    <Canvas style={{ width, height }}>
      {seeds.map((seed, i) => (
        <SnowFlake
          key={i}
          seed={seed}
          color={theme.particle}
          height={height}
        />
      ))}
    </Canvas>
  );
}
