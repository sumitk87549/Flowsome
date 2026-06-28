// src/components/focus/WorkSessionCanvas.tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { Canvas } from '@shopify/react-native-skia';
import { useWindowDimensions } from 'react-native';
import { BreathingRing } from './BreathingRing';
import { OrbitalRings } from './OrbitalRings';
import { ParticleField } from './ParticleField';

interface WorkSessionCanvasProps {
  /** Pass true when the work session timer has completed (starts slow-down animations) */
  isSessionEnding?: boolean;
}

export function WorkSessionCanvas({ isSessionEnding = false }: WorkSessionCanvasProps) {
  const { width, height } = useWindowDimensions();
  const cx = width / 2;
  const cy = height / 2;

  return (
    <Canvas
      style={[
        StyleSheet.absoluteFill,
        { zIndex: 1 }  // Above background (Layer 1), below timer text (Layers 3–6)
      ]}
    >
      {/*
        Render order matters in Skia: elements rendered first appear behind later ones.
        1. OrbitalRings — widest, behind everything
        2. ParticleField — dots floating around the ring
        3. BreathingRing — center glow, on top of particles
      */}
      <OrbitalRings cx={cx} cy={cy} isSlowingDown={isSessionEnding} />
      <ParticleField cx={cx} cy={cy} isSlowingDown={isSessionEnding} />
      <BreathingRing cx={cx} cy={cy} isSlowingDown={isSessionEnding} />
    </Canvas>
  );
}
