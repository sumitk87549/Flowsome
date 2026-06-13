// Sprint 9 — utils/hapticUtils.ts
import * as Haptics from 'expo-haptics';
import { useSettingsStore } from '../store/settingsStore';

export const HapticUtils = {
  light: (): void => {
    if (useSettingsStore.getState().hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  },
  medium: (): void => {
    if (useSettingsStore.getState().hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  },
  heavy: (): void => {
    if (useSettingsStore.getState().hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  },
  success: (): void => {
    if (useSettingsStore.getState().hapticsEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  },
  warning: (): void => {
    if (useSettingsStore.getState().hapticsEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  },
};

function isHapticsEnabled(): boolean {
  return useSettingsStore.getState().hapticsEnabled;
}

export function hapticLight(): void {
  if (isHapticsEnabled()) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }
}

export function hapticMedium(): void {
  if (isHapticsEnabled()) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  }
}

export function hapticHeavy(): void {
  if (isHapticsEnabled()) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
  }
}

export function hapticSuccess(): void {
  if (isHapticsEnabled()) {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }
}

// NEW — Rising sequence haptic: three pulses escalating (Light → Light → Medium)
export async function hapticRisingSequence(): Promise<void> {
  if (!isHapticsEnabled()) return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await new Promise<void>((resolve) => setTimeout(resolve, 80));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await new Promise<void>((resolve) => setTimeout(resolve, 80));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch (_) {
    // fail silently
  }
}

// NEW — Single firm pulse: one Medium impact
export async function hapticSingleFirm(): Promise<void> {
  if (!isHapticsEnabled()) return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch (_) {
    // fail silently
  }
}

// NEW — Phase-specific haptic dispatcher for breathing
export async function hapticForBreathingPhase(phase: string): Promise<void> {
  if (!isHapticsEnabled()) return;
  switch (phase) {
    case 'inhale':
      await hapticRisingSequence();
      break;
    case 'holdIn':
      await hapticSingleFirm();
      break;
    case 'exhale':
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (_) {}
      break;
    case 'holdOut':
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (_) {}
      break;
    default:
      break;
  }
}
