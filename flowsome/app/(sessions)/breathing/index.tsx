// app/(sessions)/breathing/index.tsx — Premium: Visual overhaul
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeScreen } from '../../../components/ui/SafeScreen';
import { FlowCard } from '../../../components/ui/FlowCard';
import { useTheme } from '../../../hooks/useTheme';
import { useSessionStore } from '../../../store/sessionStore';
import { useSettingsStore } from '../../../store/settingsStore';
import { BREATHING_PATTERNS } from '../../../constants/breathing-patterns';
import { hapticLight, hapticMedium } from '../../../utils/hapticUtils';

export default function BreathingPicker() {
  const theme = useTheme();
  const router = useRouter();
  const { selectedPatternId, setSelectedPattern } = useSessionStore();
  const language = useSettingsStore((s) => s.language);
  const isHindi = language === 'hi-IN';

  const selected = selectedPatternId ?? BREATHING_PATTERNS[0].id;

  const handleStart = () => {
    hapticMedium();
    router.push('/(sessions)/breathing/session' as any);
  };

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
      <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 }}>
        <TouchableOpacity 
          onPress={() => { hapticLight(); router.back(); }}
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
                hapticLight();
                setSelectedPattern(pattern.id);
              }}
            >
              <FlowCard
                useBlur={false}
                style={{
                  padding: 18,
                  backgroundColor: 'rgba(0,0,0,0.50)',
                  borderWidth: isSelected ? 2 : 1,
                  borderColor: isSelected ? theme.primary : 'rgba(255,255,255,0.15)',
                  borderRadius: 16,
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
                      {isHindi && (
                        <>
                          <Text style={{ fontFamily: 'DMSans-Regular', fontSize: 12, color: theme.textMuted }}>
                            {pattern.nameHindi}
                          </Text>
                          <Text style={{ fontFamily: 'DMSans-Regular', fontSize: 12, color: theme.textMuted }}>•</Text>
                        </>
                      )}
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
        <TouchableOpacity
          onPress={handleStart}
          activeOpacity={0.8}
          style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.primary,
            borderRadius: 14,
            paddingVertical: 16,
          }}
        >
          <Text style={{
            color: theme.background,
            fontSize: 17,
            fontFamily: 'DMSans-Medium',
            letterSpacing: 0.5,
          }}>
            Begin Session
          </Text>
        </TouchableOpacity>
      </View>
    </SafeScreen>
  );
}
