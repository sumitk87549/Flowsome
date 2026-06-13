// app/index.tsx — Sprint 13: Premium home screen with visual overhaul
import { View, TouchableOpacity, ScrollView, useWindowDimensions, Text, StyleSheet, Animated as RNAnimated } from 'react-native';
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

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const config = useThemeConfig();
  const { language } = useSettings();

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
      // Theme selector follows
      RNAnimated.timing(selectorOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      // Sessions follow
      RNAnimated.timing(sessionsOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
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
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  };

  return (
    <SafeScreen>
      {/* Particle background */}
      <ParticleCanvas />
      {/* Background Audio */}
      <AudioManager />

      {/* Header gradient overlay for text readability */}
      <LinearGradient
        colors={[theme.background, 'transparent']}
        locations={[0, 1]}
        style={styles.headerGradient}
        pointerEvents="none"
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 64 }}>
        {/* ── Header Row ──────────────────────────────────────────── */}
        <RNAnimated.View style={{
          opacity: headerOpacity,
          transform: [{ translateY: headerTranslate }],
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 8,
        }}>
          {/* Left: Streak Indicator */}
          <StreakIndicator theme={theme} />

          {/* Center: Brand Title + Season */}
          <View style={{ alignItems: 'center' }}>
            <Text style={{
              fontFamily: 'CormorantGaramond-SemiBold',
              fontSize: 28,
              color: theme.primary,
              letterSpacing: 2,
              ...headerShadow,
            }}>
              Flowsome
            </Text>
            <Text style={{
              color: theme.textMuted,
              fontSize: 8,
              letterSpacing: 2,
              fontFamily: 'DMSans-Medium',
              marginTop: 2,
              opacity: 0.8,
              ...headerShadow,
            }}>
              {seasonInfo.line.toUpperCase()}
            </Text>
          </View>

          {/* Right: Stats, Settings, Day/Night */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <TouchableOpacity 
              onPress={() => { HapticUtils.light(); router.push('/(screens)/stats' as any); }}
              style={styles.headerIconButton}
            >
              <Ionicons name="bar-chart-outline" size={20} color={theme.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { HapticUtils.light(); router.push('/settings/' as any); }}
              style={styles.headerIconButton}
            >
              <Ionicons name="settings-outline" size={20} color={theme.textMuted} />
            </TouchableOpacity>
            <DayNightToggle />
          </View>
        </RNAnimated.View>

        {/* ── Dynamic Greeting Watermark ────────────────────────── */}
        <Animated.View style={[styles.greetingContainer, greetingStyle]} pointerEvents="none">
          <Text style={[styles.greetingText, { color: theme.textSecondary, fontFamily: 'CormorantGaramond-Italic', ...headerShadow }]}>
            {greeting.line}
          </Text>
        </Animated.View>

        {/* ── Theme Selector strip ───────────────────────────────── */}
        <RNAnimated.View style={{ opacity: selectorOpacity, marginBottom: 16 }}>
          <ThemeSelector />
        </RNAnimated.View>

        {/* ── Session Cards (Prioritized) ─────────────────────────── */}
        <RNAnimated.View style={{ opacity: sessionsOpacity, paddingHorizontal: 20, marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {SESSION_CARDS.map((card, i) => (
              <SessionCard key={card.id} data={card} delay={100 + i * 80} />
            ))}
          </View>
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
  );
}

const styles = StyleSheet.create({
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 1,
  },
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
