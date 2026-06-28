// src/rest-modes/MoveAndSeeMode.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';
import { Panel } from '@/types/session';
import { PanelText } from '@/components/rest/PanelText';
import { useSessionTimer } from '@/hooks/useSessionTimer';

const PANELS: Panel[] = [
  { type: 2, text: "Let your shoulders drop away from your ears.", holdMs: 5500, hapticOnEntry: 'light' },
  { type: 1, text: "Notice the weight of your hands.", holdMs: 5000 },
  { isEmpty: true, emptyDurationMs: 2000, type: 2, text: '', holdMs: 0 },
  { type: 2, text: "Roll your neck slowly to the left.", holdMs: 5500, hapticOnEntry: 'light' },
  { type: 2, text: "And to the right.", holdMs: 5500, hapticOnEntry: 'light' },
  { isEmpty: true, emptyDurationMs: 2200, type: 2, text: '', holdMs: 0 },
  { type: 1, text: "Look to the far left of the room.", holdMs: 5000, hapticOnEntry: 'light' },
  { type: 3, text: "Hold your gaze there for a moment.", holdMs: 5500 },
  { type: 1, text: "Now to the far right.", holdMs: 5000, hapticOnEntry: 'light' },
  { isEmpty: true, emptyDurationMs: 2000, type: 2, text: '', holdMs: 0 },
  { type: 2, text: "Follow the light at the edge of your vision.", holdMs: 6000, hapticOnEntry: 'light' },
  { type: 3, text: "Just looking. Nothing to find.", holdMs: 6000 },
  { isEmpty: true, emptyDurationMs: 2500, type: 2, text: '', holdMs: 0 },
  { type: 2, text: "Uncross anything that's crossed.", holdMs: 5000, hapticOnEntry: 'light' },
  { type: 1, text: "Feel the surface beneath you.", holdMs: 6000 },
  { type: 3, text: "You're still here.", holdMs: 6500 },
];

interface MoveAndSeeModeProps {
  duration: number; // in minutes, from navigation params
  onSessionComplete: () => void;
}

export default function MoveAndSeeMode({ duration, onSessionComplete }: MoveAndSeeModeProps) {
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
