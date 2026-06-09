// components/particles/ParticleCanvas.tsx
import { useState } from 'react';
import { View, Dimensions } from 'react-native';
import { Canvas } from '@shopify/react-native-skia';
import { useAppStore } from '../../store/appStore';
import { DustParticles } from './DustParticles';
import { SnowParticles } from './SnowParticles';
import { RainParticles } from './RainParticles';
import { WaterRipple } from './WaterRipple';
import { OceanWave } from './OceanWave';
import { THEMES } from '../../constants/themes';

const { width, height } = Dimensions.get('window');

export function ParticleCanvas() {
  const [ready, setReady] = useState(false);
  const { activeTheme } = useAppStore();
  const config = THEMES[activeTheme];

  const renderParticles = () => {
    switch (config.particleType) {
      case 'dust':   return <DustParticles />;
      case 'snow':   return <SnowParticles />;
      case 'rain':   return <RainParticles />;
      case 'ripple': return <WaterRipple />;
      case 'ocean':  return <OceanWave />;
      default:       return null;
    }
  };

  return (
    <View
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      pointerEvents="none"
      onLayout={() => setReady(true)}
    >
      {ready && (
        <Canvas style={{ width, height: height * 1.1 }}>
          {renderParticles()}
        </Canvas>
      )}
    </View>
  );
}
