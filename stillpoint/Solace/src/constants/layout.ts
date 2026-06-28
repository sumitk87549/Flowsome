import { Dimensions } from 'react-native';

const screen = Dimensions.get('screen');

export const LAYOUT = {
  screenWidth: screen.width,
  screenHeight: screen.height,
  cx: screen.width / 2,   // screen center X — used by Skia canvases
  cy: screen.height / 2,  // screen center Y — used by Skia canvases
} as const;

export const BREATHING_RING_SCALE_MIN = 0.96;
export const BREATHING_RING_SCALE_MAX = 1.04;
