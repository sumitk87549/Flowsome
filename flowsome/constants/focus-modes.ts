// constants/focus-modes.ts

export interface FocusConfig {
  id: string;
  name: string;
  nameHindi: string;
  description: string;
  defaultWorkMinutes: number;
  defaultBreakMinutes: number;
  binauralMode: 'alpha' | 'theta';
  promptEn: string;
  promptHi: string;
}

export const FOCUS_MODES: FocusConfig[] = [
  {
    id: 'deep-work',
    name: 'Deep Work',
    nameHindi: 'गहरा कार्य',
    description: "Cal Newport's protocol. Long, distraction-free work blocks.",
    defaultWorkMinutes: 90,
    defaultBreakMinutes: 20,
    binauralMode: 'alpha',
    promptEn: 'What will you accomplish in this deep work session?',
    promptHi: 'इस गहरे कार्य सत्र में आप क्या हासिल करेंगे?',
  },
  {
    id: 'pomodoro-focus',
    name: 'Pomodoro Focus',
    nameHindi: 'पोमोडोरो फोकस',
    description: 'Classic 25-5 pomodoro. Sprint, rest, repeat.',
    defaultWorkMinutes: 25,
    defaultBreakMinutes: 5,
    binauralMode: 'alpha',
    promptEn: 'One task only. What are you focusing on right now?',
    promptHi: 'केवल एक काम। अभी आप किस पर ध्यान दे रहे हैं?',
  },
  {
    id: 'creative-flow',
    name: 'Creative Flow',
    nameHindi: 'रचनात्मक प्रवाह',
    description: 'Open-ended creative sessions with ambient support.',
    defaultWorkMinutes: 45,
    defaultBreakMinutes: 10,
    binauralMode: 'theta',
    promptEn: 'What are you creating today?',
    promptHi: 'आज आप क्या बना रहे हैं?',
  },
];
