// src/rest-modes/WalkMode.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';
import { FONT } from '@/constants/typography';
import { useSessionTimer } from '@/hooks/useSessionTimer';

interface WalkModeProps {
  duration: number;
  onSessionComplete: () => void;
}

export default function WalkMode({ duration, onSessionComplete }: WalkModeProps) {
  const timer = useSessionTimer({ durationMinutes: duration, onComplete: onSessionComplete });

  return (
    <View style={styles.container}>
      <Text style={styles.inviteText}>Step outside.</Text>
      <Text style={styles.timerText}>
        {String(timer.display.minutes).padStart(2, '0')}
        {':'}
        {String(timer.display.seconds).padStart(2, '0')}
      </Text>
      <Text style={styles.subText}>Come back when it's done.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutralDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteText: {
    fontFamily: FONT.light,
    fontSize: 20,
    color: COLORS.cream,
    opacity: 0.7,
    marginBottom: 32,
    letterSpacing: 1,
  },
  timerText: {
    fontFamily: FONT.thin,
    fontSize: 64,
    color: COLORS.cream,
    letterSpacing: 4,
    fontVariant: ['tabular-nums'],
  },
  subText: {
    fontFamily: FONT.light,
    fontSize: 12,
    color: COLORS.cream,
    opacity: 0.35,
    marginTop: 24,
    letterSpacing: 0.5,
  },
});
