// app/(sessions)/meditation/session.tsx
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import * as KeepAwake from 'expo-keep-awake';
import { SafeScreen } from '../../../components/ui/SafeScreen';
import { MeditationAmbient } from '../../../components/meditation/MeditationAmbient';
import { FlowText } from '../../../components/ui/FlowText';
import { FlowButton } from '../../../components/ui/FlowButton';
import { ParticleCanvas } from '../../../components/particles/ParticleCanvas';
import { useAmbientAudio, useBinauralAudio, useSFX } from '../../../hooks/useAudio';
import { useSpeech } from '../../../hooks/useSpeech';
import { MEDITATION_TYPES } from '../../../constants/meditation-types';
import { useTimer } from '../../../hooks/useTimer';
import { useAppStore } from '../../../store/appStore';
import { useTheme } from '../../../hooks/useTheme';
import { useSettingsStore } from '../../../store/settingsStore';
import { formatTime } from '../../../utils/timeUtils';
import { HapticUtils } from '../../../utils/hapticUtils';

export default function MeditationSession() {
  const router = useRouter();
  const theme = useTheme();
  const { activeTheme } = useAppStore();
  const { keepAwakeEnabled } = useSettingsStore();
  const params = useLocalSearchParams<{ typeId: string; durationMin: string }>();

  const meditationType = MEDITATION_TYPES.find(t => t.id === params.typeId) ?? MEDITATION_TYPES[0];
  const durationMin = parseInt(params.durationMin ?? '10', 10);

  const { speak } = useSpeech();
  const { playSingingBowl } = useSFX();

  const { status, secondsLeft, progress, start, pause, resume, stop } = useTimer({
    workMinutes: durationMin,
    breakMinutes: 0,
    totalPomodoros: 1,
    onAllComplete: () => {
      playSingingBowl();
      HapticUtils.success();
    },
  });

  useAmbientAudio(activeTheme, true);
  useBinauralAudio(meditationType.binauralMode, status === 'running');

  useEffect(() => {
    if (keepAwakeEnabled) KeepAwake.activateKeepAwakeAsync();
    return () => { KeepAwake.deactivateKeepAwake(); };
  }, [keepAwakeEnabled]);

  useEffect(() => {
    const t = setTimeout(() => {
      start();
      playSingingBowl();
      setTimeout(() => speak(meditationType.ttsIntroEn), 2000);
    }, 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (status === 'complete') {
      const t = setTimeout(() => router.replace('/' as any), 4000);
      return () => clearTimeout(t);
    }
  }, [status]);

  return (
    <SafeScreen>
      <ParticleCanvas />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 60 }}>
        <View style={{ alignItems: 'center', gap: 4 }}>
          <FlowText variant="heading" size="2xl" color={theme.primary}>{meditationType.name}</FlowText>
          <FlowText size="sm" color={theme.textMuted}>{meditationType.nameHindi} · {durationMin} min</FlowText>
          {status === 'complete' && (
            <FlowText variant="heading" size="xl" color={theme.primary} style={{ marginTop: 8 }}>
              🙏 Session Complete
            </FlowText>
          )}
        </View>

        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <MeditationAmbient />
          <View style={{ position: 'absolute' }}>
            <FlowText variant="heading" size="4xl" color={theme.primary}>
              {formatTime(secondsLeft)}
            </FlowText>
          </View>
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
          <FlowButton
            label="End"
            variant="ghost"
            onPress={() => { stop(); router.back(); }}
            style={{ width: '100%', alignItems: 'center' }}
          />
        </View>
      </View>
    </SafeScreen>
  );
}
