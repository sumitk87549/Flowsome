// components/breathing/BreathingPhaseLabel.tsx
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { FlowText } from '../ui/FlowText';
import { BreathingPhase } from '../../constants/breathing-patterns';
import { useTheme } from '../../hooks/useTheme';
import { useSettings } from '../../hooks/useSettings';

interface BreathingPhaseLabelProps {
  phase: BreathingPhase;
  secondsRemaining: number;
}

export function BreathingPhaseLabel({
  phase,
  secondsRemaining,
}: BreathingPhaseLabelProps) {
  const theme = useTheme();
  const { language } = useSettings();

  const labelText = language === 'hi-IN' ? phase.nameHindi : phase.nameEnglish;

  return (
    <View style={{ alignItems: 'center', gap: 4 }}>
      <Animated.View
        key={phase.name}
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(200)}
      >
        <FlowText
          variant="heading"
          size="3xl"
          color={theme.primary}
          style={{ textAlign: 'center', letterSpacing: 2 }}
        >
          {labelText}
        </FlowText>
      </Animated.View>
      <FlowText variant="body" size="2xl" color={theme.textSecondary}>
        {Math.ceil(secondsRemaining)}
      </FlowText>
    </View>
  );
}
