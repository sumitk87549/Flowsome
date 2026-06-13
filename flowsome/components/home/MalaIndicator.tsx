// components/home/MalaIndicator.tsx — Sprint 13: Enhanced glow + intentional empty state
import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Canvas, Circle } from '@shopify/react-native-skia';
import { useHistoryStore } from '../../store/historyStore';

interface MalaIndicatorProps {
  width: number;
  theme: {
    primary: string;
    cardBorder: string;
  };
}

export default function MalaIndicator({ width, theme }: MalaIndicatorProps) {
  const getMalaProgress = useHistoryStore((s) => s.getMalaProgress);
  const litBeads = getMalaProgress();

  const BEAD_COUNT = 108;
  const CANVAS_H = 44;
  const canvasW = width;

  const beads = useMemo(
    () =>
      Array(BEAD_COUNT)
        .fill(0)
        .map((_, i) => {
          const t = i / (BEAD_COUNT - 1);
          const x = 16 + t * (canvasW - 32);
          const y = CANVAS_H / 2 + Math.sin(t * Math.PI) * 7;
          return { x, y, lit: i < litBeads };
        }),
    [canvasW, litBeads]
  );

  return (
    <View style={{ width: canvasW, height: CANVAS_H }} pointerEvents="none">
      <Canvas style={{ width: canvasW, height: CANVAS_H }}>
        {beads.map((bead, i) => (
          <React.Fragment key={i}>
            {/* Glow halo behind lit beads */}
            {bead.lit && (
              <Circle
                cx={bead.x}
                cy={bead.y}
                r={5}
                color={theme.primary}
                opacity={0.15}
              />
            )}
            {/* Bead */}
            <Circle
              cx={bead.x}
              cy={bead.y}
              r={bead.lit ? 2.5 : 1.6}
              color={bead.lit ? theme.primary : theme.cardBorder}
              opacity={bead.lit ? 0.95 : 0.2}
            />
          </React.Fragment>
        ))}
      </Canvas>
    </View>
  );
}
