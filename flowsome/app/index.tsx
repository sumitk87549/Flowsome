// app/index.tsx — Sprint 6 (adds ParticleCanvas as background layer)
import { View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { HapticUtils } from '../utils/hapticUtils';
import { SafeScreen } from '../components/ui/SafeScreen';
import { FlowText } from '../components/ui/FlowText';
import { ThemeSelector } from '../components/home/ThemeSelector';
import { DayNightToggle } from '../components/home/DayNightToggle';
import { SessionCard, SESSION_CARDS } from '../components/home/SessionCard';
import { useTheme, useThemeConfig } from '../hooks/useTheme';
import { useSettings } from '../hooks/useSettings';
import { AudioManager } from '../components/audio/AudioManager';
import { ParticleCanvas } from '../components/particles/ParticleCanvas';

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const config = useThemeConfig();
  const { language } = useSettings();

  return (
    <SafeScreen>
      {/* Particle system — absolutely positioned behind all other content */}
      <ParticleCanvas />
      {/* Audio-only, renders null */}
      <AudioManager />
      {/* ── Header Row ──────────────────────────────────────────────── */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 12, paddingBottom: 4 }}>
        <View>
          <FlowText variant="heading" size="2xl" color={theme.primary}>Flowsome</FlowText>
          <FlowText variant="headingLight" size="sm" color={theme.textMuted}>
            {language === 'hi-IN' ? config.taglineHindi : config.tagline}
          </FlowText>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TouchableOpacity
            onPress={() => { HapticUtils.light(); router.push('/settings/' as any); }}
            style={{ padding: 4 }}
          >
            <Ionicons name="settings-outline" size={22} color={theme.textMuted} />
          </TouchableOpacity>
          <DayNightToggle />
        </View>
      </View>
      {/* ── Theme Selector Strip ─────────────────────────────────────── */}
      <ThemeSelector />
      {/* ── Region Label ─────────────────────────────────────────────── */}
      <View style={{ paddingHorizontal: 24, paddingVertical: 16 }}>
        <FlowText variant="headingItalic" size="lg" color={theme.textSecondary} style={{ textAlign: 'center', lineHeight: 28 }}>
          {config.name} {config.icon}
        </FlowText>
        <FlowText variant="body" size="sm" color={theme.textMuted} style={{ textAlign: 'center', marginTop: 4 }}>
          {language === 'hi-IN' ? config.nameHindi : config.name}
        </FlowText>
      </View>
      {/* ── Session Cards Grid ───────────────────────────────────────── */}
      <View style={{ flex: 1, paddingHorizontal: 20, paddingBottom: 24 }}>
        <FlowText variant="label" size="xs" color={theme.textMuted} style={{ marginBottom: 12, letterSpacing: 2, textTransform: 'uppercase' }}>
          Choose Your Practice
        </FlowText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {SESSION_CARDS.map((card) => (
            <SessionCard key={card.id} data={card} />
          ))}
        </View>
      </View>
    </SafeScreen>
  );
}
