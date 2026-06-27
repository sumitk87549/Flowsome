import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SolaceToggle from '@/components/shared/SolaceToggle';
import { COLORS } from '@/constants/colors';
import { FONT, FS } from '@/constants/typography';

interface ToggleRowProps {
  label: string;
  subLabel?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export default function ToggleRow({ label, subLabel, value, onValueChange }: ToggleRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {subLabel ? <Text style={styles.subLabel}>{subLabel}</Text> : null}
      </View>
      <SolaceToggle value={value} onValueChange={onValueChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  labelContainer: {
    flex: 1,
    marginRight: 16,
  },
  label: {
    fontFamily: FONT.light,
    fontSize: FS.body,
    color: COLORS.cream,
  },
  subLabel: {
    fontFamily: FONT.light,
    fontSize: FS.sm,
    color: COLORS.creamFaint,
    marginTop: 2,
  },
});
