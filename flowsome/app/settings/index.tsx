// app/settings/index.tsx — Sprint 13: Refined premium settings
import { View, Switch, TouchableOpacity, ScrollView, Image, Text } from 'react-native';
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
import { HapticUtils } from '../../utils/hapticUtils';

function VolumeSlider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const theme = useTheme();
  const steps = [0, 0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <View style={{ gap: 8 }}>
      <FlowText size="sm" color={theme.textSecondary}>{label}: {Math.round(value * 100)}%</FlowText>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        {steps.map((step) => (
          <TouchableOpacity
            key={step}
            onPress={() => { HapticUtils.light(); onChange(step); }}
            style={{
              flex: 1,
              height: 8,
              borderRadius: 4,
              backgroundColor: value >= step ? theme.primary : theme.cardBorder,
            }}
          />
        ))}
      </View>
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
      borderBottomColor: theme.cardBorder,
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

  return (
    <SafeScreen>
      <Animated.View entering={FadeIn.duration(350)} style={{ flex: 1 }}>
        {/* Header with gradient backdrop */}
        <View style={{ position: 'relative' }}>
          <LinearGradient
            colors={[theme.gradientStart, theme.background]}
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: 120,
              opacity: 0.15,
            }}
          />
          <View style={{
            paddingHorizontal: 24,
            paddingTop: 16,
            paddingBottom: 8,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
          }}>
            <TouchableOpacity 
              onPress={() => { HapticUtils.light(); router.back(); }}
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
            <Text style={{
              fontFamily: 'CormorantGaramond-SemiBold',
              fontSize: 30,
              color: theme.primary,
              letterSpacing: 1,
              marginLeft: 12,
            }}>
              Settings
            </Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 60 }}>

          {/* Language */}
          <SectionLabel>Language</SectionLabel>
          <FlowCard style={{ padding: 16 }}>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {(['en-IN', 'hi-IN'] as Language[]).map((lang) => (
                <TouchableOpacity
                  key={lang}
                  onPress={() => { HapticUtils.medium(); setLanguage(lang); }}
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: 12,
                    alignItems: 'center',
                    backgroundColor: language === lang ? theme.primary : theme.card,
                    borderWidth: 1,
                    borderColor: language === lang ? theme.primary : theme.cardBorder,
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
          <FlowCard style={{ padding: 16, gap: 16 }}>
            <VolumeSlider label="Ambient" value={ambientVolume} onChange={setAmbientVolume} />
            <VolumeSlider label="Binaural Beats" value={binauralVolume} onChange={setBinauralVolume} />
            <VolumeSlider label="Sound Effects" value={sfxVolume} onChange={setSfxVolume} />
          </FlowCard>

          {/* Device */}
          <SectionLabel>Device</SectionLabel>
          <FlowCard style={{ padding: 16 }}>
            <SettingRow label="Haptic Feedback">
              <Switch
                value={hapticsEnabled}
                onValueChange={setHapticsEnabled}
                trackColor={{ false: theme.cardBorder, true: theme.primary }}
                thumbColor={theme.background}
              />
            </SettingRow>
            <SettingRow label="Keep Screen Awake">
              <Switch
                value={keepAwakeEnabled}
                onValueChange={setKeepAwakeEnabled}
                trackColor={{ false: theme.cardBorder, true: theme.primary }}
                thumbColor={theme.background}
              />
            </SettingRow>
          </FlowCard>

          {/* About */}
          <SectionLabel>About</SectionLabel>
          <FlowCard style={{ padding: 0, overflow: 'hidden', borderWidth: 1, borderColor: theme.cardBorder }}>
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
                Version 1.0.0 · Expo SDK 56
              </Text>
              <Text style={{
                fontFamily: 'DMSans-Regular',
                fontSize: 11,
                color: theme.textMuted,
                marginTop: 8,
                lineHeight: 16,
              }}>
                Wellness & productivity with Indian identity. Five regions. Four sessions. One practice.
              </Text>
            </View>
          </FlowCard>

        </ScrollView>
      </Animated.View>
    </SafeScreen>
  );
}
