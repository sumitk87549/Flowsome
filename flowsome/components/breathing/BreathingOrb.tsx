// components/breathing/BreathingOrb.tsx
import { useState, useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import { Canvas, Circle, RadialGradient, vec } from '@shopify/react-native-skia';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { BreathingPhase } from '../../constants/breathing-patterns';
import { useAppStore } from '../../store/appStore';
import { THEMES } from '../../constants/themes';

const { width } = Dimensions.get('window');
const ORB_MAX_SIZE = width * 0.65;
const ORB_MIN_SIZE = width * 0.35;
const CANVAS_SIZE = ORB_MAX_SIZE + 80;

interface BreathingOrbProps {
  phase: BreathingPhase;
  progress: number; // 0 → 1 within current phase
}

export function BreathingOrb({ phase, progress: _progress }: BreathingOrbProps) {
  const [ready, setReady] = useState(false);
  const { activeTheme, dayNight } = useAppStore();
  const colors =
    dayNight === 'day'
      ? THEMES[activeTheme].dayColors
      : THEMES[activeTheme].nightColors;

  const scale = useSharedValue(0.6);
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    const phaseName = phase.name;
    if (phaseName === 'inhale') {
      scale.value = withTiming(1.0, {
        duration: phase.durationSeconds * 1000,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      });
      glowOpacity.value = withTiming(0.7, {
        duration: phase.durationSeconds * 1000,
      });
    } else if (phaseName === 'exhale') {
      scale.value = withTiming(0.6, {
        duration: phase.durationSeconds * 1000,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      });
      glowOpacity.value = withTiming(0.2, {
        duration: phase.durationSeconds * 1000,
      });
    } else {
      // holdIn or holdOut — gentle spring to current position
      scale.value = withSpring(phaseName === 'holdIn' ? 1.0 : 0.6, {
        damping: 30,
        stiffness: 60,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase.name]);

  const animatedOrbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: 0.9,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: scale.value * 1.4 }],
  }));

  const orbR = CANVAS_SIZE / 2 - 10;

  return (
    <View
      style={{
        width: CANVAS_SIZE,
        height: CANVAS_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onLayout={() => setReady(true)}
    >
      {/* Glow ring */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: ORB_MAX_SIZE + 60,
            height: ORB_MAX_SIZE + 60,
            borderRadius: (ORB_MAX_SIZE + 60) / 2,
            backgroundColor: colors.orbGlow,
          },
          glowStyle,
        ]}
      />

      {/* Orb — Skia Canvas with layout guard */}
      <Animated.View style={[{ position: 'absolute' }, animatedOrbStyle]}>
        {ready && (
          <Canvas style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}>
            <Circle cx={CANVAS_SIZE / 2} cy={CANVAS_SIZE / 2} r={orbR}>
              <RadialGradient
                c={vec(CANVAS_SIZE / 2, CANVAS_SIZE / 2)}
                r={orbR}
                colors={[colors.primaryLight, colors.orb, colors.gradientEnd]}
              />
            </Circle>
          </Canvas>
        )}
      </Animated.View>
    </View>
  );
}
