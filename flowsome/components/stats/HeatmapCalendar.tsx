// components/stats/HeatmapCalendar.tsx
import React, { useMemo } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { Canvas, RoundedRect } from '@shopify/react-native-skia';
import type { SessionRecord } from '../../store/historyStore';

const THEME_COLORS: Record<string, string> = {
  rajasthan: '#F0A030',
  himalaya:  '#70B8F8',
  kerala:    '#40C878',
  assam:     '#88B850',
  andaman:   '#30C8E0',
};

interface HeatmapCalendarProps {
  sessions: SessionRecord[];
  theme: {
    cardBorder: string;
    background: string;
    text: string;
  };
}

export default function HeatmapCalendar({ sessions, theme }: HeatmapCalendarProps) {
  const { width } = useWindowDimensions();
  const PADDING = 40;
  const COLS = 53; // weeks
  const ROWS = 7;  // days of week
  const CELL = Math.max(3, Math.floor((width - PADDING) / COLS));
  const GAP = 1;
  const CANVAS_W = COLS * (CELL + GAP);
  const CANVAS_H = ROWS * (CELL + GAP);

  // Build map: date → { minutes, theme }
  const heatmap = useMemo(() => {
    const map: Record<string, { minutes: number; theme: string }> = {};
    for (const session of sessions) {
      const day = session.completedAt.substring(0, 10);
      if (!map[day]) {
        map[day] = { minutes: 0, theme: session.theme };
      }
      map[day].minutes += session.durationMinutes;
    }
    return map;
  }, [sessions]);

  // Build 53×7 grid of cells — 364 days ending today
  const cells = useMemo(() => {
    const result: { date: string; col: number; row: number }[] = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364);
    // Align to Sunday
    startDate.setDate(startDate.getDate() - startDate.getDay());

    for (let col = 0; col < COLS; col++) {
      for (let row = 0; row < ROWS; row++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + col * 7 + row);
        result.push({
          date: d.toISOString().substring(0, 10),
          col,
          row,
        });
      }
    }
    return result;
  }, []);

  return (
    <View style={{ width: CANVAS_W, height: CANVAS_H }}>
      <Canvas style={{ width: CANVAS_W, height: CANVAS_H }}>
        {cells.map((cell, i) => {
          const data = heatmap[cell.date];
          const minutes = data?.minutes ?? 0;
          const themeColor = data
            ? (THEME_COLORS[data.theme] ?? '#6366F1')
            : theme.cardBorder;

          const intensity = Math.min(minutes / 60, 1);
          const opacity = minutes === 0 ? 0.15 : 0.15 + intensity * 0.85;

          return (
            <RoundedRect
              key={i}
              x={cell.col * (CELL + GAP)}
              y={cell.row * (CELL + GAP)}
              width={CELL}
              height={CELL}
              r={1.5}
              color={minutes === 0 ? theme.cardBorder : themeColor}
              opacity={opacity}
            />
          );
        })}
      </Canvas>
    </View>
  );
}
