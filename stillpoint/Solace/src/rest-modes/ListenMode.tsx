// src/rest-modes/ListenMode.tsx
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';
import { PanelText } from '@/components/rest/PanelText';
import { usePanelQueue } from '@/hooks/usePanelQueue';
import { useSessionTimer } from '@/hooks/useSessionTimer';
import type { Panel } from '@/types/session';

// ─────────────────────────────────────────────────────────────────────────────
// LISTEN MODE PANEL SCRIPT
// Panels guide the user to simply close their eyes and listen to the ambient sound.
// Spacing is intentional — long empty gaps let the ambient audio breathe.
// ─────────────────────────────────────────────────────────────────────────────
const LISTEN_PANELS: Panel[] = [
  {
    type: 2,
    text: 'Close your eyes if that feels comfortable.',
    holdMs: 4000,
    hapticOnEntry: 'light',
  },
  {
    isEmpty: true,
    emptyDurationMs: 6000,
    type: 2,  // required by Panel type but unused when isEmpty is true
    text: '',
    holdMs: 0,
  },
  {
    type: 1,
    text: 'What do you hear?',
    holdMs: 5000,
  },
  {
    isEmpty: true,
    emptyDurationMs: 8000,
    type: 2,
    text: '',
    holdMs: 0,
  },
  {
    type: 2,
    text: 'Let the sounds come and go\nwithout holding any of them.',
    holdMs: 6000,
    hapticOnEntry: 'light',
  },
  {
    isEmpty: true,
    emptyDurationMs: 10000,
    type: 2,
    text: '',
    holdMs: 0,
  },
  {
    type: 3,
    text: 'You are listening.',
    holdMs: 5000,
  },
  {
    isEmpty: true,
    emptyDurationMs: 12000,
    type: 2,
    text: '',
    holdMs: 0,
  },
  {
    type: 1,
    text: 'No need to do anything else.',
    holdMs: 6000,
    hapticOnEntry: 'light',
  },
  {
    isEmpty: true,
    emptyDurationMs: 15000,
    type: 2,
    text: '',
    holdMs: 0,
  },
  {
    type: 3,
    text: 'Just here.',
    holdMs: 5000,
  },
];

interface ListenModeProps {
  duration: number;          // in minutes
  onSessionComplete: () => void;
}

export function ListenMode({ duration, onSessionComplete }: ListenModeProps) {
  // Panel queue — cycles through LISTEN_PANELS
  const { currentPanel, currentIndex, advanceToNext } = usePanelQueue(LISTEN_PANELS);

  // Rest session timer — uses the same hook as the work session timer
  // When it completes, call onSessionComplete
  const timer = useSessionTimer({
    durationMinutes: duration,
    onComplete: onSessionComplete,
  });

  // Handle empty panels — don't render PanelText, just wait
  useEffect(() => {
    if (!currentPanel || !currentPanel.isEmpty) return;
    const waitTimer = setTimeout(advanceToNext, currentPanel.emptyDurationMs ?? 1000);
    return () => clearTimeout(waitTimer);
  }, [currentIndex]);

  // When the panel script ends (all panels played), do nothing —
  // the rest session timer controls when onSessionComplete fires.
  // The user simply rests in silence until the timer ends.

  return (
    <View style={styles.container}>
      {/* Render the current panel if it has text */}
      {currentPanel && !currentPanel.isEmpty && (
        <PanelText
          key={currentIndex}        // CRITICAL: forces fresh mount on each new panel
          panel={currentPanel}
          onExit={advanceToNext}
        />
      )}
      {/* No other visual elements — Listen mode is intentionally minimal */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.forestNight,
  },
});
