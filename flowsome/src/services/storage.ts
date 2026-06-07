import { createMMKV } from 'react-native-mmkv';
import { AppLanguage, SceneId, SettingsState, ThemeMode } from '../types';

const storage = createMMKV({ id: 'flowsome.preferences' });

const KEYS = {
  sceneId: 'scene.id',
  uiLanguage: 'settings.uiLanguage',
  sessionLanguage: 'settings.sessionLanguage',
  themeMode: 'settings.themeMode',
};

const languageValues: AppLanguage[] = ['en', 'hi', 'bn', 'ta', 'te'];
const themeModeValues: ThemeMode[] = ['auto', 'light', 'dark'];
const sceneValues: SceneId[] = ['rajasthan', 'kerala', 'assam', 'himalaya', 'andaman'];

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
  return asSceneId(storage.getString(KEYS.sceneId), fallback);
}

export function saveSceneId(sceneId: SceneId): void {
  storage.set(KEYS.sceneId, sceneId);
}

export function loadSettings(fallback: SettingsState): SettingsState {
  return {
    uiLanguage: asLanguage(storage.getString(KEYS.uiLanguage), fallback.uiLanguage),
    sessionLanguage: asLanguage(storage.getString(KEYS.sessionLanguage), fallback.sessionLanguage),
    themeMode: asThemeMode(storage.getString(KEYS.themeMode), fallback.themeMode),
  };
}

export function saveSettings(settings: SettingsState): void {
  storage.set(KEYS.uiLanguage, settings.uiLanguage);
  storage.set(KEYS.sessionLanguage, settings.sessionLanguage);
  storage.set(KEYS.themeMode, settings.themeMode);
}
