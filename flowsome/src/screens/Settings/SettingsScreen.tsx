import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { BottomNav } from '../../components/BottomNav';
import { ThemedBackground } from '../../components/ThemedBackground';
import { useTheme } from '../../context/ThemeContext';
import { useAppStore } from '../../store/appStore';
import { AppLanguage, AppTheme, ThemeMode } from '../../types';
import { TYPE } from '../../constants/typography';
import { LANGUAGES, THEME_MODE_LABELS, t } from '../../localization/i18n';

const THEME_MODES: ThemeMode[] = ['auto', 'light', 'dark'];

export function SettingsScreen() {
  const theme = useTheme();
  const settings = useAppStore((s) => s.settings);
  const setUiLanguage = useAppStore((s) => s.setUiLanguage);
  const setSessionLanguage = useAppStore((s) => s.setSessionLanguage);
  const setThemeMode = useAppStore((s) => s.setThemeMode);
  const uiLanguage = settings.uiLanguage;

  return (
    <ThemedBackground>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInUp.duration(600)} style={styles.header}>
            <Text style={[styles.title, { color: theme.textColor }]}>{t(uiLanguage, 'settings.title')}</Text>
            <View style={[styles.rule, { backgroundColor: theme.accentColor + '45' }]} />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(80).duration(500).springify().damping(18)}>
            <OverlineLabel label={t(uiLanguage, 'settings.appearance')} theme={theme} />
            <Text style={[styles.sectionHint, { color: theme.subtextColor + '72' }]}>{t(uiLanguage, 'settings.themeModeHint')}</Text>
            <SegmentedPicker
              options={THEME_MODES}
              selected={settings.themeMode}
              labelFor={(mode) => THEME_MODE_LABELS[mode]}
              onSelect={setThemeMode}
              theme={theme}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(160).duration(500).springify().damping(18)}>
            <OverlineLabel label={t(uiLanguage, 'settings.interfaceLanguage')} theme={theme} />
            <Text style={[styles.sectionHint, { color: theme.subtextColor + '72' }]}>{t(uiLanguage, 'settings.interfaceHint')}</Text>
            <LanguagePicker selected={settings.uiLanguage} onSelect={setUiLanguage} theme={theme} />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(240).duration(500).springify().damping(18)}>
            <OverlineLabel label={t(uiLanguage, 'settings.sessionLanguage')} theme={theme} />
            <Text style={[styles.sectionHint, { color: theme.subtextColor + '72' }]}>{t(uiLanguage, 'settings.sessionHint')}</Text>
            <LanguagePicker selected={settings.sessionLanguage} onSelect={setSessionLanguage} theme={theme} />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(320).duration(500).springify().damping(18)}>
            <OverlineLabel label={t(uiLanguage, 'settings.about')} theme={theme} />
            <InfoRow label={t(uiLanguage, 'settings.version')} value="1.0.0" theme={theme} />
            <View style={styles.infoGap} />
            <InfoRow label={t(uiLanguage, 'settings.builtWith')} value="Expo SDK 56" theme={theme} />
          </Animated.View>
        </ScrollView>
        <BottomNav />
      </SafeAreaView>
    </ThemedBackground>
  );
}

function OverlineLabel({ label, theme }: { label: string; theme: AppTheme }) {
  return <Text style={[styles.overline, { color: theme.subtextColor + '72' }]}>{label}</Text>;
}

function InfoRow({ label, value, theme }: { label: string; value: string; theme: AppTheme }) {
  return (
    <View style={[styles.infoRow, { borderColor: theme.accentColor + '18' }]}> 
      <Text style={[styles.rowLabel, { color: theme.textColor }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: theme.subtextColor + '86' }]}>{value}</Text>
    </View>
  );
}

function LanguagePicker({ selected, onSelect, theme }: { selected: AppLanguage; onSelect: (v: AppLanguage) => void; theme: AppTheme }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pills}>
      {LANGUAGES.map((language) => (
        <PillButton
          key={language.code}
          label={language.nativeLabel}
          sublabel={language.label}
          isActive={language.code === selected}
          onPress={() => onSelect(language.code)}
          theme={theme}
        />
      ))}
    </ScrollView>
  );
}

function SegmentedPicker<T extends string>({
  options,
  selected,
  labelFor,
  onSelect,
  theme,
}: {
  options: T[];
  selected: T;
  labelFor: (v: T) => string;
  onSelect: (v: T) => void;
  theme: AppTheme;
}) {
  return (
    <View style={[styles.segmented, { borderColor: theme.accentColor + '18' }]}> 
      {options.map((option) => (
        <PillButton key={option} label={labelFor(option)} isActive={option === selected} onPress={() => onSelect(option)} theme={theme} compact />
      ))}
    </View>
  );
}

function PillButton({
  label,
  sublabel,
  isActive,
  onPress,
  theme,
  compact = false,
}: {
  label: string;
  sublabel?: string;
  isActive: boolean;
  onPress: () => void;
  theme: AppTheme;
  compact?: boolean;
}) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={[style, compact ? styles.compactButtonWrap : undefined]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.94, { damping: 14, stiffness: 320 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 10, stiffness: 200 }); }}
        activeOpacity={1}
        style={[
          styles.pill,
          compact ? styles.compactPill : undefined,
          {
            backgroundColor: isActive ? theme.accentColor + '1E' : 'rgba(255,255,255,0.025)',
            borderColor: isActive ? theme.accentColor + '62' : theme.accentColor + '18',
          },
        ]}
      >
        <Text style={[styles.pillText, { color: isActive ? theme.accentColor : theme.textColor + 'B0', fontWeight: isActive ? '600' : '400' }]}>{label}</Text>
        {sublabel ? <Text style={[styles.pillSubtext, { color: theme.subtextColor + '72' }]}>{sublabel}</Text> : null}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 28, paddingTop: 24, paddingBottom: 32, gap: 30 },
  header: { gap: 12, marginBottom: 4 },
  title: { ...TYPE.TITLE },
  rule: { width: 32, height: 1.5, borderRadius: 1 },
  overline: { ...TYPE.CAPTION, textTransform: 'uppercase', marginBottom: 10 },
  sectionHint: { fontSize: 12, fontWeight: '300', letterSpacing: 0.3, marginTop: -5, marginBottom: 14, lineHeight: 18 },
  infoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: StyleSheet.hairlineWidth, borderRadius: 20, padding: 20, backgroundColor: 'rgba(255,255,255,0.035)' },
  infoGap: { height: 8 },
  rowLabel: { ...TYPE.BODY, letterSpacing: 0.2 },
  rowValue: { ...TYPE.BODY, fontWeight: '300' },
  pills: { gap: 10, paddingBottom: 2 },
  segmented: { flexDirection: 'row', gap: 8, borderWidth: StyleSheet.hairlineWidth, borderRadius: 28, padding: 6, backgroundColor: 'rgba(255,255,255,0.025)' },
  compactButtonWrap: { flex: 1 },
  pill: { minWidth: 104, paddingHorizontal: 18, paddingVertical: 12, borderRadius: 24, borderWidth: StyleSheet.hairlineWidth, gap: 2, alignItems: 'center' },
  compactPill: { minWidth: 0, paddingHorizontal: 12, paddingVertical: 11 },
  pillText: { fontSize: 13, letterSpacing: 0.3 },
  pillSubtext: { fontSize: 10, letterSpacing: 0.2, fontWeight: '300' },
});
