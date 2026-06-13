// app/onboarding.tsx
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ParticleCanvas } from '../components/particles/ParticleCanvas';
import { useAppStore } from '../store/appStore';
import { useSettingsStore } from '../store/settingsStore';
import { useSessionStore } from '../store/sessionStore';
import { useTheme } from '../hooks/useTheme';
import { THEMES, ThemeId } from '../constants/themes';
import { HapticUtils } from '../utils/hapticUtils';

type Step = 'welcome' | 'region-quiz' | 'first-breath';

const QUIZ_THEMES: ThemeId[] = ['rajasthan', 'himalaya', 'andaman'];

export default function OnboardingScreen() {
  const [step, setStep] = useState<Step>('welcome');
  const [selectedRegion, setSelectedRegion] = useState<ThemeId | null>(null);
  const theme = useTheme();
  const setTheme = useAppStore((s) => s.setTheme);
  const setOnboardingComplete = useSettingsStore((s) => s.setOnboardingComplete);
  const setSelectedPattern = useSessionStore((s) => s.setSelectedPattern);

  const titleOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (step === 'welcome') {
      Animated.sequence([
        Animated.timing(titleOpacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(taglineOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]).start();

      const timer = setTimeout(() => setStep('region-quiz'), 3500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleRegionSelect = (regionId: ThemeId) => {
    HapticUtils.light();
    setSelectedRegion(regionId);
    setTheme(regionId);
  };

  const handleBeginFirstBreath = () => {
    setOnboardingComplete();
    setSelectedPattern('box-breathing');
    router.replace('/(sessions)/breathing/session');
  };

  // --- STEP 1: Welcome ---
  if (step === 'welcome') {
    return (
      <TouchableOpacity
        style={StyleSheet.absoluteFill}
        onPress={() => setStep('region-quiz')}
        activeOpacity={1}
      >
        <LinearGradient
          colors={[theme.gradientStart, theme.gradientEnd]}
          style={StyleSheet.absoluteFill}
        />
        <ParticleCanvas />

        <View style={styles.welcomeContent}>
          <Animated.Text
            style={[styles.wordmark, { color: theme.text, opacity: titleOpacity }]}
          >
            Flowsome
          </Animated.Text>
          <Animated.Text
            style={[styles.tagline, { color: theme.textMuted, opacity: taglineOpacity }]}
          >
            India's wellness, in your hands
          </Animated.Text>
        </View>
      </TouchableOpacity>
    );
  }

  // --- STEP 2: Region Quiz ---
  if (step === 'region-quiz') {
    return (
      <View style={[styles.screen, { backgroundColor: theme.background }]}>
        <ParticleCanvas />

        <View style={styles.quizContent}>
          <Text style={[styles.quizQuestion, { color: theme.text }]}>
            Where do you find your stillness?
          </Text>

          <View style={styles.regionCards}>
            {QUIZ_THEMES.map((id) => {
              const config = THEMES[id];
              const isSelected = selectedRegion === id;
              return (
                <TouchableOpacity
                  key={id}
                  style={[
                    styles.regionCard,
                    {
                      backgroundColor: theme.card,
                      borderColor: isSelected ? theme.primary : theme.cardBorder,
                      borderWidth: isSelected ? 2 : 1,
                    },
                  ]}
                  onPress={() => handleRegionSelect(id)}
                >
                  <Text style={{ fontSize: 32 }}>{config.icon}</Text>
                  <Text style={[styles.regionName, { color: theme.text }]}>
                    {config.name}
                  </Text>
                  <Text style={[styles.regionTagline, { color: theme.textMuted }]}>
                    {config.tagline}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {selectedRegion && (
            <View style={styles.confirmRow}>
              <Text style={[styles.confirmText, { color: theme.textMuted }]}>
                {THEMES[selectedRegion]?.name ?? ''} has been waiting for you.
              </Text>
              <TouchableOpacity
                style={[styles.nextBtn, { backgroundColor: theme.primary }]}
                onPress={() => setStep('first-breath')}
              >
                <Text style={[styles.nextBtnText, { color: theme.background }]}>
                  Continue →
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  }

  // --- STEP 3: First Practice ---
  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ParticleCanvas />
      <View style={styles.practiceContent}>
        <Text style={[styles.practiceTitle, { color: theme.text }]}>
          One breath{'\n'}before we begin?
        </Text>
        <Text style={[styles.practiceSubtitle, { color: theme.textMuted }]}>
          Box breathing · 3 cycles · ~1 minute
        </Text>
        <TouchableOpacity
          style={[styles.beginBtn, { backgroundColor: theme.primary }]}
          onPress={handleBeginFirstBreath}
        >
          <Text style={[styles.beginBtnText, { color: theme.background }]}>
            Begin
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  screen: { flex: 1 },
  welcomeContent: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
  },
  wordmark: {
    fontSize: 52, fontFamily: 'CormorantGaramond-Medium', letterSpacing: 3,
  },
  tagline: {
    fontSize: 16, marginTop: 16, fontFamily: 'DMSans-Regular', letterSpacing: 1,
  },
  quizContent: {
    flex: 1, paddingHorizontal: 24, justifyContent: 'center',
  },
  quizQuestion: {
    fontSize: 26, fontFamily: 'CormorantGaramond-Medium',
    textAlign: 'center', marginBottom: 32, lineHeight: 34,
  },
  regionCards: {
    gap: 12,
  },
  regionCard: {
    borderRadius: 16, padding: 20,
    flexDirection: 'row', alignItems: 'center', gap: 16,
  },
  regionName: {
    fontSize: 18, fontFamily: 'DMSans-Medium',
  },
  regionTagline: {
    fontSize: 12, fontFamily: 'DMSans-Regular', marginTop: 2,
  },
  confirmRow: {
    marginTop: 24, alignItems: 'center', gap: 16,
  },
  confirmText: {
    fontSize: 15, fontFamily: 'CormorantGaramond-Italic', textAlign: 'center',
  },
  nextBtn: {
    paddingHorizontal: 40, paddingVertical: 14, borderRadius: 12,
  },
  nextBtnText: {
    fontSize: 16, fontFamily: 'DMSans-Medium',
  },
  practiceContent: {
    flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32,
  },
  practiceTitle: {
    fontSize: 40, fontFamily: 'CormorantGaramond-Medium',
    textAlign: 'center', lineHeight: 50, marginBottom: 16,
  },
  practiceSubtitle: {
    fontSize: 14, fontFamily: 'DMSans-Regular', letterSpacing: 1, marginBottom: 48,
  },
  beginBtn: {
    paddingHorizontal: 64, paddingVertical: 18, borderRadius: 12,
  },
  beginBtnText: {
    fontSize: 20, fontFamily: 'DMSans-Medium', letterSpacing: 1,
  },
});
