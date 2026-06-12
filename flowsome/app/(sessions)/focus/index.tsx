// app/(sessions)/focus/index.tsx
import { View, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeScreen } from '../../../components/ui/SafeScreen';
import { FlowText } from '../../../components/ui/FlowText';
import { FlowCard } from '../../../components/ui/FlowCard';
import { FlowButton } from '../../../components/ui/FlowButton';
import { IntentionInput } from '../../../components/focus/IntentionInput';
import { useTheme, useThemeConfig } from '../../../hooks/useTheme';
import { useSessionStore } from '../../../store/sessionStore';
import { FOCUS_MODES } from '../../../constants/focus-modes';
import { THEME_IMAGES } from '../../../constants/theme-images';
import { HapticUtils } from '../../../utils/hapticUtils';

export default function FocusSetup() {
  const theme = useTheme();
  const config = useThemeConfig();
  const router = useRouter();
  const { setIntention } = useSessionStore();
  const [selectedModeId, setSelectedModeId] = useState(FOCUS_MODES[0].id);
  const [intention, setIntentionText] = useState('');

  const selectedMode = FOCUS_MODES.find(m => m.id === selectedModeId) ?? FOCUS_MODES[0];

  const handleStart = () => {
    setIntention(intention);
    HapticUtils.medium();
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

  return (
    <SafeScreen>
      <View style={{ paddingHorizontal: 24, paddingTop: 16 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <FlowText color={theme.textMuted}>← Back</FlowText>
        </TouchableOpacity>
        <FlowText variant="heading" size="4xl" color={theme.primary} style={{ marginTop: 16 }}>✨ Flow</FlowText>
        <FlowText variant="body" size="sm" color={theme.textMuted} style={{ marginTop: 4 }}>
          Enter a flow state with binaural soundscapes
        </FlowText>
        
        {/* Landscape banner showcasing the selected region */}
        <View style={{ borderRadius: 16, overflow: 'hidden', height: 95, marginTop: 16, borderWidth: 1, borderColor: theme.cardBorder }}>
          <ImageBackground source={THEME_IMAGES[config.id]} style={{ width: '100%', height: '100%', justifyContent: 'flex-end' }}>
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.75)']} style={{ padding: 12 }}>
              <FlowText color="#FFFFFF" variant="headingItalic" size="sm" style={{ letterSpacing: 0.5 }}>
                Flowing with regional presence in {config.name} {config.icon}
              </FlowText>
            </LinearGradient>
          </ImageBackground>
        </View>
      </View>
      
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, gap: 16, paddingTop: 16, paddingBottom: 160 }}>
        {FOCUS_MODES.map(mode => (
          <TouchableOpacity
            key={mode.id}
            onPress={() => { HapticUtils.light(); setSelectedModeId(mode.id); }}
            activeOpacity={0.85}
          >
            <FlowCard style={{
              padding: 18, gap: 6,
              borderColor: selectedModeId === mode.id ? theme.primary : theme.cardBorder,
              borderWidth: selectedModeId === mode.id ? 2 : 1,
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <FlowText
                    variant="heading"
                    size="xl"
                    color={selectedModeId === mode.id ? theme.primary : theme.text}
                  >
                    {mode.name}
                  </FlowText>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                    <FlowText size="xs" color={theme.textMuted}>{mode.nameHindi}</FlowText>
                    <FlowText size="xs" color={theme.textMuted}>•</FlowText>
                    <FlowText size="xs" color={theme.textMuted}>{mode.defaultWorkMinutes}m work / {mode.defaultBreakMinutes}m break</FlowText>
                  </View>
                </View>
              </View>
              <FlowText size="sm" color={theme.textSecondary} style={{ marginTop: 4 }}>{mode.description}</FlowText>
            </FlowCard>
          </TouchableOpacity>
        ))}
        <IntentionInput
          value={intention}
          onChange={setIntentionText}
          placeholder={selectedMode.promptEn}
        />
      </ScrollView>
      
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 24, paddingBottom: 40 }}>
        <FlowButton
          label="Begin Focus Session"
          size="lg"
          onPress={handleStart}
          style={{ width: '100%', alignItems: 'center' }}
        />
      </View>
    </SafeScreen>
  );
}

