import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';
import { FONT } from '@/constants/typography';

interface TimerDisplayProps {
  minutes: number;
  seconds: number;
}

export default function TimerDisplay({ minutes, seconds }: TimerDisplayProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.digits}>{String(minutes).padStart(2, '0')}</Text>
      <Text style={styles.colon}>:</Text>
      <Text style={styles.digits}>{String(seconds).padStart(2, '0')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'baseline', // Fixed alignment matching original
    justifyContent: 'center',
    alignSelf: 'center',
    top: '44%',
    zIndex: 3,
  },
  digits: {
    fontFamily: FONT.thin,
    fontSize: 88,
    fontVariant: ['tabular-nums'],
    color: COLORS.warmWhite,
    opacity: 1.0,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  colon: {
    fontFamily: FONT.thin,
    fontSize: 88,
    color: COLORS.warmWhite,
    opacity: 0.55,
    fontVariant: ['tabular-nums'],
    includeFontPadding: false,
    textAlignVertical: 'center',
    marginHorizontal: 2,
  },
});
