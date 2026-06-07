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
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';
import { TYPE } from '../constants/typography';

interface SessionButtonProps {
  emoji: string;
  label: string;
  onPress: () => void;
  style?: ViewStyle;
}

export function SessionButton({ emoji, label, onPress, style }: SessionButtonProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const glow = useSharedValue(0);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value,
  }));

  function handlePressIn() {
    scale.value = withSpring(0.94, { damping: 14, stiffness: 320 });
    glow.value = withTiming(1, { duration: 100 });
  }

  function handlePressOut() {
    scale.value = withSpring(1, { damping: 10, stiffness: 200 });
    glow.value = withTiming(0, { duration: 300 });
  }

  return (
    <Animated.View style={[styles.wrapper, style, containerStyle]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={[styles.button, { borderColor: theme.accentColor + '20' }]}
      >
        {/* Press glow */}
        <Animated.View
          style={[
            styles.pressGlow,
            glowStyle,
            { backgroundColor: theme.accentColor + '0C' },
          ]}
        />

        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={[styles.label, { color: theme.textColor + 'CC' }]}>{label}</Text>
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
    borderRadius: 28,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 24,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.025)',
    gap: 14,
    overflow: 'hidden',
  },
  pressGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  emoji: {
    fontSize: 34,
  },
  label: {
    ...TYPE.CAPTION,
    textTransform: 'uppercase',
  },
});
