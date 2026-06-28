import { StoryPanel } from '@/types/session';

export const FOREST_AFTER_RAIN_PANELS: StoryPanel[] = [
  { type: 2, text: "The rain has stopped.", holdMs: 6000, theme: 'forest', hapticOnEntry: 'light' },
  { type: 1, text: "The forest is breathing out.", holdMs: 7000, theme: 'forest' },
  { isEmpty: true, emptyDurationMs: 2500, type: 2, text: '', holdMs: 0 },
  { type: 2, text: "Water moves through pine needles.", holdMs: 7500, theme: 'forest', hapticOnEntry: 'light' },
  { type: 3, text: "One drop at a time.", holdMs: 7000, theme: 'forest' },
  { isEmpty: true, emptyDurationMs: 2000, type: 2, text: '', holdMs: 0 },
  { type: 1, text: "A bird tests its voice.", holdMs: 7000, theme: 'forest' },
  { type: 2, text: "The ground is dark and soft.", holdMs: 7500, theme: 'forest', hapticOnEntry: 'light' },
  { isEmpty: true, emptyDurationMs: 2500, type: 2, text: '', holdMs: 0 },
  { type: 4, text: "Something in you slows to match the trees.", holdMs: 9000, theme: 'forest' },
  { isEmpty: true, emptyDurationMs: 2000, type: 2, text: '', holdMs: 0 },
  { type: 2, text: "The air smells like the beginning of things.", holdMs: 8000, theme: 'forest' },
  { type: 3, text: "Stay here a little longer.", holdMs: 8000, theme: 'forest' },
  { isEmpty: true, emptyDurationMs: 3000, type: 2, text: '', holdMs: 0 },
  { type: 1, text: "The forest holds no rush.", holdMs: 8500, theme: 'forest' },
  { type: 2, text: "Neither do you.", holdMs: 9000, theme: 'forest' },
];

export const FOREST_AFTER_RAIN_AMBIENT = 'forest' as const;
