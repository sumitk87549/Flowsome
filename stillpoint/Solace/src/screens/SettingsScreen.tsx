import React, { useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useSettings } from '@/context/SettingsContext';
import { COLORS } from '@/constants/colors';
import { FONT, FS } from '@/constants/typography';
import SensoryProfileCard from '@/components/shared/SensoryProfileCard';
import ToggleRow from '@/components/shared/ToggleRow';
import ChipRow from '@/components/shared/ChipRow';
import { SensoryProfile, AmbientSound, RestStyle } from '@/types/settings';
import { BackButton } from '@/components/shared/BackButton';
import { useTheme } from '@/design/theme';

const SENSORY_PROFILES: { profile: SensoryProfile; label: string; descriptor: string }[] = [
  { profile: 'full', label: 'Full', descriptor: 'Sound, haptics & motion' },
  { profile: 'still', label: 'Still', descriptor: 'Sound & motion only' },
  { profile: 'quiet', label: 'Quiet', descriptor: 'Motion only' },
  { profile: 'screenOnly', label: 'Screen', descriptor: 'Visual only' },
];

const WORK_DURATION_OPTIONS = [
  { label: '15m', value: 15 },
  { label: '20m', value: 20 },
  { label: '25m', value: 25 },
  { label: '30m', value: 30 },
  { label: '45m', value: 45 },
  { label: '60m', value: 60 },
];

const SHORT_REST_OPTIONS = [
  { label: '5m', value: 5 },
  { label: '10m', value: 10 },
  { label: '15m', value: 15 },
];

const LONG_REST_OPTIONS = [
  { label: '15m', value: 15 },
  { label: '20m', value: 20 },
  { label: '30m', value: 30 },
];

const SESSIONS_UNTIL_LONG_OPTIONS = [
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
];

const AMBIENT_SOUND_OPTIONS = [
  { label: 'Forest', value: 'forest' },
  { label: 'Rain', value: 'rain' },
  { label: 'Ocean', value: 'ocean' },
  { label: 'Desert', value: 'desert' },
  { label: 'Mountain', value: 'mountain' },
];

const REST_STYLE_OPTIONS = [
  { label: 'Auto', value: 'auto' },
  { label: 'Listen', value: 'listen' },
  { label: 'Breathe', value: 'breathe' },
  { label: 'Drift', value: 'drift' },
  { label: 'Quick', value: 'quickSettle' },
  { label: 'Move', value: 'move' },
  { label: 'Sense', value: 'senseAndGround' },
  { label: 'Story', value: 'storyMoment' },
];

const EVENING_TIME_OPTIONS = [
  { label: '19:00', value: '19:00' },
  { label: '20:00', value: '20:00' },
  { label: '21:00', value: '21:00' },
  { label: '21:30', value: '21:30' },
  { label: '22:00', value: '22:00' },
  { label: '22:30', value: '22:30' },
];

export default function SettingsScreen() {
  const { settings, updateSetting } = useSettings();

  // Evening note time-picker animated height
  const eveningPickerHeight = useSharedValue(settings.eveningNoteEnabled ? 60 : 0);

  const eveningPickerStyle = useAnimatedStyle(() => ({
    height: eveningPickerHeight.value,
    overflow: 'hidden',
  }));

  function handleEveningNoteToggle(val: boolean) {
    updateSetting('eveningNoteEnabled', val);
    eveningPickerHeight.value = withSpring(val ? 60 : 0, {
      stiffness: 200,
      damping: 24,
    });
  }

  const theme = useTheme();

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
          <Text style={[styles.screenTitle, { color: theme.colors.text }]}>Settings</Text>
        </View>

        {/* ── Zone 1: Sensory ── */}
        <Text style={[styles.zoneLabel, { color: theme.colors.textMuted }]}>Sensory</Text>
        <View style={styles.cardsRow}>
          {SENSORY_PROFILES.map((item) => (
            <SensoryProfileCard
              key={item.profile}
              profile={item.profile}
              label={item.label}
              descriptor={item.descriptor}
              isSelected={settings.sensoryProfile === item.profile}
              onSelect={() => updateSetting('sensoryProfile', item.profile)}
            />
          ))}
        </View>

        <View style={styles.toggleSection}>
          <ToggleRow
            label="Haptics on transitions only"
            subLabel="Suppress haptics during rest panels"
            value={settings.transitionsOnly}
            onValueChange={(val) => updateSetting('transitionsOnly', val)}
          />
        </View>

        {/* ── Zone 2: Session Timing ── */}
        <Text style={[styles.zoneLabel, styles.zoneGap, { color: theme.colors.textMuted }]}>Session Timing</Text>

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
          label="Sessions Until Long Rest"
          options={SESSIONS_UNTIL_LONG_OPTIONS}
          selectedValue={settings.sessionsUntilLongRest}
          onSelect={(val) => updateSetting('sessionsUntilLongRest', val as number)}
        />

        {/* ── Zone 3: Experience ── */}
        <Text style={[styles.zoneLabel, styles.zoneGap, { color: theme.colors.textMuted }]}>Experience</Text>

        <View style={styles.toggleSection}>
          <ToggleRow
            label="Auto-start rest"
            subLabel="Transitions to rest without confirmation"
            value={settings.autoStartRest}
            onValueChange={(val) => updateSetting('autoStartRest', val)}
          />
          <ToggleRow
            label="Auto-start work"
            subLabel="Transitions back to work automatically"
            value={settings.autoStartWork}
            onValueChange={(val) => updateSetting('autoStartWork', val)}
          />
          <ToggleRow
            label="Intention word"
            subLabel="Choose a word to anchor your session"
            value={settings.intentionWordEnabled}
            onValueChange={(val) => updateSetting('intentionWordEnabled', val)}
          />
          <ToggleRow
            label="Settle notice"
            subLabel="Brief moment before rest begins"
            value={settings.settleNoticeEnabled}
            onValueChange={(val) => updateSetting('settleNoticeEnabled', val)}
          />
          <ToggleRow
            label="Evening note"
            subLabel="Gentle end-of-day reflection prompt"
            value={settings.eveningNoteEnabled}
            onValueChange={handleEveningNoteToggle}
          />
        </View>

        {/* Evening time picker — animates in when Evening Note is ON */}
        <Animated.View style={eveningPickerStyle}>
          <ChipRow
            label="Evening Note Time"
            options={EVENING_TIME_OPTIONS}
            selectedValue={settings.eveningNoteTime}
            onSelect={(val) => updateSetting('eveningNoteTime', val as string)}
          />
        </Animated.View>

        <ChipRow
          label="Ambient Sound"
          options={AMBIENT_SOUND_OPTIONS}
          selectedValue={settings.ambientSound}
          onSelect={(val) => updateSetting('ambientSound', val as AmbientSound)}
        />
        <ChipRow
          label="Rest Style"
          options={REST_STYLE_OPTIONS}
          selectedValue={settings.restStyle}
          onSelect={(val) => updateSetting('restStyle', val as RestStyle)}
        />

        <View style={styles.bottomPadding} />
      </ScrollView>
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
    marginBottom: 36,
  },
  screenTitle: {
    fontFamily: FONT.thin,
    fontSize: 26,
    letterSpacing: 4,
    marginLeft: 16,
  },
  zoneLabel: {
    fontFamily: FONT.light,
    fontSize: FS.xs,
    color: COLORS.creamFaint,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  zoneGap: {
    marginTop: 32,
  },
  cardsRow: {
    flexDirection: 'row',
    marginHorizontal: -4,
    marginBottom: 20,
  },
  toggleSection: {
    marginBottom: 8,
  },
  bottomPadding: {
    height: 40,
  },
});
