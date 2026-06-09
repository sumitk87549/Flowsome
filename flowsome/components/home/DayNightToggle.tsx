// components/home/DayNightToggle.tsx
import { TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { FlowText } from '../ui/FlowText';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../store/appStore';
import { HapticUtils } from '../../utils/hapticUtils';

export function DayNightToggle() {
  const { dayNight, setDayNight } = useAppStore();
  const theme = useTheme();
  const progress = useSharedValue(dayNight === 'night' ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(dayNight === 'night' ? 1 : 0, { duration: 400 });
  }, [dayNight]);

  // Suppress unused variable warning — progress drives animation
  const _animStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [1, 1]),
  }));

  const toggle = () => {
    HapticUtils.light();
    setDayNight(dayNight === 'day' ? 'night' : 'day');
  };

  return (
    <TouchableOpacity
      onPress={toggle}
      activeOpacity={0.8}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: theme.card,
        borderWidth: 1,
        borderColor: theme.cardBorder,
      }}
    >
      <FlowText size="sm" color={theme.textMuted}>
        {dayNight === 'day' ? '☀️ Day' : '🌙 Night'}
      </FlowText>
    </TouchableOpacity>
  );
}
