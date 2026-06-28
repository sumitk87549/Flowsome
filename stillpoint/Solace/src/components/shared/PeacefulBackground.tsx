import React, { useEffect } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import {
  Canvas,
  LinearGradient,
  RadialGradient,
  Rect,
  vec,
  Circle,
} from '@shopify/react-native-skia';
import {
  useSharedValue,
  withTiming,
  withRepeat,
  Easing,
  useDerivedValue,
} from 'react-native-reanimated';
import { useTheme } from '@/design/theme';

interface PeacefulBackgroundProps {
  isPaused?: boolean;
}

// More particles, smaller size
const PARTICLE_COUNT = 72;

function generateMotes(width: number, height: number) {
  const motes = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    motes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      // Smaller: 0.4–1.2 px radius
      size: Math.random() * 0.8 + 0.4,
      speed: Math.random() * 0.4 + 0.15,
      offset: Math.random() * Math.PI * 2,
      // Vary horizontal drift amplitude
      drift: Math.random() * 14 + 6,
    });
  }
  return motes;
}

export function PeacefulBackground({ isPaused = false }: PeacefulBackgroundProps) {
  const { width, height } = useWindowDimensions();
  const theme = useTheme();
  const isNight = theme.mode === 'night';

  const time = useSharedValue(0);

  useEffect(() => {
    time.value = withRepeat(
      withTiming(100, { duration: 100000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const motes = React.useMemo(
    () => generateMotes(width, height),
    [width, height]
  );

  // Gradient — night: dark navy to slightly lighter navy
  // Dawn: warm parchment top to slightly deeper at bottom
  const nightColors: [string, string] = [
    theme.colors.backgroundDeep,
    theme.colors.background,
  ];
  const dawnColors: [string, string] = [
    theme.colors.background,
    theme.colors.backgroundDeep,
  ];
  const gradientColors = isNight ? nightColors : dawnColors;

  // Particle color: night = soft cream glow, dawn = warm amber
  // Use theme accent with full control
  const particleColorNight = '#C8A882'; // warm cream-gold
  const particleColorDawn  = '#B87A5A'; // warm terracotta

  return (
    <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Base gradient */}
      <Rect x={0} y={0} width={width} height={height}>
        <LinearGradient
          start={vec(width / 2, 0)}
          end={vec(width / 2, height)}
          colors={gradientColors}
        />
      </Rect>

      {/* Night: subtle warm orb at center-bottom */}
      {isNight && (
        <Circle cx={width / 2} cy={height * 0.72} r={width * 0.72} opacity={0.055}>
          <RadialGradient
            c={vec(width / 2, height * 0.72)}
            r={width * 0.72}
            colors={['#C8903A', 'transparent']}
          />
        </Circle>
      )}

      {/* Dawn: very faint warm glow in upper third */}
      {!isNight && (
        <Circle cx={width / 2} cy={height * 0.30} r={width * 0.55} opacity={0.06}>
          <RadialGradient
            c={vec(width / 2, height * 0.30)}
            r={width * 0.55}
            colors={['#D49A72', 'transparent']}
          />
        </Circle>
      )}

      {/* Floating dust particles */}
      {motes.map((mote, i) => {
        const cx = useDerivedValue(() => {
          const speedFactor = isPaused ? 0.08 : 1;
          return (
            mote.x +
            Math.sin(time.value * mote.speed + mote.offset) *
              mote.drift *
              speedFactor
          );
        });
        const cy = useDerivedValue(() => {
          const speedFactor = isPaused ? 0.08 : 1;
          // Float upward, wrap around
          return (
            ((mote.y - time.value * 18 * mote.speed * speedFactor) %
              height +
              height) %
            height
          );
        });

        return (
          <Circle
            key={i}
            cx={cx}
            cy={cy}
            r={mote.size}
            color={isNight ? particleColorNight : particleColorDawn}
            // Night: slightly more visible, dawn: subtle
            opacity={isNight ? 0.18 : 0.22}
          />
        );
      })}
    </Canvas>
  );
}
