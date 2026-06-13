// components/breathing/BreathingPhaseLabel.tsx — Sprint 13: Refined watermark
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

// Text shadow for contrast over particles
const textShadow = {
  textShadowColor: 'rgba(0,0,0,0.4)',
  textShadowOffset: { width: 0, height: 1 },
  textShadowRadius: 4,
};

export function BreathingPhaseLabel({ phase, secondsRemaining, theme }: BreathingPhaseLabelProps) {
  const { language } = useSettings();
  const phaseData = PHASE_TEXT[phase] || PHASE_TEXT.idle;

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: 90 }}>
      {/* Watermark countdown — bigger, more transparent */}
      <Text
        style={{
          fontSize: 140,
          opacity: 0.06,
          position: 'absolute',
          fontFamily: 'CormorantGaramond-Light',
          color: theme.text,
        }}
      >
        {Math.ceil(secondsRemaining)}
      </Text>
      {/* Primary phase label */}
      <Text
        style={{
          fontSize: 36,
          letterSpacing: 4,
          textTransform: 'uppercase',
          fontFamily: 'CormorantGaramond-SemiBold',
          color: theme.text,
          ...textShadow,
        }}
      >
        {phaseData.en}
      </Text>
      {/* Hindi — always visible as cultural undercurrent */}
      <Text
        style={{
          fontSize: 15,
          marginTop: 4,
          opacity: 0.8,
          fontFamily: 'DMSans-Regular',
          color: theme.textMuted,
          ...textShadow,
        }}
      >
        {phaseData.hi}
      </Text>
    </View>
  );
}
