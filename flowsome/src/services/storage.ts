import { AppLanguage, SceneId, SettingsState, ThemeMode } from '../types';

const KEYS = {
  sceneId: 'scene.id',
  uiLanguage: 'settings.uiLanguage',
  sessionLanguage: 'settings.sessionLanguage',
  themeMode: 'settings.themeMode',
};

const languageValues: AppLanguage[] = ['en', 'hi', 'bn', 'ta', 'te'];
const themeModeValues: ThemeMode[] = ['auto', 'light', 'dark'];
const sceneValues: SceneId[] = ['rajasthan', 'kerala', 'assam', 'himalaya', 'andaman'];

const memoryStorage: Partial<Record<keyof typeof KEYS, string>> = {};

function getValue(key: keyof typeof KEYS): string | undefined {
  return memoryStorage[key];
}

function setValue(key: keyof typeof KEYS, value: string): void {
  memoryStorage[key] = value;
}

function asLanguage(value: string | undefined, fallback: AppLanguage): AppLanguage {
  return languageValues.includes(value as AppLanguage) ? (value as AppLanguage) : fallback;
}

function asThemeMode(value: string | undefined, fallback: ThemeMode): ThemeMode {
  return themeModeValues.includes(value as ThemeMode) ? (value as ThemeMode) : fallback;
}

function asSceneId(value: string | undefined, fallback: SceneId): SceneId {
  return sceneValues.includes(value as SceneId) ? (value as SceneId) : fallback;
}

export function loadSceneId(fallback: SceneId): SceneId {
  return asSceneId(getValue('sceneId'), fallback);
}

export function saveSceneId(sceneId: SceneId): void {
  setValue('sceneId', sceneId);
}

export function loadSettings(fallback: SettingsState): SettingsState {
  return {
    uiLanguage: asLanguage(getValue('uiLanguage'), fallback.uiLanguage),
    sessionLanguage: asLanguage(getValue('sessionLanguage'), fallback.sessionLanguage),
    themeMode: asThemeMode(getValue('themeMode'), fallback.themeMode),
  };
}

export function saveSettings(settings: SettingsState): void {
  setValue('uiLanguage', settings.uiLanguage);
  setValue('sessionLanguage', settings.sessionLanguage);
  setValue('themeMode', settings.themeMode);
}
