import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useSettings } from '@/context/SettingsContext';
import { useTheme } from '@/design/theme';
import { FONT, FS } from '@/constants/typography';
import * as Haptics from 'expo-haptics';

export function ThemeToggle() {
  const { settings, updateSetting } = useSettings();
  const theme = useTheme();

  const handlePress = () => {
    if (settings.sensoryProfile === 'full' || settings.sensoryProfile === 'still') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    const nextMode = settings.themeMode === 'dawn' ? 'night' : 'dawn';
    updateSetting('themeMode', nextMode);
  };

  const label = settings.themeMode === 'dawn' ? '☀️ Dawn' : '🌙 Night';

  return (
    <Pressable
      onPress={handlePress}
      style={[styles.pill, { backgroundColor: theme.colors.surface }]}
      hitSlop={16}
    >
      <Text style={[styles.text, { color: theme.colors.textMuted }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: FONT.regular,
    fontSize: FS.xs,
    letterSpacing: 0.5,
  }
});
