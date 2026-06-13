// app/(sessions)/meditation/index.tsx — Premium: Visual overhaul
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
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

        <FlowText variant="heading" size="4xl" color={theme.primary} style={{ marginTop: 4 }}>
          Meditate
        </FlowText>
        <FlowText variant="body" size="sm" color={theme.textMuted} style={{ marginTop: 2 }}>
          Select a practice to cultivate mindfulness
        </FlowText>
      </View>
      
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, gap: 14, paddingTop: 20, paddingBottom: 150 }}>
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
