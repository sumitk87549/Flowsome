// app/(sessions)/meditation/index.tsx
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeScreen } from '../../../components/ui/SafeScreen';
import { FlowText } from '../../../components/ui/FlowText';
import { FlowButton } from '../../../components/ui/FlowButton';
import { MeditationCard } from '../../../components/meditation/MeditationCard';
import { useTheme } from '../../../hooks/useTheme';
import { useSessionStore } from '../../../store/sessionStore';
import { MEDITATION_TYPES } from '../../../constants/meditation-types';
import { HapticUtils } from '../../../utils/hapticUtils';

export default function MeditationPicker() {
  const theme = useTheme();
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
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, gap: 12, paddingTop: 16, paddingBottom: 120 }}>
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
        <View style={{ gap: 8, marginTop: 8 }}>
          <FlowText
            variant="label"
            size="xs"
            color={theme.textMuted}
            style={{ letterSpacing: 2, textTransform: 'uppercase' }}
          >
            Duration
          </FlowText>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            {selectedType.durationMinutes.map(d => (
              <TouchableOpacity
                key={d}
                onPress={() => { HapticUtils.light(); setSelectedDuration(d); }}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 12,
                  backgroundColor: selectedDuration === d ? theme.primary : theme.card,
                  borderWidth: 1,
                  borderColor: theme.cardBorder,
                }}
              >
                <FlowText size="sm" color={selectedDuration === d ? theme.background : theme.text}>
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
