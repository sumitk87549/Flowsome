// app/(sessions)/breathing/index.tsx
import { View, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeScreen } from '../../../components/ui/SafeScreen';
import { FlowText } from '../../../components/ui/FlowText';
import { FlowCard } from '../../../components/ui/FlowCard';
import { FlowButton } from '../../../components/ui/FlowButton';
import { useTheme, useThemeConfig } from '../../../hooks/useTheme';
import { useSessionStore } from '../../../store/sessionStore';
import { BREATHING_PATTERNS } from '../../../constants/breathing-patterns';
import { THEME_IMAGES } from '../../../constants/theme-images';
import { HapticUtils } from '../../../utils/hapticUtils';

export default function BreathingPicker() {
  const theme = useTheme();
  const config = useThemeConfig();
  const router = useRouter();
  const { selectedPatternId, setSelectedPattern } = useSessionStore();

  const selected = selectedPatternId ?? BREATHING_PATTERNS[0].id;

  const handleStart = () => {
    HapticUtils.medium();
    router.push('/(sessions)/breathing/session' as any);
  };

  return (
    <SafeScreen>
      <View
        style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <FlowText color={theme.textMuted}>← Back</FlowText>
        </TouchableOpacity>
        <FlowText
          variant="heading"
          size="4xl"
          color={theme.primary}
          style={{ marginTop: 16 }}
        >
          🌬️ Breathe
        </FlowText>
        <FlowText
          variant="body"
          size="sm"
          color={theme.textMuted}
          style={{ marginTop: 4 }}
        >
          Choose your breathing technique
        </FlowText>
        
        {/* Landscape banner showcasing the selected region */}
        <View style={{ borderRadius: 16, overflow: 'hidden', height: 95, marginTop: 16, borderWidth: 1, borderColor: theme.cardBorder }}>
          <ImageBackground source={THEME_IMAGES[config.id]} style={{ width: '100%', height: '100%', justifyContent: 'flex-end' }}>
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.75)']} style={{ padding: 12 }}>
              <FlowText color="#FFFFFF" variant="headingItalic" size="sm" style={{ letterSpacing: 0.5 }}>
                Practicing with regional presence in {config.name} {config.icon}
              </FlowText>
            </LinearGradient>
          </ImageBackground>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          gap: 14,
          paddingTop: 8,
          paddingBottom: 120,
        }}
      >
        {BREATHING_PATTERNS.map((pattern) => (
          <TouchableOpacity
            key={pattern.id}
            onPress={() => {
              HapticUtils.light();
              setSelectedPattern(pattern.id);
            }}
          >
            <FlowCard
              style={{
                padding: 18,
                borderColor:
                  selected === pattern.id ? theme.primary : theme.cardBorder,
                borderWidth: selected === pattern.id ? 2 : 1,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <FlowText
                    variant="heading"
                    size="xl"
                    color={selected === pattern.id ? theme.primary : theme.text}
                  >
                    {pattern.name}
                  </FlowText>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                    <FlowText size="xs" color={theme.textMuted}>{pattern.nameHindi}</FlowText>
                    <FlowText size="xs" color={theme.textMuted}>•</FlowText>
                    <FlowText size="xs" color={theme.textMuted}>{pattern.cycles} cycles</FlowText>
                  </View>
                </View>
              </View>

              <FlowText
                variant="body"
                size="sm"
                color={theme.textSecondary}
                style={{ marginTop: 6 }}
              >
                {pattern.description}
              </FlowText>

              {/* Minimal phases text layout — no boxes, clean dots */}
              <FlowText size="xs" color={theme.textSecondary} style={{ marginTop: 8, opacity: 0.9 }}>
                {pattern.phases
                  .filter((p) => p.durationSeconds > 0)
                  .map((p) => `${p.nameEnglish} ${p.durationSeconds}s`)
                  .join('  •  ')}
              </FlowText>

              {pattern.recommendedFor && (
                <FlowText size="xs" color={theme.textMuted} style={{ marginTop: 6 }}>
                  ✨ Recommended: {pattern.recommendedFor}
                </FlowText>
              )}
            </FlowCard>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 24, paddingBottom: 40 }}>
        <FlowButton
          label="Begin Session"
          size="lg"
          onPress={handleStart}
          style={{ width: '100%', alignItems: 'center' }}
        />
      </View>
    </SafeScreen>
  );
}

