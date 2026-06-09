// app/(sessions)/breathing/index.tsx
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeScreen } from '../../../components/ui/SafeScreen';
import { FlowText } from '../../../components/ui/FlowText';
import { FlowCard } from '../../../components/ui/FlowCard';
import { FlowButton } from '../../../components/ui/FlowButton';
import { useTheme } from '../../../hooks/useTheme';
import { useSessionStore } from '../../../store/sessionStore';
import { BREATHING_PATTERNS } from '../../../constants/breathing-patterns';
import { HapticUtils } from '../../../utils/hapticUtils';

export default function BreathingPicker() {
  const theme = useTheme();
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
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          gap: 12,
          paddingBottom: 32,
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
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <View style={{ flex: 1 }}>
                  <FlowText
                    variant="heading"
                    size="xl"
                    color={
                      selected === pattern.id ? theme.primary : theme.text
                    }
                  >
                    {pattern.name}
                  </FlowText>
                  <FlowText
                    variant="body"
                    size="xs"
                    color={theme.textMuted}
                    style={{ marginTop: 2 }}
                  >
                    {pattern.nameHindi}
                  </FlowText>
                  <FlowText
                    variant="body"
                    size="sm"
                    color={theme.textSecondary}
                    style={{ marginTop: 6 }}
                  >
                    {pattern.description}
                  </FlowText>
                </View>
                <FlowText variant="label" size="sm" color={theme.textMuted}>
                  {pattern.cycles} cycles
                </FlowText>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 6,
                  marginTop: 10,
                  flexWrap: 'wrap',
                }}
              >
                {pattern.phases
                  .filter((p) => p.durationSeconds > 0)
                  .map((phase, i) => (
                    <View
                      key={i}
                      style={{
                        backgroundColor: theme.card,
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                        borderRadius: 8,
                      }}
                    >
                      <FlowText size="xs" color={theme.textMuted}>
                        {phase.nameEnglish} {phase.durationSeconds}s
                      </FlowText>
                    </View>
                  ))}
              </View>
            </FlowCard>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={{ paddingHorizontal: 24, paddingBottom: 32 }}>
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
