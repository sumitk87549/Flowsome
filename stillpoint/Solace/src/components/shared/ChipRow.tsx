import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useHaptic } from '@/hooks/useHaptic';
import { COLORS } from '@/constants/colors';
import { FONT, FS } from '@/constants/typography';
import { TIMING } from '@/constants/timing';
import * as Haptics from 'expo-haptics';

interface ChipOption {
  label: string;
  value: string | number;
}

interface ChipRowProps {
  label: string;
  options: ChipOption[];
  selectedValue: string | number;
  onSelect: (value: string | number) => void;
}

function Chip({
  option,
  isSelected,
  onSelect,
}: {
  option: ChipOption;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const { fire } = useHaptic();
  const progress = useSharedValue(isSelected ? 1 : 0);

  React.useEffect(() => {
    progress.value = withTiming(isSelected ? 1 : 0, { duration: TIMING.CHIP_TRANSITION });
  }, [isSelected, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    borderColor: `rgba(212, 149, 106, ${progress.value * 0.6})`,
    borderWidth: 1,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: isSelected ? 1 : 0.4,
    color: isSelected ? COLORS.amber : COLORS.cream,
  }));

  function handlePress() {
    fire(Haptics.ImpactFeedbackStyle.Light, false);
    onSelect();
  }

  return (
    <Pressable onPress={handlePress} style={styles.chipPressable}>
      <Animated.View style={[styles.chip, animatedStyle]}>
        <Animated.Text style={[styles.chipText, textStyle]}>{option.label}</Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

export default function ChipRow({ label, options, selectedValue, onSelect }: ChipRowProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsContainer}
      >
        {options.map((option) => (
          <Chip
            key={String(option.value)}
            option={option}
            isSelected={option.value === selectedValue}
            onSelect={() => onSelect(option.value)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontFamily: FONT.light,
    fontSize: FS.sm,
    color: COLORS.creamFaint,
    marginBottom: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  chipsContainer: {
    paddingRight: 16,
  },
  chipPressable: {
    marginRight: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.creamGhost,
  },
  chipText: {
    fontFamily: FONT.light,
    fontSize: FS.base,
  },
});
