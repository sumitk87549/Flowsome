// app/(sessions)/meditation/index.tsx — Premium: Visual overhaul
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeScreen } from '../../../components/ui/SafeScreen';
import { FlowText } from '../../../components/ui/FlowText';
import { FlowCard } from '../../../components/ui/FlowCard';
import { useTheme } from '../../../hooks/useTheme';
import { useSessionStore } from '../../../store/sessionStore';
import { useSettingsStore } from '../../../store/settingsStore';
import { MEDITATION_TYPES, MeditationType } from '../../../constants/meditation-types';
import { hapticLight, hapticMedium } from '../../../utils/hapticUtils';

interface LocalMeditationCardProps {
  type: MeditationType;
  isSelected: boolean;
  onSelect: () => void;
  isHindi: boolean;
}

function LocalMeditationCard({ type, isSelected, onSelect, isHindi }: LocalMeditationCardProps) {
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={() => { hapticLight(); onSelect(); }} activeOpacity={0.85}>
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
            <FlowText variant="heading" size="xl" color={isSelected ? theme.primary : theme.text}>{type.name}</FlowText>
            {isHindi && (
              <FlowText size="xs" color={theme.textMuted} style={{ marginTop: 2 }}>{type.nameHindi}</FlowText>
            )}
          </View>
        </View>
        <FlowText size="sm" color={theme.textSecondary}>{type.description}</FlowText>
      </FlowCard>
    </TouchableOpacity>
  );
}

export default function MeditationPicker() {
  const theme = useTheme();
  const router = useRouter();
  const { setSelectedMeditation } = useSessionStore();
  const language = useSettingsStore((s) => s.language);
  const isHindi = language === 'hi-IN';

  const [selectedId, setSelectedId] = useState(MEDITATION_TYPES[0].id);
  const [selectedDuration, setSelectedDuration] = useState(MEDITATION_TYPES[0].durationMinutes[0]);

  const selectedType = MEDITATION_TYPES.find(t => t.id === selectedId) ?? MEDITATION_TYPES[0];

  const handleStart = () => {
    setSelectedMeditation(selectedId);
    hapticMedium();
    router.push({
      pathname: '/(sessions)/meditation/session',
      params: { typeId: selectedId, durationMin: String(selectedDuration) },
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
          Meditate
        </Text>
        <FlowText variant="body" size="sm" color={theme.textMuted} style={{ marginTop: 2 }}>
          Select a practice to cultivate mindfulness
        </FlowText>
      </View>
      
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, gap: 14, paddingTop: 20, paddingBottom: 150 }}>
        {MEDITATION_TYPES.map(type => (
          <LocalMeditationCard
            key={type.id}
            type={type}
            isSelected={selectedId === type.id}
            isHindi={isHindi}
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
                onPress={() => { hapticLight(); setSelectedDuration(d); }}
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 14,
                  backgroundColor: selectedDuration === d ? theme.primary : 'rgba(0,0,0,0.50)',
                  borderWidth: 1.5,
                  borderColor: selectedDuration === d ? theme.primary : 'rgba(255,255,255,0.15)',
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
