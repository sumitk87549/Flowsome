// components/meditation/TratakaFlame.tsx
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Canvas, Path } from '@shopify/react-native-skia';
import {
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  useDerivedValue,
  cancelAnimation,
} from 'react-native-reanimated';
import { Skia } from '@shopify/react-native-skia';
import * as Brightness from 'expo-brightness';

interface TratakaFlameProps {
  isActive: boolean;
}

export default function TratakaFlame({ isActive }: TratakaFlameProps) {
  const sway = useSharedValue(0);
  const heightOsc = useSharedValue(1);
  const flicker = useSharedValue(1);

  // Brightness control
  useEffect(() => {
    let originalBrightness = 0.5;
    if (isActive) {
      Brightness.getBrightnessAsync()
        .then((b) => {
          originalBrightness = b;
          return Brightness.setBrightnessAsync(0.8);
        })
        .catch(() => {});
    }
    return () => {
      Brightness.setBrightnessAsync(originalBrightness).catch(() => {});
    };
  }, [isActive]);

  // Slow sway
  useEffect(() => {
    sway.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 1200 }),
        withTiming(6, { duration: 900 }),
        withTiming(-3, { duration: 1500 }),
        withTiming(4, { duration: 800 }),
      ),
      -1,
      false,
    );
    return () => {
      cancelAnimation(sway);
    };
  }, []);

  // Height breathes
  useEffect(() => {
    heightOsc.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 2000 }),
        withTiming(0.94, { duration: 1800 }),
        withTiming(1.04, { duration: 2200 }),
      ),
      -1,
      false,
    );
    return () => {
      cancelAnimation(heightOsc);
    };
  }, []);

  // Flicker
  useEffect(() => {
    flicker.value = withRepeat(
      withSequence(
        withTiming(0.97, { duration: 80 }),
        withTiming(1.0, { duration: 120 }),
        withTiming(0.96, { duration: 60 }),
        withTiming(1.0, { duration: 200 }),
      ),
      -1,
      false,
    );
    return () => {
      cancelAnimation(flicker);
    };
  }, []);

  const CANVAS_W = 200;
  const CANVAS_H = 340;
  const BASE_X = CANVAS_W / 2;
  const BASE_Y = CANVAS_H - 40;

  // Outer halo flame path
  const outerFlamePath = useDerivedValue(() => {
    'worklet';
    const s = sway.value;
    const h = heightOsc.value * flicker.value;
    const path = Skia.Path.Make();
    const tipY = BASE_Y - 160 * h;
    path.moveTo(BASE_X - 35, BASE_Y);
    path.cubicTo(BASE_X - 45 + s * 0.5, BASE_Y - 80, BASE_X + s * 1.2, tipY + 20, BASE_X + s, tipY);
    path.cubicTo(BASE_X + s * 0.8, tipY + 20, BASE_X + 45 + s * 0.5, BASE_Y - 80, BASE_X + 35, BASE_Y);
    path.close();
    return path;
  });

  // Middle flame
  const midFlamePath = useDerivedValue(() => {
    'worklet';
    const s = sway.value * 0.8;
    const h = heightOsc.value * flicker.value;
    const path = Skia.Path.Make();
    const tipY = BASE_Y - 120 * h;
    path.moveTo(BASE_X - 20, BASE_Y);
    path.cubicTo(BASE_X - 28 + s * 0.4, BASE_Y - 60, BASE_X + s, tipY + 15, BASE_X + s, tipY);
    path.cubicTo(BASE_X + s, tipY + 15, BASE_X + 28 + s * 0.4, BASE_Y - 60, BASE_X + 20, BASE_Y);
    path.close();
    return path;
  });

  // Inner bright core
  const innerFlamePath = useDerivedValue(() => {
    'worklet';
    const s = sway.value * 0.5;
    const h = heightOsc.value * flicker.value;
    const path = Skia.Path.Make();
    const tipY = BASE_Y - 75 * h;
    path.moveTo(BASE_X - 10, BASE_Y);
    path.cubicTo(BASE_X - 14 + s * 0.3, BASE_Y - 35, BASE_X + s, tipY + 10, BASE_X + s, tipY);
    path.cubicTo(BASE_X + s, tipY + 10, BASE_X + 14 + s * 0.3, BASE_Y - 35, BASE_X + 10, BASE_Y);
    path.close();
    return path;
  });

  // Wax pool — built as an oval path (safe with derived values)
  const poolPath = useDerivedValue(() => {
    'worklet';
    const poolW = 52 + sway.value * 0.3;
    const poolH = 12 + flicker.value * 1.5;
    const path = Skia.Path.Make();
    path.addOval({
      x: BASE_X - poolW / 2,
      y: BASE_Y - 6 - poolH / 2,
      width: poolW,
      height: poolH,
    });
    return path;
  });

  return (
    <View style={styles.container}>
      <Canvas style={{ width: CANVAS_W, height: CANVAS_H }}>
        {/* Outer halo */}
        <Path path={outerFlamePath} color="#FF6B00" opacity={0.25} />
        {/* Middle flame */}
        <Path path={midFlamePath} color="#FF8C00" opacity={0.70} />
        {/* Inner core */}
        <Path path={innerFlamePath} color="#FFF176" opacity={0.95} />
        {/* Wax pool */}
        <Path path={poolPath} color="#FFF9C4" opacity={0.5} />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
