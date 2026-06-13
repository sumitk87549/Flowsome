// components/home/StreakIndicator.tsx — Flame icon, no emoji
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useHistoryStore } from '../../store/historyStore';

interface StreakIndicatorProps {
  theme: {
    primary: string;
    text: string;
    textMuted: string;
  };
}

export default function StreakIndicator({ theme }: StreakIndicatorProps) {
  const getStreak = useHistoryStore((s) => s.getStreak);
  const streak = getStreak();

  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.0);

  useEffect(() => {
    if (streak > 0) {
      scale.value = withSequence(
        withSpring(1.2, { damping: 5 }),
        withSpring(1.0),
      );
      glowOpacity.value = withTiming(0.4 + Math.min(streak / 30, 0.4), { duration: 800 });
    }
  }, [streak]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const flameColor = streak === 0 ? theme.textMuted : (streak < 7 ? '#F59E0B' : streak < 30 ? '#F97316' : '#FBBF24');

  if (streak === 0) {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, opacity: 0.35 }}>
        <Ionicons name="flame" size={18} color={theme.textMuted} />
      </View>
    );
  }

  return (
    <Animated.View style={[{ flexDirection: 'row', alignItems: 'center', gap: 5 }, animStyle]}>
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: flameColor,
          },
          glowStyle,
        ]}
        pointerEvents="none"
      />
      <Ionicons name="flame" size={18} color={flameColor} style={{ zIndex: 1 }} />
      <Text
        style={{
          fontSize: 13,
          color: theme.text,
          fontFamily: 'DMSans-Medium',
          zIndex: 1,
        }}
      >
        {streak}
      </Text>
    </Animated.View>
  );
}
