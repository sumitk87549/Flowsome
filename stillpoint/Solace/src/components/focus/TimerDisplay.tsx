import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { FONT } from '@/constants/typography';
import { useTheme } from '@/design/theme';

interface TimerDisplayProps {
  minutes: number;
  seconds: number;
}

export default function TimerDisplay({ minutes, seconds }: TimerDisplayProps) {
  const theme = useTheme();
  const isNight = theme.mode === 'night';

  // In Night mode: bright warm white
  // In Dawn mode: deep dark brown (the textPrimary from DAWN_THEME = #25231F)
  const digitColor = isNight ? '#F1E9DA' : '#25231F';
  const colonColor = isNight ? 'rgba(241,233,218,0.55)' : 'rgba(37,35,31,0.45)';

  return (
    <View style={styles.container}>
      <Text style={[styles.digits, { color: digitColor }]}>
        {String(minutes).padStart(2, '0')}
      </Text>
      <Text style={[styles.colon, { color: colonColor }]}>:</Text>
      <Text style={[styles.digits, { color: digitColor }]}>
        {String(seconds).padStart(2, '0')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  digits: {
    fontFamily: FONT.thin,
    fontSize: 88,
    fontVariant: ['tabular-nums'],
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  colon: {
    fontFamily: FONT.thin,
    fontSize: 88,
    fontVariant: ['tabular-nums'],
    includeFontPadding: false,
    textAlignVertical: 'center',
    marginHorizontal: 2,
  },
});
