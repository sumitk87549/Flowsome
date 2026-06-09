// components/particles/WaterRipple.tsx
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
const RIPPLE_COUNT = 6;

interface Ripple {
  cx: number;
  cy: number;
  maxR: number;
  phase: number;
}

const ripples: Ripple[] = Array.from({ length: RIPPLE_COUNT }, (_, i) => ({
  cx: width * 0.3 + Math.random() * width * 0.4,
  cy: height * 0.4 + Math.random() * height * 0.3,
  maxR: 60 + Math.random() * 60,
  phase: i / RIPPLE_COUNT,
}));

// ─── Sub-component ────────────────────────────────────────────────────────────
interface RippleItemProps {
  ripple: Ripple;
  t: SharedValue<number>;
  color: string;
}

function RippleItem({ ripple: r, t, color }: RippleItemProps) {
  const radius = useDerivedValue(() => {
    return ((t.value + r.phase) % 1) * r.maxR;
  });

  const opacity = useDerivedValue(() => {
    return (1 - ((t.value + r.phase) % 1)) * 0.4;
  });

  return (
    <Circle
      cx={r.cx}
      cy={r.cy}
      r={radius}
      color={color}
      style="stroke"
      strokeWidth={1.5}
      opacity={opacity}
    />
  );
}

// ─── Parent ───────────────────────────────────────────────────────────────────
export function WaterRipple() {
  const { activeTheme, dayNight } = useAppStore();
  const colors = dayNight === 'day'
    ? THEMES[activeTheme].dayColors
    : THEMES[activeTheme].nightColors;
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withRepeat(
      withTiming(1, { duration: 4000, easing: Easing.linear }),
      -1,
      false,
    );
  }, []);

  return (
    <>
      {ripples.map((r, i) => (
        <RippleItem key={i} ripple={r} t={t} color={colors.particle} />
      ))}
    </>
  );
}
