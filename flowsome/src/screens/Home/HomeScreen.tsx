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
} from 'react-native-reanimated';

import { ThemedBackground } from '../../components/ThemedBackground';
import { BottomNav } from '../../components/BottomNav';
import { SessionButton } from '../../components/SessionButton';
import { useAppStore } from '../../store/appStore';
import { RootStackParamList, SessionMode } from '../../types';
import { SESSION_LABELS, SESSION_EMOJIS } from '../../constants/sessions';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const SESSION_MODES: SessionMode[] = ['pomodoro', 'focus', 'breathing', 'meditation'];

export function HomeScreen() {
  const navigation = useNavigation<NavProp>();
  const theme = useAppStore((s) => s.currentTheme);
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
          {/* Header */}
          <Animated.View entering={FadeInUp.delay(0).duration(700)} style={styles.header}>
            <Text style={[styles.title, { color: theme.textColor }]}>Flowsome</Text>
            <Text style={[styles.subtitle, { color: theme.subtextColor }]}>
              Find your flow
            </Text>
          </Animated.View>

          {/* Mode buttons */}
          <Animated.View entering={FadeInDown.delay(200).duration(700)} style={styles.grid}>
            <View style={styles.row}>
              {SESSION_MODES.slice(0, 2).map((mode) => (
                <SessionButton
                  key={mode}
                  emoji={SESSION_EMOJIS[mode]}
                  label={SESSION_LABELS[mode]}
                  onPress={() => handleMode(mode)}
                  style={styles.buttonFlex}
                />
              ))}
            </View>
            <View style={styles.row}>
              {SESSION_MODES.slice(2).map((mode) => (
                <SessionButton
                  key={mode}
                  emoji={SESSION_EMOJIS[mode]}
                  label={SESSION_LABELS[mode]}
                  onPress={() => handleMode(mode)}
                  style={styles.buttonFlex}
                />
              ))}
            </View>
          </Animated.View>

          {/* Current theme card */}
          <Animated.View
            entering={FadeInDown.delay(400).duration(700)}
            style={[styles.themeCard, { borderColor: theme.accentColor + '30' }]}
          >
            <Text style={[styles.themeLabel, { color: theme.subtextColor }]}>
              Current Theme
            </Text>
            <Text style={[styles.themeName, { color: theme.textColor }]}>
              {theme.name}
            </Text>
            <View
              style={[styles.themeAccent, { backgroundColor: theme.accentColor }]}
            />
          </Animated.View>
        </ScrollView>

        <BottomNav />
      </SafeAreaView>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 24,
    gap: 40,
  },
  header: {
    gap: 8,
  },
  title: {
    fontSize: 42,
    fontWeight: '200',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '300',
    letterSpacing: 1,
  },
  grid: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    height: 140,
  },
  buttonFlex: {
    flex: 1,
  },
  themeCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 24,
    backgroundColor: 'rgba(255,255,255,0.03)',
    gap: 6,
  },
  themeLabel: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  themeName: {
    fontSize: 22,
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  themeAccent: {
    width: 32,
    height: 2,
    borderRadius: 1,
    marginTop: 8,
  },
});
