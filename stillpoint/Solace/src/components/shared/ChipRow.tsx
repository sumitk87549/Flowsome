import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useHaptic } from '@/hooks/useHaptic';
import { FONT, FS } from '@/constants/typography';
import { TIMING } from '@/constants/timing';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/design/theme';

interface ChipOption {
  label: string;
  value: string | number;
}

interface ChipRowProps {
  label: string;
  options: ChipOption[];
  selectedValue: string | number;
  onSelect: (value: string | number) => void;
  disabled?: boolean;
}

function Chip({
  option,
  isSelected,
  onSelect,
  disabled,
}: {
  option: ChipOption;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}) {
  const { fire } = useHaptic();
  const theme = useTheme();
  const progress = useSharedValue(isSelected ? 1 : 0);

  React.useEffect(() => {
    progress.value = withTiming(isSelected ? 1 : 0, { duration: TIMING.CHIP_TRANSITION });
  }, [isSelected, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    // using surfaceStrong for selected state so it's readable
    return {
      borderColor: isSelected ? theme.colors.accent : 'transparent',
      borderWidth: 1,
      backgroundColor: isSelected ? theme.colors.surfaceStrong : theme.colors.surface,
    };
  });

  const textStyle = useAnimatedStyle(() => ({
    opacity: isSelected ? 1 : 0.6,
    color: isSelected ? theme.colors.accent : theme.colors.textPrimary,
  }));

  function handlePress() {
    if (disabled) return;
    fire(Haptics.ImpactFeedbackStyle.Light, false);
    onSelect();
  }

  return (
    <Pressable onPress={handlePress} style={[styles.chipPressable, disabled && { opacity: 0.4 }]}>
      <Animated.View style={[styles.chip, animatedStyle]}>
        <Animated.Text style={[styles.chipText, textStyle]}>{option.label}</Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

export default function ChipRow({ label, options, selectedValue, onSelect, disabled }: ChipRowProps) {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.colors.textMuted }]}>{label}</Text>
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
            disabled={disabled}
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
    fontFamily: FONT.medium,
    fontSize: FS.sm,
    marginBottom: 10,
    letterSpacing: 0.5,
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
  },
  chipText: {
    fontFamily: FONT.medium,
    fontSize: FS.base,
  },
});
