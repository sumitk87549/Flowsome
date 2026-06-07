import React, { memo, useEffect, useMemo } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { ParticlePreset } from '../types';

const { width: W, height: H } = Dimensions.get('window');

interface ParticleConfig {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  driftX: number;
  driftY: number;
  radius: number;
  shape: 'circle' | 'leaf' | 'fog';
}

interface ParticleLayerProps {
  accentColor: string;
  count: number;
  preset: ParticlePreset;
}

const PRESET_META: Record<ParticlePreset, { max: number; shape: ParticleConfig['shape']; baseOpacity: number; size: [number, number]; direction: [number, number] }> = {
  sand: { max: 18, shape: 'circle', baseOpacity: 0.18, size: [1.4, 3.2], direction: [36, -26] },
  mistLeaves: { max: 22, shape: 'fog', baseOpacity: 0.14, size: [18, 54], direction: [20, -38] },
  fog: { max: 16, shape: 'fog', baseOpacity: 0.12, size: [34, 86], direction: [30, -18] },
  snow: { max: 20, shape: 'circle', baseOpacity: 0.2, size: [1.8, 4.4], direction: [14, 70] },
  bubbles: { max: 22, shape: 'circle', baseOpacity: 0.16, size: [2.5, 7], direction: [18, -86] },
};

function seeded(index: number, salt: number): number {
  const t = ((index + 1) * 2654435761) >>> 0;
  return ((t ^ salt) % 1000) / 1000;
}

const Particle = memo(function Particle({ config, accentColor, preset }: { config: ParticleConfig; accentColor: string; preset: ParticlePreset }) {
  const translate = useSharedValue(0);
  const alpha = useSharedValue(0);
  const scale = useSharedValue(0.86);

  useEffect(() => {
    translate.value = withDelay(
      config.delay,
      withRepeat(withTiming(1, { duration: config.duration, easing: Easing.inOut(Easing.ease) }), -1, false)
    );
    alpha.value = withDelay(
      config.delay,
      withRepeat(
        withSequence(
          withTiming(config.opacity, { duration: config.duration * 0.24, easing: Easing.out(Easing.ease) }),
          withTiming(config.opacity * 0.72, { duration: config.duration * 0.48, easing: Easing.linear }),
          withTiming(0, { duration: config.duration * 0.28, easing: Easing.in(Easing.ease) })
        ),
        -1,
        false
      )
    );
    scale.value = withDelay(
      config.delay,
      withRepeat(
        withSequence(
          withTiming(1.06, { duration: config.duration * 0.45, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.82, { duration: config.duration * 0.55, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );
  }, [alpha, config.delay, config.duration, config.opacity, scale, translate]);

  const style = useAnimatedStyle(() => ({
    opacity: alpha.value,
    transform: [
      { translateX: translate.value * config.driftX },
      { translateY: translate.value * config.driftY },
      { scale: scale.value },
      { rotate: `${translate.value * (preset === 'mistLeaves' ? 28 : 8)}deg` },
    ],
  }));

  const isFog = config.shape === 'fog';
  const isLeaf = config.shape === 'leaf';

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.particle,
        style,
        {
          left: config.x,
          top: config.y,
          width: config.size,
          height: isFog ? config.size * 0.36 : isLeaf ? config.size * 0.55 : config.size,
          borderRadius: config.radius,
          backgroundColor: isFog ? accentColor + '28' : accentColor,
          borderWidth: preset === 'bubbles' ? StyleSheet.hairlineWidth : 0,
          borderColor: preset === 'bubbles' ? accentColor + 'A0' : 'transparent',
        },
      ]}
    />
  );
});

export const ParticleLayer = memo(function ParticleLayer({ accentColor, count, preset }: ParticleLayerProps) {
  const meta = PRESET_META[preset];
  const safeCount = Math.min(count, meta.max);

  const particles = useMemo<ParticleConfig[]>(() => {
    return Array.from({ length: safeCount }, (_, i) => {
      const size = meta.size[0] + seeded(i, 0xfeedface) * (meta.size[1] - meta.size[0]);
      const shape: ParticleConfig['shape'] = preset === 'mistLeaves' && i % 7 === 0 ? 'leaf' : meta.shape;
      return {
        id: i,
        x: seeded(i, 0xdeadbeef) * (W - 32) + 16,
        y: seeded(i, 0xcafebabe) * H * 0.92 + H * 0.04,
        size,
        duration: 9000 + seeded(i, 0xbaddcafe) * 11000,
        delay: seeded(i, 0xabadc0de) * 5000,
        opacity: meta.baseOpacity + seeded(i, 0x1337beef) * 0.1,
        driftX: (seeded(i, 0x5185) - 0.5) * meta.direction[0] * 2,
        driftY: meta.direction[1] * (0.72 + seeded(i, 0x7219) * 0.56),
        radius: shape === 'leaf' ? size * 0.5 : size / 2,
        shape,
      };
    });
  }, [meta, preset, safeCount]);

  return (
    <>
      {particles.map((config) => (
        <Particle key={`${preset}-${config.id}`} config={config} accentColor={accentColor} preset={preset} />
      ))}
    </>
  );
});

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
  },
});
