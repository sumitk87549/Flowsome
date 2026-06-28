import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';
import { Panel } from '@/types/session';
import { PanelText } from '@/components/rest/PanelText';
import { useSessionTimer } from '@/hooks/useSessionTimer';

const PANELS: Panel[] = [
  { type: 2, text: "Look at something far away.", holdMs: 6000, hapticOnEntry: 'light' },
  { isEmpty: true, emptyDurationMs: 2500, type: 2, text: '', holdMs: 0 },
  { type: 1, text: "Keep your gaze soft.", holdMs: 6000 },
  { isEmpty: true, emptyDurationMs: 20000, type: 2, text: '', holdMs: 0 },
  { type: 3, text: "Notice one color in the room.", holdMs: 8000, hapticOnEntry: 'light' },
  { isEmpty: true, emptyDurationMs: 5000, type: 2, text: '', holdMs: 0 },
];

interface EyesAwayModeProps {
  duration: number; // in minutes, from navigation params
  onSessionComplete: () => void;
}

export default function EyesAwayMode({ duration, onSessionComplete }: EyesAwayModeProps) {
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
    backgroundColor: COLORS.neutralDark,
  },
});
