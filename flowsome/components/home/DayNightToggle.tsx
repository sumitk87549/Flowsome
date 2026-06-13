// components/home/DayNightToggle.tsx — Icon-only toggle, no emoji
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../store/appStore';
import { HapticUtils } from '../../utils/hapticUtils';

export function DayNightToggle() {
  const { dayNight, setDayNight } = useAppStore();
  const theme = useTheme();

  const toggle = () => {
    HapticUtils.light();
    setDayNight(dayNight === 'day' ? 'night' : 'day');
  };

  return (
    <TouchableOpacity
      onPress={toggle}
      activeOpacity={0.7}
      style={{
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.card,
        borderWidth: 1,
        borderColor: theme.cardBorder,
      }}
    >
      <Ionicons
        name={dayNight === 'day' ? 'sunny' : 'moon'}
        size={16}
        color={theme.primary}
      />
    </TouchableOpacity>
  );
}
