// app/(sessions)/meditation/index.tsx
import { View, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeScreen } from '../../../components/ui/SafeScreen';
import { FlowText } from '../../../components/ui/FlowText';
import { FlowButton } from '../../../components/ui/FlowButton';
import { MeditationCard } from '../../../components/meditation/MeditationCard';
import { useTheme, useThemeConfig } from '../../../hooks/useTheme';
import { useSessionStore } from '../../../store/sessionStore';
import { MEDITATION_TYPES } from '../../../constants/meditation-types';
import { THEME_IMAGES } from '../../../constants/theme-images';
import { HapticUtils } from '../../../utils/hapticUtils';

export default function MeditationPicker() {
  const theme = useTheme();
  const config = useThemeConfig();
  const router = useRouter();
  const { setSelectedMeditation } = useSessionStore();
  const [selectedId, setSelectedId] = useState(MEDITATION_TYPES[0].id);
  const [selectedDuration, setSelectedDuration] = useState(MEDITATION_TYPES[0].durationMinutes[0]);

  const selectedType = MEDITATION_TYPES.find(t => t.id === selectedId) ?? MEDITATION_TYPES[0];

  const handleStart = () => {
    setSelectedMeditation(selectedId);
    HapticUtils.medium();
    router.push({
      pathname: '/(sessions)/meditation/session',
      params: { typeId: selectedId, durationMin: String(selectedDuration) },
    });
  };

  return (
    <SafeScreen>
      <View style={{ paddingHorizontal: 24, paddingTop: 16 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <FlowText color={theme.textMuted}>← Back</FlowText>
        </TouchableOpacity>
        <FlowText variant="heading" size="4xl" color={theme.primary} style={{ marginTop: 16 }}>🧘 Meditate</FlowText>
        <FlowText variant="body" size="sm" color={theme.textMuted} style={{ marginTop: 4 }}>
          Select a practice to cultivate mindfulness
        </FlowText>
        
        {/* Landscape banner showcasing the selected region */}
        <View style={{ borderRadius: 16, overflow: 'hidden', height: 95, marginTop: 16, borderWidth: 1, borderColor: theme.cardBorder }}>
          <ImageBackground source={THEME_IMAGES[config.id]} style={{ width: '100%', height: '100%', justifyContent: 'flex-end' }}>
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.75)']} style={{ padding: 12 }}>
              <FlowText color="#FFFFFF" variant="headingItalic" size="sm" style={{ letterSpacing: 0.5 }}>
                Meditating with regional presence in {config.name} {config.icon}
              </FlowText>
            </LinearGradient>
          </ImageBackground>
        </View>
      </View>
      
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, gap: 14, paddingTop: 16, paddingBottom: 150 }}>
        {MEDITATION_TYPES.map(type => (
          <MeditationCard
            key={type.id}
            type={type}
            isSelected={selectedId === type.id}
            onSelect={() => {
              setSelectedId(type.id);
              setSelectedDuration(type.durationMinutes[0]);
            }}
          />
        ))}
        
        <View style={{ gap: 8, marginTop: 12, paddingHorizontal: 4 }}>
          <FlowText
            variant="label"
            size="xs"
            color={theme.textMuted}
            style={{ letterSpacing: 2.5, textTransform: 'uppercase' }}
          >
            Duration
          </FlowText>
          <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
            {selectedType.durationMinutes.map(d => (
              <TouchableOpacity
                key={d}
                onPress={() => { HapticUtils.light(); setSelectedDuration(d); }}
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 14,
                  backgroundColor: selectedDuration === d ? theme.primary : theme.card,
                  borderWidth: 1.5,
                  borderColor: selectedDuration === d ? theme.primary : theme.cardBorder,
                }}
              >
                <FlowText size="sm" color={selectedDuration === d ? theme.background : theme.text} style={{ fontWeight: '500' }}>
                  {d} min
                </FlowText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 24, paddingBottom: 40 }}>
        <FlowButton
          label="Begin Meditation"
          size="lg"
          onPress={handleStart}
          style={{ width: '100%', alignItems: 'center' }}
        />
      </View>
    </SafeScreen>
  );
}

