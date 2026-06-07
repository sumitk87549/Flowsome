import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Screen } from '../components/Screen';
import { COLORS, SPACING } from '../constants/theme';
import { SessionConfig, NavigationProps } from '../types';

interface SessionScreenProps extends NavigationProps {
  config: SessionConfig;
}

export function SessionScreen({ config, goBack }: SessionScreenProps) {
  const handleStart = () => {
    console.log('Session Started', config);
  };

  const displayDuration = () => {
    if (config.type === 'Pomodoro') {
      return `${config.workDuration}m / ${config.breakDuration}m × ${config.cycles}`;
    }
    return `${config.duration} Min`;
  };

  return (
    <Screen>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backText}>← EXIT</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.typeText}>{config.type.toUpperCase()}</Text>
        <Text style={styles.durationText}>{displayDuration()}</Text>

        {config.type === 'Breathing' && config.breathingPattern && (
          <Text style={styles.detailText}>{config.breathingPattern} Pattern</Text>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.startButton} onPress={handleStart} activeOpacity={0.7}>
          <View style={styles.startButtonInner}>
            <Text style={styles.startText}>START</Text>
          </View>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: SPACING.xxl,
    paddingHorizontal: SPACING.md,
  },
  backButton: {
    paddingVertical: SPACING.sm,
  },
  backText: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 1.5,
    opacity: 0.8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.accent,
    letterSpacing: 4,
    marginBottom: SPACING.lg,
  },
  durationText: {
    fontSize: 64,
    fontWeight: '200',
    color: COLORS.text,
    letterSpacing: -1,
  },
  detailText: {
    fontSize: 18,
    fontWeight: '300',
    color: COLORS.text,
    opacity: 0.6,
    marginTop: SPACING.md,
  },
  footer: {
    paddingBottom: SPACING.xxxl * 2,
    alignItems: 'center',
  },
  startButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(134, 197, 184, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(134, 197, 184, 0.2)',
  },
  startButtonInner: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(134, 197, 184, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startText: {
    fontSize: 24,
    fontWeight: '300',
    color: COLORS.text,
    letterSpacing: 4,
  },
});
