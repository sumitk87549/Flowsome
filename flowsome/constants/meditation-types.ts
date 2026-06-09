// constants/meditation-types.ts

export interface MeditationType {
  id: string;
  name: string;
  nameHindi: string;
  description: string;
  descriptionHindi: string;
  durationMinutes: number[];
  binauralMode: 'theta' | 'delta' | 'alpha';
  ttsIntroEn: string;
  ttsIntroHi: string;
}

export const MEDITATION_TYPES: MeditationType[] = [
  {
    id: 'mindfulness',
    name: 'Mindfulness',
    nameHindi: 'सचेतनता',
    description: 'Present-moment awareness. Anchor to the breath, observe thoughts without judgment.',
    descriptionHindi: 'वर्तमान पल की जागरूकता। श्वास पर ध्यान, विचारों को बिना निर्णय देखें।',
    durationMinutes: [5, 10, 20],
    binauralMode: 'theta',
    ttsIntroEn: 'Close your eyes. Settle into stillness. Bring your full attention to the breath.',
    ttsIntroHi: 'आँखें बंद करें। स्थिरता में बैठें। अपना पूरा ध्यान श्वास पर लाएं।',
  },
  {
    id: 'vipassana',
    name: 'Vipassana',
    nameHindi: 'विपश्यना',
    description: 'Insight meditation. Observe sensations as they arise and pass — impermanence as truth.',
    descriptionHindi: 'अंतर्दृष्टि ध्यान। संवेदनाओं को उठते और गुज़रते देखें।',
    durationMinutes: [10, 20, 30],
    binauralMode: 'theta',
    ttsIntroEn: 'Sit with a straight spine. Begin to observe sensations in the body, from crown to feet.',
    ttsIntroHi: 'सीधी पीठ के साथ बैठें। सिर से पैर तक शरीर की संवेदनाओं को देखना शुरू करें।',
  },
  {
    id: 'yoga-nidra',
    name: 'Yoga Nidra',
    nameHindi: 'योग निद्रा',
    description: 'Conscious sleep. Body scan while maintaining awareness at the threshold of sleep.',
    descriptionHindi: 'चेतन नींद। नींद की दहलीज पर सचेत रहते हुए शरीर का अवलोकन।',
    durationMinutes: [20, 30, 45],
    binauralMode: 'delta',
    ttsIntroEn: 'Lie down comfortably. You are about to experience conscious sleep. Stay awake, but allow the body to fully relax.',
    ttsIntroHi: 'आराम से लेट जाएं। आप सचेत नींद का अनुभव करने वाले हैं। जागते रहें, लेकिन शरीर को पूरी तरह आराम करने दें।',
  },
  {
    id: 'trataka',
    name: 'Trataka',
    nameHindi: 'त्राटक',
    description: 'Concentrated gazing. A Hatha Yoga practice that sharpens focus and calms the mind.',
    descriptionHindi: 'एकाग्र दृष्टि। हठ योग का एक अभ्यास जो एकाग्रता बढ़ाता है।',
    durationMinutes: [5, 10, 15],
    binauralMode: 'alpha',
    ttsIntroEn: 'Fix your gaze on a single point. Do not blink. Allow the mind to become utterly still.',
    ttsIntroHi: 'अपनी दृष्टि एक बिंदु पर टिकाएं। पलक न झपकाएं। मन को पूरी तरह शांत होने दें।',
  },
];
