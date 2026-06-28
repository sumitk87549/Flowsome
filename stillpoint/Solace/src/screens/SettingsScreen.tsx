import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Alert,
} from 'react-native';
import { useSettings } from '@/context/SettingsContext';
import { COLORS } from '@/constants/colors';
import { FONT, FS } from '@/constants/typography';
import ToggleRow from '@/components/shared/ToggleRow';
import ChipRow from '@/components/shared/ChipRow';
import { AmbientSound, RestStyle, ThemeMode, BellVolume } from '@/types/settings';
import { BackButton } from '@/components/shared/BackButton';
import { useTheme } from '@/design/theme';
import { ConfirmSheet } from '@/components/shared/ConfirmSheet';

const WORK_DURATION_OPTIONS = [
  { label: '15m', value: 15 },
  { label: '20m', value: 20 },
  { label: '25m', value: 25 },
  { label: '30m', value: 30 },
  { label: '45m', value: 45 },
  { label: '60m', value: 60 },
];

const SHORT_REST_OPTIONS = [
  { label: '3m', value: 3 },
  { label: '5m', value: 5 },
  { label: '7m', value: 7 },
  { label: '10m', value: 10 },
  { label: '15m', value: 15 },
];

const LONG_REST_OPTIONS = [
  { label: '15m', value: 15 },
  { label: '20m', value: 20 },
  { label: '25m', value: 25 },
  { label: '30m', value: 30 },
];

const SESSIONS_UNTIL_LONG_OPTIONS = [
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
];

const REST_STYLE_OPTIONS = [
  { label: 'Auto', value: 'auto' },
  { label: 'Eyes Away', value: 'eyesAway' },
  { label: 'Move & See', value: 'move' },
  { label: 'Sense Grounding', value: 'senseAndGround' },
  { label: 'Quiet Listening', value: 'quietListening' },
  { label: 'Story Garden', value: 'storyGarden' },
];

const VISUAL_INTENSITY_OPTIONS = [
  { label: 'Minimal', value: 'minimal' },
  { label: 'Balanced', value: 'balanced' },
  { label: 'Immersive', value: 'immersive' },
];

const AMBIENT_SOUND_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'Rain', value: 'rain' },
  { label: 'Forest', value: 'forest' },
  { label: 'Ocean', value: 'ocean' },
  { label: 'Night', value: 'night' },
  { label: 'Wind', value: 'wind' },
];

const BELL_VOLUME_OPTIONS = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
];

const THEME_MODE_OPTIONS = [
  { label: 'System', value: 'system' },
  { label: 'Dawn', value: 'dawn' },
  { label: 'Night', value: 'night' },
];

export default function SettingsScreen() {
  const { settings, updateSetting } = useSettings();
  const theme = useTheme();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleResetSettings = () => {
    // Basic reset for core settings
    updateSetting('workDuration', 25);
    updateSetting('shortRestDuration', 5);
    updateSetting('longRestDuration', 15);
    updateSetting('sessionsUntilLongRest', 4);
    setShowResetConfirm(false);
  };

  const currentRhythm = `${settings.workDuration} / ${settings.shortRestDuration} / ${settings.longRestDuration}`;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <BackButton />
          <View style={{ marginLeft: 16 }}>
            <Text style={[styles.screenTitle, { color: theme.colors.textPrimary }]}>Settings</Text>
            <Text style={[styles.rhythmSubtitle, { color: theme.colors.textMuted }]}>
              Current Rhythm · {currentRhythm}
            </Text>
          </View>
        </View>

        {/* ── Section 1: Session rhythm ── */}
        <View style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.zoneLabel, { color: theme.colors.textPrimary }]}>Session Rhythm</Text>
          <ChipRow
            label="Work Duration"
            options={WORK_DURATION_OPTIONS}
            selectedValue={settings.workDuration}
            onSelect={(val) => updateSetting('workDuration', val as number)}
          />
          <ChipRow
            label="Short Rest"
            options={SHORT_REST_OPTIONS}
            selectedValue={settings.shortRestDuration}
            onSelect={(val) => updateSetting('shortRestDuration', val as number)}
          />
          <ChipRow
            label="Long Rest"
            options={LONG_REST_OPTIONS}
            selectedValue={settings.longRestDuration}
            onSelect={(val) => updateSetting('longRestDuration', val as number)}
          />
          <ChipRow
            label="Long Rest After Cycles"
            options={SESSIONS_UNTIL_LONG_OPTIONS}
            selectedValue={settings.sessionsUntilLongRest}
            onSelect={(val) => updateSetting('sessionsUntilLongRest', val as number)}
          />
        </View>

        {/* ── Section 2: Rest guidance ── */}
        <View style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.zoneLabel, { color: theme.colors.textPrimary }]}>Rest Guidance</Text>
          <ChipRow
            label="Default Rest Path"
            options={REST_STYLE_OPTIONS}
            selectedValue={settings.restStyle}
            onSelect={(val) => updateSetting('restStyle', val as RestStyle)}
          />
          <ChipRow
            label="Visual Intensity"
            options={VISUAL_INTENSITY_OPTIONS}
            selectedValue={settings.visualIntensity}
            onSelect={(val) => updateSetting('visualIntensity', val as any)}
          />
          <ToggleRow
            label="Show return reflection"
            subLabel="Prompt before beginning next focus"
            value={settings.showReturnReflection}
            onValueChange={(val) => updateSetting('showReturnReflection', val)}
          />
        </View>

        {/* ── Section 3: Sound & touch ── */}
        <View style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.zoneLabel, { color: theme.colors.textPrimary }]}>Sound & Touch</Text>
          <ToggleRow
            label="Sound enabled"
            subLabel="Master toggle for all sounds"
            value={settings.soundEnabled}
            onValueChange={(val) => updateSetting('soundEnabled', val)}
          />
          <ToggleRow
            label="Bells enabled"
            subLabel="Chime at start and end of sessions"
            value={settings.bellsEnabled}
            onValueChange={(val) => updateSetting('bellsEnabled', val)}
            disabled={!settings.soundEnabled}
          />
          <ToggleRow
            label="Ambient enabled"
            subLabel="Background sounds during sessions"
            value={settings.ambientEnabled}
            onValueChange={(val) => updateSetting('ambientEnabled', val)}
            disabled={!settings.soundEnabled}
          />
          <ChipRow
            label="Ambient Sound"
            options={AMBIENT_SOUND_OPTIONS}
            selectedValue={settings.ambientSound}
            onSelect={(val) => updateSetting('ambientSound', val as AmbientSound)}
            disabled={!settings.soundEnabled || !settings.ambientEnabled}
          />
          <ChipRow
            label="Bell Volume"
            options={BELL_VOLUME_OPTIONS}
            selectedValue={settings.bellVolume}
            onSelect={(val) => updateSetting('bellVolume', val as BellVolume)}
            disabled={!settings.soundEnabled || !settings.bellsEnabled}
          />
          <ToggleRow
            label="Haptics enabled"
            subLabel="Gentle physical feedback"
            value={settings.hapticsEnabled}
            onValueChange={(val) => updateSetting('hapticsEnabled', val)}
          />
        </View>

        {/* ── Section 4: Appearance ── */}
        <View style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.zoneLabel, { color: theme.colors.textPrimary }]}>Appearance</Text>
          <ChipRow
            label="Theme Mode"
            options={THEME_MODE_OPTIONS}
            selectedValue={settings.themeMode}
            onSelect={(val) => updateSetting('themeMode', val as ThemeMode)}
          />
          <ToggleRow
            label="Reduced motion"
            subLabel="Simplify or slow animations"
            value={settings.reducedMotion}
            onValueChange={(val) => updateSetting('reducedMotion', val)}
          />
          <ToggleRow
            label="Particles enabled"
            subLabel="Show floating particles in backgrounds"
            value={settings.particlesEnabled}
            onValueChange={(val) => updateSetting('particlesEnabled', val)}
            disabled={settings.reducedMotion}
          />
          <ToggleRow
            label="Full-screen immersive"
            subLabel="Hide status bar where possible"
            value={settings.fullScreenMode}
            onValueChange={(val) => updateSetting('fullScreenMode', val)}
          />
        </View>

        {/* ── Section 5: Flow ── */}
        <View style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.zoneLabel, { color: theme.colors.textPrimary }]}>Flow</Text>
          <ToggleRow
            label="Auto-start rest"
            subLabel="Begin rest immediately when focus ends"
            value={settings.autoStartRest}
            onValueChange={(val) => updateSetting('autoStartRest', val)}
          />
          <ToggleRow
            label="Auto-start work"
            subLabel="Begin focus immediately when rest ends"
            value={settings.autoStartWork}
            onValueChange={(val) => updateSetting('autoStartWork', val)}
          />
          <ToggleRow
            label="Keep screen awake"
            subLabel="Prevent screen from dimming"
            value={settings.keepScreenAwake}
            onValueChange={(val) => updateSetting('keepScreenAwake', val)}
          />
        </View>

        {/* ── Section 6: Data ── */}
        <View style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.zoneLabel, { color: theme.colors.textPrimary }]}>Data</Text>
          <Pressable
            style={({ pressed }) => [
              styles.resetButton,
              { backgroundColor: theme.colors.background },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => setShowResetConfirm(true)}
          >
            <Text style={[styles.resetText, { color: theme.colors.danger }]}>
              Reset Settings
            </Text>
          </Pressable>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      <ConfirmSheet
        visible={showResetConfirm}
        title="Reset settings?"
        confirmLabel="Reset"
        cancelLabel="Cancel"
        onConfirm={handleResetSettings}
        onCancel={() => setShowResetConfirm(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  screenTitle: {
    fontFamily: FONT.medium,
    fontSize: 28,
    letterSpacing: 1,
  },
  rhythmSubtitle: {
    fontFamily: FONT.regular,
    fontSize: 14,
    marginTop: 4,
  },
  sectionCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'transparent', // Can use theme line color here in line if needed
  },
  zoneLabel: {
    fontFamily: FONT.medium,
    fontSize: 16,
    letterSpacing: 1,
    marginBottom: 16,
  },
  resetButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  resetText: {
    fontFamily: FONT.medium,
    fontSize: 16,
  },
  bottomPadding: {
    height: 40,
  },
});
