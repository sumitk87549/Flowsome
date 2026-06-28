import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { useSettings } from '@/context/SettingsContext';
import { useTheme } from '@/design/theme';
import { FONT, FS, TRACKING } from '@/constants/typography';

const SCREEN_HEIGHT = Dimensions.get('screen').height;

interface SessionSetupSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESETS = [
  { id: 'classic', label: 'Classic', work: 25, rest: 5, long: 15, cycles: 4 },
  { id: 'deep', label: 'Deep Work', work: 50, rest: 10, long: 20, cycles: 2 },
  { id: 'gentle', label: 'Gentle Start', work: 15, rest: 5, long: 15, cycles: 3 },
  { id: 'custom', label: 'Custom', work: -1, rest: -1, long: -1, cycles: -1 },
];

export function SessionSetupSheet({ isOpen, onClose }: SessionSetupSheetProps) {
  const { settings, updateSetting } = useSettings();
  const theme = useTheme();
  
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);
  const pointerEvents = isOpen ? 'auto' : 'none';

  useEffect(() => {
    if (isOpen) {
      opacity.value = withTiming(1, { duration: 250 });
      scale.value = withSpring(1, { damping: 20, stiffness: 200 });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(0.95, { duration: 200 });
    }
  }, [isOpen, opacity, scale]);

  const modalStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));
  
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const applyPreset = (preset: typeof PRESETS[0]) => {
    if (preset.id !== 'custom') {
      updateSetting('workDuration', preset.work);
      updateSetting('shortRestDuration', preset.rest);
      updateSetting('longRestDuration', preset.long);
      updateSetting('sessionsUntilLongRest', preset.cycles);
    }
  };

  const currentPreview = `${settings.workDuration} min focus · ${settings.shortRestDuration} min rest · ${settings.longRestDuration} min long rest`;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={pointerEvents}>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>
      
      <View style={styles.centeredContainer} pointerEvents="box-none">
        <Animated.View style={[styles.card, { backgroundColor: theme.colors.surfaceStrong }, modalStyle]}>
          
          <Text style={[styles.previewText, { color: theme.colors.textMuted }]}>
            {currentPreview}
          </Text>
          
          <View style={styles.presetsGrid}>
            {PRESETS.map(preset => {
              const isSelected = preset.id !== 'custom'
                ? settings.workDuration === preset.work && settings.shortRestDuration === preset.rest
                : false; // logic for custom selected

              return (
                <Pressable 
                  key={preset.id} 
                  style={[
                    styles.presetCard, 
                    { 
                      backgroundColor: isSelected ? theme.colors.accent : theme.colors.surface,
                      borderColor: isSelected ? theme.colors.accent : 'transparent',
                    }
                  ]}
                  onPress={() => applyPreset(preset)}
                >
                  <Text style={[styles.presetLabel, { color: isSelected ? theme.colors.background : theme.colors.textPrimary }]}>
                    {preset.label}
                  </Text>
                  {preset.id !== 'custom' && (
                    <Text style={[styles.presetDetails, { color: isSelected ? theme.colors.background : theme.colors.textMuted }]}>
                      {preset.work}m / {preset.rest}m
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </View>

          <View style={styles.actions}>
            <Pressable 
              style={[styles.primaryButton, { backgroundColor: theme.colors.textPrimary }]} 
              onPress={onClose}
            >
              <Text style={[styles.primaryButtonText, { color: theme.colors.background }]}>Start Session</Text>
            </Pressable>
            
            <Pressable 
              style={styles.secondaryButton} 
              onPress={onClose}
            >
              <Text style={[styles.secondaryButtonText, { color: theme.colors.textMuted }]}>Cancel</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  centeredContainer: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  previewText: {
    fontFamily: FONT.medium,
    fontSize: FS.sm,
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  presetCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  presetLabel: {
    fontFamily: FONT.medium,
    fontSize: FS.base,
    marginBottom: 4,
  },
  presetDetails: {
    fontFamily: FONT.regular,
    fontSize: FS.xs,
  },
  actions: {
    alignItems: 'center',
  },
  primaryButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    fontFamily: FONT.medium,
    fontSize: FS.base,
  },
  secondaryButton: {
    padding: 12,
  },
  secondaryButtonText: {
    fontFamily: FONT.regular,
    fontSize: FS.sm,
  },
});
