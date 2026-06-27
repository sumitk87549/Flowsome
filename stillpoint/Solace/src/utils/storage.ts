import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  SETTINGS: 'solace:settings',
  SESSIONS_TODAY: 'solace:sessionsToday',
  TOTAL_MINS_TODAY: 'solace:totalMinsToday',
  INTENTION_WORDS: 'solace:intentionWords',
  LAST_SESSION_DATE: 'solace:lastSessionDate',
  STREAK: 'solace:streak',
  REST_MODE_QUEUE: 'solace:restModeQueue',
} as const;

export async function readJson<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`[storage] readJson failed for key "${key}":`, e);
    return null;
  }
}

export async function writeJson<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`[storage] writeJson failed for key "${key}":`, e);
  }
}

export async function removeKey(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error(`[storage] removeKey failed for key "${key}":`, e);
  }
}
