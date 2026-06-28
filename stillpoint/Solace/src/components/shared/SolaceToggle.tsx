import React, { useEffect } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  interpolateColor,
} from 'react-native-reanimated';
import { useHaptic } from '@/hooks/useHaptic';
import { TIMING } from '@/constants/timing';
import { COLORS } from '@/constants/colors';
import * as Haptics from 'expo-haptics';

interface SolaceToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

const TRACK_WIDTH = 48;
const TRACK_HEIGHT = 28;
const THUMB_SIZE = 22;
const THUMB_OFF_X = 3;
const THUMB_ON_X = 23;

export default function SolaceToggle({ value, onValueChange, disabled }: SolaceToggleProps) {
  const { fire } = useHaptic();
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, { duration: TIMING.TOGGLE_TRANSITION });
  }, [value, progress]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [COLORS.toggleTrackOff, COLORS.toggleTrackOn]
    ),
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(progress.value, [0, 1], [THUMB_OFF_X, THUMB_ON_X]),
      },
    ],
  }));

  function handlePress() {
    if (disabled) return;
    fire(Haptics.ImpactFeedbackStyle.Light, false);
    onValueChange(!value);
  }

  return (
    <Pressable onPress={handlePress} hitSlop={8}>
      <Animated.View
        style={[
          {
            width: TRACK_WIDTH,
            height: TRACK_HEIGHT,
            borderRadius: TRACK_HEIGHT / 2,
            justifyContent: 'center',
          },
          trackStyle,
        ]}
      >
        <Animated.View
          style={[
            {
              width: THUMB_SIZE,
              height: THUMB_SIZE,
              borderRadius: THUMB_SIZE / 2,
              backgroundColor: COLORS.cream,
              position: 'absolute',
            },
            thumbStyle,
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}
