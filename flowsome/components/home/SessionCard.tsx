// components/home/SessionCard.tsx
import { TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FlowText } from '../ui/FlowText';
import { FlowCard } from '../ui/FlowCard';
import { useTheme } from '../../hooks/useTheme';
import { HapticUtils } from '../../utils/hapticUtils';

export interface SessionCardData {
  id: string;
  title: string;
  titleHindi: string;
  subtitle: string;
  tagline: string;
  icon: string;
  route: string;
  accent: 'blue' | 'orange' | 'purple' | 'green';
}

const ACCENT_COLORS = {
  blue: ['rgba(59, 130, 246, 0.15)', 'rgba(29, 78, 216, 0.02)'],
  orange: ['rgba(245, 158, 11, 0.15)', 'rgba(180, 83, 9, 0.02)'],
  purple: ['rgba(139, 92, 246, 0.15)', 'rgba(109, 40, 217, 0.02)'],
  green: ['rgba(16, 185, 129, 0.15)', 'rgba(4, 120, 87, 0.02)'],
} as const;

export const SESSION_CARDS: SessionCardData[] = [
  {
    id: 'breathing',
    title: 'Breathe',
    titleHindi: 'श्वास',
    subtitle: 'Box · 4-7-8 · Nadi Shodhana',
    tagline: 'Calm the mind',
    icon: '🌬️',
    route: '/(sessions)/breathing/',
    accent: 'blue',
  },
  {
    id: 'pomodoro',
    title: 'Focus',
    titleHindi: 'फोकस',
    subtitle: 'Pomodoro · Deep Work',
    tagline: 'Train concentration',
    icon: '⏱️',
    route: '/(sessions)/pomodoro/',
    accent: 'orange',
  },
  {
    id: 'meditation',
    title: 'Meditate',
    titleHindi: 'ध्यान',
    subtitle: 'Mindfulness · Yoga Nidra',
    tagline: 'Deep presence',
    icon: '🧘',
    route: '/(sessions)/meditation/',
    accent: 'purple',
  },
  {
    id: 'focus',
    title: 'Flow',
    titleHindi: 'प्रवाह',
    subtitle: 'Deep Work · Creative',
    tagline: 'Enter the zone',
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

  const gradients = ACCENT_COLORS[data.accent];

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.85}
      style={{ flex: 1, minWidth: '45%', maxWidth: '48%' }}
    >
      <FlowCard style={{ padding: 0, minHeight: 155, overflow: 'hidden' }}>
        <LinearGradient
          colors={gradients}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ padding: 18, flex: 1, justifyContent: 'space-between' }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <FlowText size="3xl">{data.icon}</FlowText>
            <FlowText size="xs" color={theme.textMuted} style={{ opacity: 0.6 }}>→</FlowText>
          </View>
          
          <View style={{ marginTop: 8 }}>
            <FlowText variant="heading" size="xl" color={theme.primary}>
              {data.title}
            </FlowText>
            <FlowText variant="headingLight" size="sm" color={theme.textSecondary} style={{ opacity: 0.8 }}>
              {data.titleHindi}
            </FlowText>
          </View>

          <View style={{ marginTop: 4 }}>
            <FlowText variant="body" size="xs" color={theme.textMuted} style={{ fontSize: 10 }}>
              {data.subtitle}
            </FlowText>
          </View>
        </LinearGradient>
      </FlowCard>
    </TouchableOpacity>
  );
}

