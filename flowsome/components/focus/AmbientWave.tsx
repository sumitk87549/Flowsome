// components/focus/AmbientWave.tsx
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Canvas, Path } from '@shopify/react-native-skia';
import { Skia } from '@shopify/react-native-skia';
import {
  useSharedValue,
  withRepeat,
  withTiming,
  useDerivedValue,
  cancelAnimation,
} from 'react-native-reanimated';

interface AmbientWaveProps {
  width: number;
  color: string;
}

export default function AmbientWave({ width, color }: AmbientWaveProps) {
  const CANVAS_H = 80;
  const wavePhase = useSharedValue(0);
  const amplitude = useSharedValue(8);

  useEffect(() => {
    wavePhase.value = withRepeat(
      withTiming(Math.PI * 2, { duration: 4000 }),
      -1,
      false,
    );
    return () => {
      cancelAnimation(wavePhase);
    };
  }, []);

  useEffect(() => {
    amplitude.value = withRepeat(
      withTiming(14, { duration: 4000 }),
      -1,
      true, // reverses back and forth
    );
    return () => {
      cancelAnimation(amplitude);
    };
  }, []);

  const wavePath = useDerivedValue(() => {
    'worklet';
    const path = Skia.Path.Make();
    const steps = 80;
    const stepW = width / steps;
    const baseY = CANVAS_H / 2;

    path.moveTo(0, baseY);
    for (let i = 1; i <= steps; i++) {
      const x = i * stepW;
      const y =
        baseY +
        amplitude.value *
          Math.sin(wavePhase.value + (i / steps) * Math.PI * 4);
      path.lineTo(x, y);
    }
    return path;
  });

  return (
    <View pointerEvents="none" style={{ width, height: CANVAS_H }}>
      <Canvas style={{ width, height: CANVAS_H }}>
        <Path
          path={wavePath}
          color={color}
          opacity={0.10}
          style="stroke"
          strokeWidth={1.5}
        />
      </Canvas>
    </View>
  );
}
