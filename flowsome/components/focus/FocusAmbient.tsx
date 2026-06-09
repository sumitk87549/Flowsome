// components/focus/FocusAmbient.tsx
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { useEffect } from 'react';
import { View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export function FocusAmbient() {
  const theme = useTheme();
  const opacity = useSharedValue(0.2);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.8, { duration: 3000, easing: Easing.bezier(0.4, 0, 0.6, 1) }), -1, true);
  }, []);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: 160, height: 160 }}>
      <Animated.View style={[style, {
        width: 140, height: 140, borderRadius: 70,
        borderWidth: 2, borderColor: theme.primary,
      }]} />
      <View style={{ position: 'absolute', width: 40, height: 40, borderRadius: 20, backgroundColor: theme.primary }} />
    </View>
  );
}
