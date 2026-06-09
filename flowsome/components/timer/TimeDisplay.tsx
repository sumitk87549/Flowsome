// components/timer/TimeDisplay.tsx
import { View } from 'react-native';
import { FlowText } from '../ui/FlowText';
import { useTheme } from '../../hooks/useTheme';
import { formatTime } from '../../utils/timeUtils';
import { TimerPhase } from '../../hooks/useTimer';

interface TimeDisplayProps {
  secondsLeft: number;
  phase: TimerPhase;
  completedPomodoros: number;
  totalPomodoros: number;
}

export function TimeDisplay({ secondsLeft, phase, completedPomodoros, totalPomodoros }: TimeDisplayProps) {
  const theme = useTheme();

  return (
    <View style={{ alignItems: 'center', gap: 8 }}>
      <FlowText
        variant="label"
        size="xs"
        color={theme.textMuted}
        style={{ letterSpacing: 3, textTransform: 'uppercase' }}
      >
        {phase === 'work' ? '⏱️ Focus' : phase === 'break' ? '☕ Break' : 'Ready'}
      </FlowText>
      <FlowText
        variant="heading"
        size="hero"
        color={theme.primary}
        style={{ letterSpacing: -2 }}
      >
        {formatTime(secondsLeft)}
      </FlowText>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        {Array.from({ length: totalPomodoros }).map((_, i) => (
          <View
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: i < completedPomodoros ? theme.primary : theme.cardBorder,
            }}
          />
        ))}
      </View>
    </View>
  );
}
