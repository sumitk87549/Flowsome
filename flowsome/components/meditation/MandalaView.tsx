// components/meditation/MandalaView.tsx
import React from 'react';
import { View } from 'react-native';
import { Canvas, Path, Circle } from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { Skia } from '@shopify/react-native-skia';

type MeditationType = 'mindfulness' | 'vipassana' | 'yoga-nidra' | 'trataka' | null;

interface MandalaViewProps {
  progress: SharedValue<number>;
  meditationType: MeditationType | string | null;
  size?: number;
  theme: {
    primary: string;
    primaryLight: string;
    textMuted: string;
    orb: string;
  };
}

// ---- WORKLET helper: build one lotus petal path ----
function buildLotusPetal(
  cx: number,
  cy: number,
  r: number,
  angleRad: number,
  petalLength: number,
  petalWidth: number
): ReturnType<typeof Skia.Path.Make> {
  'worklet';
  const path = Skia.Path.Make();
  const tipX = cx + Math.cos(angleRad) * (r + petalLength);
  const tipY = cy + Math.sin(angleRad) * (r + petalLength);
  const leftX = cx + Math.cos(angleRad + Math.PI / 2) * petalWidth;
  const leftY = cy + Math.sin(angleRad + Math.PI / 2) * petalWidth;
  const rightX = cx + Math.cos(angleRad - Math.PI / 2) * petalWidth;
  const rightY = cy + Math.sin(angleRad - Math.PI / 2) * petalWidth;

  path.moveTo(cx + Math.cos(angleRad) * r, cy + Math.sin(angleRad) * r);
  path.cubicTo(leftX, leftY, tipX - 5, tipY - 5, tipX, tipY);
  path.cubicTo(tipX + 5, tipY + 5, rightX, rightY, cx + Math.cos(angleRad) * r, cy + Math.sin(angleRad) * r);
  path.close();
  return path;
}

export default function MandalaView({
  progress,
  meditationType,
  size = 280,
  theme,
}: MandalaViewProps) {
  const cx = size / 2;
  const cy = size / 2;

  // ---- MINDFULNESS: Lotus ----
  const mindfulnessPaths = useDerivedValue(() => {
    'worklet';
    const p = progress.value;
    const paths: { path: ReturnType<typeof Skia.Path.Make>; opacity: number; fill: boolean }[] = [];

    // Center seed
    const seed = Skia.Path.Make();
    seed.addCircle(cx, cy, 8);
    paths.push({ path: seed, opacity: Math.min(p * 10, 1), fill: true });

    // Inner ring of 4 petals — appears 0.05–0.3
    if (p > 0.05) {
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const reveal = Math.min((p - 0.05) / 0.25, 1);
        const petal = buildLotusPetal(cx, cy, 20, angle, 30 * reveal, 12);
        paths.push({ path: petal, opacity: reveal * 0.85, fill: false });
      }
    }

    // Outer ring of 8 petals — appears 0.3–0.7
    if (p > 0.3) {
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const reveal = Math.min((p - 0.3) / 0.4, 1);
        const petal = buildLotusPetal(cx, cy, 45, angle, 45 * reveal, 16);
        paths.push({ path: petal, opacity: reveal * 0.65, fill: false });
      }
    }

    // Outer circle border — appears 0.7–1.0
    if (p > 0.7) {
      const ring = Skia.Path.Make();
      const reveal = Math.min((p - 0.7) / 0.3, 1);
      ring.addCircle(cx, cy, 90 * reveal + 5);
      paths.push({ path: ring, opacity: reveal * 0.4, fill: false });
    }

    return paths;
  });

  // ---- YOGA NIDRA: Concentric ripples ----
  const yogaNidraPaths = useDerivedValue(() => {
    'worklet';
    const p = progress.value;
    const circles: { r: number; opacity: number }[] = [];
    const ringCount = 8;
    for (let i = 0; i < ringCount; i++) {
      const threshold = i / ringCount;
      if (p > threshold) {
        const reveal = Math.min((p - threshold) / (1 / ringCount), 1);
        circles.push({ r: 20 + i * 14, opacity: reveal * (0.6 - i * 0.06) });
      }
    }
    return circles;
  });

  // ---- VIPASSANA: Geometric ----
  const vipassanaPaths = useDerivedValue(() => {
    'worklet';
    const p = progress.value;
    const paths: { path: ReturnType<typeof Skia.Path.Make>; opacity: number }[] = [];

    if (p > 0) {
      const tri = Skia.Path.Make();
      const triSize = 25 * Math.min(p * 5, 1);
      tri.moveTo(cx, cy - triSize);
      tri.lineTo(cx + triSize * 0.866, cy + triSize * 0.5);
      tri.lineTo(cx - triSize * 0.866, cy + triSize * 0.5);
      tri.close();
      paths.push({ path: tri, opacity: Math.min(p * 5, 1) * 0.8 });
    }

    if (p > 0.2) {
      const hex = Skia.Path.Make();
      const hexR = 50 * Math.min((p - 0.2) / 0.3, 1);
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 - Math.PI / 6;
        const x = cx + hexR * Math.cos(angle);
        const y = cy + hexR * Math.sin(angle);
        if (i === 0) hex.moveTo(x, y);
        else hex.lineTo(x, y);
      }
      hex.close();
      paths.push({ path: hex, opacity: Math.min((p - 0.2) / 0.3, 1) * 0.5 });
    }

    if (p > 0.5) {
      const starR = 90 * Math.min((p - 0.5) / 0.5, 1);
      for (let t = 0; t < 2; t++) {
        const star = Skia.Path.Make();
        const offset = t * (Math.PI / 3);
        for (let i = 0; i < 3; i++) {
          const angle = (i / 3) * Math.PI * 2 + offset;
          const x = cx + starR * Math.cos(angle);
          const y = cy + starR * Math.sin(angle);
          if (i === 0) star.moveTo(x, y);
          else star.lineTo(x, y);
        }
        star.close();
        paths.push({ path: star, opacity: Math.min((p - 0.5) / 0.5, 1) * 0.35 });
      }
    }

    return paths;
  });

  const type = meditationType ?? 'mindfulness';

  if (type === 'yoga-nidra') {
    return (
      <View style={{ width: size, height: size }}>
        <Canvas style={{ width: size, height: size }}>
          {yogaNidraPaths.value.map((ring, i) => (
            <Circle
              key={i}
              cx={cx}
              cy={cy}
              r={ring.r}
              color={theme.primary}
              opacity={ring.opacity}
              style="stroke"
              strokeWidth={1.5}
            />
          ))}
        </Canvas>
      </View>
    );
  }

  if (type === 'vipassana') {
    return (
      <View style={{ width: size, height: size }}>
        <Canvas style={{ width: size, height: size }}>
          {vipassanaPaths.value.map((item, i) => (
            <Path
              key={i}
              path={item.path}
              color={theme.textMuted}
              opacity={item.opacity}
              style="stroke"
              strokeWidth={1}
            />
          ))}
        </Canvas>
      </View>
    );
  }

  // Default: mindfulness lotus
  return (
    <View style={{ width: size, height: size }}>
      <Canvas style={{ width: size, height: size }}>
        {mindfulnessPaths.value.map((item, i) => (
          <Path
            key={i}
            path={item.path}
            color={theme.primary}
            opacity={item.opacity}
            style={item.fill ? 'fill' : 'stroke'}
            strokeWidth={1.5}
          />
        ))}
      </Canvas>
    </View>
  );
}
