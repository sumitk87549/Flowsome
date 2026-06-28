import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/design/theme';
import { FONT, FS } from '@/constants/typography';
import * as Haptics from 'expo-haptics';
import { useSettings } from '@/context/SettingsContext';

interface BackButtonProps {
  onPress?: () => void;
  style?: ViewStyle;
  label?: string;
}

export function BackButton({ onPress, style, label = 'Back' }: BackButtonProps) {
  const navigation = useNavigation();
  const theme = useTheme();
  const { settings } = useSettings();

  const handlePress = () => {
    if (settings.sensoryProfile === 'full' || settings.sensoryProfile === 'still') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    if (onPress) {
      onPress();
    } else {
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    }
  };

  return (
    <Pressable 
      onPress={handlePress} 
      style={({ pressed }) => [styles.button, pressed && { opacity: 0.6 }, style]}
      hitSlop={16}
    >
      <Text style={[styles.text, { color: theme.colors.textMuted }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: FONT.regular,
    fontSize: FS.base,
    letterSpacing: 0.5,
  }
});
