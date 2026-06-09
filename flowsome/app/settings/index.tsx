// app/settings/index.tsx
import { View, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeScreen } from '../../components/ui/SafeScreen';
import { FlowText } from '../../components/ui/FlowText';
import { FlowCard } from '../../components/ui/FlowCard';
import { useTheme } from '../../hooks/useTheme';
import { useSettingsStore, Language } from '../../store/settingsStore';
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

export default function Settings() {
  const theme = useTheme();
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
        <View style={{
          paddingHorizontal: 24,
          paddingTop: 16,
          paddingBottom: 8,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 16,
        }}>
          <TouchableOpacity onPress={() => router.back()}>
            <FlowText color={theme.textMuted}>← Back</FlowText>
          </TouchableOpacity>
          <FlowText variant="heading" size="3xl" color={theme.primary}>Settings</FlowText>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 60 }}>

          {/* Language */}
          <FlowText
            variant="label"
            size="xs"
            color={theme.textMuted}
            style={{ marginTop: 24, marginBottom: 8, letterSpacing: 2, textTransform: 'uppercase' }}
          >
            Language
          </FlowText>
          <FlowCard style={{ padding: 16 }}>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {(['en-IN', 'hi-IN'] as Language[]).map((lang) => (
                <TouchableOpacity
                  key={lang}
                  onPress={() => { HapticUtils.medium(); setLanguage(lang); }}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    borderRadius: 12,
                    alignItems: 'center',
                    backgroundColor: language === lang ? theme.primary : theme.card,
                    borderWidth: 1,
                    borderColor: language === lang ? theme.primary : theme.cardBorder,
                  }}
                >
                  <FlowText
                    variant="bodyMedium"
                    size="sm"
                    color={language === lang ? theme.background : theme.text}
                  >
                    {lang === 'en-IN' ? '🇬🇧 English' : '🇮🇳 हिन्दी'}
                  </FlowText>
                </TouchableOpacity>
              ))}
            </View>
          </FlowCard>

          {/* Audio */}
          <FlowText
            variant="label"
            size="xs"
            color={theme.textMuted}
            style={{ marginTop: 24, marginBottom: 8, letterSpacing: 2, textTransform: 'uppercase' }}
          >
            Audio
          </FlowText>
          <FlowCard style={{ padding: 16, gap: 16 }}>
            <VolumeSlider label="🌿 Ambient" value={ambientVolume} onChange={setAmbientVolume} />
            <VolumeSlider label="🎵 Binaural" value={binauralVolume} onChange={setBinauralVolume} />
            <VolumeSlider label="🔔 SFX" value={sfxVolume} onChange={setSfxVolume} />
          </FlowCard>

          {/* Device */}
          <FlowText
            variant="label"
            size="xs"
            color={theme.textMuted}
            style={{ marginTop: 24, marginBottom: 8, letterSpacing: 2, textTransform: 'uppercase' }}
          >
            Device
          </FlowText>
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
          <FlowText
            variant="label"
            size="xs"
            color={theme.textMuted}
            style={{ marginTop: 24, marginBottom: 8, letterSpacing: 2, textTransform: 'uppercase' }}
          >
            About
          </FlowText>
          <FlowCard style={{ padding: 16, gap: 4 }}>
            <FlowText variant="heading" size="xl" color={theme.primary}>Flowsome</FlowText>
            <FlowText size="sm" color={theme.textMuted}>Version 1.0.0 · Expo SDK 56</FlowText>
            <FlowText size="xs" color={theme.textMuted} style={{ marginTop: 8 }}>
              Wellness & productivity with Indian identity. Five regions. Four sessions. One practice.
            </FlowText>
          </FlowCard>

        </ScrollView>
      </Animated.View>
    </SafeScreen>
  );
}
