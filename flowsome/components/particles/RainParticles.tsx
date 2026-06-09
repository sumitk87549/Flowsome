// components/particles/RainParticles.tsx
import { useEffect } from 'react';
import { Dimensions } from 'react-native';
import { Rect } from '@shopify/react-native-skia';
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
const DROP_COUNT = 60;

interface RainDrop {
  x: number;
  startY: number;
  length: number;
  speed: number;
  opacity: number;
}

const drops: RainDrop[] = Array.from({ length: DROP_COUNT }, () => ({
  x: Math.random() * width,
  startY: Math.random() * height,
  length: Math.random() * 18 + 10,
  speed: Math.random() * 0.8 + 0.5,
  opacity: Math.random() * 0.3 + 0.1,
}));

// ─── Sub-component ────────────────────────────────────────────────────────────
interface RainDropItemProps {
  drop: RainDrop;
  t: SharedValue<number>;
  color: string;
}

function RainDropItem({ drop: d, t, color }: RainDropItemProps) {
  const y = useDerivedValue(() => {
    const rawY = d.startY + t.value * d.speed * (height + d.length) * 2;
    return (
      ((rawY % (height + d.length)) + (height + d.length)) % (height + d.length) - d.length
    );
  });

  return (
    <Rect
      x={d.x}
      y={y}
      width={1}
      height={d.length}
      color={color}
      opacity={d.opacity}
    />
  );
}

// ─── Parent ───────────────────────────────────────────────────────────────────
export function RainParticles() {
  const { activeTheme, dayNight } = useAppStore();
  const colors = dayNight === 'day'
    ? THEMES[activeTheme].dayColors
    : THEMES[activeTheme].nightColors;
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withRepeat(
      withTiming(1, { duration: 5000, easing: Easing.linear }),
      -1,
      false,
    );
  }, []);

  return (
    <>
      {drops.map((d, i) => (
        <RainDropItem key={i} drop={d} t={t} color={colors.particle} />
      ))}
    </>
  );
}
