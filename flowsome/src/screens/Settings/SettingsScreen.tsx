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
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { ThemedBackground } from '../../components/ThemedBackground';
import { BottomNav } from '../../components/BottomNav';
import { useAppStore } from '../../store/appStore';

const LANGUAGES = ['English', 'Hindi', 'Bengali', 'Tamil', 'Telugu'];

export function SettingsScreen() {
  const theme = useAppStore((s) => s.currentTheme);
  const settings = useAppStore((s) => s.settings);
  const setUiLanguage = useAppStore((s) => s.setUiLanguage);
  const setSessionLanguage = useAppStore((s) => s.setSessionLanguage);
  const toggleDarkMode = useAppStore((s) => s.toggleDarkMode);

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
            <Text style={[styles.title, { color: theme.textColor }]}>Settings</Text>
          </Animated.View>

          {/* UI Language */}
          <Animated.View entering={FadeInDown.delay(100).duration(500)}>
            <SectionLabel label="UI Language" theme={theme} />
            <LanguagePicker
              options={LANGUAGES}
              selected={settings.uiLanguage}
              onSelect={setUiLanguage}
              theme={theme}
            />
          </Animated.View>

          {/* Session Language */}
          <Animated.View entering={FadeInDown.delay(200).duration(500)}>
            <SectionLabel label="Session Language" theme={theme} />
            <LanguagePicker
              options={LANGUAGES}
              selected={settings.sessionLanguage}
              onSelect={setSessionLanguage}
              theme={theme}
            />
          </Animated.View>

          {/* Dark Mode */}
          <Animated.View entering={FadeInDown.delay(300).duration(500)}>
            <SectionLabel label="Appearance" theme={theme} />
            <TouchableOpacity
              onPress={toggleDarkMode}
              activeOpacity={0.7}
              style={[styles.row, { borderColor: theme.accentColor + '30' }]}
            >
              <Text style={[styles.rowText, { color: theme.textColor }]}>
                Dark Mode
              </Text>
              <View
                style={[
                  styles.toggle,
                  {
                    backgroundColor: settings.darkMode
                      ? theme.accentColor
                      : theme.accentColor + '30',
                  },
                ]}
              >
                <View
                  style={[
                    styles.toggleThumb,
                    {
                      transform: [{ translateX: settings.darkMode ? 18 : 2 }],
                      backgroundColor: settings.darkMode ? '#fff' : theme.subtextColor,
                    },
                  ]}
                />
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Version */}
          <Animated.View entering={FadeInDown.delay(400).duration(500)}>
            <SectionLabel label="About" theme={theme} />
            <View style={[styles.row, { borderColor: theme.accentColor + '30' }]}>
              <Text style={[styles.rowText, { color: theme.textColor }]}>Version</Text>
              <Text style={[styles.rowValue, { color: theme.subtextColor }]}>1.0.0</Text>
            </View>
          </Animated.View>
        </ScrollView>

        <BottomNav />
      </SafeAreaView>
    </ThemedBackground>
  );
}

function SectionLabel({ label, theme }: { label: string; theme: any }) {
  return (
    <Text style={[styles.sectionLabel, { color: theme.subtextColor }]}>{label}</Text>
  );
}

interface LanguagePickerProps {
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
  theme: any;
}

function LanguagePicker({ options, selected, onSelect, theme }: LanguagePickerProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.pills}
    >
      {options.map((opt) => {
        const isActive = opt === selected;
        return (
          <TouchableOpacity
            key={opt}
            onPress={() => onSelect(opt)}
            activeOpacity={0.7}
            style={[
              styles.pill,
              {
                backgroundColor: isActive ? theme.accentColor + '30' : 'transparent',
                borderColor: isActive ? theme.accentColor : theme.accentColor + '30',
              },
            ]}
          >
            <Text
              style={[
                styles.pillText,
                {
                  color: isActive ? theme.accentColor : theme.subtextColor,
                },
              ]}
            >
              {opt}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 24,
    gap: 28,
  },
  header: { gap: 8, marginBottom: 8 },
  title: {
    fontSize: 42,
    fontWeight: '200',
    letterSpacing: -0.5,
  },
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  rowText: {
    fontSize: 15,
    fontWeight: '400',
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '300',
  },
  toggle: {
    width: 44,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  pills: {
    gap: 10,
    paddingBottom: 2,
  },
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '400',
  },
});
