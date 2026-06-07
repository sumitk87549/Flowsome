import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useScene } from '../context/ThemeContext';
import { ParticleLayer } from './ParticleLayer';

interface ThemedBackgroundProps {
  children: React.ReactNode;
  style?: object;
  showParticles?: boolean;
}

const { height: H } = Dimensions.get('window');

/**
 * ThemedBackground — cross-fading atmospheric canvas.
 *
 * Layer stack (bottom → top):
 *   1. prevTheme gradient  (fades OUT as transition → 1)
 *   2. nextTheme gradient  (fades IN as transition → 1)
 *   3. Diagonal accent band
 *   4. Top accent glow
 *   5. Bottom vignette
 *   6. Dark mode overlay   (fades IN when darkMode is enabled)
 *   7. Particles
 *   8. {children}
 */
export function ThemedBackground({
  children,
  style,
  showParticles = true,
}: ThemedBackgroundProps) {
  const { transition, prevTheme, nextTheme, darkValue } = useScene();

  // Cross-fade: prev layer fades out
  const prevLayerStyle = useAnimatedStyle(() => ({
    opacity: 1 - transition.value,
  }));

  // Cross-fade: next layer fades in
  const nextLayerStyle = useAnimatedStyle(() => ({
    opacity: transition.value,
  }));

  // Dark overlay: becomes visible when darkMode on
  const darkOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(darkValue.value, [0, 1], [0, 0.35]),
  }));

  const bandColor = nextTheme.accentColor + '07';

  return (
    <Animated.View style={[styles.root, style]}>
      {/* ── Layer 1: Outgoing theme gradient ── */}
      <Animated.View style={[StyleSheet.absoluteFill, prevLayerStyle]}>
        <LinearGradient
          colors={prevTheme.backgroundGradient}
          start={{ x: 0.15, y: 0 }}
          end={{ x: 0.7, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* ── Layer 2: Incoming theme gradient ── */}
      <Animated.View style={[StyleSheet.absoluteFill, nextLayerStyle]}>
        <LinearGradient
          colors={nextTheme.backgroundGradient}
          start={{ x: 0.15, y: 0 }}
          end={{ x: 0.7, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* ── Layer 3: Diagonal accent band ── */}
      <LinearGradient
        colors={['transparent', bandColor, 'transparent']}
        start={{ x: 0, y: 0.2 }}
        end={{ x: 1, y: 0.8 }}
        style={StyleSheet.absoluteFill}
      />

      {/* ── Layer 4: Top accent glow ── */}
      <LinearGradient
        colors={[
          nextTheme.accentColor + '0E',
          nextTheme.accentColor + '04',
          'transparent',
        ]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.55 }}
        style={styles.topGlow}
      />

      {/* ── Layer 5: Bottom vignette ── */}
      <LinearGradient
        colors={['transparent', nextTheme.backgroundGradient[0] + 'F0']}
        start={{ x: 0.5, y: 0.6 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.bottomVignette}
      />

      {/* ── Layer 6: Dark mode overlay ── */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          darkOverlayStyle,
          { backgroundColor: '#000' },
        ]}
        pointerEvents="none"
      />

      {/* ── Layer 7: Ambient particles ── */}
      {showParticles && (
        <ParticleLayer
          accentColor={nextTheme.accentColor}
          count={nextTheme.particleDensity}
        />
      )}

      {/* ── Layer 8: Content ── */}
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: H * 0.5,
  },
  bottomVignette: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: H * 0.38,
  },
});
