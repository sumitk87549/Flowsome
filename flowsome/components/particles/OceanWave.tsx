// components/particles/OceanWave.tsx
import { useEffect } from 'react';
import { Dimensions } from 'react-native';
import { Path, Skia, SkPath } from '@shopify/react-native-skia';
import {
  useSharedValue,
  useDerivedValue,
  withRepeat,
  withTiming,
  Easing,
  SharedValue,
} from 'react-native-reanimated';
import { useAppStore } from '../../store/appStore';
import { THEMES } from '../../constants/themes';

const { width, height } = Dimensions.get('window');

interface WaveLayer {
  yBase: number;
  amplitude: number;
  frequency: number;
  speed: number;
  opacity: number;
}

const WAVE_LAYERS: WaveLayer[] = [
  { yBase: height * 0.75, amplitude: 18, frequency: 0.012, speed: 1.0, opacity: 0.25 },
  { yBase: height * 0.80, amplitude: 12, frequency: 0.015, speed: 0.7, opacity: 0.18 },
  { yBase: height * 0.85, amplitude: 8,  frequency: 0.020, speed: 1.3, opacity: 0.12 },
];

// ─── Sub-component ────────────────────────────────────────────────────────────
interface WaveLayerItemProps {
  wave: WaveLayer;
  t: SharedValue<number>;
  color: string;
}

function WaveLayerItem({ wave, t, color }: WaveLayerItemProps) {
  // Skia.Path.Make() is worklet-safe in @shopify/react-native-skia v1.x
  const path = useDerivedValue((): SkPath => {
    const skPath = Skia.Path.Make();
    const offset = t.value * Math.PI * 4 * wave.speed;
    skPath.moveTo(0, wave.yBase);
    for (let x = 0; x <= width; x += 4) {
      const y = wave.yBase + Math.sin(x * wave.frequency + offset) * wave.amplitude;
      skPath.lineTo(x, y);
    }
    skPath.lineTo(width, height);
    skPath.lineTo(0, height);
    skPath.close();
    return skPath;
  });

  return (
    <Path
      path={path}
      color={color}
      opacity={wave.opacity}
      style="fill"
    />
  );
}

// ─── Parent ───────────────────────────────────────────────────────────────────
export function OceanWave() {
  const { activeTheme, dayNight } = useAppStore();
  const colors = dayNight === 'day'
    ? THEMES[activeTheme].dayColors
    : THEMES[activeTheme].nightColors;
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withRepeat(
      withTiming(1, { duration: 8000, easing: Easing.linear }),
      -1,
      false,
    );
  }, []);

  return (
    <>
      {WAVE_LAYERS.map((wave, i) => (
        <WaveLayerItem key={i} wave={wave} t={t} color={colors.particle} />
      ))}
    </>
  );
}
