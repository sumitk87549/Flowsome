import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, BackHandler, Animated } from 'react-native';
import { Screen } from '../components/Screen';
import { COLORS, SPACING } from '../constants/theme';
import { SessionConfig, NavigationProps, SessionState } from '../types';

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
  const orbScale = useRef(new Animated.Value(1)).current;
  const orbOpacity = useRef(new Animated.Value(1)).current;
  const orbAnimationRef = useRef<Animated.CompositeAnimation | null>(null);

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

  // Orb Animation Engine
  useEffect(() => {
    if (orbAnimationRef.current) {
      orbAnimationRef.current.stop();
    }

    if (sessionState === 'RUNNING') {
      Animated.timing(orbOpacity, { toValue: 1, duration: 500, useNativeDriver: true }).start();
      
      const breatheIn = Animated.timing(orbScale, {
        toValue: 1.04,
        duration: 2500,
        useNativeDriver: true,
      });
      const breatheOut = Animated.timing(orbScale, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: true,
      });

      orbAnimationRef.current = Animated.loop(Animated.sequence([breatheIn, breatheOut]));
      orbAnimationRef.current.start();
      
    } else if (sessionState === 'PAUSED') {
      Animated.parallel([
        Animated.timing(orbScale, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(orbOpacity, { toValue: 0.5, duration: 800, useNativeDriver: true })
      ]).start();
      
    } else if (sessionState === 'COMPLETED') {
      Animated.parallel([
        Animated.timing(orbScale, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(orbOpacity, { toValue: 0.2, duration: 1500, useNativeDriver: true })
      ]).start();
      
    } else {
      // READY or EXITED
      Animated.parallel([
        Animated.timing(orbScale, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(orbOpacity, { toValue: 1, duration: 500, useNativeDriver: true })
      ]).start();
    }

    return () => {
      if (orbAnimationRef.current) {
        orbAnimationRef.current.stop();
      }
    };
  }, [sessionState, orbScale, orbOpacity]);

  const handleStop = () => {
    console.log('Transition: RUNNING/PAUSED -> EXITED');
    setSessionState('EXITED');
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

  const handleStart = () => {
    console.log('Transition: READY -> RUNNING');
    setSessionState('RUNNING');
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
      case 'RUNNING': return ''; // Cleaner when running
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

        <View style={styles.timerContainer}>
          {/* Base Structure - Ready for future backgrounds/particles */}
          <View style={styles.orbBackground} />
          
          {/* Living Orb */}
          <Animated.View style={[
            styles.livingOrb,
            { 
              transform: [{ scale: orbScale }],
              opacity: orbOpacity 
            }
          ]} />
          
          <Text style={styles.durationText}>{formatTime(remainingSeconds)}</Text>
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
  orbBackground: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    // Ready for future theme integration
  },
  livingOrb: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(134, 197, 184, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(134, 197, 184, 0.15)',
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
    marginTop: SPACING.xl,
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




