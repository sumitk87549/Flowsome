// utils/greetingUtils.ts
export interface GreetingResult {
  line: string;
  lineHindi: string;
}

interface GreetingEntry {
  hours: [number, number]; // from (inclusive), to (exclusive)
  line: string;
  lineHindi: string;
}

const GREETINGS: GreetingEntry[] = [
  { hours: [5, 9],   line: 'Brahma muhurta — the creator\'s hour.',    lineHindi: 'ब्रह्म मुहूर्त — सृष्टिकर्ता का समय।' },
  { hours: [9, 12],  line: 'Morning flow awaits.',                     lineHindi: 'प्रातः प्रवाह आपकी प्रतीक्षा में है।' },
  { hours: [12, 15], line: 'Midday reset. 5 minutes now saves hours.', lineHindi: 'मध्याह्न विश्राम। पाँच मिनट काफी हैं।' },
  { hours: [15, 18], line: 'Afternoon energy. A breath is enough.',    lineHindi: 'अपराह्न ऊर्जा। एक साँस पर्याप्त है।' },
  { hours: [18, 21], line: 'Golden hour. Sandhyavandanam time.',       lineHindi: 'सुनहरा समय। संध्यावंदन का वक्त।' },
  { hours: [21, 29], line: 'Let the day dissolve.',                    lineHindi: 'दिन को विसर्जित होने दें।' }, // 21–28 covers 9pm–4am
];

export function getTimeGreeting(streakDays = 0): GreetingResult {
  const hour = new Date().getHours();
  const normalizedHour = hour < 5 ? hour + 24 : hour;

  const entry = GREETINGS.find(
    (g) => normalizedHour >= g.hours[0] && normalizedHour < g.hours[1],
  ) ?? GREETINGS[GREETINGS.length - 1];

  const streakSuffix = streakDays > 0 ? ` · Day ${streakDays} 🪔` : '';
  return {
    line: entry.line + streakSuffix,
    lineHindi: entry.lineHindi,
  };
}
