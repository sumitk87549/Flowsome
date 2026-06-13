// components/achievements/BadgeToast.tsx
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  withSequence,
  useAnimatedStyle,
} from 'react-native-reanimated';

interface BadgeInfo {
  icon: string;
  title: string;
  description: string;
}

interface BadgeToastProps {
  badge: BadgeInfo | null;
  theme: {
    background: string;
    text: string;
    textMuted: string;
    primary: string;
    cardBorder: string;
  };
}

export default function BadgeToast({ badge, theme }: BadgeToastProps) {
  const translateY = useSharedValue(80);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (badge) {
      translateY.value = withSequence(
        withTiming(0, { duration: 350 }),
        withTiming(0, { duration: 2800 }), // hold
        withTiming(80, { duration: 350 }),
      );
      opacity.value = withSequence(
        withTiming(1, { duration: 350 }),
        withTiming(1, { duration: 2800 }),
        withTiming(0, { duration: 350 }),
      );
    }
  }, [badge]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!badge) return null;

  return (
    <Animated.View
      style={[
        animStyle,
        {
          position: 'absolute',
          bottom: 90,
          left: 20,
          right: 20,
          backgroundColor: theme.background,
          borderColor: theme.cardBorder,
          borderWidth: 1,
          borderRadius: 16,
          padding: 16,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          shadowColor: theme.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 8,
          zIndex: 999,
        },
      ]}
      pointerEvents="none"
    >
      <Text style={{ fontSize: 28 }}>{badge.icon}</Text>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: theme.text,
            fontFamily: 'DMSans-Medium',
            fontSize: 15,
          }}
        >
          {badge.title}
        </Text>
        <Text
          style={{
            color: theme.textMuted,
            fontSize: 12,
            marginTop: 2,
          }}
        >
          {badge.description}
        </Text>
      </View>
    </Animated.View>
  );
}
