// app/(sessions)/breathing/index.tsx — Premium: Visual overhaul
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '../../../components/ui/SafeScreen';
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

  const textShadow = {
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  };

  return (
    <SafeScreen>
      <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 }}>
        <TouchableOpacity 
          onPress={() => { HapticUtils.light(); router.back(); }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            marginBottom: 12,
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
          fontSize: 34,
          color: theme.primary,
          marginTop: 4,
          ...textShadow,
        }}>
          Breathe
        </Text>
        <Text style={{
          fontFamily: 'DMSans-Regular',
          fontSize: 13,
          color: theme.textMuted,
          marginTop: 2,
        }}>
          Select a breathing pattern to center your mind
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          gap: 14,
          paddingTop: 8,
          paddingBottom: 120,
        }}
      >
        {BREATHING_PATTERNS.map((pattern) => {
          const isSelected = selected === pattern.id;
          return (
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
                  borderColor: isSelected ? theme.primary : theme.cardBorder,
                  borderWidth: isSelected ? 2 : 1,
                  shadowColor: isSelected ? theme.primary : 'transparent',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: isSelected ? 0.4 : 0,
                  shadowRadius: 10,
                  elevation: isSelected ? 5 : 0,
                  opacity: isSelected ? 1 : 0.75,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontFamily: 'CormorantGaramond-SemiBold',
                      fontSize: 20,
                      color: isSelected ? theme.primary : theme.text,
                    }}>
                      {pattern.name}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                      <Text style={{ fontFamily: 'DMSans-Regular', fontSize: 12, color: theme.textMuted }}>
                        {pattern.nameHindi}
                      </Text>
                      <Text style={{ fontFamily: 'DMSans-Regular', fontSize: 12, color: theme.textMuted }}>•</Text>
                      <Text style={{ fontFamily: 'DMSans-Regular', fontSize: 12, color: theme.textMuted }}>
                        {pattern.cycles} cycles
                      </Text>
                    </View>
                  </View>
                </View>

                <Text style={{
                  fontFamily: 'DMSans-Regular',
                  fontSize: 13,
                  color: theme.textSecondary,
                  marginTop: 6,
                  lineHeight: 18,
                }}>
                  {pattern.description}
                </Text>

                {/* Phase timings */}
                <Text style={{
                  fontFamily: 'DMSans-Regular',
                  fontSize: 11,
                  color: theme.textSecondary,
                  marginTop: 8,
                  opacity: 0.85,
                }}>
                  {pattern.phases
                    .filter((p) => p.durationSeconds > 0)
                    .map((p) => `${p.nameEnglish} ${p.durationSeconds}s`)
                    .join('  •  ')}
                </Text>

                {pattern.recommendedFor && (
                  <Text style={{
                    fontFamily: 'DMSans-Regular',
                    fontSize: 11,
                    color: theme.textMuted,
                    marginTop: 6,
                  }}>
                    Recommended for: {pattern.recommendedFor}
                  </Text>
                )}
              </FlowCard>
            </TouchableOpacity>
          );
        })}
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
