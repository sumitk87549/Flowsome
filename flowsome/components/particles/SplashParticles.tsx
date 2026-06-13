// components/particles/SplashParticles.tsx
import React, { memo, useMemo, useEffect } from 'react';
import { Canvas, Oval } from '@shopify/react-native-skia';
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

interface DropSeed {
  startX: number;
  initialOffset: number;
  radius: number;
  fallDuration: number;
  opacity: number;
}

const SplashDrop = memo(function SplashDrop({
  seed,
  color,
  height,
}: {
  seed: DropSeed;
  color: string;
  height: number;
}) {
  const t = useSharedValue(-seed.initialOffset);

  useEffect(() => {
    t.value = withRepeat(
      withTiming(height + 60, {
        duration: seed.fallDuration,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1), // slowly starts, speeds up, then slows (dripping on glass effect)
      }),
      -1,
      false,
    );
    return () => cancelAnimation(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const cy = useDerivedValue(() => Math.max(-50, t.value));
  
  // Create a slight sway or zig-zag for the water droplet dripping down
  const cx = useDerivedValue(() => {
      const progress = (t.value + seed.initialOffset) / (height + seed.initialOffset + 60);
      const sway = Math.sin(progress * Math.PI * 4) * 4;
      return seed.startX + sway;
  });

  const opacity = useDerivedValue(() => {
    if (t.value < 0) return 0;
    // Fade out as it drips off screen
    if (t.value > height - 60) return seed.opacity * Math.max(0, (height + 40 - t.value) / 100);
    return seed.opacity;
  });

  return (
    // Make them slightly elongated to look like dripping water
    <Oval x={cx} y={cy} width={seed.radius * 1.5} height={seed.radius * 3} color={color} opacity={opacity} />
  );
});

export default function SplashParticles({
  width,
  height,
  theme,
  breathPhase,
}: ParticleProps) {
  const PARTICLE_COUNT = 15; // very few drops

  const seeds: DropSeed[] = useMemo(
    () =>
      Array(PARTICLE_COUNT)
        .fill(0)
        .map(() => {
          return {
            startX:        10 + Math.random() * (width - 20),
            initialOffset: 50 + Math.random() * height * 1.5, // spread out start times
            radius:        1.5 + Math.random() * 2, // small drops
            fallDuration:  12000 + Math.random() * 8000, // very slow dripping
            opacity:       0.4 + Math.random() * 0.4,
          };
        }),
    [width, height],
  );

  if (width === 0) return null;

  return (
    <Canvas style={{ width, height }}>
      {seeds.map((seed, i) => (
        <SplashDrop
          key={i}
          seed={seed}
          color={theme.particle} // This will be the theme's particle color (cyan/white for Andaman)
          height={height}
        />
      ))}
    </Canvas>
  );
}
