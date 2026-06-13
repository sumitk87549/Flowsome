// app/(sessions)/focus/index.tsx — Premium: Visual overhaul
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeScreen } from '../../../components/ui/SafeScreen';
import { FlowText } from '../../../components/ui/FlowText';
import { FlowCard } from '../../../components/ui/FlowCard';
import { IntentionInput } from '../../../components/focus/IntentionInput';
import { useTheme } from '../../../hooks/useTheme';
import { useSessionStore } from '../../../store/sessionStore';
import { useSettingsStore } from '../../../store/settingsStore';
import { FOCUS_MODES } from '../../../constants/focus-modes';
import { hapticLight, hapticMedium } from '../../../utils/hapticUtils';

export default function FocusSetup() {
  const theme = useTheme();
  const router = useRouter();
  const { setIntention } = useSessionStore();
  const [selectedModeId, setSelectedModeId] = useState(FOCUS_MODES[0].id);
  const [intention, setIntentionText] = useState('');
  const language = useSettingsStore((s) => s.language);
  const isHindi = language === 'hi-IN';

  const selectedMode = FOCUS_MODES.find(m => m.id === selectedModeId) ?? FOCUS_MODES[0];

  const handleStart = () => {
    setIntention(intention);
    hapticMedium();
    router.push({
      pathname: '/(sessions)/focus/session',
      params: {
        modeId: selectedModeId,
        workMin: String(selectedMode.defaultWorkMinutes),
        breakMin: String(selectedMode.defaultBreakMinutes),
        intention,
      },
    });
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
      <View style={{ paddingHorizontal: 24, paddingTop: 16 }}>
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
          Flow
        </Text>
        <FlowText variant="body" size="sm" color={theme.textMuted} style={{ marginTop: 2 }}>
          Enter a flow state with binaural soundscapes
        </FlowText>
      </View>
      
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, gap: 16, paddingTop: 20, paddingBottom: 160 }}>
        {FOCUS_MODES.map(mode => {
          const isSelected = selectedModeId === mode.id;
          return (
            <TouchableOpacity
              key={mode.id}
              onPress={() => { hapticLight(); setSelectedModeId(mode.id); }}
              activeOpacity={0.85}
            >
              <FlowCard
                useBlur={false}
                style={{
                  padding: 18,
                  gap: 6,
                  backgroundColor: 'rgba(0,0,0,0.50)',
                  borderWidth: isSelected ? 2 : 1,
                  borderColor: isSelected ? theme.primary : 'rgba(255,255,255,0.15)',
                  borderRadius: 16,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1 }}>
                    <FlowText
                      variant="heading"
                      size="xl"
                      color={isSelected ? theme.primary : theme.text}
                    >
                      {mode.name}
                    </FlowText>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                      {isHindi && (
                        <>
                          <FlowText size="xs" color={theme.textMuted}>{mode.nameHindi}</FlowText>
                          <FlowText size="xs" color={theme.textMuted}>•</FlowText>
                        </>
                      )}
                      <FlowText size="xs" color={theme.textMuted}>{mode.defaultWorkMinutes}m work / {mode.defaultBreakMinutes}m break</FlowText>
                    </View>
                  </View>
                </View>
                <FlowText size="sm" color={theme.textSecondary} style={{ marginTop: 4 }}>{mode.description}</FlowText>
              </FlowCard>
            </TouchableOpacity>
          );
        })}
        <IntentionInput
          value={intention}
          onChange={setIntentionText}
          placeholder={selectedMode.promptEn}
        />
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
