import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
  Easing,
} from 'react-native-reanimated';

import { ThemedBackground } from '../../components/ThemedBackground';
import { BreathingCircle } from '../../components/BreathingCircle';
import { useTheme } from '../../context/ThemeContext';
import { useAppStore } from '../../store/appStore';
import { useSessionEngine } from '../../features/session/useSessionEngine';
import { formatSeconds } from '../../utils/time';
import { RootStackParamList, SessionPhase } from '../../types';
import { SESSION_LABELS, SESSION_EMOJIS } from '../../constants/sessions';
import { TYPE } from '../../constants/typography';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const { width: W, height: H_WIN } = Dimensions.get('window');
const RING_D = Math.min(W * 0.68, 280); // diameter of the focus-mode arc ring

// ─── Animated close button ───────────────────────────────────────────────────

function CloseButton({
  onPress,
  accentColor,
  subtextColor,
}: {
  onPress: () => void;
  accentColor: string;
  subtextColor: string;
}) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={style}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.84, { damping: 14, stiffness: 320 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 10, stiffness: 200 });
        }}
        activeOpacity={1}
        style={[styles.closeBtn, { borderColor: accentColor + '28' }]}
      >
        <Text style={[styles.closeBtnText, { color: subtextColor + 'A0' }]}>
          ✕
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Animated Arc Ring (focus / pomodoro) ─────────────────────────────────────
/**
 * Three static concentric rings + one animated "sweep" segment.
 * The sweep is faked with a rotating half-circle clip that correctly
 * tracks `progress` via a Reanimated SharedValue.
 */
function ArcProgressRing({
  progress,
  accentColor,
  size,
}: {
  progress: number;
  accentColor: string;
  size: number;
}) {
  const progressSV = useSharedValue(progress);

  useEffect(() => {
    progressSV.value = withTiming(progress, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress]);

  // Half-circle clip approach: two halves, clipped, rotated
  // Left half shows for progress 0–50%, right half for 50–100%
  const leftStyle = useAnimatedStyle(() => {
    const deg = interpolate(progressSV.value, [0, 0.5], [0, 180]);
    return {
      transform: [{ rotate: `${deg}deg` }],
      opacity: progressSV.value > 0 ? 1 : 0,
    };
  });

  const rightStyle = useAnimatedStyle(() => {
    const deg = interpolate(progressSV.value, [0.5, 1], [0, 180]);
    return {
      transform: [{ rotate: `${deg}deg` }],
      opacity: progressSV.value > 0.5 ? 1 : 0,
    };
  });

  return (
    <View
      style={{
        width: size * 1.6,
        height: size * 1.6,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Static rings */}
      <View
        style={[
          styles.arcStaticRing,
          {
            width: size * 1.6,
            height: size * 1.6,
            borderRadius: size * 0.8,
            borderColor: accentColor + '09',
          },
        ]}
      />
      <View
        style={[
          styles.arcStaticRing,
          {
            position: 'absolute',
            width: size * 1.24,
            height: size * 1.24,
            borderRadius: size * 0.62,
            borderColor: accentColor + '14',
          },
        ]}
      />
      <View
        style={[
          styles.arcStaticRing,
          {
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: accentColor + '22',
          },
        ]}
      />

      {/* Progress ring using border colouring — simpler and reliable */}
      {/* We rotate a border-only view; the colored borders represent the arc */}
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          overflow: 'hidden',
        }}
      >
        {/* Right half (0-50%) */}
        <View
          style={{
            position: 'absolute',
            width: size / 2,
            height: size,
            right: 0,
            overflow: 'hidden',
          }}
        >
          <Animated.View
            style={[
              leftStyle,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                borderWidth: 2,
                borderColor: accentColor,
                position: 'absolute',
                left: -size / 2,
                transformOrigin: `${size / 2}px ${size / 2}px`,
              },
            ]}
          />
        </View>

        {/* Left half (50-100%) */}
        <View
          style={{
            position: 'absolute',
            width: size / 2,
            height: size,
            left: 0,
            overflow: 'hidden',
          }}
        >
          <Animated.View
            style={[
              rightStyle,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                borderWidth: 2,
                borderColor: accentColor,
                position: 'absolute',
                left: 0,
                transformOrigin: `${size / 2}px ${size / 2}px`,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

// ─── Glass pill control button ─────────────────────────────────────────────

function ControlButton({
  label,
  onPress,
  accentColor,
  textColor,
  flex,
  filled = false,
}: {
  label: string;
  onPress: () => void;
  accentColor: string;
  textColor: string;
  flex: number;
  filled?: boolean;
}) {
  const scale = useSharedValue(1);
  const glow  = useSharedValue(0);

  const btnStyle  = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: glow.value * 0.6 }));

  return (
    <Animated.View style={[{ flex }, btnStyle]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.93, { damping: 14, stiffness: 320 });
          glow.value  = withTiming(1, { duration: 100 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 10, stiffness: 200 });
          glow.value  = withTiming(0, { duration: 280 });
        }}
        activeOpacity={1}
        style={[
          styles.controlBtn,
          {
            backgroundColor: filled
              ? accentColor + '1C'
              : 'rgba(255,255,255,0.03)',
            borderColor: filled ? accentColor + '45' : accentColor + '1A',
          },
        ]}
      >
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            glowStyle,
            {
              borderRadius: 22,
              backgroundColor: accentColor + '10',
            },
          ]}
          pointerEvents="none"
        />
        <Text
          style={[
            styles.controlBtnText,
            { color: filled ? textColor : textColor + '70' },
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Pulsing accent orb (session atmosphere) ─────────────────────────────────

function AtmosphereOrb({ accentColor }: { accentColor: string }) {
  const scale   = useSharedValue(1);
  const opacity = useSharedValue(0.06);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.0, { duration: 4000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.10, { duration: 3500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.04, { duration: 3500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.atmosphereOrb,
        style,
        { backgroundColor: accentColor },
      ]}
      pointerEvents="none"
    />
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export function SessionScreen() {
  const navigation   = useNavigation<NavProp>();
  const theme        = useTheme();
  const session      = useAppStore((s) => s.session);
  const pauseSession = useAppStore((s) => s.pauseSession);
  const resumeSession = useAppStore((s) => s.resumeSession);
  const endSession   = useAppStore((s) => s.endSession);

  useSessionEngine();

  const handleEnd = useCallback(() => {
    endSession();
    navigation.goBack();
  }, [endSession, navigation]);

  const handlePauseResume = useCallback(() => {
    if (session.isPaused) resumeSession();
    else pauseSession();
  }, [session.isPaused, pauseSession, resumeSession]);

  if (!session.isActive || !session.mode || !session.config) return null;

  const phases       = session.config.phases;
  const currentPhase = phases[session.currentPhaseIndex];
  const remaining    = session.totalSeconds - session.elapsedSeconds;
  const progress     = session.elapsedSeconds / Math.max(session.totalSeconds, 1);

  const modeLabel   = SESSION_LABELS[session.mode];
  const modeEmoji   = SESSION_EMOJIS[session.mode];
  const isBreathing = session.mode === 'breathing' || session.mode === 'meditation';

  return (
    <ThemedBackground showParticles={isBreathing}>
      <StatusBar style="light" />

      {/* Atmosphere orb — ambient bloom behind the hero */}
      <AtmosphereOrb accentColor={theme.accentColor} />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>

        {/* ── Top bar ─────────────────────────────────────────── */}
        <Animated.View
          entering={FadeInUp.delay(80).duration(500)}
          style={styles.topBar}
        >
          <CloseButton
            onPress={handleEnd}
            accentColor={theme.accentColor}
            subtextColor={theme.subtextColor}
          />

          <View style={styles.modePill}>
            <Text style={styles.modeEmoji}>{modeEmoji}</Text>
            <Text style={[styles.modeName, { color: theme.subtextColor + '85' }]}>
              {modeLabel}
            </Text>
          </View>

          <Text style={[styles.cycleTag, { color: theme.subtextColor + '50' }]}>
            {session.mode !== 'breathing'
              ? `${session.currentCycle}/${session.config.cycles}`
              : ''}
          </Text>
        </Animated.View>

        {/* ── Hero ────────────────────────────────────────────── */}
        <View style={styles.hero}>

          {/* BREATHING / MEDITATION: breathing circle with overlaid timer */}
          {isBreathing && (
            <Animated.View
              entering={FadeIn.delay(120).duration(900)}
              style={styles.heroCenter}
            >
              <BreathingCircle
                phase={currentPhase.phase as SessionPhase}
                size={RING_D * 0.62}
              />
              <View style={styles.circleTimerOverlay}>
                <Text style={[styles.circleTimer, { color: theme.textColor }]}>
                  {formatSeconds(remaining)}
                </Text>
                <Animated.Text
                  key={currentPhase.phase}
                  entering={FadeIn.duration(350)}
                  style={[styles.phaseLabel, { color: theme.subtextColor + 'B0' }]}
                >
                  {currentPhase.label}
                </Animated.Text>
              </View>
            </Animated.View>
          )}

          {/* FOCUS / POMODORO: arc ring with large display timer */}
          {!isBreathing && (
            <Animated.View
              entering={FadeIn.delay(80).duration(900)}
              style={styles.heroCenter}
            >
              <ArcProgressRing
                progress={progress}
                accentColor={theme.accentColor}
                size={RING_D}
              />
              <View style={styles.arcTimerOverlay}>
                <Text style={[styles.displayTimer, { color: theme.textColor }]}>
                  {formatSeconds(remaining)}
                </Text>
                <Animated.Text
                  key={currentPhase.phase}
                  entering={FadeIn.duration(350)}
                  style={[styles.phaseLabel, { color: theme.subtextColor + 'A0' }]}
                >
                  {currentPhase.label}
                </Animated.Text>
              </View>
            </Animated.View>
          )}

          {/* Paused badge */}
          {session.isPaused && (
            <Animated.View
              entering={FadeIn.duration(220)}
              exiting={FadeOut.duration(220)}
              style={[styles.pausedBadge, { borderColor: theme.accentColor + '30' }]}
            >
              <Text style={[styles.pausedText, { color: theme.accentColor + '90' }]}>
                ⏸  paused
              </Text>
            </Animated.View>
          )}

          {/* Progress line */}
          <Animated.View
            entering={FadeInDown.delay(500).duration(500)}
            style={[styles.progressTrack, { backgroundColor: theme.accentColor + '12' }]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: theme.accentColor + 'CC',
                  width: `${Math.min(progress * 100, 100)}%`,
                },
              ]}
            />
          </Animated.View>
        </View>

        {/* ── Controls ────────────────────────────────────────── */}
        <Animated.View
          entering={FadeInDown.delay(650).duration(500)}
          style={styles.controls}
        >
          <ControlButton
            label="End"
            onPress={handleEnd}
            accentColor={theme.accentColor}
            textColor={theme.textColor}
            flex={1}
          />
          <ControlButton
            label={session.isPaused ? 'Resume' : 'Pause'}
            onPress={handlePauseResume}
            accentColor={theme.accentColor}
            textColor={theme.textColor}
            flex={2}
            filled
          />
        </Animated.View>

      </SafeAreaView>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },

  // ── Top bar ──
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: '300',
  },
  modePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  modeEmoji: { fontSize: 17 },
  modeName: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  cycleTag: {
    width: 40,
    textAlign: 'right',
    fontSize: 12,
    letterSpacing: 1,
    fontWeight: '400',
  },

  // ── Hero ──
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
  },
  heroCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleTimerOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  arcTimerOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  displayTimer: {
    fontSize: 82,
    fontWeight: '100',
    letterSpacing: -3.5,
    includeFontPadding: false,
  },
  circleTimer: {
    fontSize: 44,
    fontWeight: '200',
    letterSpacing: -1.5,
    includeFontPadding: false,
  },
  phaseLabel: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  pausedBadge: {
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.03)',
    marginTop: -6,
  },
  pausedText: {
    fontSize: 11,
    letterSpacing: 3.5,
    fontWeight: '500',
  },
  progressTrack: {
    width: 148,
    height: 1.5,
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 1,
  },

  // ── Controls ──
  controls: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 12,
    alignItems: 'center',
  },
  controlBtn: {
    height: 58,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  controlBtnText: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  // ── Atmosphere ──
  arcStaticRing: {
    borderWidth: StyleSheet.hairlineWidth,
  },
  atmosphereOrb: {
    position: 'absolute',
    width: 340,
    height: 340,
    borderRadius: 170,
    alignSelf: 'center',
    top: '18%',
  },
});
