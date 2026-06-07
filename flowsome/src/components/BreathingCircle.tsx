import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useAppStore } from '../store/appStore';
import { SessionPhase } from '../types';

interface BreathingCircleProps {
  phase: SessionPhase;
  size?: number;
}

function getScaleForPhase(phase: SessionPhase): number {
  switch (phase) {
    case 'inhale':
      return 1.35;
    case 'hold':
      return 1.35;
    case 'exhale':
      return 0.75;
    case 'rest':
      return 0.75;
    default:
      return 1;
  }
}

export function BreathingCircle({ phase, size = 200 }: BreathingCircleProps) {
  const theme = useAppStore((s) => s.currentTheme);
  const scale = useSharedValue(1);
  const outerOpacity = useSharedValue(0.2);

  useEffect(() => {
    const targetScale = getScaleForPhase(phase);
    const duration =
      phase === 'inhale' ? 4000
      : phase === 'hold' ? 0
      : phase === 'exhale' ? 6000
      : 2000;

    if (phase === 'hold' || phase === 'rest') {
      // No transition needed
      scale.value = withTiming(targetScale, { duration: 300 });
    } else {
      scale.value = withTiming(targetScale, {
        duration,
        easing: Easing.inOut(Easing.ease),
      });
    }

    outerOpacity.value = withRepeat(
      withSequence(
        withTiming(0.35, { duration: 1500 }),
        withTiming(0.1, { duration: 1500 })
      ),
      -1,
      true
    );
  }, [phase]);

  const innerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const outerStyle = useAnimatedStyle(() => ({
    opacity: outerOpacity.value,
    transform: [{ scale: scale.value * 1.25 }],
  }));

  const circleSize = size;

  return (
    <View style={[styles.container, { width: circleSize * 1.6, height: circleSize * 1.6 }]}>
      {/* Outer glow ring */}
      <Animated.View
        style={[
          styles.outerRing,
          outerStyle,
          {
            width: circleSize,
            height: circleSize,
            borderRadius: circleSize / 2,
            borderColor: theme.accentColor,
          },
        ]}
      />
      {/* Inner circle */}
      <Animated.View
        style={[
          styles.innerCircle,
          innerStyle,
          {
            width: circleSize,
            height: circleSize,
            borderRadius: circleSize / 2,
            backgroundColor: theme.accentColor + '18',
            borderColor: theme.accentColor + '60',
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    position: 'absolute',
    borderWidth: 1,
  },
  innerCircle: {
    borderWidth: 1.5,
  },
});
