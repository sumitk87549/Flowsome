// src/rest-modes/BreatheAndDriftMode.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Canvas, Circle } from '@shopify/react-native-skia';
import {
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { COLORS } from '@/constants/colors';
import { PanelText } from '@/components/rest/PanelText';
import { BreathingDot } from '@/components/rest/BreathingDot';
import { usePanelQueue } from '@/hooks/usePanelQueue';
import { useSessionTimer } from '@/hooks/useSessionTimer';
import { DRIFT_BLOB_PERIOD_H, DRIFT_BLOB_PERIOD_V } from '@/constants/timing';
import type { Panel } from '@/types/session';

// ─────────────────────────────────────────────────────────────────────────────
// BREATHE & DRIFT PANEL SCRIPT
// Short breathing instructions interspersed with long silences.
// The visual (dot + blob) does most of the work.
// ─────────────────────────────────────────────────────────────────────────────
const BREATHE_PANELS: Panel[] = [
  {
    type: 2,
    text: 'Follow the circle with your breath.',
    holdMs: 4000,
    hapticOnEntry: 'light',
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
    text: 'In through your nose.',
    holdMs: 4000,
  },
  {
    isEmpty: true,
    emptyDurationMs: 8000,
    type: 2,
    text: '',
    holdMs: 0,
  },
  {
    type: 3,
    text: 'Out slowly.',
    holdMs: 4000,
  },
  {
    isEmpty: true,
    emptyDurationMs: 20000,
    type: 2,
    text: '',
    holdMs: 0,
  },
  {
    type: 2,
    text: 'Let your shoulders drop.',
    holdMs: 5000,
    hapticOnEntry: 'light',
  },
  {
    isEmpty: true,
    emptyDurationMs: 16000,
    type: 2,
    text: '',
    holdMs: 0,
  },
  {
    type: 3,
    text: 'Breathing.',
    holdMs: 4000,
  },
];

// Drift blob properties
const BLOB_RADIUS = 180; // dp — large, low-opacity blob
const BLOB_OPACITY = 0.06; // 6% — barely visible

interface BreatheAndDriftModeProps {
  duration: number;
  onSessionComplete: () => void;
}

export function BreatheAndDriftMode({ duration, onSessionComplete }: BreatheAndDriftModeProps) {
  const { width, height } = useWindowDimensions();
  const [isDotFadingOut, setIsDotFadingOut] = useState(false);

  // Panel queue
  const { currentPanel, currentIndex, advanceToNext } = usePanelQueue(BREATHE_PANELS);

  // Rest timer — when complete, fade out the dot, then call onSessionComplete
  const timer = useSessionTimer({
    durationMinutes: duration,
    onComplete: () => {
      // Fade the dot out first, then signal completion
      setIsDotFadingOut(true);
      // onSessionComplete is called from BreathingDot's onFadeOutComplete callback
    },
  });

  // Handle empty panels
  useEffect(() => {
    if (!currentPanel || !currentPanel.isEmpty) return;
    const waitTimer = setTimeout(advanceToNext, currentPanel.emptyDurationMs ?? 1000);
    return () => clearTimeout(waitTimer);
  }, [currentIndex]);

  // ── Drift blob animation ──────────────────────────────────────────────────
  // The blob drifts horizontally and vertically on different slow periods,
  // creating an organic Lissajous-like motion (never the same path twice)

  const blobX = useSharedValue(width / 2); // starts at screen center
  const blobY = useSharedValue(height / 2);

  useEffect(() => {
    const driftRangeX = width * 0.30;  // drifts ±30% of screen width
    const driftRangeY = height * 0.25; // drifts ±25% of screen height

    // Horizontal drift: left → right → left, on DRIFT_BLOB_PERIOD_H period
    blobX.value = withRepeat(
      withSequence(
        withTiming(width / 2 + driftRangeX, { duration: DRIFT_BLOB_PERIOD_H / 2, easing: Easing.inOut(Easing.sin) }),
        withTiming(width / 2 - driftRangeX, { duration: DRIFT_BLOB_PERIOD_H / 2, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );

    // Vertical drift: different period so it never syncs with horizontal
    blobY.value = withRepeat(
      withSequence(
        withTiming(height / 2 + driftRangeY, { duration: DRIFT_BLOB_PERIOD_V / 2, easing: Easing.inOut(Easing.sin) }),
        withTiming(height / 2 - driftRangeY, { duration: DRIFT_BLOB_PERIOD_V / 2, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, []);

  return (
    <View style={styles.container}>

      {/* Layer 1 — Drift blob Skia Canvas (behind everything) */}
      <Canvas style={StyleSheet.absoluteFill}>
        {/*
          The blob is a very large, very low-opacity circle that drifts.
          blobX and blobY are Reanimated shared values passed directly to Skia —
          Skia 2.x reads them on the UI thread without .value
        */}
        <Circle
          cx={blobX}
          cy={blobY}
          r={BLOB_RADIUS}
          color={`${COLORS.sageGreen}0F`}  // sageGreen at ~6% opacity (0F hex = 15/255 ≈ 6%)
        />
      </Canvas>

      {/* Layer 2 — BreathingDot (centered) */}
      <View style={styles.dotContainer}>
        <BreathingDot
          isFadingOut={isDotFadingOut}
          onFadeOutComplete={onSessionComplete}
        />
      </View>

      {/* Layer 3 — PanelText (panels overlay everything) */}
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
  dotContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
