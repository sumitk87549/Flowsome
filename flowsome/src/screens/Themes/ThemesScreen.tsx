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
import { useTheme } from '../../context/ThemeContext';
import { useAppStore } from '../../store/appStore';
import { THEMES } from '../../constants/themes';
import { AppTheme } from '../../types';
import { TYPE } from '../../constants/typography';

export function ThemesScreen() {
  const theme    = useTheme();
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
          {/* Header */}
          <Animated.View entering={FadeInUp.duration(600)} style={styles.header}>
            <Text style={[styles.title, { color: theme.textColor }]}>Themes</Text>
            <View style={[styles.rule, { backgroundColor: theme.accentColor + '45' }]} />
            <Text style={[styles.subtitle, { color: theme.subtextColor }]}>
              India's landscapes
            </Text>
          </Animated.View>

          {/* Hint */}
          <Animated.Text
            entering={FadeInDown.delay(80).duration(500)}
            style={[styles.hint, { color: theme.subtextColor + '55' }]}
          >
            Tap a scene to apply — backgrounds cross-fade instantly
          </Animated.Text>

          {/* Theme list */}
          <View style={styles.list}>
            {THEMES.map((t, i) => (
              <ThemeRow
                key={t.id}
                themeOption={t}
                isActive={t.id === theme.id}
                onPress={() => setTheme(t.id)}
                delay={120 + i * 80}
              />
            ))}
          </View>
        </ScrollView>

        <BottomNav />
      </SafeAreaView>
    </ThemedBackground>
  );
}

// ─── Theme Row ────────────────────────────────────────────────────────────────

interface ThemeRowProps {
  themeOption: AppTheme;
  isActive: boolean;
  onPress: () => void;
  delay: number;
}

function ThemeRow({ themeOption, isActive, onPress, delay }: ThemeRowProps) {
  const currentTheme = useTheme();
  const scale        = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(500).springify().damping(18)}
      style={animStyle}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.96, { damping: 14, stiffness: 320 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 10, stiffness: 200 });
        }}
        activeOpacity={1}
        style={[
          styles.row,
          {
            borderColor: isActive
              ? themeOption.accentColor + '55'
              : currentTheme.accentColor + '12',
            backgroundColor: isActive
              ? themeOption.accentColor + '07'
              : 'rgba(255,255,255,0.02)',
          },
        ]}
      >
        {/* Gradient swatch */}
        <View style={styles.swatchWrap}>
          <LinearGradient
            colors={themeOption.backgroundGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          {/* Accent pip */}
          <View
            style={[styles.swatchPip, { backgroundColor: themeOption.accentColor }]}
          />
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={[styles.themeName, { color: currentTheme.textColor }]}>
            {themeOption.name}
          </Text>
          <Text style={[styles.themeSound, { color: currentTheme.subtextColor + '70' }]}>
            {themeOption.ambientSound.replace(/_/g, ' ')}
          </Text>
          {/* Particle density badge */}
          <Text style={[styles.particleBadge, { color: themeOption.accentColor + '90' }]}>
            {themeOption.particleDensity > 25 ? '✦ Dense particles' :
             themeOption.particleDensity > 15 ? '✦ Soft particles' : '✦ Minimal'}
          </Text>
        </View>

        {/* Active check */}
        {isActive ? (
          <View
            style={[styles.checkWrap, { borderColor: themeOption.accentColor }]}
          >
            <Text style={[styles.checkMark, { color: themeOption.accentColor }]}>
              ✓
            </Text>
          </View>
        ) : (
          <View
            style={[styles.inactiveCircle, { borderColor: currentTheme.accentColor + '20' }]}
          />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1 },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 28,
    gap: 28,
  },
  header:   { gap: 12 },
  title:    { ...TYPE.TITLE },
  rule:     { width: 32, height: 1.5, borderRadius: 1 },
  subtitle: { ...TYPE.BODY, letterSpacing: 1.5, fontWeight: '300' },
  hint: {
    fontSize: 12,
    fontWeight: '300',
    letterSpacing: 0.3,
    marginTop: -4,
  },
  list: { gap: 10 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 22,
    padding: 16,
    gap: 16,
  },
  swatchWrap: {
    width: 60,
    height: 60,
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  swatchPip: {
    width: 20,
    height: 3,
    borderRadius: 1.5,
    marginBottom: 8,
    opacity: 0.9,
  },
  info: { flex: 1, gap: 4 },
  themeName:     { ...TYPE.SUBHEADING },
  themeSound:    { ...TYPE.CAPTION, letterSpacing: 1, textTransform: 'capitalize' },
  particleBadge: { fontSize: 10, fontWeight: '300', letterSpacing: 0.5, marginTop: 2 },
  checkWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: { fontSize: 12, fontWeight: '700', marginTop: -1 },
  inactiveCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
