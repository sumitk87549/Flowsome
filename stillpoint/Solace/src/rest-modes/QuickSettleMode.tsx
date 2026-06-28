// src/rest-modes/QuickSettleMode.tsx
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';
import { PanelText } from '@/components/rest/PanelText';
import { RippleSystem } from '@/components/rest/RippleSystem';
import { usePanelQueue } from '@/hooks/usePanelQueue';
import { useSessionTimer } from '@/hooks/useSessionTimer';
import type { Panel } from '@/types/session';

// ─────────────────────────────────────────────────────────────────────────────
// QUICK SETTLE PANEL SCRIPT
// Dense, direct grounding instructions. No long empty gaps —
// the brevity of this mode means panels should keep a gentle rhythm.
// ─────────────────────────────────────────────────────────────────────────────
const QUICK_SETTLE_PANELS: Panel[] = [
  {
    type: 2,
    text: 'Notice your breath.',
    holdMs: 3500,
    hapticOnEntry: 'light',
  },
  {
    isEmpty: true,
    emptyDurationMs: 2000,
    type: 2,
    text: '',
    holdMs: 0,
  },
  {
    type: 2,
    text: 'Feel your feet on the floor.',
    holdMs: 4000,
    hapticOnEntry: 'light',
  },
  {
    isEmpty: true,
    emptyDurationMs: 2000,
    type: 2,
    text: '',
    holdMs: 0,
  },
  {
    type: 1,
    text: 'Look around you\nand name three things you see.',
    holdMs: 5000,
  },
  {
    isEmpty: true,
    emptyDurationMs: 3000,
    type: 2,
    text: '',
    holdMs: 0,
  },
  {
    type: 2,
    text: 'Take one slow breath.',
    holdMs: 4000,
    hapticOnEntry: 'light',
  },
  {
    isEmpty: true,
    emptyDurationMs: 4000,
    type: 2,
    text: '',
    holdMs: 0,
  },
  {
    type: 3,
    text: 'You are here.',
    holdMs: 4000,
  },
  {
    isEmpty: true,
    emptyDurationMs: 5000,
    type: 2,
    text: '',
    holdMs: 0,
  },
  {
    type: 2,
    text: 'That is enough.',
    holdMs: 4000,
    hapticOnEntry: 'light',
  },
];

interface QuickSettleModeProps {
  duration: number;
  onSessionComplete: () => void;
}

export function QuickSettleMode({ duration, onSessionComplete }: QuickSettleModeProps) {
  // Panel queue
  const { currentPanel, currentIndex, advanceToNext } = usePanelQueue(QUICK_SETTLE_PANELS);

  // Rest timer
  const timer = useSessionTimer({
    durationMinutes: duration,
    onComplete: onSessionComplete,
  });

  // Handle empty panels
  useEffect(() => {
    if (!currentPanel || !currentPanel.isEmpty) return;
    const waitTimer = setTimeout(advanceToNext, currentPanel.emptyDurationMs ?? 1000);
    return () => clearTimeout(waitTimer);
  }, [currentIndex]);

  return (
    <View style={styles.container}>

      {/* Layer 1 — Ripple system (behind text panels) */}
      <RippleSystem />

      {/* Layer 2 — PanelText panels */}
      {currentPanel && !currentPanel.isEmpty && (
        <PanelText
          key={currentIndex}
          panel={currentPanel}
          onExit={advanceToNext}
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
