// app/(sessions)/pomodoro/session.tsx
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import * as KeepAwake from 'expo-keep-awake';
import { SafeScreen } from '../../../components/ui/SafeScreen';
import { CircularTimer } from '../../../components/timer/CircularTimer';
import { TimeDisplay } from '../../../components/timer/TimeDisplay';
import { FlowButton } from '../../../components/ui/FlowButton';
import { FlowText } from '../../../components/ui/FlowText';
import { ParticleCanvas } from '../../../components/particles/ParticleCanvas';
import { useTimer } from '../../../hooks/useTimer';
import { useAmbientAudio, useBinauralAudio, useSFX } from '../../../hooks/useAudio';
import { useAppStore } from '../../../store/appStore';
import { useTheme } from '../../../hooks/useTheme';
import { useSettingsStore } from '../../../store/settingsStore';

export default function PomodoroSession() {
  const router = useRouter();
  const theme = useTheme();
  const { activeTheme } = useAppStore();
  const { keepAwakeEnabled } = useSettingsStore();
  const params = useLocalSearchParams<{ workMin: string; breakMin: string; count: string }>();

  const workMin = parseInt(params.workMin ?? '25', 10);
  const breakMin = parseInt(params.breakMin ?? '5', 10);
  const count = parseInt(params.count ?? '4', 10);

  const { playDing, playSingingBowl } = useSFX();

  const {
    status,
    phase,
    secondsLeft,
    completedPomodoros,
    progress,
    start,
    pause,
    resume,
    stop,
  } = useTimer({
    workMinutes: workMin,
    breakMinutes: breakMin,
    totalPomodoros: count,
    onWorkComplete: () => {
      playDing();
    },
    onBreakComplete: () => {
      playDing();
    },
    onAllComplete: () => {
      playSingingBowl();
    },
  });

  useAmbientAudio(activeTheme, true);
  useBinauralAudio('alpha', status === 'running' && phase === 'work');

  useEffect(() => {
    if (keepAwakeEnabled) {
      KeepAwake.activateKeepAwakeAsync();
    }
    return () => {
      KeepAwake.deactivateKeepAwake();
    };
  }, [keepAwakeEnabled]);

  useEffect(() => {
    // Auto-start the timer 500ms after mount (gives audio time to initialize)
    const t = setTimeout(() => {
      start();
    }, 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status === 'complete') {
      const t = setTimeout(() => {
        router.back();
      }, 4000);
      return () => clearTimeout(t);
    }
  }, [status]);

  return (
    <SafeScreen>
      <ParticleCanvas />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 60,
        }}
      >
        {/* Top label */}
        <FlowText variant="heading" size="xl" color={theme.textMuted}>
          {status === 'complete'
            ? '✅ Session Complete!'
            : `${completedPomodoros + 1} of ${count}`}
        </FlowText>

        {/* Circular timer with time display centered inside */}
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <CircularTimer
            progress={progress}
            size={280}
            isBreak={phase === 'break'}
          />
          <View style={{ position: 'absolute' }}>
            <TimeDisplay
              secondsLeft={secondsLeft}
              phase={phase}
              completedPomodoros={completedPomodoros}
              totalPomodoros={count}
            />
          </View>
        </View>

        {/* Controls */}
        <View style={{ gap: 12, width: '80%', alignItems: 'center' }}>
          {status === 'running' && (
            <FlowButton
              label="Pause"
              variant="secondary"
              onPress={pause}
              style={{ width: '100%', alignItems: 'center' }}
            />
          )}
          {status === 'paused' && (
            <FlowButton
              label="Resume"
              onPress={resume}
              style={{ width: '100%', alignItems: 'center' }}
            />
          )}
          <FlowButton
            label="End Session"
            variant="ghost"
            onPress={() => {
              stop();
              router.back();
            }}
            style={{ width: '100%', alignItems: 'center' }}
          />
        </View>
      </View>
    </SafeScreen>
  );
}
