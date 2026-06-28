// src/rest-modes/MemoryMode.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';
import { Panel } from '@/types/session';
import { PanelText } from '@/components/rest/PanelText';
import { useSessionTimer } from '@/hooks/useSessionTimer';

const PANELS: Panel[] = [
  { type: 2, text: "Think of somewhere you felt completely at ease.", holdMs: 9000, hapticOnEntry: 'light' },
  { isEmpty: true, emptyDurationMs: 2500, type: 2, text: '', holdMs: 0 },
  { type: 1, text: "Let it come to you slowly.", holdMs: 8000 },
  { type: 2, text: "Don't force the detail.", holdMs: 7500 },
  { isEmpty: true, emptyDurationMs: 3000, type: 2, text: '', holdMs: 0 },
  { type: 4, text: "What did the light look like there?", holdMs: 10000, hapticOnEntry: 'light' },
  { isEmpty: true, emptyDurationMs: 2500, type: 2, text: '', holdMs: 0 },
  { type: 2, text: "Was there a sound?", holdMs: 9000 },
  { type: 1, text: "Or was it quiet.", holdMs: 8000 },
  { isEmpty: true, emptyDurationMs: 3000, type: 2, text: '', holdMs: 0 },
  { type: 3, text: "Stay in that place.", holdMs: 10000 },
  { isEmpty: true, emptyDurationMs: 3000, type: 2, text: '', holdMs: 0 },
  { type: 4, text: "Notice how your body felt there.", holdMs: 11000, hapticOnEntry: 'light' },
  { isEmpty: true, emptyDurationMs: 2500, type: 2, text: '', holdMs: 0 },
  { type: 2, text: "That ease is still inside you.", holdMs: 10000 },
  { isEmpty: true, emptyDurationMs: 3000, type: 2, text: '', holdMs: 0 },
  { type: 1, text: "You can carry it with you.", holdMs: 10000 },
  { type: 3, text: "Back into the work.", holdMs: 9000 },
  { isEmpty: true, emptyDurationMs: 4000, type: 2, text: '', holdMs: 0 },
  { type: 2, text: "When you're ready.", holdMs: 12000 },
];

interface MemoryModeProps {
  duration: number; // longRestDuration from settings, e.g. 15
  onSessionComplete: () => void;
}

export default function MemoryMode({ duration, onSessionComplete }: MemoryModeProps) {
  const [currentPanelIndex, setCurrentPanelIndex] = useState(0);
  const emptyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const timer = useSessionTimer({ durationMinutes: duration, onComplete: onSessionComplete });

  useEffect(() => {
    const panel = PANELS[currentPanelIndex];
    if (panel?.isEmpty) {
      emptyTimerRef.current = setTimeout(() => {
        setCurrentPanelIndex(i => Math.min(i + 1, PANELS.length - 1));
      }, panel.emptyDurationMs ?? 2000);
    }
    return () => {
      if (emptyTimerRef.current) clearTimeout(emptyTimerRef.current);
    };
  }, [currentPanelIndex]);

  const currentPanel = PANELS[currentPanelIndex];

  return (
    <View style={styles.container}>
      {currentPanel && !currentPanel.isEmpty && (
        <PanelText
          key={currentPanelIndex}
          panel={currentPanel}
          onExit={() => setCurrentPanelIndex(i => Math.min(i + 1, PANELS.length - 1))}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.forestNight,
  },
});
