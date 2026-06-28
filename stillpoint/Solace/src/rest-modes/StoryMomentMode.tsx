// src/rest-modes/StoryMomentMode.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Canvas, Rect, RadialGradient, vec } from '@shopify/react-native-skia';
import { useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { COLORS } from '@/constants/colors';
import { StoryPanel, StoryTheme } from '@/types/session';
import { PanelText } from '@/components/rest/PanelText';
import { useSessionTimer } from '@/hooks/useSessionTimer';
import { FOREST_AFTER_RAIN_PANELS } from '@/stories/ForestAfterRain';

const THEME_COLORS: Record<StoryTheme, [string, string, string]> = {
  forest:      [COLORS.storyTheme0[0], COLORS.storyTheme0[1], COLORS.forestNight],
  ocean:       [COLORS.storyTheme1[0], COLORS.storyTheme1[1], COLORS.workBg5],
  mountain:    [COLORS.storyTheme2[0], COLORS.storyTheme2[1], COLORS.neutralDark],
  desertNight: [COLORS.storyTheme3[0], COLORS.storyTheme3[1], COLORS.neutralDark],
  winterRoom:  [COLORS.storyTheme4[0], COLORS.storyTheme4[1], COLORS.restSlate],
  morningLight:[COLORS.storyTheme5[0], COLORS.storyTheme5[1], COLORS.workBg3],
};

interface StoryMomentModeProps {
  duration: number;
  onSessionComplete: () => void;
}

export default function StoryMomentMode({ duration, onSessionComplete }: StoryMomentModeProps) {
  const { width, height } = useWindowDimensions();
  const PANELS = FOREST_AFTER_RAIN_PANELS;

  const [currentPanelIndex, setCurrentPanelIndex] = useState(0);
  const [currentTheme, setCurrentTheme] = useState<StoryTheme>('forest');
  const emptyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const timer = useSessionTimer({ durationMinutes: duration, onComplete: onSessionComplete });

  useEffect(() => {
    const panel = PANELS[currentPanelIndex];
    if (panel?.isEmpty) {
      emptyTimerRef.current = setTimeout(() => {
        setCurrentPanelIndex(i => Math.min(i + 1, PANELS.length - 1));
      }, panel.emptyDurationMs ?? 2000);
    }
    const theme = (panel as StoryPanel)?.theme;
    if (theme && theme !== currentTheme) {
      setCurrentTheme(theme);
    }
    return () => {
      if (emptyTimerRef.current) clearTimeout(emptyTimerRef.current);
    };
  }, [currentPanelIndex]);

  const currentPanel = PANELS[currentPanelIndex];
  const themeColors = THEME_COLORS[currentTheme];

  return (
    <View style={styles.container}>
      {/* Skia background gradient */}
      <Canvas style={StyleSheet.absoluteFill}>
        <Rect x={0} y={0} width={width} height={height}>
          <RadialGradient
            c={vec(width / 2, height / 2)}
            r={Math.max(width, height) * 0.7}
            colors={themeColors}
          />
        </Rect>
      </Canvas>

      {/* Panel text overlay */}
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
