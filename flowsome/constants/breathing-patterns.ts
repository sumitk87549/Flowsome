// constants/breathing-patterns.ts

export interface BreathingPhase {
  name: 'inhale' | 'holdIn' | 'exhale' | 'holdOut';
  nameHindi: string;
  nameEnglish: string;
  durationSeconds: number;
}

export interface BreathingPattern {
  id: string;
  name: string;
  nameHindi: string;
  description: string;
  descriptionHindi: string;
  cycles: number;
  phases: BreathingPhase[];
  recommendedFor: string;
}

export const BREATHING_PATTERNS: BreathingPattern[] = [
  {
    id: 'box-breathing',
    name: 'Box Breathing',
    nameHindi: 'बॉक्स श्वास',
    description: 'Equal counts in all four phases. Used by Navy SEALs for stress control.',
    descriptionHindi: 'चारों चरणों में समान समय। तनाव नियंत्रण के लिए उत्तम।',
    cycles: 8,
    recommendedFor: 'Stress, Anxiety, Focus',
    phases: [
      { name: 'inhale',  nameHindi: 'श्वास लें',    nameEnglish: 'Inhale',  durationSeconds: 4 },
      { name: 'holdIn',  nameHindi: 'रोकें',        nameEnglish: 'Hold',    durationSeconds: 4 },
      { name: 'exhale',  nameHindi: 'श्वास छोड़ें', nameEnglish: 'Exhale',  durationSeconds: 4 },
      { name: 'holdOut', nameHindi: 'रुकें',        nameEnglish: 'Rest',    durationSeconds: 4 },
    ],
  },
  {
    id: '4-7-8',
    name: '4-7-8 Breathing',
    nameHindi: '4-7-8 श्वास',
    description: "Dr. Weil's relaxation technique. Activates parasympathetic nervous system.",
    descriptionHindi: 'विश्राम और नींद के लिए आदर्श। तंत्रिका तंत्र को शांत करता है।',
    cycles: 4,
    recommendedFor: 'Sleep, Deep Relaxation',
    phases: [
      { name: 'inhale',  nameHindi: 'श्वास लें',    nameEnglish: 'Inhale',  durationSeconds: 4 },
      { name: 'holdIn',  nameHindi: 'रोकें',        nameEnglish: 'Hold',    durationSeconds: 7 },
      { name: 'exhale',  nameHindi: 'श्वास छोड़ें', nameEnglish: 'Exhale',  durationSeconds: 8 },
      { name: 'holdOut', nameHindi: '',             nameEnglish: '',        durationSeconds: 0 },
    ],
  },
  {
    id: 'nadi-shodhana',
    name: 'Nadi Shodhana',
    nameHindi: 'नाड़ी शोधन',
    description: 'Alternate nostril breathing from Ayurveda. Balances left/right brain hemispheres.',
    descriptionHindi: 'आयुर्वेदिक अनुलोम-विलोम। मन को संतुलित करता है।',
    cycles: 12,
    recommendedFor: 'Meditation, Balance',
    phases: [
      { name: 'inhale',  nameHindi: 'बायीं ओर से श्वास लें', nameEnglish: 'Inhale left',  durationSeconds: 5 },
      { name: 'holdIn',  nameHindi: 'रोकें',                 nameEnglish: 'Hold',          durationSeconds: 5 },
      { name: 'exhale',  nameHindi: 'दायीं ओर से छोड़ें',    nameEnglish: 'Exhale right', durationSeconds: 5 },
      { name: 'holdOut', nameHindi: '',                      nameEnglish: '',             durationSeconds: 0 },
    ],
  },
  {
    id: 'coherent',
    name: 'Coherent Breathing',
    nameHindi: 'सुसंगत श्वास',
    description: '5-5 resonant breathing. Maximizes heart rate variability (HRV).',
    descriptionHindi: 'हृदय गति परिवर्तनशीलता बढ़ाता है। तनाव कम करता है।',
    cycles: 10,
    recommendedFor: 'Calm, HRV, Recovery',
    phases: [
      { name: 'inhale',  nameHindi: 'श्वास लें',    nameEnglish: 'Inhale',  durationSeconds: 5 },
      { name: 'holdIn',  nameHindi: '',             nameEnglish: '',        durationSeconds: 0 },
      { name: 'exhale',  nameHindi: 'श्वास छोड़ें', nameEnglish: 'Exhale',  durationSeconds: 5 },
      { name: 'holdOut', nameHindi: '',             nameEnglish: '',        durationSeconds: 0 },
    ],
  },
];
