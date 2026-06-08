import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, BackHandler, Animated } from 'react-native';
import { Screen } from '../components/Screen';
import { COLORS, SPACING } from '../constants/theme';
import { SessionConfig, NavigationProps, SessionState } from '../types';
import { Audio } from 'expo-av';

interface SessionScreenProps extends NavigationProps {
  config: SessionConfig;
}

export function SessionScreen({ config, navigate }: SessionScreenProps) {
  const [sessionState, setSessionState] = useState<SessionState>('READY');
  
  const getInitialSeconds = () => {
    if (config.type === 'Pomodoro' && config.workDuration) {
      return config.workDuration * 60;
    }
    return (config.duration || 15) * 60;
  };

  const totalSeconds = useRef(getInitialSeconds()).current;
  const [remainingSeconds, setRemainingSeconds] = useState<number>(totalSeconds);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Animation values for the Living Orb
  const pulseAnim = useRef(new Animated.Value(1.0)).current;
  const opacityAnim = useRef(new Animated.Value(0.8)).current;
  const pulseRef = useRef<Animated.CompositeAnimation | null>(null);

  // Audio Ref
  const soundRef = useRef<Audio.Sound | null>(null);

  // Audio Cleanup
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
      }
    };
  }, []);

  // Timer Engine
  useEffect(() => {
    if (sessionState === 'RUNNING') {
      timerRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setSessionState('COMPLETED');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [sessionState]);

  // Living Orb Motion & State Visuals
  useEffect(() => {
    if (pulseRef.current) {
      pulseRef.current.stop();
    }

    if (sessionState === 'RUNNING') {
      // Fade orb to fully active
      Animated.timing(opacityAnim, {
        toValue: 1.0,
        duration: 500,
        useNativeDriver: true,
      }).start();

      // Start looping breathing animation (5 second cycle: 2.5s inhale, 2.5s exhale)
      const breathingAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.04,
            duration: 2500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1.0,
            duration: 2500,
            useNativeDriver: true,
          }),
        ])
      );
      pulseRef.current = breathingAnimation;
      breathingAnimation.start();
    } else if (sessionState === 'READY') {
      // Static orb at standard scale/opacity
      Animated.parallel([
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.8,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (sessionState === 'PAUSED') {
      // Pause: stops breathing, resets scale, dims opacity
      Animated.parallel([
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.4,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (sessionState === 'COMPLETED') {
      // Completed: stops breathing, resets scale, fades to very soft opacity
      Animated.parallel([
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.2,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
    }

    return () => {
      if (pulseRef.current) {
        pulseRef.current.stop();
      }
    };
  }, [sessionState]);

  const handleStop = async () => {
    console.log('Transition: RUNNING/PAUSED -> EXITED');
    setSessionState('EXITED');
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      } catch (e) {
        console.log('Audio stop error:', e);
      }
    }
    navigate({ name: 'Home' });
  };

  const handleExitRequest = () => {
    if (sessionState === 'RUNNING' || sessionState === 'PAUSED') {
      Alert.alert('Exit Session?', 'Your current session will be stopped.', [
        {
          text: 'Stay',
          onPress: () => null,
          style: 'cancel',
        },
        { text: 'Exit', onPress: handleStop },
      ]);
      return true;
    }
    navigate({ name: 'Home' });
    return true;
  };

  // Hardware Back Button Handling
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleExitRequest
    );

    return () => backHandler.remove();
  }, [sessionState, navigate]);

  const handleStart = async () => {
    console.log('Transition: READY -> RUNNING');
    setSessionState('RUNNING');
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/audio/rain.mp3'),
        { shouldPlay: true, isLooping: true }
      );
      soundRef.current = sound;
    } catch (e) {
      console.log('Audio load error:', e);
    }
  };

  const handlePause = () => {
    console.log('Transition: RUNNING -> PAUSED');
    setSessionState('PAUSED');
  };

  const handleResume = () => {
    console.log('Transition: PAUSED -> RUNNING');
    setSessionState('RUNNING');
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const renderStateText = () => {
    switch (sessionState) {
      case 'READY': return 'READY TO START';
      case 'RUNNING': return 'IN PROGRESS';
      case 'PAUSED': return 'PAUSED';
      case 'COMPLETED': return 'SESSION COMPLETE';
      case 'EXITED': return 'SESSION ENDED';
      default: return '';
    }
  };

  return (
    <Screen>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleExitRequest}>
          <Text style={styles.backText}>← EXIT</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.typeText}>{config.type.toUpperCase()}</Text>

        {/* Living Orb Container - structured to support future background themes/particles */}
        <View style={styles.timerContainer}>
          {/* Future Theme Background Placement Layer */}
          <View style={StyleSheet.absoluteFillObject} />

          {/* Animated Breathing Orb */}
          <Animated.View
            style={[
              styles.orbBase,
              {
                opacity: opacityAnim,
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <View style={styles.orbInnerAmbient} />
          </Animated.View>

          {/* Foreground Timer Text */}
          <View style={styles.foregroundContainer}>
            <Text style={styles.durationText}>{formatTime(remainingSeconds)}</Text>
          </View>
        </View>

        {config.type === 'Breathing' && config.breathingPattern && (
          <Text style={styles.detailText}>{config.breathingPattern} Pattern</Text>
        )}
        
        <Text style={styles.stateIndicator}>{renderStateText()}</Text>
      </View>

      <View style={styles.footer}>
        {sessionState === 'READY' && (
          <TouchableOpacity style={styles.actionButton} onPress={handleStart} activeOpacity={0.7}>
            <View style={styles.actionButtonInner}>
              <Text style={styles.actionText}>START</Text>
            </View>
          </TouchableOpacity>
        )}

        {sessionState === 'RUNNING' && (
          <View style={styles.multiActionContainer}>
            <TouchableOpacity style={[styles.actionButton, styles.smallButton]} onPress={handlePause} activeOpacity={0.7}>
              <View style={styles.actionButtonInner}>
                <Text style={styles.actionText}>PAUSE</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.actionButton, styles.smallButton]} onPress={handleStop} activeOpacity={0.7}>
              <View style={styles.actionButtonInner}>
                <Text style={styles.actionText}>STOP</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {sessionState === 'PAUSED' && (
          <View style={styles.multiActionContainer}>
            <TouchableOpacity style={[styles.actionButton, styles.smallButton]} onPress={handleResume} activeOpacity={0.7}>
              <View style={styles.actionButtonInner}>
                <Text style={styles.actionText}>RESUME</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.actionButton, styles.smallButton]} onPress={handleStop} activeOpacity={0.7}>
              <View style={styles.actionButtonInner}>
                <Text style={styles.actionText}>STOP</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {(sessionState === 'COMPLETED' || sessionState === 'EXITED') && (
          <TouchableOpacity style={styles.actionButton} onPress={() => navigate({ name: 'Home' })} activeOpacity={0.7}>
            <View style={styles.actionButtonInner}>
              <Text style={styles.actionText}>DONE</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: SPACING.xxl,
    paddingHorizontal: SPACING.md,
  },
  backButton: {
    paddingVertical: SPACING.sm,
  },
  backText: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 1.5,
    opacity: 0.8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.accent,
    letterSpacing: 4,
    marginBottom: SPACING.xl,
  },
  timerContainer: {
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  orbBase: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(134, 197, 184, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(134, 197, 184, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orbInnerAmbient: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(134, 197, 184, 0.03)',
  },
  foregroundContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationText: {
    fontSize: 80,
    fontWeight: '200',
    color: COLORS.text,
    letterSpacing: -2,
    fontVariant: ['tabular-nums'],
  },
  detailText: {
    fontSize: 18,
    fontWeight: '300',
    color: COLORS.text,
    opacity: 0.6,
    marginTop: SPACING.lg,
  },
  stateIndicator: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.accent,
    letterSpacing: 2,
    marginTop: SPACING.xxxl,
    opacity: 0.8,
  },
  footer: {
    paddingBottom: SPACING.xxxl * 2,
    alignItems: 'center',
    minHeight: 250,
    justifyContent: 'center',
  },
  multiActionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.lg,
  },
  actionButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(134, 197, 184, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(134, 197, 184, 0.2)',
  },
  smallButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  actionButtonInner: {
    width: '85%',
    height: '85%',
    borderRadius: 100,
    backgroundColor: 'rgba(134, 197, 184, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 16,
    fontWeight: '300',
    color: COLORS.text,
    letterSpacing: 2,
  },
});




