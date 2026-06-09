// components/particles/DustParticles.tsx
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
const PARTICLE_COUNT = 35;

interface Particle {
  x: number;
  y: number;
  r: number;
  speed: number;
  drift: number;
  phase: number;
}

// Generated once at module load — random but stable per app session
const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
  x: Math.random() * width,
  y: Math.random() * height,
  r: Math.random() * 2.5 + 0.8,
  speed: Math.random() * 0.4 + 0.1,
  drift: (Math.random() - 0.5) * 0.3,
  phase: Math.random() * Math.PI * 2,
}));

// ─── Sub-component: hooks are at top level here, NOT in a .map() ──────────────
interface DustParticleItemProps {
  particle: Particle;
  t: SharedValue<number>;
  color: string;
}

function DustParticleItem({ particle: p, t, color }: DustParticleItemProps) {
  const cx = useDerivedValue(() => {
    const progress = (t.value + p.phase / (Math.PI * 2)) % 1;
    const rawX = p.x + p.drift * progress * width * 2;
    return ((rawX % (width + 20)) + (width + 20)) % (width + 20) - 10;
  });

  const cy = useDerivedValue(() => {
    const progress = (t.value + p.phase / (Math.PI * 2)) % 1;
    const rawY = p.y - progress * p.speed * height * 1.5;
    return ((rawY % (height + 20)) + (height + 20)) % (height + 20);
  });

  const opacity = useDerivedValue(() => {
    return 0.2 + 0.4 * Math.abs(Math.sin(t.value * Math.PI * 2 + p.phase));
  });

  return <Circle cx={cx} cy={cy} r={p.r} color={color} opacity={opacity} />;
}

// ─── Parent: creates shared clock, renders sub-components ────────────────────
export function DustParticles() {
  const { activeTheme, dayNight } = useAppStore();
  const colors = dayNight === 'day'
    ? THEMES[activeTheme].dayColors
    : THEMES[activeTheme].nightColors;
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withRepeat(
      withTiming(1, { duration: 12000, easing: Easing.linear }),
      -1,
      false,
    );
  }, []);

  return (
    <>
      {particles.map((p, i) => (
        <DustParticleItem key={i} particle={p} t={t} color={colors.particle} />
      ))}
    </>
  );
}
