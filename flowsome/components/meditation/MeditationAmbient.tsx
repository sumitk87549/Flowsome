// components/meditation/MeditationAmbient.tsx
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { useEffect } from 'react';
import { View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export function MeditationAmbient() {
  const theme = useTheme();
  const scale = useSharedValue(0.85);
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    scale.value = withRepeat(withTiming(1.12, { duration: 5000, easing: Easing.bezier(0.4, 0, 0.6, 1) }), -1, true);
    opacity.value = withRepeat(withTiming(0.6, { duration: 5000, easing: Easing.bezier(0.4, 0, 0.6, 1) }), -1, true);
  }, []);

  const orbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: 280, height: 280 }}>
      <Animated.View style={[orbStyle, { width: 200, height: 200, borderRadius: 100, backgroundColor: theme.orbGlow }]} />
      <Animated.View style={[{ position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: theme.orb }, orbStyle]} />
    </View>
  );
}
