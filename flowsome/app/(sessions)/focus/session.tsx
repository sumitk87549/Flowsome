// app/(sessions)/focus/session.tsx
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import * as KeepAwake from 'expo-keep-awake';
import { SafeScreen } from '../../../components/ui/SafeScreen';
import { FocusAmbient } from '../../../components/focus/FocusAmbient';
import { FlowText } from '../../../components/ui/FlowText';
import { FlowButton } from '../../../components/ui/FlowButton';
import { CircularTimer } from '../../../components/timer/CircularTimer';
import { ParticleCanvas } from '../../../components/particles/ParticleCanvas';
import { useAmbientAudio, useBinauralAudio } from '../../../hooks/useAudio';
import { useTimer } from '../../../hooks/useTimer';
import { useAppStore } from '../../../store/appStore';
import { useTheme } from '../../../hooks/useTheme';
import { useSettingsStore } from '../../../store/settingsStore';
import { FOCUS_MODES } from '../../../constants/focus-modes';
import { formatTime } from '../../../utils/timeUtils';

export default function FocusSession() {
  const router = useRouter();
  const theme = useTheme();
  const { activeTheme } = useAppStore();
  const { keepAwakeEnabled } = useSettingsStore();
  const params = useLocalSearchParams<{ modeId: string; workMin: string; breakMin: string; intention: string }>();

  const focusMode = FOCUS_MODES.find(m => m.id === params.modeId) ?? FOCUS_MODES[0];
  const workMin = parseInt(params.workMin ?? String(focusMode.defaultWorkMinutes), 10);
  const intention = params.intention ?? '';

  const { status, phase, secondsLeft, progress, start, pause, resume, stop } = useTimer({
    workMinutes: workMin,
    breakMinutes: 0,
    totalPomodoros: 1,
    onAllComplete: () => {},
  });

  useAmbientAudio(activeTheme, true);
  useBinauralAudio(focusMode.binauralMode, status === 'running');

  useEffect(() => {
    if (keepAwakeEnabled) KeepAwake.activateKeepAwakeAsync();
    return () => { KeepAwake.deactivateKeepAwake(); };
  }, [keepAwakeEnabled]);

  useEffect(() => {
    const t = setTimeout(() => { start(); }, 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (status === 'complete') {
      const t = setTimeout(() => router.back(), 3000);
      return () => clearTimeout(t);
    }
  }, [status]);

  const phaseLabel =
    status === 'complete' ? '✅ Complete' :
    phase === 'work' ? '🎯 Focus' :
    'Ready';

  return (
    <SafeScreen>
      <ParticleCanvas />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 60 }}>
        <View style={{ alignItems: 'center', gap: 4, paddingHorizontal: 32 }}>
          <FlowText variant="heading" size="2xl" color={theme.primary}>{focusMode.name}</FlowText>
          <FlowText size="sm" color={theme.textMuted}>{focusMode.nameHindi}</FlowText>
          {intention.trim().length > 0 && (
            <FlowText
              size="sm"
              color={theme.textSecondary}
              style={{ marginTop: 8, textAlign: 'center' }}
            >
              "{intention}"
            </FlowText>
          )}
        </View>

        <View style={{ alignItems: 'center', justifyContent: 'center', gap: 24 }}>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <CircularTimer progress={progress} size={260} strokeWidth={6} isBreak={false} />
            <View style={{ position: 'absolute', alignItems: 'center', gap: 4 }}>
              <FlowText
                variant="label"
                size="xs"
                color={theme.textMuted}
                style={{ letterSpacing: 3, textTransform: 'uppercase' }}
              >
                {phaseLabel}
              </FlowText>
              <FlowText variant="heading" size="3xl" color={theme.primary}>
                {formatTime(secondsLeft)}
              </FlowText>
            </View>
          </View>
          <FocusAmbient />
        </View>

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
          {status === 'complete' && (
            <FlowText variant="heading" size="xl" color={theme.primary}>
              Great session! 🎉
            </FlowText>
          )}
          <FlowButton
            label="End Session"
            variant="ghost"
            onPress={() => { stop(); router.back(); }}
            style={{ width: '100%', alignItems: 'center' }}
          />
        </View>
      </View>
    </SafeScreen>
  );
}
