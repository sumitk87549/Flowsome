import React from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { BottomNav } from '../../components/BottomNav';
import { ThemedBackground } from '../../components/ThemedBackground';
import { useTheme } from '../../context/ThemeContext';
import { useAppStore } from '../../store/appStore';
import { THEMES } from '../../constants/themes';
import { AppTheme } from '../../types';
import { TYPE } from '../../constants/typography';
import { t } from '../../localization/i18n';

export function ThemesScreen() {
  const theme = useTheme();
  const setTheme = useAppStore((s) => s.setTheme);
  const uiLanguage = useAppStore((s) => s.settings.uiLanguage);

  return (
    <ThemedBackground>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInUp.duration(600)} style={styles.header}>
            <Text style={[styles.title, { color: theme.textColor }]}>{t(uiLanguage, 'themes.title')}</Text>
            <View style={[styles.rule, { backgroundColor: theme.accentColor + '45' }]} />
            <Text style={[styles.subtitle, { color: theme.subtextColor }]}>{t(uiLanguage, 'themes.subtitle')}</Text>
          </Animated.View>

          <Animated.Text entering={FadeInDown.delay(80).duration(500)} style={[styles.hint, { color: theme.subtextColor + '75' }]}>
            {t(uiLanguage, 'themes.hint')}
          </Animated.Text>

          <View style={styles.list}>
            {THEMES.map((scene, index) => (
              <SceneCard
                key={scene.id}
                scene={scene}
                isActive={scene.id === theme.id}
                currentTheme={theme}
                onPress={() => setTheme(scene.id)}
                delay={130 + index * 80}
                selectedLabel={t(uiLanguage, 'scene.choose')}
              />
            ))}
          </View>
        </ScrollView>
        <BottomNav />
      </SafeAreaView>
    </ThemedBackground>
  );
}

function SceneCard({
  scene,
  currentTheme,
  isActive,
  onPress,
  delay,
  selectedLabel,
}: {
  scene: AppTheme;
  currentTheme: AppTheme;
  isActive: boolean;
  onPress: () => void;
  delay: number;
  selectedLabel: string;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(600).springify().damping(20)} style={animStyle}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.975, { damping: 16, stiffness: 280 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 12, stiffness: 180 }); }}
        activeOpacity={1}
        style={[styles.card, { borderColor: isActive ? scene.accentColor + '80' : currentTheme.accentColor + '18' }]}
      >
        <ImageBackground source={scene.backgroundImage} resizeMode="cover" style={StyleSheet.absoluteFill}>
          <LinearGradient
            colors={[scene.backgroundGradient[0], 'transparent', scene.backgroundGradient[3]]}
            locations={[0, 0.42, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </ImageBackground>
        <View style={styles.cardContent}>
          <View style={styles.cardTopRow}>
            <View style={[styles.accentLine, { backgroundColor: scene.accentColor }]} />
            {isActive ? (
              <View style={[styles.selectedPill, { borderColor: scene.accentColor + '75', backgroundColor: scene.accentColor + '18' }]}>
                <Text style={[styles.selectedText, { color: scene.accentColor }]}>{selectedLabel}</Text>
              </View>
            ) : null}
          </View>
          <View style={styles.cardCopy}>
            <Text style={[styles.sceneName, { color: scene.textColor }]}>{scene.name}</Text>
            <Text style={[styles.sceneSubtitle, { color: scene.subtextColor }]}>{scene.subtitle}</Text>
            <Text style={[styles.sceneFeeling, { color: scene.textColor + 'B8' }]}>{scene.feeling}</Text>
          </View>
          <Text style={[styles.ambient, { color: scene.accentColor + 'D0' }]}>{scene.ambientSound}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 28, gap: 24 },
  header: { gap: 12, paddingHorizontal: 4 },
  title: { ...TYPE.TITLE },
  rule: { width: 32, height: 1.5, borderRadius: 1 },
  subtitle: { ...TYPE.BODY, letterSpacing: 1.5, fontWeight: '300' },
  hint: { ...TYPE.BODY, fontWeight: '300', lineHeight: 21, paddingHorizontal: 4 },
  list: { gap: 16 },
  card: {
    height: 188,
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.035)',
  },
  cardContent: { flex: 1, padding: 20, justifyContent: 'space-between' },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  accentLine: { width: 34, height: 2, borderRadius: 1 },
  selectedPill: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  selectedText: { ...TYPE.MICRO, textTransform: 'uppercase' },
  cardCopy: { gap: 5 },
  sceneName: { ...TYPE.HEADING, fontWeight: '300' },
  sceneSubtitle: { ...TYPE.BODY, fontWeight: '300' },
  sceneFeeling: { fontSize: 13, letterSpacing: 0.3, fontWeight: '300', marginTop: 4 },
  ambient: { ...TYPE.CAPTION, textTransform: 'uppercase' },
});
