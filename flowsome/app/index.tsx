// app/index.tsx — Sprint 6 (adds ParticleCanvas as background layer)
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { HapticUtils } from '../utils/hapticUtils';
import { SafeScreen } from '../components/ui/SafeScreen';
import { FlowText } from '../components/ui/FlowText';
import { FlowCard } from '../components/ui/FlowCard';
import { ThemeSelector } from '../components/home/ThemeSelector';
import { DayNightToggle } from '../components/home/DayNightToggle';
import { SessionCard, SESSION_CARDS } from '../components/home/SessionCard';
import { useTheme, useThemeConfig } from '../hooks/useTheme';
import { useSettings } from '../hooks/useSettings';
import { AudioManager } from '../components/audio/AudioManager';
import { ParticleCanvas } from '../components/particles/ParticleCanvas';
import { QUOTES } from '../constants/quotes';

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const config = useThemeConfig();
  const { language } = useSettings();

  // Get active quote for theme
  const themeQuotes = QUOTES[config.id] || QUOTES['rajasthan'];
  const activeQuote = themeQuotes[0];

  return (
    <SafeScreen>
      {/* Particle system — absolutely positioned behind all other content */}
      <ParticleCanvas />
      {/* Audio-only, renders null */}
      <AudioManager />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* ── Header Row ──────────────────────────────────────────────── */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 }}>
          <View>
            <FlowText variant="heading" size="3xl" color={theme.primary}>Flowsome</FlowText>
            <FlowText variant="body" size="xs" color={theme.textMuted} style={{ marginTop: 2, letterSpacing: 1.5, textTransform: 'uppercase' }}>
              {language === 'hi-IN' ? config.taglineHindi : config.tagline}
            </FlowText>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <TouchableOpacity
              onPress={() => { HapticUtils.light(); router.push('/settings/' as any); }}
              style={{ padding: 4 }}
            >
              <Ionicons name="settings-outline" size={24} color={theme.textMuted} />
            </TouchableOpacity>
            <DayNightToggle />
          </View>
        </View>

        {/* ── Theme Selector Strip ─────────────────────────────────────── */}
        <ThemeSelector />

        {/* ── Region & Quote Card ───────────────────────────────────────── */}
        <View style={{ paddingHorizontal: 24, paddingVertical: 12 }}>
          <FlowCard style={{ padding: 18, alignItems: 'center', justifyContent: 'center', borderColor: theme.cardBorder, borderWidth: 1 }}>
            <FlowText variant="headingItalic" size="md" color={theme.textSecondary} style={{ textAlign: 'center', lineHeight: 22, fontStyle: 'italic' }}>
              "{language === 'hi-IN' ? activeQuote.textHindi : activeQuote.text}"
            </FlowText>
            <FlowText variant="body" size="xs" color={theme.textMuted} style={{ marginTop: 8, textAlign: 'center', letterSpacing: 1 }}>
              — {language === 'hi-IN' ? activeQuote.attributionHindi : activeQuote.attribution} ({config.icon} {config.name})
            </FlowText>
          </FlowCard>
        </View>

        {/* ── Session Cards Grid ───────────────────────────────────────── */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 24 }}>
          <FlowText variant="label" size="xs" color={theme.textMuted} style={{ marginBottom: 12, letterSpacing: 2.5, textTransform: 'uppercase' }}>
            Choose Your Practice
          </FlowText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {SESSION_CARDS.map((card) => (
              <SessionCard key={card.id} data={card} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}
