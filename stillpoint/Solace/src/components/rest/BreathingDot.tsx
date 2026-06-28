// src/components/rest/BreathingDot.tsx
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import { COLORS } from '@/constants/colors';
import { FONT } from '@/constants/typography';
import {
  BREATHE_INHALE_MS,
  BREATHE_EXHALE_MS,
  BREATHE_DOT_SCALE_MIN,
  BREATHE_DOT_SCALE_MAX,
  BREATHE_LABEL_FADE_MS,
} from '@/constants/timing';

// Base dot size (before scale is applied)
const DOT_BASE_SIZE = 120; // dp

interface BreathingDotProps {
  /** When true, the dot fades out (used when rest session ends) */
  isFadingOut?: boolean;
  /** Called after the fade-out completes */
  onFadeOutComplete?: () => void;
}

export function BreathingDot({ isFadingOut = false, onFadeOutComplete }: BreathingDotProps) {
  // Phase tracking — 'in' = inhaling (expanding), 'out' = exhaling (contracting)
  const [breathPhase, setBreathPhase] = useState<'in' | 'out'>('in');

  // Shared values for scale and overall opacity
  const scale = useSharedValue(BREATHE_DOT_SCALE_MIN);
  const containerOpacity = useSharedValue(1);

  // Label opacities — label fades out just before the other one fades in
  const labelInOpacity = useSharedValue(1);   // "Breathe in" label
  const labelOutOpacity = useSharedValue(0);  // "Breathe out" label

  // ── Start the breathing loop ──────────────────────────────────────────────
  useEffect(() => {
    // Scale animation: inhale (expand) then exhale (contract), repeat forever
    // CRITICAL: withRepeat(..., -1, false) — NEVER use true (reverse) with sine easing
    scale.value = withRepeat(
      withSequence(
        withTiming(BREATHE_DOT_SCALE_MAX, {
          duration: BREATHE_INHALE_MS,
          easing: Easing.inOut(Easing.sin),
        }),
        withTiming(BREATHE_DOT_SCALE_MIN, {
          duration: BREATHE_EXHALE_MS,
          easing: Easing.inOut(Easing.sin),
        })
      ),
      -1,
      false  // NEVER true
    );

    // Phase label toggling: every BREATHE_INHALE_MS ms, switch which label is visible
    // Start: "Breathe in" visible, "Breathe out" hidden
    // After BREATHE_INHALE_MS: cross-fade to "Breathe out"
    // After BREATHE_EXHALE_MS more: cross-fade back to "Breathe in"
    const cycleMs = BREATHE_INHALE_MS + BREATHE_EXHALE_MS; // full 4000ms cycle

    const phaseInterval = setInterval(() => {
      setBreathPhase(prev => {
        const next = prev === 'in' ? 'out' : 'in';

        // Fade out the current label, fade in the next one
        if (next === 'out') {
          // Switching to "exhale" phase
          labelInOpacity.value = withTiming(0, { duration: BREATHE_LABEL_FADE_MS });
          labelOutOpacity.value = withTiming(1, { duration: BREATHE_LABEL_FADE_MS });
        } else {
          // Switching to "inhale" phase
          labelOutOpacity.value = withTiming(0, { duration: BREATHE_LABEL_FADE_MS });
          labelInOpacity.value = withTiming(1, { duration: BREATHE_LABEL_FADE_MS });
        }

        return next;
      });
    }, BREATHE_INHALE_MS); // toggle every half-cycle

    return () => clearInterval(phaseInterval);
  }, []);

  // ── Fade out when rest session ends ───────────────────────────────────────
  useEffect(() => {
    if (isFadingOut) {
      containerOpacity.value = withTiming(0, { duration: 500 }, (finished) => {
        if (finished && onFadeOutComplete) {
          // Run callback on JS thread after animation completes
          // Use runOnJS if needed, but since onFadeOutComplete just calls setState
          // in the parent, it's safe to call directly here via a setTimeout
        }
      });
      // Simpler: just use a timeout matching the animation duration
      const timer = setTimeout(() => {
        onFadeOutComplete?.();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isFadingOut]);

  // ── Animated styles ───────────────────────────────────────────────────────
  const dotAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const labelInStyle = useAnimatedStyle(() => ({
    opacity: labelInOpacity.value,
  }));

  const labelOutStyle = useAnimatedStyle(() => ({
    opacity: labelOutOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      {/* "Breathe in" label — above the dot */}
      <View style={styles.labelContainer}>
        <Animated.Text style={[styles.label, labelInStyle]}>
          Breathe in
        </Animated.Text>
        <Animated.Text style={[styles.label, styles.labelAbsolute, labelOutStyle]}>
          Breathe out
        </Animated.Text>
      </View>

      {/* The dot itself — a circle via border radius, animated scale */}
      <Animated.View style={[styles.dot, dotAnimatedStyle]}>
        {/* Glow ring behind the dot — slightly larger, very low opacity */}
        <View style={styles.glowRing} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  label: {
    fontFamily: FONT.light,
    fontSize: 14,
    color: COLORS.restText,
    letterSpacing: 2,
    opacity: 0.72,
  },
  labelAbsolute: {
    position: 'absolute',
  },
  dot: {
    width: DOT_BASE_SIZE,
    height: DOT_BASE_SIZE,
    borderRadius: DOT_BASE_SIZE / 2,
    backgroundColor: COLORS.sageGreen,
    alignItems: 'center',
    justifyContent: 'center',
    // Subtle shadow for the glow effect (React Native shadow — works on iOS)
    shadowColor: COLORS.sageGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 8, // Android
  },
  glowRing: {
    position: 'absolute',
    width: DOT_BASE_SIZE * 1.5,
    height: DOT_BASE_SIZE * 1.5,
    borderRadius: (DOT_BASE_SIZE * 1.5) / 2,
    backgroundColor: COLORS.sageGreen,
    opacity: 0.06,
  },
});
