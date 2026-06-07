import React from 'react';
import { Dimensions, ImageBackground, StyleSheet, ViewStyle } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, withRepeat, withSequence, withTiming, useSharedValue, Easing } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { AppTheme } from '../types';
import { useScene } from '../context/ThemeContext';
import { ParticleLayer } from './ParticleLayer';

interface ThemedBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
  showParticles?: boolean;
}

const { width: W, height: H } = Dimensions.get('window');

function SceneImageLayer({ theme, opacityStyle }: { theme: AppTheme; opacityStyle: any }) {
  return (
    <Animated.View style={[StyleSheet.absoluteFill, opacityStyle]}>
      <ImageBackground
        source={theme.backgroundImage}
        resizeMode="cover"
        style={StyleSheet.absoluteFill}
      >
        <LinearGradient
          colors={theme.backgroundGradient}
          start={{ x: 0.22, y: 0 }}
          end={{ x: 0.68, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </ImageBackground>
    </Animated.View>
  );
}

function AnimatedLighting({ accentColor, secondaryAccentColor, animationStyle }: AppTheme) {
  const drift = useSharedValue(0);

  React.useEffect(() => {
    drift.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 5200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 5200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [drift]);

  const lightStyle = useAnimatedStyle(() => {
    const heatOffset = animationStyle === 'heatShimmer' ? 18 : animationStyle === 'waterShimmer' ? 10 : 7;
    return {
      transform: [
        { translateX: interpolate(drift.value, [0, 1], [-heatOffset, heatOffset]) },
        { translateY: interpolate(drift.value, [0, 1], [0, -12]) },
        { scale: interpolate(drift.value, [0, 1], [1, 1.06]) },
      ],
      opacity: interpolate(drift.value, [0, 1], [0.72, 1]),
    };
  });

  return (
    <Animated.View style={[StyleSheet.absoluteFill, lightStyle]} pointerEvents="none">
      <LinearGradient
        colors={[accentColor + '18', 'transparent', secondaryAccentColor + '10', 'transparent']}
        locations={[0, 0.34, 0.64, 1]}
        start={{ x: 0.15, y: 0.04 }}
        end={{ x: 0.88, y: 0.95 }}
        style={styles.diagonalLight}
      />
      <LinearGradient
        colors={[accentColor + '20', accentColor + '06', 'transparent']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.topGlow}
      />
    </Animated.View>
  );
}

export function ThemedBackground({ children, style, showParticles = true }: ThemedBackgroundProps) {
  const { transition, prevTheme, nextTheme, darkValue } = useScene();

  const prevLayerStyle = useAnimatedStyle(() => ({ opacity: 1 - transition.value }));
  const nextLayerStyle = useAnimatedStyle(() => ({ opacity: transition.value }));
  const darkOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(darkValue.value, [0, 1], [0, 0.34]),
  }));

  return (
    <Animated.View style={[styles.root, style]}>
      <SceneImageLayer theme={prevTheme} opacityStyle={prevLayerStyle} />
      <SceneImageLayer theme={nextTheme} opacityStyle={nextLayerStyle} />
      <AnimatedLighting {...nextTheme} />

      <LinearGradient
        colors={['rgba(0,0,0,0.12)', 'transparent', nextTheme.backgroundGradient[0]]}
        locations={[0, 0.46, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View
        style={[StyleSheet.absoluteFill, darkOverlayStyle, { backgroundColor: '#000' }]}
        pointerEvents="none"
      />

      {showParticles && (
        <ParticleLayer
          accentColor={nextTheme.accentColor}
          preset={nextTheme.particlePreset}
          count={nextTheme.particleDensity}
        />
      )}

      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#020403' },
  diagonalLight: {
    position: 'absolute',
    width: W * 1.3,
    height: H * 1.12,
    left: -W * 0.15,
    top: -H * 0.06,
  },
  topGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: H * 0.46,
  },
});
