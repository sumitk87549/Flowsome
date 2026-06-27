import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  SharedValue,
} from 'react-native-reanimated';
import { useSession } from '@/context/SessionContext';
import { useSettings } from '@/context/SettingsContext';
import { COLORS } from '@/constants/colors';
import { TIMING } from '@/constants/timing';

const DOT_SIZE = 6;
const DOT_ACTIVE_SIZE = 8;
const DOT_GAP = 12;

interface DotProps {
  index: number;
  status: 'pending' | 'active' | 'completed';
  entryDelay: number;
}

function Dot({ index, status, entryDelay }: DotProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.6);

  useEffect(() => {
    opacity.value = withDelay(
      entryDelay + index * TIMING.HOME_DOT_STAGGER,
      withTiming(1, { duration: TIMING.HOME_DOT_DURATION })
    );
    scale.value = withDelay(
      entryDelay + index * TIMING.HOME_DOT_STAGGER,
      withTiming(1, { duration: TIMING.HOME_DOT_DURATION })
    );
  }, [entryDelay, index, opacity, scale]);

  const dotStyle = useAnimatedStyle(() => {
    const size = status === 'active' ? DOT_ACTIVE_SIZE : DOT_SIZE;
    const bgColor =
      status === 'pending'
        ? 'rgba(232,223,208,0.25)'
        : COLORS.amber;
    const dotOpacity =
      status === 'pending' ? 0.4 : status === 'completed' ? 1 : 0.9;

    return {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: bgColor,
      opacity: opacity.value * dotOpacity,
      transform: [{ scale: scale.value }],
    };
  });

  return <Animated.View style={dotStyle} />;
}

interface SessionDotsProps {
  entryDelay: number;
  containerOpacity: SharedValue<number>;
}

export default function SessionDots({ entryDelay, containerOpacity }: SessionDotsProps) {
  const { sessionsCompletedToday } = useSession();
  const { settings } = useSettings();
  const totalDots = 4; // Always show 4 dots visually

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  function getDotStatus(dotIndex: number): 'pending' | 'active' | 'completed' {
    const completed = sessionsCompletedToday % settings.sessionsUntilLongRest;
    if (dotIndex < completed) return 'completed';
    if (dotIndex === completed) return 'active';
    return 'pending';
  }

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {Array.from({ length: totalDots }, (_, i) => (
        <View key={i} style={styles.dotWrapper}>
          <Dot
            index={i}
            status={getDotStatus(i)}
            entryDelay={entryDelay}
          />
        </View>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotWrapper: {
    marginHorizontal: DOT_GAP / 2,
    alignItems: 'center',
    justifyContent: 'center',
    width: DOT_ACTIVE_SIZE,
    height: DOT_ACTIVE_SIZE,
  },
});
