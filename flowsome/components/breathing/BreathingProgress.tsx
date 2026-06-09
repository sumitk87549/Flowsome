// components/breathing/BreathingProgress.tsx
import { View } from 'react-native';
import { FlowText } from '../ui/FlowText';
import { useTheme } from '../../hooks/useTheme';

interface BreathingProgressProps {
  currentCycle: number;
  totalCycles: number;
}

export function BreathingProgress({
  currentCycle,
  totalCycles,
}: BreathingProgressProps) {
  const theme = useTheme();

  return (
    <View style={{ alignItems: 'center', gap: 12 }}>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {Array.from({ length: totalCycles }).map((_, i) => (
          <View
            key={i}
            style={{
              width: i < currentCycle ? 10 : 6,
              height: i < currentCycle ? 10 : 6,
              borderRadius: 6,
              backgroundColor:
                i < currentCycle ? theme.primary : theme.cardBorder,
            }}
          />
        ))}
      </View>
      <FlowText variant="body" size="sm" color={theme.textMuted}>
        Cycle {currentCycle} / {totalCycles}
      </FlowText>
    </View>
  );
}
