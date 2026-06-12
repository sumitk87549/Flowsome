// components/breathing/BreathingPhaseLabel.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { useSettings } from '../../hooks/useSettings';

const PHASE_TEXT: Record<string, { en: string; hi: string }> = {
  inhale:  { en: 'Inhale',  hi: 'श्वास लें' },
  holdIn:  { en: 'Hold',    hi: 'रोकें'    },
  exhale:  { en: 'Exhale',  hi: 'छोड़ें'    },
  holdOut: { en: 'Rest',    hi: 'विश्राम'  },
  idle:    { en: 'Ready',   hi: 'तैयार'    },
};

export interface BreathingPhaseLabelProps {
  phase: string;
  secondsRemaining: number;
  theme: { text: string; textMuted: string };
}

export function BreathingPhaseLabel({ phase, secondsRemaining, theme }: BreathingPhaseLabelProps) {
  const { language } = useSettings();
  const phaseData = PHASE_TEXT[phase] || PHASE_TEXT.idle;

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: 80 }}>
      <Text
        style={{
          fontSize: 120,
          opacity: 0.10,
          position: 'absolute',
          fontFamily: 'CormorantGaramond-Light',
          color: theme.text,
        }}
      >
        {Math.ceil(secondsRemaining)}
      </Text>
      <Text
        style={{
          fontSize: 36,
          letterSpacing: 4,
          textTransform: 'uppercase',
          fontFamily: 'CormorantGaramond-Medium',
          color: theme.text,
        }}
      >
        {phaseData.en}
      </Text>
      <Text
        style={{
          fontSize: 16,
          marginTop: 4,
          opacity: 0.7,
          fontFamily: 'DMSans-Regular',
          color: theme.textMuted,
        }}
      >
        {phaseData.hi}
      </Text>
    </View>
  );
}
