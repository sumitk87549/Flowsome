// components/meditation/MeditationCard.tsx
import { TouchableOpacity, View } from 'react-native';
import { FlowText } from '../ui/FlowText';
import { FlowCard } from '../ui/FlowCard';
import { useTheme } from '../../hooks/useTheme';
import { MeditationType } from '../../constants/meditation-types';
import { HapticUtils } from '../../utils/hapticUtils';

interface MeditationCardProps {
  type: MeditationType;
  isSelected: boolean;
  onSelect: () => void;
}

export function MeditationCard({ type, isSelected, onSelect }: MeditationCardProps) {
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={() => { HapticUtils.light(); onSelect(); }} activeOpacity={0.85}>
      <FlowCard style={{
        padding: 18, gap: 6,
        borderColor: isSelected ? theme.primary : theme.cardBorder,
        borderWidth: isSelected ? 2 : 1,
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <FlowText variant="heading" size="xl" color={isSelected ? theme.primary : theme.text}>{type.name}</FlowText>
            <FlowText size="xs" color={theme.textMuted}>{type.nameHindi}</FlowText>
          </View>
          <View style={{ alignItems: 'flex-end', gap: 3 }}>
            {type.durationMinutes.map(d => (
              <View key={d} style={{ backgroundColor: theme.card, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
                <FlowText size="xs" color={theme.textMuted}>{d}m</FlowText>
              </View>
            ))}
          </View>
        </View>
        <FlowText size="sm" color={theme.textSecondary}>{type.description}</FlowText>
      </FlowCard>
    </TouchableOpacity>
  );
}
