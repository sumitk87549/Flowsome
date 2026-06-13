// components/particles/ParticleCanvas.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { View, LayoutChangeEvent } from 'react-native';
import { useAppStore } from '../../store/appStore';
import { useTheme } from '../../hooks/useTheme';
import DustParticles from './DustParticles';
import SnowParticles from './SnowParticles';
import RainParticles from './RainParticles';
import SplashParticles from './SplashParticles';

interface ParticleCanvasProps {
  breathPhase?: 'inhale' | 'holdIn' | 'exhale' | 'holdOut' | 'idle';
  opacity?: number;
}

export function ParticleCanvas({
  breathPhase = 'idle',
  opacity = 1,
}: ParticleCanvasProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [ready, setReady] = useState(false);
  const activeTheme = useAppStore((s) => s.activeTheme);
  const theme = useTheme();

  // KEY: Increment mountKey on every theme change.
  // This forces the particle component to fully unmount and remount,
  // clearing all stale shared values from the previous theme.
  const [mountKey, setMountKey] = useState(0);
  useEffect(() => {
    setMountKey((k) => k + 1);
  }, [activeTheme]);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setDimensions({ width, height });
      setReady(true);
    }
  }, []);

  // Theme → particle type mapping
  const particleTypeMap: Record<string, string> = {
    rajasthan: 'dust',
    himalaya: 'snow',
    kerala:   'rain',
    assam:    'rain',
    andaman:  'ocean',
  };
  const particleType = particleTypeMap[activeTheme] ?? 'dust';

  const renderParticles = () => {
    if (!ready) return null;
    const { width, height } = dimensions;
    const props = { width, height, theme, breathPhase };

    switch (particleType) {
      case 'dust':  return <DustParticles   key={`dust-${mountKey}`}   {...props} />;
      case 'snow':  return <SnowParticles   key={`snow-${mountKey}`}   {...props} />;
      case 'rain':  return <RainParticles   key={`rain-${mountKey}`}   {...props} />;
      case 'ocean': return <SplashParticles key={`ocean-${mountKey}`}  {...props} />;
      default:      return <DustParticles   key={`dust-${mountKey}`}   {...props} />;
    }
  };

  return (
    <View
      onLayout={onLayout}
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        opacity,
      }}
    >
      {renderParticles()}
    </View>
  );
}
