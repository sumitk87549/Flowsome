// components/home/SessionCard.tsx
import { TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { FlowText } from '../ui/FlowText';
import { FlowCard } from '../ui/FlowCard';
import { useTheme } from '../../hooks/useTheme';
import { HapticUtils } from '../../utils/hapticUtils';

export interface SessionCardData {
  id: string;
  title: string;
  titleHindi: string;
  subtitle: string;
  icon: string;
  route: string;
  accent: string;
}

export const SESSION_CARDS: SessionCardData[] = [
  {
    id: 'breathing',
    title: 'Breathe',
    titleHindi: 'श्वास',
    subtitle: 'Box · 4-7-8 · Nadi Shodhana',
    icon: '🌬️',
    route: '/(sessions)/breathing/',
    accent: 'blue',
  },
  {
    id: 'pomodoro',
    title: 'Focus',
    titleHindi: 'फोकस',
    subtitle: 'Pomodoro · Deep Work',
    icon: '⏱️',
    route: '/(sessions)/pomodoro/',
    accent: 'orange',
  },
  {
    id: 'meditation',
    title: 'Meditate',
    titleHindi: 'ध्यान',
    subtitle: 'Mindfulness · Yoga Nidra',
    icon: '🧘',
    route: '/(sessions)/meditation/',
    accent: 'purple',
  },
  {
    id: 'focus',
    title: 'Flow',
    titleHindi: 'प्रवाह',
    subtitle: 'Deep Work · Creative',
    icon: '✨',
    route: '/(sessions)/focus/',
    accent: 'green',
  },
];

interface SessionCardProps {
  data: SessionCardData;
}

export function SessionCard({ data }: SessionCardProps) {
  const theme = useTheme();
  const router = useRouter();

  const handlePress = () => {
    HapticUtils.medium();
    router.push(data.route as any);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.85}
      style={{ flex: 1, minWidth: '45%', maxWidth: '48%' }}
    >
      <FlowCard style={{ padding: 20, gap: 8, minHeight: 130 }}>
        <View>
          <FlowText size="3xl">{data.icon}</FlowText>
        </View>
        <View>
          <FlowText variant="heading" size="xl" color={theme.primary}>
            {data.title}
          </FlowText>
          <FlowText variant="headingLight" size="sm" color={theme.textMuted}>
            {data.titleHindi}
          </FlowText>
        </View>
        <FlowText variant="body" size="xs" color={theme.textMuted}>
          {data.subtitle}
        </FlowText>
      </FlowCard>
    </TouchableOpacity>
  );
}
