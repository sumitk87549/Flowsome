import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeIn,
} from 'react-native-reanimated';

import { ThemedBackground } from '../../components/ThemedBackground';
import { BottomNav } from '../../components/BottomNav';
import { SessionButton } from '../../components/SessionButton';
import { useTheme } from '../../context/ThemeContext';
import { useAppStore } from '../../store/appStore';
import { RootStackParamList, SessionMode } from '../../types';
import { SESSION_LABELS, SESSION_EMOJIS } from '../../constants/sessions';
import { TYPE } from '../../constants/typography';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const SESSION_MODES: SessionMode[] = ['pomodoro', 'focus', 'breathing', 'meditation'];

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 5)  return 'Still night';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  if (h < 21) return 'Good evening';
  return 'Wind down';
}

export function HomeScreen() {
  const navigation  = useNavigation<NavProp>();
  const theme       = useTheme();
  const startSession = useAppStore((s) => s.startSession);

  function handleMode(mode: SessionMode) {
    startSession(mode);
    navigation.navigate('Session', { mode });
  }

  return (
    <ThemedBackground>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Greeting overline */}
          <Animated.Text
            entering={FadeIn.duration(900)}
            style={[styles.greeting, { color: theme.subtextColor + '65' }]}
          >
            {getGreeting()}
          </Animated.Text>

          {/* Wordmark */}
          <Animated.View entering={FadeInUp.delay(60).duration(700)} style={styles.header}>
            <Text style={[styles.wordmark, { color: theme.textColor }]}>Flowsome</Text>
            <View style={[styles.wordmarkRule, { backgroundColor: theme.accentColor + '45' }]} />
            <Text style={[styles.tagline, { color: theme.subtextColor }]}>Find your flow</Text>
          </Animated.View>

          {/* 2 × 2 session button grid */}
          <View style={styles.grid}>
            <View style={styles.row}>
              {SESSION_MODES.slice(0, 2).map((mode, i) => (
                <Animated.View
                  key={mode}
                  entering={FadeInDown.delay(180 + i * 90).duration(600).springify().damping(18)}
                  style={styles.cellFlex}
                >
                  <SessionButton
                    emoji={SESSION_EMOJIS[mode]}
                    label={SESSION_LABELS[mode]}
                    onPress={() => handleMode(mode)}
                  />
                </Animated.View>
              ))}
            </View>
            <View style={styles.row}>
              {SESSION_MODES.slice(2).map((mode, i) => (
                <Animated.View
                  key={mode}
                  entering={FadeInDown.delay(360 + i * 90).duration(600).springify().damping(18)}
                  style={styles.cellFlex}
                >
                  <SessionButton
                    emoji={SESSION_EMOJIS[mode]}
                    label={SESSION_LABELS[mode]}
                    onPress={() => handleMode(mode)}
                  />
                </Animated.View>
              ))}
            </View>
          </View>

          {/* Active theme card */}
          <Animated.View
            entering={FadeInDown.delay(600).duration(600)}
            style={[styles.themeCard, { borderColor: theme.accentColor + '16' }]}
          >
            <View style={styles.themeCardRow}>
              <Text style={[styles.themeCardLabel, { color: theme.subtextColor + '80' }]}>
                Active Theme
              </Text>
              <View style={[styles.themeColorPip, { backgroundColor: theme.accentColor }]} />
            </View>
            <Text style={[styles.themeCardName, { color: theme.textColor }]}>
              {theme.name}
            </Text>
            <View style={[styles.themeCardRule, { backgroundColor: theme.accentColor + '45' }]} />
          </Animated.View>
        </ScrollView>

        <BottomNav />
      </SafeAreaView>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 24,
    gap: 36,
  },
  greeting: {
    ...TYPE.CAPTION,
    textTransform: 'uppercase',
  },
  header: {
    gap: 12,
  },
  wordmark: {
    ...TYPE.TITLE,
  },
  wordmarkRule: {
    width: 32,
    height: 1.5,
    borderRadius: 1,
  },
  tagline: {
    ...TYPE.BODY,
    letterSpacing: 1.5,
    fontWeight: '300',
  },
  grid: {
    gap: 14,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 14,
    height: 150,
  },
  cellFlex: {
    flex: 1,
  },
  themeCard: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 24,
    padding: 24,
    paddingBottom: 22,
    backgroundColor: 'rgba(255,255,255,0.02)',
    gap: 9,
  },
  themeCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  themeCardLabel: {
    ...TYPE.CAPTION,
    textTransform: 'uppercase',
  },
  themeColorPip: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  themeCardName: {
    ...TYPE.HEADING,
    fontWeight: '200',
  },
  themeCardRule: {
    width: 40,
    height: 1.5,
    borderRadius: 1,
    marginTop: 4,
  },
});
