// components/timer/CircularTimer.tsx
import { View } from 'react-native';
import Svg, { Circle as SvgCircle } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';

const AnimatedCircle = Animated.createAnimatedComponent(SvgCircle);

interface CircularTimerProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  isBreak?: boolean;
}

export function CircularTimer({ progress, size = 280, strokeWidth = 6, isBreak = false }: CircularTimerProps) {
  const theme = useTheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  const animProgress = useSharedValue(0);

  useEffect(() => {
    const clampedProgress = Math.max(0, Math.min(1, isNaN(progress) ? 0 : progress));
    animProgress.value = withTiming(clampedProgress, { duration: 900 });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - animProgress.value),
  }));

  const trackColor = theme.cardBorder;
  const progressColor = isBreak ? theme.textSecondary : theme.primary;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <SvgCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}
