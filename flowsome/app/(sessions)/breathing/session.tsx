// app/(sessions)/breathing/session.tsx
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import * as KeepAwake from 'expo-keep-awake';
import { SafeScreen } from '../../../components/ui/SafeScreen';
import { BreathingOrb } from '../../../components/breathing/BreathingOrb';
import { BreathingPhaseLabel } from '../../../components/breathing/BreathingPhaseLabel';
import { BreathingProgress } from '../../../components/breathing/BreathingProgress';
import { FlowButton } from '../../../components/ui/FlowButton';
import { ParticleCanvas } from '../../../components/particles/ParticleCanvas';
import { useBreathing } from '../../../hooks/useBreathing';
import { useSessionStore } from '../../../store/sessionStore';
import { BREATHING_PATTERNS } from '../../../constants/breathing-patterns';
import { useAmbientAudio } from '../../../hooks/useAudio';
import { useAppStore } from '../../../store/appStore';
import { useSettingsStore } from '../../../store/settingsStore';

export default function BreathingSession() {
  const router = useRouter();
  const { activeTheme } = useAppStore();
  const { selectedPatternId } = useSessionStore();
  const { keepAwakeEnabled } = useSettingsStore();

  const pattern =
    BREATHING_PATTERNS.find((p) => p.id === selectedPatternId) ??
    BREATHING_PATTERNS[0];

  const {
    state,
    currentPhase,
    phaseProgress,
    currentCycle,
    phaseSecondsRemaining,
    start,
    pause,
    resume,
    stop,
  } = useBreathing(pattern);

  // Keep screen awake during session
  useEffect(() => {
    if (keepAwakeEnabled) {
      KeepAwake.activateKeepAwakeAsync().catch(() => {
        // silently ignore if not supported
      });
    }
    return () => {
      KeepAwake.deactivateKeepAwake();
    };
  }, [keepAwakeEnabled]);

  // Auto-start 800ms after screen mounts
  useEffect(() => {
    const timer = setTimeout(() => start(), 800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Navigate back automatically after session completes
  useEffect(() => {
    if (state === 'complete') {
      const timer = setTimeout(() => router.back(), 3000);
      return () => clearTimeout(timer);
    }
  }, [state, router]);

  // Ambient audio (loops, plays for duration of screen)
  useAmbientAudio(activeTheme, true);

  const handleStop = () => {
    stop();
    router.back();
  };

  return (
    <SafeScreen>
      <ParticleCanvas />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 60,
          paddingHorizontal: 24,
        }}
      >
        {/* Top: Cycle progress dots */}
        <View style={{ alignItems: 'center' }}>
          <BreathingProgress
            currentCycle={currentCycle}
            totalCycles={pattern.cycles}
          />
        </View>

        {/* Center: Orb + Phase label */}
        <View style={{ alignItems: 'center', gap: 32 }}>
          <BreathingOrb phase={currentPhase} progress={phaseProgress} />
          {state !== 'idle' && state !== 'complete' && (
            <BreathingPhaseLabel
              phase={currentPhase}
              secondsRemaining={phaseSecondsRemaining}
            />
          )}
          {state === 'complete' && (
            <BreathingPhaseLabel
              phase={{
                name: 'inhale',
                nameEnglish: 'Complete ✓',
                nameHindi: 'पूर्ण ✓',
                durationSeconds: 0,
              }}
              secondsRemaining={0}
            />
          )}
        </View>

        {/* Bottom: Controls */}
        <View style={{ gap: 12, width: '100%' }}>
          {state === 'running' && (
            <FlowButton
              label="Pause"
              variant="secondary"
              onPress={pause}
              style={{ alignSelf: 'center', width: '60%', alignItems: 'center' }}
            />
          )}
          {state === 'paused' && (
            <FlowButton
              label="Resume"
              onPress={resume}
              style={{ alignSelf: 'center', width: '60%', alignItems: 'center' }}
            />
          )}
          <FlowButton
            label="End Session"
            variant="ghost"
            onPress={handleStop}
            style={{ alignSelf: 'center', width: '60%', alignItems: 'center' }}
          />
        </View>
      </View>
    </SafeScreen>
  );
}
