// components/particles/SplashParticles.tsx
import React, { memo, useMemo, useEffect } from 'react';
import { Canvas, Oval, Group, Blur, LinearGradient, vec } from '@shopify/react-native-skia';
import {
  useSharedValue,
  useDerivedValue,
  withRepeat,
  withTiming,
  cancelAnimation,
  Easing,
  withDelay,
} from 'react-native-reanimated';

interface ParticleProps {
  width: number;
  height: number;
  theme: any;
  breathPhase?: string;
}

interface DropSeed {
  x: number;
  y: number;
  w: number;
  h: number;
  type: 'static' | 'dripping';
  delay: number;
  duration: number;
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
  const t = useSharedValue(0);

  useEffect(() => {
    if (seed.type === 'dripping') {
      t.value = withDelay(
        seed.delay,
        withRepeat(
          withTiming(1, {
            duration: seed.duration,
            // Dripping on glass: starts slow, accelerates quickly, then slows down, repeats
            easing: Easing.bezier(0.5, 0, 0.2, 1),
          }),
          -1,
          false
        )
      );
    } else {
      // Static drops might slowly slide down a tiny bit or just fade in/out
      t.value = withDelay(
        seed.delay,
        withRepeat(
          withTiming(1, {
            duration: seed.duration,
            easing: Easing.inOut(Easing.ease),
          }),
          -1,
          true
        )
      );
    }
    return () => cancelAnimation(t);
  }, [seed]); // eslint-disable-line react-hooks/exhaustive-deps

  const transform = useDerivedValue(() => {
    if (seed.type === 'dripping') {
      // It falls from its start y to the bottom of the screen
      const currentY = seed.y + t.value * (height + 100 - seed.y);
      // Slight sway mimicking a jagged dripping path
      const sway = Math.sin(t.value * Math.PI * 6) * 3;
      return [
        { translateX: seed.x + sway },
        { translateY: currentY },
      ];
    } else {
      // Static drop slowly creeps down slightly
      return [
        { translateX: seed.x },
        { translateY: seed.y + t.value * 10 },
      ];
    }
  });

  const opacity = useDerivedValue(() => {
    if (seed.type === 'dripping') {
      // Fade in at start, fade out at very bottom
      if (t.value < 0.05) return (t.value / 0.05) * seed.opacity;
      if (t.value > 0.9) return ((1 - t.value) / 0.1) * seed.opacity;
      return seed.opacity;
    } else {
      // Pulse opacity slightly for shimmer effect
      return seed.opacity * (0.8 + 0.2 * Math.sin(t.value * Math.PI));
    }
  });

  const w = seed.w;
  const h = seed.h;

  return (
    <Group transform={transform} opacity={opacity}>
      {/* Drop shadow for depth against the "glass" */}
      <Oval x={1} y={2} width={w} height={h} color="rgba(0,0,0,0.3)">
        <Blur blur={2} />
      </Oval>

      {/* Main drop body with simulated refraction */}
      <Oval x={0} y={0} width={w} height={h}>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(0, h)}
          colors={['rgba(20,20,20,0.2)', 'rgba(255,255,255,0.5)']}
        />
      </Oval>

      {/* Subtle theme tint */}
      <Oval x={0} y={0} width={w} height={h} color={color} opacity={0.15} />

      {/* Primary top-left highlight */}
      <Oval x={w * 0.15} y={h * 0.1} width={w * 0.4} height={h * 0.3} color="rgba(255,255,255,0.9)" />
      
      {/* Secondary bottom reflection */}
      <Oval x={w * 0.3} y={h * 0.7} width={w * 0.4} height={h * 0.2} color="rgba(255,255,255,0.6)" />
    </Group>
  );
});

export default function SplashParticles({
  width,
  height,
  theme,
  breathPhase,
}: ParticleProps) {
  const STATIC_COUNT = 30; // Real drops sitting on the glass
  const DRIP_COUNT = 8;    // Few drops falling

  const seeds: DropSeed[] = useMemo(() => {
    const drops: DropSeed[] = [];
    
    // Generate static drops
    for (let i = 0; i < STATIC_COUNT; i++) {
      const radius = 1.5 + Math.random() * 3;
      drops.push({
        x: 10 + Math.random() * (width - 20),
        y: Math.random() * height,
        w: radius * 2,
        h: radius * 2.2, // Slightly elongated
        type: 'static',
        delay: Math.random() * 5000,
        duration: 4000 + Math.random() * 4000,
        opacity: 0.4 + Math.random() * 0.4,
      });
    }

    // Generate dripping drops
    for (let i = 0; i < DRIP_COUNT; i++) {
      const radius = 2 + Math.random() * 2;
      drops.push({
        x: 10 + Math.random() * (width - 20),
        y: -50 + (Math.random() * height * 0.5), // Start anywhere above or slightly below the top edge
        w: radius * 2,
        h: radius * 3.5, // More elongated for moving drops
        type: 'dripping',
        delay: Math.random() * 15000,
        duration: 8000 + Math.random() * 8000, // Very slow dripping
        opacity: 0.5 + Math.random() * 0.4,
      });
    }

    return drops;
  }, [width, height]);

  if (width === 0) return null;

  return (
    <Canvas style={{ width, height }}>
      {seeds.map((seed, i) => (
        <SplashDrop
          key={i}
          seed={seed}
          color={theme.particle}
          height={height}
        />
      ))}
    </Canvas>
  );
}
