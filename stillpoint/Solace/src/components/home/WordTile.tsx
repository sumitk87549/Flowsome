import React, { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { useHaptic } from '@/hooks/useHaptic';
import { COLORS } from '@/constants/colors';
import { FONT, FS, TRACKING } from '@/constants/typography';
import { TIMING } from '@/constants/timing';
import * as Haptics from 'expo-haptics';

// Fixed tile dimensions — required for FlatList.getItemLayout
export const TILE_WIDTH = 110;
export const TILE_HEIGHT = 52;
export const TILE_HORIZONTAL_MARGIN = 6;

interface WordTileProps {
  word: string;
  isSelected: boolean;
  onPress: () => void;
}

export default function WordTile({ word, isSelected, onPress }: WordTileProps) {
  const { fire } = useHaptic();
  const progress = useSharedValue(isSelected ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isSelected ? 1 : 0, {
      duration: TIMING.TILE_TRANSITION,
    });
  }, [isSelected, progress]);

  const containerStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      ['rgba(232,223,208,0.15)', 'rgba(212,149,106,0.60)']
    ),
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ['transparent', 'rgba(212,149,106,0.07)']
    ),
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: isSelected ? 1 : 0.55,
    color: interpolateColor(
      progress.value,
      [0, 1],
      [COLORS.cream, COLORS.cream]
    ),
  }));

  function handlePress() {
    fire(Haptics.ImpactFeedbackStyle.Light, false);
    onPress();
  }

  return (
    <Pressable onPress={handlePress}>
      <Animated.View style={[styles.tile, containerStyle]}>
        <Animated.Text style={[styles.tileText, textStyle]}>
          {word}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: TILE_WIDTH,
    height: TILE_HEIGHT,
    marginHorizontal: TILE_HORIZONTAL_MARGIN,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileText: {
    fontFamily: FONT.light,
    fontSize: FS.base,
    letterSpacing: TRACKING.base,
  },
});
