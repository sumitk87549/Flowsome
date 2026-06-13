// components/particles/SnowParticles.tsx — Sprint 13: Variety + sinusoidal sway
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
  initialOffset: number;
  radius: number;
  fallDuration: number;
  swayAmpX: number;
  swayFreq: number;
  opacity: number;
}

const SnowFlake = memo(function SnowFlake({
  seed,
  color,
  height,
  breathPhase,
}: {
  seed: SnowSeed;
  color: string;
  height: number;
  breathPhase?: string;
}) {
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

  const cy = useDerivedValue(() => t.value);

  // Sinusoidal sway + breath reaction
  const cx = useDerivedValue(() => {
    const totalRange = height + 40 + seed.initialOffset;
    const progress = (t.value + seed.initialOffset) / totalRange;
    // True sinusoidal oscillation instead of linear
    const sway = seed.swayAmpX * Math.sin(progress * Math.PI * 2 * seed.swayFreq);
    // On inhale, drift inward toward center
    let breathOffset = 0;
    if (breathPhase === 'inhale') {
      const centerX = seed.startX > 200 ? -6 : 6; // drift toward center
      breathOffset = centerX * Math.sin(progress * Math.PI);
    }
    return seed.startX + sway + breathOffset;
  });

  const opacity = useDerivedValue(() => {
    if (t.value < 30)           return seed.opacity * Math.max(0, (t.value + 30) / 60);
    if (t.value > height - 30) return seed.opacity * Math.max(0, (height + 40 - t.value) / 70);
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
  const PARTICLE_COUNT = 50; // increased from 28

  const seeds: SnowSeed[] = useMemo(
    () =>
      Array(PARTICLE_COUNT)
        .fill(0)
        .map(() => {
          // Large flakes drift slowly, small ones fall fast
          const isLarge = Math.random() < 0.3;
          return {
            startX:        Math.random() * width,
            initialOffset: 20 + Math.random() * height,
            radius:        isLarge ? (3 + Math.random() * 2) : (1 + Math.random() * 1.5),
            fallDuration:  isLarge ? (10000 + Math.random() * 8000) : (5000 + Math.random() * 5000),
            swayAmpX:      isLarge ? (18 + Math.random() * 25) : (8 + Math.random() * 15),
            swayFreq:      0.5 + Math.random() * 1.5,
            opacity:       isLarge ? (0.5 + Math.random() * 0.35) : (0.3 + Math.random() * 0.4),
          };
        }),
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
          breathPhase={breathPhase}
        />
      ))}
    </Canvas>
  );
}
