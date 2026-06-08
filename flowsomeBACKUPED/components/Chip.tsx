import React, { useRef } from 'react';
import { Text, StyleSheet, Pressable, Animated } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function Chip({ label, selected, onPress }: ChipProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale }] }]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.chip,
          selected && styles.chipSelected
        ]}
      >
        <Text style={[
          styles.text,
          selected && styles.textSelected
        ]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: SPACING.md,
    marginBottom: SPACING.md,
  },
  chip: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(134, 197, 184, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    borderColor: COLORS.accent,
    backgroundColor: 'rgba(134, 197, 184, 0.15)',
  },
  text: {
    fontSize: 16,
    fontWeight: '300',
    color: COLORS.text,
    letterSpacing: 1,
  },
  textSelected: {
    color: COLORS.accent,
    fontWeight: '400',
  },
});
