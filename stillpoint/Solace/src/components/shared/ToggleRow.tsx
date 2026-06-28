import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SolaceToggle from '@/components/shared/SolaceToggle';
import { FONT, FS } from '@/constants/typography';
import { useTheme } from '@/design/theme';

interface ToggleRowProps {
  label: string;
  subLabel?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export default function ToggleRow({ label, subLabel, value, onValueChange, disabled }: ToggleRowProps) {
  const theme = useTheme();
  
  return (
    <View style={[styles.row, disabled && { opacity: 0.4 }]}>
      <View style={styles.labelContainer}>
        <Text style={[styles.label, { color: theme.colors.textPrimary }]}>{label}</Text>
        {subLabel ? <Text style={[styles.subLabel, { color: theme.colors.textMuted }]}>{subLabel}</Text> : null}
      </View>
      <SolaceToggle value={value} onValueChange={onValueChange} disabled={disabled} />
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
    fontFamily: FONT.medium,
    fontSize: FS.body,
  },
  subLabel: {
    fontFamily: FONT.regular,
    fontSize: FS.sm,
    marginTop: 2,
  },
});
