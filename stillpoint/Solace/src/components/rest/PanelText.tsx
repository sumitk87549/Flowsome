// src/components/rest/PanelText.tsx
import React, { useEffect } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import { COLORS } from '@/constants/colors';
import { FONT } from '@/constants/typography';
import {
  PANEL_FADE_IN_DURATION,
  PANEL_FADE_OUT_DURATION,
  PANEL_GUTTER_DURATION,
  PANEL_FADE_IN_TRANSLATE_Y,
} from '@/constants/timing';
import { useHaptic } from '@/hooks/useHaptic';
import * as Haptics from 'expo-haptics';
import type { Panel } from '@/types/session';

interface PanelTextProps {
  panel: Panel;
  /** Called after the full exit sequence (fade-out + gutter) completes */
  onExit: () => void;
}

export function PanelText({ panel, onExit }: PanelTextProps) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const { fire } = useHaptic();

  // Animation shared values
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(PANEL_FADE_IN_TRANSLATE_Y); // starts shifted down

  // Run the full panel lifecycle on mount
  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>;

    // 1. Fire haptic on entry (if specified), before or simultaneous with fade-in
    if (panel.hapticOnEntry) {
      const hapticStyle = panel.hapticOnEntry === 'heavy' ? Haptics.ImpactFeedbackStyle.Heavy :
                          panel.hapticOnEntry === 'medium' ? Haptics.ImpactFeedbackStyle.Medium :
                          Haptics.ImpactFeedbackStyle.Light;
      fire(hapticStyle, false); // isTransition: false for panel haptics
    }

    // 2. Fade in (700ms)
    // Types 1 and 4 also rise upward (translateY from +10 to 0)
    opacity.value = withTiming(1, {
      duration: PANEL_FADE_IN_DURATION,
      easing: Easing.out(Easing.quad),
    });

    if (panel.type === 1 || panel.type === 4) {
      translateY.value = withTiming(0, {
        duration: PANEL_FADE_IN_DURATION,
        easing: Easing.out(Easing.quad),
      });
    } else {
      translateY.value = 0; // no translation for types 2 and 3
    }

    // 3. After fade-in completes, hold for panel.holdMs, then fade out
    timerId = setTimeout(() => {
      // Fade out (600ms)
      opacity.value = withTiming(0, {
        duration: PANEL_FADE_OUT_DURATION,
        easing: Easing.in(Easing.quad),
      });

      // 4. After fade-out, wait for the gutter (180ms), then call onExit
      timerId = setTimeout(() => {
        onExit();
      }, PANEL_FADE_OUT_DURATION + PANEL_GUTTER_DURATION);

    }, PANEL_FADE_IN_DURATION + panel.holdMs);

    // Cleanup — cancel any pending timeout if this component unmounts early
    return () => { clearTimeout(timerId); };
  }, []); // runs once on mount

  // Position the text based on panel type
  // The text is absolutely positioned within a full-screen container
  const topPosition = getTopPositionForType(panel.type, screenHeight);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.Text
      style={[
        styles.panelText,
        {
          top: topPosition,
          width: getPanelWidth(panel.type, screenWidth),
          alignSelf: 'center',
          position: 'absolute',
        },
        animatedStyle,
      ]}
    >
      {panel.text}
    </Animated.Text>
  );
}

/**
 * Top position (in dp from top of screen) for each panel type.
 * These percentages come directly from the blueprint's positioning spec.
 */
function getTopPositionForType(type: 1 | 2 | 3 | 4, screenHeight: number): number {
  switch (type) {
    case 1: return screenHeight * 0.20; // 20% from top — "voice from above"
    case 2: return screenHeight * 0.50; // 50% — eye-level grounding voice
    case 3: return screenHeight * 0.68; // 68% — echo/reflection
    case 4: return screenHeight * 0.46; // 46% — slightly above center, wide
    default: return screenHeight * 0.50;
  }
}

/**
 * Max width for each panel type (panel types 1–3 are narrower, type 4 is wide).
 */
function getPanelWidth(type: 1 | 2 | 3 | 4, screenWidth: number): number {
  if (type === 4) return screenWidth * 0.88; // wide container
  return screenWidth * 0.72;                 // standard container
}

const styles = StyleSheet.create({
  panelText: {
    fontFamily: FONT.light,
    fontSize: 17,          // standard rest panel font size
    color: COLORS.restText,
    opacity: 0.84,         // 84% base opacity as per blueprint
    lineHeight: 17 * 1.75, // lineHeight = fontSize × 1.75
    textAlign: 'center',
  },
});
