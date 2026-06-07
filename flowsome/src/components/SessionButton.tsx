import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useAppStore } from '../store/appStore';
import { AppTheme } from '../types';

interface SessionButtonProps {
  emoji: string;
  label: string;
  onPress: () => void;
  style?: ViewStyle;
}

export function SessionButton({ emoji, label, onPress, style }: SessionButtonProps) {
  const theme = useAppStore((s) => s.currentTheme);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  function handlePressIn() {
    scale.value = withSpring(0.96, { damping: 12, stiffness: 260 });
    opacity.value = withSpring(0.85);
  }

  function handlePressOut() {
    scale.value = withSpring(1, { damping: 12, stiffness: 260 });
    opacity.value = withSpring(1);
  }

  return (
    <Animated.View style={[styles.wrapper, style, animStyle]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={[styles.button, { borderColor: theme.accentColor + '40' }]}
      >
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={[styles.label, { color: theme.textColor }]}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  button: {
    flex: 1,
    borderRadius: 24,
    borderWidth: 1,
    paddingVertical: 28,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    gap: 10,
  },
  emoji: {
    fontSize: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});
