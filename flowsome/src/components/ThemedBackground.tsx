import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '../store/appStore';

interface ThemedBackgroundProps {
  children: React.ReactNode;
  style?: object;
}

export function ThemedBackground({ children, style }: ThemedBackgroundProps) {
  const theme = useAppStore((s) => s.currentTheme);

  return (
    <LinearGradient
      colors={theme.backgroundGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.3, y: 1 }}
      style={[styles.container, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
