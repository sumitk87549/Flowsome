import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useSettings } from '@/context/SettingsContext';
import { useTheme } from '@/design/theme';
import { FONT, FS, TRACKING } from '@/constants/typography';
import { TIMING } from '@/constants/timing';

const SCREEN_HEIGHT = Dimensions.get('screen').height;
const SHEET_TOP = SCREEN_HEIGHT * 0.3; // 70% height
const SPRING_CONFIG = {
  stiffness: TIMING.SHEET_SPRING_STIFFNESS,
  damping: TIMING.SHEET_SPRING_DAMPING,
  mass: TIMING.SHEET_SPRING_MASS,
};

interface SessionSetupSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESETS = [
  { id: 'classic', label: 'Classic', work: 25, rest: 5, long: 15, cycles: 4 },
  { id: 'deep', label: 'Deep Work', work: 50, rest: 10, long: 20, cycles: 2 },
  { id: 'gentle', label: 'Gentle Start', work: 15, rest: 5, long: 15, cycles: 3 },
];

export function SessionSetupSheet({ isOpen, onClose }: SessionSetupSheetProps) {
  const { settings, updateSetting } = useSettings();
  const theme = useTheme();
  const translateY = useSharedValue(SCREEN_HEIGHT);

  useEffect(() => {
    if (isOpen) {
      translateY.value = withSpring(SHEET_TOP, SPRING_CONFIG);
    } else {
      translateY.value = withSpring(SCREEN_HEIGHT, SPRING_CONFIG);
    }
  }, [isOpen, translateY]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const applyPreset = (preset: typeof PRESETS[0]) => {
    updateSetting('workDuration', preset.work);
    updateSetting('shortRestDuration', preset.rest);
    updateSetting('longRestDuration', preset.long);
    updateSetting('sessionsUntilLongRest', preset.cycles);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      )}
      <Animated.View style={[styles.sheet, { backgroundColor: theme.colors.surface }, sheetStyle]}>
        <View style={styles.handle} />
        
        <Text style={[styles.title, { color: theme.colors.text }]}>Session Setup</Text>
        
        <Text style={[styles.sectionLabel, { color: theme.colors.textMuted }]}>Presets</Text>
        <View style={styles.presetsGrid}>
          {PRESETS.map(preset => (
            <Pressable 
              key={preset.id} 
              style={[styles.presetCard, { backgroundColor: theme.colors.background }]}
              onPress={() => applyPreset(preset)}
            >
              <Text style={[styles.presetLabel, { color: theme.colors.text }]}>{preset.label}</Text>
              <Text style={[styles.presetDetails, { color: theme.colors.textMuted }]}>
                {preset.work}m / {preset.rest}m
              </Text>
            </Pressable>
          ))}
        </View>
        
        <View style={styles.footer}>
          <Pressable onPress={() => { onClose(); }}>
            <Text style={[styles.closeText, { color: theme.colors.textMuted }]}>Done</Text>
          </Pressable>
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: FONT.regular,
    fontSize: FS.lg,
    marginBottom: 24,
    letterSpacing: TRACKING.wide,
  },
  sectionLabel: {
    fontFamily: FONT.regular,
    fontSize: FS.sm,
    marginBottom: 12,
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  presetCard: {
    width: '47%',
    padding: 16,
    borderRadius: 16,
  },
  presetLabel: {
    fontFamily: FONT.regular,
    fontSize: FS.base,
    marginBottom: 4,
  },
  presetDetails: {
    fontFamily: FONT.light,
    fontSize: FS.xs,
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  closeText: {
    fontFamily: FONT.regular,
    fontSize: FS.base,
  }
});
