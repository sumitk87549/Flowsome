// components/home/SessionCard.tsx — Premium: Ionicons, no emojis
import { useRef, useEffect } from 'react';
import { TouchableOpacity, View, Animated as RNAnimated, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { FlowCard } from '../ui/FlowCard';
import { useTheme } from '../../hooks/useTheme';
import { HapticUtils } from '../../utils/hapticUtils';

export interface SessionCardData {
  id: string;
  title: string;
  titleHindi: string;
  subtitle: string;
  icon: string;          // Ionicons name
  route: string;
  accent: 'blue' | 'orange' | 'purple' | 'green';
}

const ACCENT_COLORS = {
  blue:   { bg: ['rgba(112,184,248,0.12)', 'rgba(64,128,208,0.04)'], icon: '#70B8F8' },
  orange: { bg: ['rgba(240,160,48,0.12)', 'rgba(180,83,9,0.04)'],   icon: '#F0A030' },
  purple: { bg: ['rgba(160,140,220,0.12)', 'rgba(100,60,180,0.04)'], icon: '#A08CDC' },
  green:  { bg: ['rgba(64,200,120,0.12)', 'rgba(40,140,80,0.04)'],   icon: '#40C878' },
} as const;

export const SESSION_CARDS: SessionCardData[] = [
  {
    id: 'breathing',
    title: 'Breathe',
    titleHindi: 'श्वास',
    subtitle: 'Box · 4-7-8 · Nadi Shodhana',
    icon: 'leaf-outline',
    route: '/(sessions)/breathing/',
    accent: 'blue',
  },
  {
    id: 'pomodoro',
    title: 'Focus',
    titleHindi: 'फोकस',
    subtitle: 'Pomodoro · Deep Work',
    icon: 'time-outline',
    route: '/(sessions)/pomodoro/',
    accent: 'orange',
  },
  {
    id: 'meditation',
    title: 'Meditate',
    titleHindi: 'ध्यान',
    subtitle: 'Mindfulness · Yoga Nidra',
    icon: 'flower-outline',
    route: '/(sessions)/meditation/',
    accent: 'purple',
  },
  {
    id: 'focus',
    title: 'Flow',
    titleHindi: 'प्रवाह',
    subtitle: 'Deep Work · Creative',
    icon: 'sparkles-outline',
    route: '/(sessions)/focus/',
    accent: 'green',
  },
];

interface SessionCardProps {
  data: SessionCardData;
  delay?: number;
}

export function SessionCard({ data, delay = 0 }: SessionCardProps) {
  const theme = useTheme();
  const router = useRouter();
  const pressScale = useRef(new RNAnimated.Value(1)).current;
  const entranceOpacity = useRef(new RNAnimated.Value(0)).current;
  const entranceTranslate = useRef(new RNAnimated.Value(16)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      RNAnimated.parallel([
        RNAnimated.timing(entranceOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        RNAnimated.timing(entranceTranslate, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]).start();
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const handlePressIn = () => {
    RNAnimated.spring(pressScale, { toValue: 0.96, useNativeDriver: true, damping: 15, stiffness: 200 }).start();
  };
  const handlePressOut = () => {
    RNAnimated.spring(pressScale, { toValue: 1, useNativeDriver: true, damping: 12, stiffness: 180 }).start();
  };

  const handlePress = () => {
    HapticUtils.medium();
    router.push(data.route as any);
  };

  const accentConfig = ACCENT_COLORS[data.accent];

  return (
    <RNAnimated.View style={{
      flex: 1,
      minWidth: '45%',
      maxWidth: '48%',
      opacity: entranceOpacity,
      transform: [{ translateY: entranceTranslate }, { scale: pressScale }],
    }}>
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <FlowCard style={{ padding: 0, minHeight: 170, overflow: 'hidden' }}>
          <LinearGradient
            colors={accentConfig.bg}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ padding: 20, flex: 1, justifyContent: 'space-between' }}
          >
            {/* Icon row */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: 'rgba(255,255,255,0.06)',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Ionicons name={data.icon as any} size={22} color={accentConfig.icon} />
              </View>
              <Ionicons name="chevron-forward" size={16} color={theme.textMuted} style={{ opacity: 0.4 }} />
            </View>

            {/* Title block */}
            <View style={{ marginTop: 16 }}>
              <Text style={{
                fontFamily: 'CormorantGaramond-SemiBold',
                fontSize: 24,
                color: theme.text,
                textShadowColor: 'rgba(0,0,0,0.4)',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 3,
              }}>
                {data.title}
              </Text>
              <Text style={{
                fontFamily: 'DMSans-Regular',
                fontSize: 13,
                color: theme.textMuted,
                marginTop: 2,
              }}>
                {data.titleHindi}
              </Text>
            </View>

            {/* Subtitle */}
            <Text style={{
              fontFamily: 'DMSans-Regular',
              fontSize: 10,
              color: theme.textMuted,
              opacity: 0.7,
              letterSpacing: 0.5,
              marginTop: 8,
            }}>
              {data.subtitle}
            </Text>
          </LinearGradient>
        </FlowCard>
      </TouchableOpacity>
    </RNAnimated.View>
  );
}
