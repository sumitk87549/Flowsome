// src/rest-modes/SenseAndGroundMode.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';
import { Panel } from '@/types/session';
import { PanelText } from '@/components/rest/PanelText';
import { useSessionTimer } from '@/hooks/useSessionTimer';

const PANELS: Panel[] = [
  { type: 2, text: "Press your feet into the floor.", holdMs: 7000, hapticOnEntry: 'heavy' },
  { isEmpty: true, emptyDurationMs: 1500, type: 2, text: '', holdMs: 0 },
  { type: 1, text: "Name five things you can see right now.", holdMs: 9000, hapticOnEntry: 'light' },
  { isEmpty: true, emptyDurationMs: 2000, type: 2, text: '', holdMs: 0 },
  { type: 2, text: "Touch four things within reach.", holdMs: 9000, hapticOnEntry: 'light' },
  { type: 3, text: "Notice each texture.", holdMs: 6000 },
  { isEmpty: true, emptyDurationMs: 2000, type: 2, text: '', holdMs: 0 },
  { type: 1, text: "Listen for three sounds.", holdMs: 9000, hapticOnEntry: 'light' },
  { type: 3, text: "Even the quiet ones.", holdMs: 6500 },
  { isEmpty: true, emptyDurationMs: 2000, type: 2, text: '', holdMs: 0 },
  { type: 2, text: "Find two things you can smell.", holdMs: 8000, hapticOnEntry: 'light' },
  { isEmpty: true, emptyDurationMs: 1800, type: 2, text: '', holdMs: 0 },
  { type: 1, text: "One thing you can taste.", holdMs: 7000, hapticOnEntry: 'light' },
  { isEmpty: true, emptyDurationMs: 2500, type: 2, text: '', holdMs: 0 },
  { type: 2, text: "You are here.", holdMs: 8000 },
  { type: 3, text: "Fully here.", holdMs: 8000 },
];

interface SenseAndGroundModeProps {
  duration: number;
  onSessionComplete: () => void;
}

export default function SenseAndGroundMode({ duration, onSessionComplete }: SenseAndGroundModeProps) {
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
