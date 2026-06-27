import { Easing } from 'react-native-reanimated';

// Named easing curves used throughout the app. Import from here — never inline Easing calls.
export const EASE = {
  outQuad: Easing.out(Easing.quad),
  inOutQuad: Easing.inOut(Easing.quad),
  inOutSin: Easing.inOut(Easing.sin),
  outCubic: Easing.out(Easing.cubic),
  linear: Easing.linear,
} as const;
