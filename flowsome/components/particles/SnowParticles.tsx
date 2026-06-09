// components/particles/SnowParticles.tsx
import { useEffect } from 'react';
import { Dimensions } from 'react-native';
import { Circle } from '@shopify/react-native-skia';
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
const FLAKE_COUNT = 50;

interface Flake {
  x: number;
  startY: number;
  r: number;
  speed: number;
  sway: number;
  phase: number;
}

// startY ranges from -height to +height so flakes are staggered on first render
const flakes: Flake[] = Array.from({ length: FLAKE_COUNT }, () => ({
  x: Math.random() * width,
  startY: Math.random() * height * 2 - height,
  r: Math.random() * 3 + 0.5,
  speed: Math.random() * 0.6 + 0.2,
  sway: Math.random() * 30 + 10,
  phase: Math.random() * Math.PI * 2,
}));

// ─── Sub-component ────────────────────────────────────────────────────────────
interface SnowFlakeItemProps {
  flake: Flake;
  t: SharedValue<number>;
  color: string;
}

function SnowFlakeItem({ flake: f, t, color }: SnowFlakeItemProps) {
  const cy = useDerivedValue(() => {
    const rawY = f.startY + t.value * f.speed * (height + 40) * 2;
    return ((rawY % (height + 40)) + (height + 40)) % (height + 40) - 40;
  });

  const cx = useDerivedValue(() => {
    return f.x + Math.sin(t.value * Math.PI * 4 + f.phase) * f.sway;
  });

  return <Circle cx={cx} cy={cy} r={f.r} color={color} opacity={0.7} />;
}

// ─── Parent ───────────────────────────────────────────────────────────────────
export function SnowParticles() {
  const { activeTheme, dayNight } = useAppStore();
  const colors = dayNight === 'day'
    ? THEMES[activeTheme].dayColors
    : THEMES[activeTheme].nightColors;
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withRepeat(
      withTiming(1, { duration: 14000, easing: Easing.linear }),
      -1,
      false,
    );
  }, []);

  return (
    <>
      {flakes.map((f, i) => (
        <SnowFlakeItem key={i} flake={f} t={t} color={colors.particle} />
      ))}
    </>
  );
}
