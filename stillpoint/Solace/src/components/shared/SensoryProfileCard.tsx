import React, { useEffect } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { useHaptic } from '@/hooks/useHaptic';
import { COLORS } from '@/constants/colors';
import { FONT, FS } from '@/constants/typography';
import { TIMING } from '@/constants/timing';
import * as Haptics from 'expo-haptics';
import { SensoryProfile } from '@/types/settings';

interface SensoryProfileCardProps {
  profile: SensoryProfile;
  label: string;
  descriptor: string;
  isSelected: boolean;
  onSelect: () => void;
}

export default function SensoryProfileCard({
  profile,
  label,
  descriptor,
  isSelected,
  onSelect,
}: SensoryProfileCardProps) {
  const { fire } = useHaptic();
  const progress = useSharedValue(isSelected ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isSelected ? 1 : 0, { duration: TIMING.SENSORY_CARD_TRANSITION });
  }, [isSelected, progress]);

  const cardStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ['rgba(232,223,208,0.04)', 'rgba(212,149,106,0.08)']
    ),
    borderLeftColor: interpolateColor(
      progress.value,
      [0, 1],
      ['rgba(232,223,208,0.08)', COLORS.amber]
    ),
    borderLeftWidth: 2,
  }));

  function handlePress() {
    fire(Haptics.ImpactFeedbackStyle.Light, false);
    onSelect();
  }

  return (
    <Pressable style={styles.pressable} onPress={handlePress}>
      <Animated.View style={[styles.card, cardStyle]}>
        <Text style={styles.profileName}>{label}</Text>
        <Text style={styles.descriptor}>{descriptor}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
    marginHorizontal: 4,
  },
  card: {
    padding: 12,
    borderRadius: 8,
    minHeight: 72,
  },
  profileName: {
    fontFamily: FONT.regular,
    fontSize: FS.title,
    color: COLORS.cream,
    marginBottom: 4,
  },
  descriptor: {
    fontFamily: FONT.light,
    fontSize: FS.sm,
    color: COLORS.creamFaint,
    lineHeight: 16,
  },
});
