// app/settings/index.tsx — Sprint 13: Refined premium settings
import React, { useState } from 'react';
import { View, Switch, TouchableOpacity, ScrollView, Image, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeScreen } from '../../components/ui/SafeScreen';
import { FlowText } from '../../components/ui/FlowText';
import { FlowCard } from '../../components/ui/FlowCard';
import { useTheme, useThemeConfig } from '../../hooks/useTheme';
import { useSettingsStore, Language } from '../../store/settingsStore';
import { THEME_IMAGES } from '../../constants/theme-images';
import { hapticLight } from '../../utils/hapticUtils';

function CustomSlider({ value, onValueChange, onSlidingComplete, theme }: { value: number; onValueChange: (v: number) => void; onSlidingComplete?: () => void; theme: any }) {
  const [width, setWidth] = useState(0);

  const handleTouch = (event: any) => {
    if (width === 0) return;
    const { locationX } = event.nativeEvent;
    const newValue = Math.max(0, Math.min(1, locationX / width));
    onValueChange(newValue);
    if (onSlidingComplete) {
      onSlidingComplete();
    }
  };

  return (
    <View
      style={{ width: '100%', height: 40, justifyContent: 'center' }}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleTouch}
        style={{ width: '100%', height: 40, justifyContent: 'center' }}
      >
        <View style={{ height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.15)', width: '100%', position: 'relative' }}>
          <View style={{ height: 6, borderRadius: 3, backgroundColor: theme.primary, width: `${value * 100}%` }} />
          <View
            style={{
              position: 'absolute',
              top: -7,
              left: `${value * 100}%`,
              marginLeft: -10,
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: theme.primary,
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.5,
              shadowRadius: 3,
              elevation: 4,
            }}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

function VolumeSlider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const theme = useTheme();

  return (
    <View style={{ gap: 4, marginVertical: 4 }}>
      <FlowText size="sm" color={theme.textSecondary}>{label}: {Math.round(value * 100)}%</FlowText>
      <CustomSlider
        value={value}
        onValueChange={onChange}
        onSlidingComplete={() => hapticLight()}
        theme={theme}
      />
    </View>
  );
}

function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.08)',
    }}>
      <FlowText size="md" color={theme.text}>{label}</FlowText>
      {children}
    </View>
  );
}

function SectionLabel({ children }: { children: string }) {
  const theme = useTheme();
  return (
    <Text style={{
      fontFamily: 'DMSans-Medium',
      fontSize: 11,
      color: theme.textMuted,
      letterSpacing: 2.5,
      textTransform: 'uppercase',
      marginTop: 28,
      marginBottom: 10,
    }}>
      {children}
    </Text>
  );
}

export default function Settings() {
  const theme = useTheme();
  const config = useThemeConfig();
  const router = useRouter();
  const {
    language, setLanguage,
    ambientVolume, setAmbientVolume,
    binauralVolume, setBinauralVolume,
    sfxVolume, setSfxVolume,
    hapticsEnabled, setHapticsEnabled,
    keepAwakeEnabled, setKeepAwakeEnabled,
  } = useSettingsStore();

  const textShadow = {
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  };

  return (
    <SafeScreen>
      <LinearGradient
        colors={['rgba(0,0,0,0.65)', 'rgba(0,0,0,0.30)', 'rgba(0,0,0,0.55)']}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <Animated.View entering={FadeIn.duration(350)} style={{ flex: 1 }}>
        {/* Header */}
        <View style={{
          paddingHorizontal: 24,
          paddingTop: 16,
          paddingBottom: 8,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <View style={{ position: 'absolute', left: 24, bottom: 8, top: 16, justifyContent: 'center', zIndex: 10 }}>
            <TouchableOpacity
              onPress={() => { hapticLight(); router.back(); }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Ionicons name="chevron-back" size={20} color={theme.textMuted} />
              <Text style={{
                fontFamily: 'DMSans-Medium',
                fontSize: 14,
                color: theme.textMuted,
              }}>
                Back
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={{
            fontFamily: 'CormorantGaramond-SemiBold',
            fontSize: 34,
            color: theme.primary,
            letterSpacing: 1,
            ...textShadow,
          }}>
            Settings
          </Text>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 60 }}>

          {/* Language */}
          <SectionLabel>Language</SectionLabel>
          <FlowCard
            useBlur={false}
            style={{
              padding: 16,
              backgroundColor: 'rgba(0,0,0,0.42)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.12)',
              borderRadius: 20,
            }}
          >
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {(['en-IN', 'hi-IN'] as Language[]).map((lang) => (
                <TouchableOpacity
                  key={lang}
                  onPress={() => { hapticLight(); setLanguage(lang); }}
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: 12,
                    alignItems: 'center',
                    backgroundColor: language === lang ? theme.primary : 'rgba(0,0,0,0.50)',
                    borderWidth: 1.5,
                    borderColor: language === lang ? theme.primary : 'rgba(255,255,255,0.15)',
                  }}
                >
                  <Text style={{
                    fontFamily: 'DMSans-Medium',
                    fontSize: 14,
                    color: language === lang ? theme.background : theme.text,
                    letterSpacing: 0.5,
                  }}>
                    {lang === 'en-IN' ? 'EN · English' : 'हिं · हिन्दी'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </FlowCard>

          {/* Audio */}
          <SectionLabel>Audio</SectionLabel>
          <FlowCard
            useBlur={false}
            style={{
              padding: 16,
              gap: 16,
              backgroundColor: 'rgba(0,0,0,0.42)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.12)',
              borderRadius: 20,
            }}
          >
            <VolumeSlider label="Ambient" value={ambientVolume} onChange={setAmbientVolume} />
            <VolumeSlider label="Binaural Beats" value={binauralVolume} onChange={setBinauralVolume} />
            <VolumeSlider label="Sound Effects" value={sfxVolume} onChange={setSfxVolume} />
          </FlowCard>

          {/* Device */}
          <SectionLabel>Device</SectionLabel>
          <FlowCard
            useBlur={false}
            style={{
              padding: 16,
              backgroundColor: 'rgba(0,0,0,0.42)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.12)',
              borderRadius: 20,
            }}
          >
            <SettingRow label="Haptic Feedback">
              <Switch
                value={hapticsEnabled}
                onValueChange={(val) => { hapticLight(); setHapticsEnabled(val); }}
                trackColor={{ false: 'rgba(255,255,255,0.15)', true: theme.primary }}
                thumbColor="#FFFFFF"
              />
            </SettingRow>
            <SettingRow label="Keep Screen Awake">
              <Switch
                value={keepAwakeEnabled}
                onValueChange={(val) => { hapticLight(); setKeepAwakeEnabled(val); }}
                trackColor={{ false: 'rgba(255,255,255,0.15)', true: theme.primary }}
                thumbColor="#FFFFFF"
              />
            </SettingRow>
          </FlowCard>

          {/* About */}
          <SectionLabel>About</SectionLabel>
          <FlowCard
            useBlur={false}
            style={{
              padding: 0,
              overflow: 'hidden',
              backgroundColor: 'rgba(0,0,0,0.42)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.12)',
              borderRadius: 20,
            }}
          >
            <Image source={THEME_IMAGES[config.id]} style={{ width: '100%', height: 110 }} resizeMode="cover" />
            <View style={{ padding: 16, gap: 4 }}>
              <Text style={{
                fontFamily: 'CormorantGaramond-SemiBold',
                fontSize: 22,
                color: theme.primary,
              }}>
                Flowsome
              </Text>
              <Text style={{
                fontFamily: 'DMSans-Regular',
                fontSize: 13,
                color: theme.textMuted,
              }}>
                Version 1
              </Text>
              <Text style={{
                fontFamily: 'DMSans-Regular',
                fontSize: 11,
                color: theme.textMuted,
                marginTop: 8,
                lineHeight: 16,
              }}>
                Wellness & productivity with Indian identity. Five regions. One practice.
              </Text>
            </View>
          </FlowCard>

        </ScrollView>
      </Animated.View>
    </SafeScreen >
  );
}
