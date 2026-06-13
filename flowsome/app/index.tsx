// app/index.tsx — Sprint 13: Premium home screen with visual overhaul
import { View, TouchableOpacity, ScrollView, useWindowDimensions, Text, StyleSheet, Image, Animated as RNAnimated } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useState, useEffect, useMemo, useRef } from 'react';
import { getTimeGreeting } from '../utils/greetingUtils';
import { getCurrentSeasonInfo } from '../utils/seasonUtils';
import Animated, { useSharedValue, withSequence, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import StreakIndicator from '../components/home/StreakIndicator';
import MalaIndicator from '../components/home/MalaIndicator';
import BadgeToast from '../components/achievements/BadgeToast';
import type { Achievement } from '../constants/achievements';
import { useHistoryStore } from '../store/historyStore';
import { HapticUtils } from '../utils/hapticUtils';
import { SafeScreen } from '../components/ui/SafeScreen';
import { ThemeSelector } from '../components/home/ThemeSelector';
import { DayNightToggle } from '../components/home/DayNightToggle';
import { SessionCard, SESSION_CARDS } from '../components/home/SessionCard';
import { useTheme, useThemeConfig } from '../hooks/useTheme';
import { useSettings } from '../hooks/useSettings';
import { AudioManager } from '../components/audio/AudioManager';
import { ParticleCanvas } from '../components/particles/ParticleCanvas';
import { QUOTES } from '../constants/quotes';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const config = useThemeConfig();
  const { language } = useSettings();
  const insets = useSafeAreaInsets();

  const { width } = useWindowDimensions();
  const [pendingBadge, setPendingBadge] = useState<Achievement | null>(null);

  const showBadgeToast = useCallback((badge: Achievement) => {
    setPendingBadge(badge);
    setTimeout(() => setPendingBadge(null), 4000);
  }, []);

  const [greeting] = useState(() => {
    const streak = useHistoryStore.getState().getStreak();
    return getTimeGreeting(streak);
  });
  const greetingOpacity = useSharedValue(0);
  const seasonInfo = useMemo(() => getCurrentSeasonInfo(), []);

  // ── Entrance animations ──
  const headerOpacity = useRef(new RNAnimated.Value(0)).current;
  const headerTranslate = useRef(new RNAnimated.Value(-12)).current;
  const selectorOpacity = useRef(new RNAnimated.Value(0)).current;
  const sessionsOpacity = useRef(new RNAnimated.Value(0)).current;
  const quoteOpacity = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    RNAnimated.sequence([
      // Header fades in first
      RNAnimated.parallel([
        RNAnimated.timing(headerOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        RNAnimated.timing(headerTranslate, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
      // Sessions follow
      RNAnimated.timing(sessionsOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      // Theme selector follows
      RNAnimated.timing(selectorOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      // Quote footer last
      RNAnimated.timing(quoteOpacity, { toValue: 1, duration: 500, useNativeDriver: true, delay: 100 }),
    ]).start();
  }, []);

  useEffect(() => {
    greetingOpacity.value = withSequence(
      withTiming(1, { duration: 500 }),
      withTiming(1, { duration: 1800 }),
      withTiming(0, { duration: 400 }),
    );
  }, []);

  const greetingStyle = useAnimatedStyle(() => ({
    opacity: greetingOpacity.value,
  }));

  const themeQuotes = QUOTES.filter((q) => q.region === config.id || q.region === 'all');
  const activeQuote = themeQuotes.length > 0 ? themeQuotes[0] : QUOTES[0];

  const headerShadow = {
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  };

  const iconShadowStyle = {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 3,
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <SafeScreen edges={['left', 'right', 'bottom']}>
        {/* Particle background */}
        <ParticleCanvas />
        <LinearGradient
          colors={['rgba(0,0,0,0.72)', 'rgba(0,0,0,0.35)', 'transparent']}
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: 160,
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        {/* Background Audio */}
        <AudioManager />

        {/* Floating Day/Night Toggle */}
        <View style={{
          position: 'absolute',
          bottom: insets.bottom + 60,
          left: 16,
          zIndex: 10,
        }}>
          <DayNightToggle />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 64 }}>
          {/* ── Header Row ──────────────────────────────────────────── */}
          <RNAnimated.View style={{
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslate }],
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingTop: insets.top + 16,
            paddingBottom: 12,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(255, 255, 255, 0.08)',
            zIndex: 2,
          }}>
            {/* Left Side: App Logo & Heading */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 38, height: 38, borderRadius: 19, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
                <Image source={require('../assets/icon.png')} style={{ width: 38, height: 38, transform: [{ scale: 1.35 }] }} />
              </View>
              <View style={{ alignItems: 'flex-start' }}>
                <Text style={{
                  fontFamily: 'CormorantGaramond-Medium',
                  fontSize: 24,
                  color: '#FFFFFF',
                  letterSpacing: 1,
                  textShadowColor: '#FFFFFF',
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 14,
                }}>
                  Flowsome
                </Text>
                <Text style={{
                  fontFamily: 'DMSans-Regular',
                  fontSize: 9,
                  color: '#FFFFFF',
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                  textShadowColor: 'rgba(255,255,255,0.8)',
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 10,
                  marginTop: 1,
                }}>
                  {seasonInfo.line.toUpperCase()}
                </Text>
              </View>
            </View>

            {/* Right Side: Utilities (Stats & Settings) */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <TouchableOpacity 
                onPress={() => { HapticUtils.light(); router.push('/(screens)/stats' as any); }}
                style={[
                  styles.headerIconButton,
                  iconShadowStyle,
                  {
                    width: 36,
                    height: 36,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }
                ]}
              >
                <Ionicons name="stats-chart" size={18} color="#FFFFFF" style={{ textShadowColor: '#FFFFFF', textShadowRadius: 8 }} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { HapticUtils.light(); router.push('/settings/' as any); }}
                style={[
                  styles.headerIconButton,
                  iconShadowStyle,
                  {
                    width: 36,
                    height: 36,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }
                ]}
              >
                <Ionicons name="settings-outline" size={20} color="#FFFFFF" style={{ textShadowColor: '#FFFFFF', textShadowRadius: 8 }} />
              </TouchableOpacity>
            </View>
          </RNAnimated.View>

          {/* ── Dynamic Greeting Watermark ────────────────────────── */}
          <Animated.View style={[styles.greetingContainer, greetingStyle]} pointerEvents="none">
            <Text style={[styles.greetingText, { color: theme.textSecondary, fontFamily: 'CormorantGaramond-Italic', ...headerShadow }]}>
              {greeting.line}
            </Text>
          </Animated.View>

          {/* ── Session Cards (Prioritized) ─────────────────────────── */}
          <RNAnimated.View style={{ opacity: sessionsOpacity, paddingHorizontal: 20, marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {SESSION_CARDS.map((card, i) => (
                <SessionCard key={card.id} data={card} delay={100 + i * 80} />
              ))}
            </View>
          </RNAnimated.View>

          {/* ── Theme Selector strip ───────────────────────────────── */}
          <RNAnimated.View style={{ opacity: selectorOpacity, marginBottom: 16 }}>
            <Text style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: 10,
              letterSpacing: 2,
              fontFamily: 'DMSans-Regular',
              textTransform: 'uppercase',
              marginTop: 20,
              marginBottom: 10,
              marginLeft: 20,
              textShadowColor: 'rgba(0,0,0,0.5)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 4,
            }}>
              Choose Your Landscape
            </Text>
            <ThemeSelector />
          </RNAnimated.View>

          {/* ── Daily Quote (As peaceful footer) ────────────────────── */}
          <RNAnimated.View style={{ opacity: quoteOpacity, paddingHorizontal: 32, paddingVertical: 24, alignItems: 'center' }}>
            <View style={[styles.quoteSeparator, { backgroundColor: theme.cardBorder }]} />
            
            <Text style={{
              fontFamily: 'CormorantGaramond-Italic',
              fontSize: 16,
              color: theme.textSecondary,
              textAlign: 'center',
              lineHeight: 24,
              marginTop: 14,
              opacity: 0.9,
              ...headerShadow,
            }}>
              "{language === 'hi-IN' && activeQuote.textHindi ? activeQuote.textHindi : activeQuote.text}"
            </Text>
            <Text style={{
              fontFamily: 'DMSans-Regular',
              fontSize: 9,
              color: theme.textMuted,
              textAlign: 'center',
              letterSpacing: 2,
              marginTop: 8,
              textTransform: 'uppercase',
              opacity: 0.7,
            }}>
              — {activeQuote.attribution}
            </Text>

            <View style={[styles.quoteSeparator, { backgroundColor: theme.cardBorder, marginTop: 14 }]} />
          </RNAnimated.View>
        </ScrollView>

        {/* 108 Mala beads */}
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <MalaIndicator width={width} theme={theme} />
        </View>

        <BadgeToast badge={pendingBadge} theme={theme} />
      </SafeScreen>
    </View>
  );
}

const styles = StyleSheet.create({
  greetingContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 6,
    height: 20,
  },
  greetingText: {
    fontSize: 13,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  quoteSeparator: {
    height: 1,
    width: '30%',
    alignSelf: 'center',
    opacity: 0.25,
  },
  headerIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
});
