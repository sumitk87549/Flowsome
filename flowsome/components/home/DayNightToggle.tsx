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
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.65)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.25)',
        shadowColor: dayNight === 'day' ? '#FFD700' : '#88CCFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 6,
      }}
    >
      <Ionicons
        name={dayNight === 'day' ? 'sunny' : 'moon'}
        size={20}
        color={dayNight === 'day' ? '#FFE55C' : '#FFFFFF'}
        style={{
          textShadowColor: dayNight === 'day' ? '#FFD700' : '#88CCFF',
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 10,
        }}
      />
    </TouchableOpacity>
  );
}
