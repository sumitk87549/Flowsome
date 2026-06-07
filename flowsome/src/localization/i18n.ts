import { AppLanguage, SessionMode, SessionPhase, ThemeMode } from '../types';

export const LANGUAGES: { code: AppLanguage; label: string; nativeLabel: string }[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
];

export const THEME_MODE_LABELS: Record<ThemeMode, string> = {
  auto: 'Auto',
  light: 'Light',
  dark: 'Dark',
};

type TranslationKey =
  | 'home.findYourFlow'
  | 'home.activeScene'
  | 'themes.title'
  | 'themes.subtitle'
  | 'themes.hint'
  | 'settings.title'
  | 'settings.appearance'
  | 'settings.interfaceLanguage'
  | 'settings.sessionLanguage'
  | 'settings.interfaceHint'
  | 'settings.sessionHint'
  | 'settings.about'
  | 'settings.version'
  | 'settings.builtWith'
  | 'settings.themeMode'
  | 'settings.themeModeHint'
  | 'nav.home'
  | 'nav.themes'
  | 'nav.settings'
  | 'session.end'
  | 'session.pause'
  | 'session.resume'
  | 'session.paused'
  | 'scene.choose'
  | 'ambient.ready';

const STRINGS: Record<AppLanguage, Record<TranslationKey, string>> = {
  en: {
    'home.findYourFlow': 'Find your flow',
    'home.activeScene': 'Active Scene',
    'themes.title': 'Scenes',
    'themes.subtitle': "India's landscapes",
    'themes.hint': 'Choose a destination. The atmosphere changes with you.',
    'settings.title': 'Settings',
    'settings.appearance': 'Appearance',
    'settings.interfaceLanguage': 'Interface Language',
    'settings.sessionLanguage': 'Session Language',
    'settings.interfaceHint': 'Changes every on-screen label immediately',
    'settings.sessionHint': 'Stored separately for future voice guidance',
    'settings.about': 'About',
    'settings.version': 'Version',
    'settings.builtWith': 'Built with',
    'settings.themeMode': 'Theme',
    'settings.themeModeHint': 'Auto follows your device setting',
    'nav.home': 'Home',
    'nav.themes': 'Scenes',
    'nav.settings': 'Settings',
    'session.end': 'End',
    'session.pause': 'Pause',
    'session.resume': 'Resume',
    'session.paused': 'paused',
    'scene.choose': 'Selected',
    'ambient.ready': 'Ambient ready',
  },
  hi: {
    'home.findYourFlow': 'अपना प्रवाह खोजें',
    'home.activeScene': 'सक्रिय दृश्य',
    'themes.title': 'दृश्य',
    'themes.subtitle': 'भारत के परिदृश्य',
    'themes.hint': 'एक स्थान चुनें। वातावरण आपके साथ बदलता है।',
    'settings.title': 'सेटिंग्स',
    'settings.appearance': 'रूप',
    'settings.interfaceLanguage': 'इंटरफ़ेस भाषा',
    'settings.sessionLanguage': 'सत्र भाषा',
    'settings.interfaceHint': 'स्क्रीन के सभी लेबल तुरंत बदलता है',
    'settings.sessionHint': 'भविष्य की आवाज़ के लिए अलग से सुरक्षित',
    'settings.about': 'परिचय',
    'settings.version': 'संस्करण',
    'settings.builtWith': 'बनाया गया',
    'settings.themeMode': 'थीम',
    'settings.themeModeHint': 'ऑटो डिवाइस सेटिंग का पालन करता है',
    'nav.home': 'घर',
    'nav.themes': 'दृश्य',
    'nav.settings': 'सेटिंग्स',
    'session.end': 'समाप्त',
    'session.pause': 'विराम',
    'session.resume': 'जारी',
    'session.paused': 'रुका हुआ',
    'scene.choose': 'चुना गया',
    'ambient.ready': 'ध्वनि तैयार',
  },
  bn: {
    'home.findYourFlow': 'নিজের প্রবাহ খুঁজুন',
    'home.activeScene': 'সক্রিয় দৃশ্য',
    'themes.title': 'দৃশ্য',
    'themes.subtitle': 'ভারতের প্রকৃতি',
    'themes.hint': 'একটি গন্তব্য বেছে নিন। পরিবেশ আপনার সঙ্গে বদলায়।',
    'settings.title': 'সেটিংস',
    'settings.appearance': 'চেহারা',
    'settings.interfaceLanguage': 'ইন্টারফেস ভাষা',
    'settings.sessionLanguage': 'সেশন ভাষা',
    'settings.interfaceHint': 'সব অন-স্ক্রিন লেবেল সঙ্গে সঙ্গে বদলায়',
    'settings.sessionHint': 'ভবিষ্যৎ ভয়েস নির্দেশনার জন্য আলাদা সঞ্চিত',
    'settings.about': 'সম্পর্কে',
    'settings.version': 'সংস্করণ',
    'settings.builtWith': 'তৈরি হয়েছে',
    'settings.themeMode': 'থিম',
    'settings.themeModeHint': 'অটো ডিভাইস সেটিং অনুসরণ করে',
    'nav.home': 'হোম',
    'nav.themes': 'দৃশ্য',
    'nav.settings': 'সেটিংস',
    'session.end': 'শেষ',
    'session.pause': 'বিরতি',
    'session.resume': 'চালু',
    'session.paused': 'বিরতি',
    'scene.choose': 'নির্বাচিত',
    'ambient.ready': 'আবহ প্রস্তুত',
  },
  ta: {
    'home.findYourFlow': 'உங்கள் ஓட்டத்தை கண்டுபிடிக்கவும்',
    'home.activeScene': 'செயலில் உள்ள காட்சி',
    'themes.title': 'காட்சிகள்',
    'themes.subtitle': 'இந்திய இயற்கை நிலங்கள்',
    'themes.hint': 'ஒரு இடத்தைத் தேர்ந்தெடுக்கவும். சூழல் உங்களுடன் மாறும்.',
    'settings.title': 'அமைப்புகள்',
    'settings.appearance': 'தோற்றம்',
    'settings.interfaceLanguage': 'இடைமுக மொழி',
    'settings.sessionLanguage': 'அமர்வு மொழி',
    'settings.interfaceHint': 'திரையில் உள்ள லேபிள்கள் உடனே மாறும்',
    'settings.sessionHint': 'எதிர்கால குரல் வழிகாட்டலுக்காக தனியாக சேமிக்கப்படும்',
    'settings.about': 'பற்றி',
    'settings.version': 'பதிப்பு',
    'settings.builtWith': 'உருவாக்கப்பட்டது',
    'settings.themeMode': 'தீம்',
    'settings.themeModeHint': 'ஆட்டோ சாதன அமைப்பை பின்பற்றும்',
    'nav.home': 'முகப்பு',
    'nav.themes': 'காட்சிகள்',
    'nav.settings': 'அமைப்புகள்',
    'session.end': 'முடி',
    'session.pause': 'இடைநிறுத்து',
    'session.resume': 'தொடர்',
    'session.paused': 'இடைநிறுத்தம்',
    'scene.choose': 'தேர்ந்தது',
    'ambient.ready': 'சூழல் தயாராக உள்ளது',
  },
  te: {
    'home.findYourFlow': 'మీ ప్రవాహాన్ని కనుగొనండి',
    'home.activeScene': 'సక్రియ దృశ్యం',
    'themes.title': 'దృశ్యాలు',
    'themes.subtitle': 'భారత ప్రకృతి దృశ్యాలు',
    'themes.hint': 'ఒక గమ్యాన్ని ఎంచుకోండి. వాతావరణం మీతో మారుతుంది.',
    'settings.title': 'సెట్టింగులు',
    'settings.appearance': 'రూపం',
    'settings.interfaceLanguage': 'ఇంటర్ఫేస్ భాష',
    'settings.sessionLanguage': 'సెషన్ భాష',
    'settings.interfaceHint': 'స్క్రీన్ లేబుళ్లు వెంటనే మారుతాయి',
    'settings.sessionHint': 'భవిష్యత్తు వాయిస్ మార్గదర్శకానికి వేరుగా నిల్వ అవుతుంది',
    'settings.about': 'గురించి',
    'settings.version': 'వెర్షన్',
    'settings.builtWith': 'నిర్మించబడింది',
    'settings.themeMode': 'థీమ్',
    'settings.themeModeHint': 'ఆటో పరికర సెట్టింగ్‌ను అనుసరిస్తుంది',
    'nav.home': 'హోమ్',
    'nav.themes': 'దృశ్యాలు',
    'nav.settings': 'సెట్టింగులు',
    'session.end': 'ముగించు',
    'session.pause': 'విరామం',
    'session.resume': 'కొనసాగించు',
    'session.paused': 'విరామం',
    'scene.choose': 'ఎంచుకున్నది',
    'ambient.ready': 'వాతావరణం సిద్ధం',
  },
};

export const SESSION_LABELS_I18N: Record<AppLanguage, Record<SessionMode, string>> = {
  en: { pomodoro: 'Pomodoro', focus: 'Focus', breathing: 'Breathing', meditation: 'Meditation' },
  hi: { pomodoro: 'पोमोडोरो', focus: 'ध्यान', breathing: 'श्वास', meditation: 'ध्यान साधना' },
  bn: { pomodoro: 'পোমোডোরো', focus: 'মনোযোগ', breathing: 'শ্বাস', meditation: 'ধ্যান' },
  ta: { pomodoro: 'பொமோடோரோ', focus: 'கவனம்', breathing: 'மூச்சு', meditation: 'தியானம்' },
  te: { pomodoro: 'పొమోడోరో', focus: 'దృష్టి', breathing: 'శ్వాస', meditation: 'ధ్యానం' },
};

export const PHASE_LABELS_I18N: Record<AppLanguage, Partial<Record<SessionPhase, string>>> = {
  en: { work: 'Focus', short_break: 'Rest', active: 'Meditate', inhale: 'Inhale', hold: 'Hold', exhale: 'Exhale', rest: 'Rest' },
  hi: { work: 'ध्यान', short_break: 'विश्राम', active: 'ध्यान', inhale: 'श्वास लें', hold: 'ठहरें', exhale: 'श्वास छोड़ें', rest: 'विश्राम' },
  bn: { work: 'মনোযোগ', short_break: 'বিশ্রাম', active: 'ধ্যান', inhale: 'শ্বাস নিন', hold: 'ধরুন', exhale: 'শ্বাস ছাড়ুন', rest: 'বিশ্রাম' },
  ta: { work: 'கவனம்', short_break: 'ஓய்வு', active: 'தியானம்', inhale: 'உள்ளிழுக்கவும்', hold: 'நிறுத்தவும்', exhale: 'வெளியேற்றவும்', rest: 'ஓய்வு' },
  te: { work: 'దృష్టి', short_break: 'విశ్రాంతి', active: 'ధ్యానం', inhale: 'లోనికి శ్వాస', hold: 'ఆపండి', exhale: 'బయటకు శ్వాస', rest: 'విశ్రాంతి' },
};

export function t(language: AppLanguage, key: TranslationKey): string {
  return STRINGS[language]?.[key] ?? STRINGS.en[key];
}

export function sessionLabel(language: AppLanguage, mode: SessionMode): string {
  return SESSION_LABELS_I18N[language]?.[mode] ?? SESSION_LABELS_I18N.en[mode];
}

export function phaseLabel(language: AppLanguage, phase: SessionPhase, fallback: string): string {
  return PHASE_LABELS_I18N[language]?.[phase] ?? fallback;
}
