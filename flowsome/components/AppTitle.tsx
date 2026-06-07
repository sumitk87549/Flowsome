import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';

interface AppTitleProps {
  title: string;
  subtitle: string;
}

export function AppTitle({ title, subtitle }: AppTitleProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.xxxl,
    marginBottom: SPACING.xxxl,
    alignItems: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: '300',
    color: COLORS.text,
    letterSpacing: 2,
    marginBottom: SPACING.md,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: COLORS.accent,
    letterSpacing: 1,
    opacity: 0.8,
  },
});
