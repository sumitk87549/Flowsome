import React, { useEffect, useMemo } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withDelay,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const { width: W, height: H } = Dimensions.get('window');

interface ParticleConfig {
  id: number;
  x: number;
  startY: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

interface ParticleLayerProps {
  accentColor: string;
  count: number;
}

// ─── Single Particle ─────────────────────────────────────────────────────────

function Particle({
  x,
  startY,
  size,
  duration,
  delay,
  maxOpacity,
  accentColor,
}: ParticleConfig & { maxOpacity: number; accentColor: string }) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.6);

  useEffect(() => {
    // Float upward
    translateY.value = withDelay(
      delay,
      withRepeat(
        withTiming(-H * 0.55, { duration, easing: Easing.inOut(Easing.ease) }),
        -1,
        false
      )
    );

    // Fade in → sustain → fade out
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(maxOpacity, { duration: duration * 0.25, easing: Easing.out(Easing.ease) }),
          withTiming(maxOpacity * 0.7, { duration: duration * 0.5 }),
          withTiming(0, { duration: duration * 0.25, easing: Easing.in(Easing.ease) })
        ),
        -1,
        false
      )
    );

    // Gentle scale pulse
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: duration * 0.4 }),
          withTiming(0.5, { duration: duration * 0.6 })
        ),
        -1,
        false
      )
    );

    return () => {
      translateY.value = 0;
      opacity.value = 0;
    };
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        style,
        {
          position: 'absolute',
          left: x,
          top: startY,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: accentColor,
        },
      ]}
    />
  );
}

// ─── Layer ───────────────────────────────────────────────────────────────────

/**
 * ParticleLayer renders floating ambient particles.
 * count is capped at 16 for performance.
 * Each particle has deterministic-random placement seeded by its index.
 */
export function ParticleLayer({ accentColor, count }: ParticleLayerProps) {
  const safeCount = Math.min(count, 16);

  const particles: ParticleConfig[] = useMemo(() => {
    return Array.from({ length: safeCount }, (_, i) => {
      // Pseudo-random using index as seed — deterministic, no Math.random() on re-render
      const t = (i * 2654435761) >>> 0; // Knuth multiplicative hash
      const norm = (n: number) => (n % 1000) / 1000; // 0..1

      return {
        id: i,
        x: norm(t ^ 0xdeadbeef) * (W - 20) + 10,
        startY: H * 0.4 + norm(t ^ 0xcafebabe) * H * 0.45,
        size: 2 + norm(t ^ 0xfeedface) * 2.5,   // 2–4.5px
        duration: 8000 + norm(t ^ 0xbaddcafe) * 6000, // 8–14s
        delay: norm(t ^ 0xabadc0de) * 5000,          // 0–5s initial delay
        opacity: 0.15 + norm(t ^ 0x1337beef) * 0.2,  // 0.15–0.35
      };
    });
  }, [safeCount]);

  return (
    <>
      {particles.map((p) => (
        <Particle
          key={p.id}
          {...p}
          maxOpacity={p.opacity}
          accentColor={accentColor}
        />
      ))}
    </>
  );
}
