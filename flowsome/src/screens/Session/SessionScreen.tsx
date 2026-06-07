import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, {
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated';

import { ThemedBackground } from '../../components/ThemedBackground';
import { BreathingCircle } from '../../components/BreathingCircle';
import { useAppStore } from '../../store/appStore';
import { useSessionEngine } from '../../features/session/useSessionEngine';
import { formatSeconds } from '../../utils/time';
import { RootStackParamList, SessionPhase } from '../../types';
import { SESSION_LABELS, SESSION_EMOJIS } from '../../constants/sessions';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export function SessionScreen() {
  const navigation = useNavigation<NavProp>();
  const theme = useAppStore((s) => s.currentTheme);
  const session = useAppStore((s) => s.session);
  const pauseSession = useAppStore((s) => s.pauseSession);
  const resumeSession = useAppStore((s) => s.resumeSession);
  const endSession = useAppStore((s) => s.endSession);

  useSessionEngine();

  const handleEnd = useCallback(() => {
    endSession();
    navigation.goBack();
  }, [endSession, navigation]);

  const handlePauseResume = useCallback(() => {
    if (session.isPaused) {
      resumeSession();
    } else {
      pauseSession();
    }
  }, [session.isPaused, pauseSession, resumeSession]);

  if (!session.isActive || !session.mode || !session.config) {
    return null;
  }

  const phases = session.config.phases;
  const currentPhase = phases[session.currentPhaseIndex];
  const remaining = session.totalSeconds - session.elapsedSeconds;
  const progress = session.elapsedSeconds / session.totalSeconds;

  const modeLabel = SESSION_LABELS[session.mode];
  const modeEmoji = SESSION_EMOJIS[session.mode];

  const showBreathing = session.mode === 'breathing' || session.mode === 'meditation';

  return (
    <ThemedBackground>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* Top bar */}
        <Animated.View entering={FadeIn.duration(500)} style={styles.topBar}>
          <Text style={[styles.modeLabel, { color: theme.subtextColor }]}>
            {modeEmoji}  {modeLabel}
          </Text>
          <Text style={[styles.cycleText, { color: theme.subtextColor }]}>
            {session.mode !== 'breathing'
              ? `${session.currentCycle} / ${session.config.cycles}`
              : ''}
          </Text>
        </Animated.View>

        {/* Center */}
        <View style={styles.center}>
          {showBreathing && (
            <Animated.View entering={FadeIn.delay(200).duration(600)}>
              <BreathingCircle phase={currentPhase.phase as SessionPhase} size={180} />
            </Animated.View>
          )}

          {!showBreathing && (
            <Animated.View
              entering={FadeIn.delay(100).duration(600)}
              style={[styles.timerRing, { borderColor: theme.accentColor + '30' }]}
            />
          )}

          <Animated.Text
            entering={FadeInDown.delay(300).duration(600)}
            style={[styles.timer, { color: theme.textColor }]}
          >
            {formatSeconds(remaining)}
          </Animated.Text>

          <Animated.Text
            entering={FadeInDown.delay(400).duration(600)}
            style={[styles.phaseLabel, { color: theme.subtextColor }]}
          >
            {currentPhase.label}
          </Animated.Text>

          {/* Progress bar */}
          <View style={[styles.progressTrack, { backgroundColor: theme.accentColor + '20' }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: theme.accentColor,
                  width: `${Math.min(progress * 100, 100)}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* Controls */}
        <Animated.View entering={FadeInDown.delay(500).duration(600)} style={styles.controls}>
          <TouchableOpacity
            onPress={handleEnd}
            style={[styles.endBtn, { borderColor: theme.accentColor + '40' }]}
            activeOpacity={0.7}
          >
            <Text style={[styles.endText, { color: theme.subtextColor }]}>End</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handlePauseResume}
            style={[styles.pauseBtn, { backgroundColor: theme.accentColor + '20', borderColor: theme.accentColor + '50' }]}
            activeOpacity={0.7}
          >
            <Text style={[styles.pauseText, { color: theme.textColor }]}>
              {session.isPaused ? 'Resume' : 'Pause'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 16,
  },
  modeLabel: {
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 1,
  },
  cycleText: {
    fontSize: 13,
    letterSpacing: 0.5,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  timerRing: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 1,
  },
  timer: {
    fontSize: 72,
    fontWeight: '100',
    letterSpacing: -2,
  },
  phaseLabel: {
    fontSize: 16,
    fontWeight: '300',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  progressTrack: {
    width: 160,
    height: 2,
    borderRadius: 1,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 1,
  },
  controls: {
    flexDirection: 'row',
    paddingHorizontal: 32,
    paddingBottom: 40,
    gap: 16,
    alignItems: 'center',
  },
  endBtn: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  endText: {
    fontSize: 15,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  pauseBtn: {
    flex: 2,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseText: {
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});
