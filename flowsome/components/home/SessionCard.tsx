// components/home/SessionCard.tsx — Premium: Ionicons, no emojis
import { useRef, useEffect } from 'react';
import { TouchableOpacity, View, Animated as RNAnimated, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FlowCard } from '../ui/FlowCard';
import { useTheme } from '../../hooks/useTheme';
import { useSettings } from '../../hooks/useSettings';
import { hapticLight } from '../../utils/hapticUtils';

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
  blue:   '#70B8F8',
  orange: '#F0A030',
  purple: '#A08CDC',
  green:  '#40C878',
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
  const { language } = useSettings();
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
    hapticLight();
    router.push(data.route as any);
  };

  const iconColor = ACCENT_COLORS[data.accent];

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
        <FlowCard
          useBlur={false}
          style={{
            minHeight: 170,
            padding: 20,
            justifyContent: 'space-between',
            borderRadius: 20,
            overflow: 'hidden',
            backgroundColor: 'rgba(0,0,0,0.42)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.12)',
          }}
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
              <Ionicons name={data.icon as any} size={22} color={iconColor} />
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.textMuted} style={{ opacity: 0.4 }} />
          </View>

          {/* Title block */}
          <View style={{ marginTop: 16 }}>
            <Text style={{
              fontFamily: 'CormorantGaramond-Medium',
              fontSize: 24,
              color: '#FFFFFF',
              textShadowColor: 'rgba(0,0,0,0.5)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 4,
            }}>
              {data.title}
            </Text>
            {language === 'hi-IN' && (
              <Text style={{
                fontFamily: 'DMSans-Regular',
                fontSize: 13,
                color: 'rgba(255,255,255,0.40)',
                marginTop: 2,
              }}>
                {data.titleHindi}
              </Text>
            )}
          </View>

          {/* Subtitle */}
          <Text style={{
            fontFamily: 'DMSans-Regular',
            fontSize: 10,
            color: 'rgba(255,255,255,0.60)',
            marginTop: 8,
            letterSpacing: 0.5,
          }}>
            {data.subtitle}
          </Text>
        </FlowCard>
      </TouchableOpacity>
    </RNAnimated.View>
  );
}
