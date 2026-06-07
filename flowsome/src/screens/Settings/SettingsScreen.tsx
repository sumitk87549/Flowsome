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
  withTiming,
} from 'react-native-reanimated';

import { ThemedBackground } from '../../components/ThemedBackground';
import { BottomNav } from '../../components/BottomNav';
import { useTheme } from '../../context/ThemeContext';
import { useAppStore } from '../../store/appStore';
import { AppTheme } from '../../types';
import { TYPE } from '../../constants/typography';

const LANGUAGES = ['English', 'Hindi', 'Bengali', 'Tamil', 'Telugu'];

export function SettingsScreen() {
  const theme              = useTheme();
  const settings           = useAppStore((s) => s.settings);
  const setUiLanguage      = useAppStore((s) => s.setUiLanguage);
  const setSessionLanguage = useAppStore((s) => s.setSessionLanguage);
  const toggleDarkMode     = useAppStore((s) => s.toggleDarkMode);

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
            <Text style={[styles.title, { color: theme.textColor }]}>Settings</Text>
            <View style={[styles.rule, { backgroundColor: theme.accentColor + '45' }]} />
          </Animated.View>

          {/* ── Appearance ── */}
          <Animated.View entering={FadeInDown.delay(80).duration(500).springify().damping(18)}>
            <OverlineLabel label="Appearance" theme={theme} />
            <ToggleRow
              label="Dark Mode"
              description="Deepens backgrounds and dims glows"
              isOn={settings.darkMode}
              onToggle={toggleDarkMode}
              theme={theme}
            />
          </Animated.View>

          {/* ── UI Language ── */}
          <Animated.View entering={FadeInDown.delay(160).duration(500).springify().damping(18)}>
            <OverlineLabel label="Interface Language" theme={theme} />
            <Text style={[styles.sectionHint, { color: theme.subtextColor + '55' }]}>
              Sets the language for all on-screen labels
            </Text>
            <LanguagePicker
              options={LANGUAGES}
              selected={settings.uiLanguage}
              onSelect={setUiLanguage}
              theme={theme}
            />
          </Animated.View>

          {/* ── Session Language ── */}
          <Animated.View entering={FadeInDown.delay(240).duration(500).springify().damping(18)}>
            <OverlineLabel label="Session Language" theme={theme} />
            <Text style={[styles.sectionHint, { color: theme.subtextColor + '55' }]}>
              Phase labels during breathing & meditation
            </Text>
            <LanguagePicker
              options={LANGUAGES}
              selected={settings.sessionLanguage}
              onSelect={setSessionLanguage}
              theme={theme}
            />
          </Animated.View>

          {/* ── About ── */}
          <Animated.View entering={FadeInDown.delay(320).duration(500).springify().damping(18)}>
            <OverlineLabel label="About" theme={theme} />
            <View style={[styles.infoRow, { borderColor: theme.accentColor + '14' }]}>
              <Text style={[styles.rowLabel, { color: theme.textColor }]}>Version</Text>
              <Text style={[styles.rowValue, { color: theme.subtextColor + '70' }]}>
                1.0.0
              </Text>
            </View>
            <View
              style={[
                styles.infoRow,
                { borderColor: theme.accentColor + '14', marginTop: 8 },
              ]}
            >
              <Text style={[styles.rowLabel, { color: theme.textColor }]}>Built with</Text>
              <Text style={[styles.rowValue, { color: theme.subtextColor + '70' }]}>
                Expo SDK 56
              </Text>
            </View>
          </Animated.View>
        </ScrollView>

        <BottomNav />
      </SafeAreaView>
    </ThemedBackground>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function OverlineLabel({ label, theme }: { label: string; theme: AppTheme }) {
  return (
    <Text style={[styles.overline, { color: theme.subtextColor + '60' }]}>
      {label}
    </Text>
  );
}

function ToggleRow({
  label,
  description,
  isOn,
  onToggle,
  theme,
}: {
  label: string;
  description?: string;
  isOn: boolean;
  onToggle: () => void;
  theme: AppTheme;
}) {
  const thumbX   = useSharedValue(isOn ? 20 : 2);
  const rowScale = useSharedValue(1);
  const trackBg  = useSharedValue(isOn ? 1 : 0);

  React.useEffect(() => {
    thumbX.value  = withSpring(isOn ? 20 : 2, { damping: 16, stiffness: 280 });
    trackBg.value = withTiming(isOn ? 1 : 0, { duration: 300 });
  }, [isOn]);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: thumbX.value }],
  }));
  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: rowScale.value }],
  }));

  return (
    <Animated.View style={rowStyle}>
      <TouchableOpacity
        onPress={onToggle}
        onPressIn={() => {
          rowScale.value = withSpring(0.97, { damping: 14, stiffness: 320 });
        }}
        onPressOut={() => {
          rowScale.value = withSpring(1, { damping: 10, stiffness: 200 });
        }}
        activeOpacity={1}
        style={[
          styles.infoRow,
          styles.toggleRow,
          { borderColor: isOn ? theme.accentColor + '30' : theme.accentColor + '14' },
        ]}
      >
        <View style={styles.toggleLabelCol}>
          <Text style={[styles.rowLabel, { color: theme.textColor }]}>{label}</Text>
          {description ? (
            <Text style={[styles.rowDescription, { color: theme.subtextColor + '60' }]}>
              {description}
            </Text>
          ) : null}
        </View>
        <View
          style={[
            styles.track,
            {
              backgroundColor: isOn
                ? theme.accentColor + '38'
                : theme.accentColor + '14',
            },
          ]}
        >
          <Animated.View
            style={[
              styles.thumb,
              thumbStyle,
              {
                backgroundColor: isOn
                  ? theme.accentColor
                  : theme.subtextColor + '50',
              },
            ]}
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

function LanguagePicker({
  options,
  selected,
  onSelect,
  theme,
}: {
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
  theme: AppTheme;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.pills}
    >
      {options.map((opt) => (
        <PillButton
          key={opt}
          label={opt}
          isActive={opt === selected}
          onPress={() => onSelect(opt)}
          theme={theme}
        />
      ))}
    </ScrollView>
  );
}

function PillButton({
  label,
  isActive,
  onPress,
  theme,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
  theme: AppTheme;
}) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={style}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.90, { damping: 14, stiffness: 320 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 10, stiffness: 200 });
        }}
        activeOpacity={1}
        style={[
          styles.pill,
          {
            backgroundColor: isActive ? theme.accentColor + '1C' : 'transparent',
            borderColor: isActive
              ? theme.accentColor + '58'
              : theme.accentColor + '18',
          },
        ]}
      >
        <Text
          style={[
            styles.pillText,
            {
              color: isActive ? theme.accentColor : theme.subtextColor + '80',
              fontWeight: isActive ? '600' : '400',
            },
          ]}
        >
          {label}
        </Text>
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
    paddingBottom: 32,
    gap: 30,
  },
  header: { gap: 12, marginBottom: 4 },
  title:  { ...TYPE.TITLE },
  rule:   { width: 32, height: 1.5, borderRadius: 1 },

  overline: {
    ...TYPE.CAPTION,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  sectionHint: {
    fontSize: 12,
    fontWeight: '300',
    letterSpacing: 0.3,
    marginTop: -6,
    marginBottom: 14,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 18,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  toggleRow: {
    alignItems: 'flex-start',
  },
  toggleLabelCol: {
    flex: 1,
    gap: 4,
    paddingRight: 16,
  },
  rowLabel:       { ...TYPE.BODY, letterSpacing: 0.2 },
  rowDescription: { fontSize: 12, fontWeight: '300', letterSpacing: 0.2 },
  rowValue:       { ...TYPE.BODY, fontWeight: '300' },

  track: {
    width: 46,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    marginTop: 2,
  },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },

  pills: { gap: 10, paddingBottom: 2 },
  pill:  {
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 28,
    borderWidth: StyleSheet.hairlineWidth,
  },
  pillText: { fontSize: 13, letterSpacing: 0.3 },
});
