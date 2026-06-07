import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedBackground } from '../../components/ThemedBackground';
import { BottomNav } from '../../components/BottomNav';
import { useAppStore } from '../../store/appStore';
import { THEMES } from '../../constants/themes';
import { AppTheme } from '../../types';

export function ThemesScreen() {
  const theme = useAppStore((s) => s.currentTheme);
  const setTheme = useAppStore((s) => s.setTheme);

  return (
    <ThemedBackground>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInUp.duration(600)} style={styles.header}>
            <Text style={[styles.title, { color: theme.textColor }]}>Themes</Text>
            <Text style={[styles.subtitle, { color: theme.subtextColor }]}>
              India's landscapes
            </Text>
          </Animated.View>

          <View style={styles.list}>
            {THEMES.map((t, i) => (
              <ThemeRow
                key={t.id}
                themeOption={t}
                isActive={t.id === theme.id}
                onPress={() => setTheme(t.id)}
                delay={i * 80}
              />
            ))}
          </View>
        </ScrollView>

        <BottomNav />
      </SafeAreaView>
    </ThemedBackground>
  );
}

interface ThemeRowProps {
  themeOption: AppTheme;
  isActive: boolean;
  onPress: () => void;
  delay: number;
}

function ThemeRow({ themeOption, isActive, onPress, delay }: ThemeRowProps) {
  const currentTheme = useAppStore((s) => s.currentTheme);
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handlePressIn() {
    scale.value = withSpring(0.97, { damping: 14, stiffness: 260 });
  }
  function handlePressOut() {
    scale.value = withSpring(1, { damping: 14, stiffness: 260 });
  }

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(500)}
      style={animStyle}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={[
          styles.row,
          {
            borderColor: isActive
              ? themeOption.accentColor + '80'
              : currentTheme.accentColor + '20',
          },
        ]}
      >
        {/* Gradient swatch */}
        <LinearGradient
          colors={themeOption.backgroundGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.swatch}
        />

        {/* Info */}
        <View style={styles.rowInfo}>
          <Text style={[styles.rowName, { color: currentTheme.textColor }]}>
            {themeOption.name}
          </Text>
          <Text style={[styles.rowSound, { color: currentTheme.subtextColor }]}>
            {themeOption.ambientSound.replace(/_/g, ' ')}
          </Text>
        </View>

        {/* Active indicator */}
        {isActive && (
          <View
            style={[styles.activeDot, { backgroundColor: themeOption.accentColor }]}
          />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 24,
    gap: 40,
  },
  header: { gap: 8 },
  title: {
    fontSize: 42,
    fontWeight: '200',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '300',
    letterSpacing: 1,
  },
  list: { gap: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
    gap: 16,
  },
  swatch: {
    width: 52,
    height: 52,
    borderRadius: 14,
  },
  rowInfo: {
    flex: 1,
    gap: 4,
  },
  rowName: {
    fontSize: 17,
    fontWeight: '400',
    letterSpacing: 0.2,
  },
  rowSound: {
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: 'capitalize',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
