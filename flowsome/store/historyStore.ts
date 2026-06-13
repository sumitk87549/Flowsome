// store/historyStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SessionRecord {
  id: string;                    // unique: timestamp string
  completedAt: string;           // ISO date string
  type: 'breathing' | 'meditation' | 'focus' | 'pomodoro';
  durationMinutes: number;
  theme: string;                 // e.g. 'rajasthan'
  practiceId: string | null;     // e.g. 'box-breathing', 'mindfulness'
  intention: string | null;
  moodBefore: number | null;     // 1–5
  moodAfter: number | null;      // 1–5
  accomplishmentNote: string | null;
}

interface HistoryState {
  sessions: SessionRecord[];
  earnedBadgeIds: string[];

  addSession: (record: Omit<SessionRecord, 'id' | 'completedAt'>) => void;
  awardBadge: (badgeId: string) => void;

  getStreak: () => number;
  getTotalSessions: () => number;
  getTotalMinutes: () => number;
  getMalaProgress: () => number;  // 0–107
  getSessionsForTheme: (theme: string) => number;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      sessions: [],
      earnedBadgeIds: [],

      addSession: (record) => {
        const newRecord: SessionRecord = {
          ...record,
          id: Date.now().toString(),
          completedAt: new Date().toISOString(),
        };
        set((s) => ({ sessions: [newRecord, ...s.sessions] }));
      },

      awardBadge: (badgeId) => {
        const already = get().earnedBadgeIds.includes(badgeId);
        if (!already) {
          set((s) => ({ earnedBadgeIds: [...s.earnedBadgeIds, badgeId] }));
        }
      },

      getStreak: () => {
        const { sessions } = get();
        if (sessions.length === 0) return 0;

        const days = new Set(
          sessions.map((s) => s.completedAt.substring(0, 10)) // YYYY-MM-DD
        );
        const sortedDays = Array.from(days).sort().reverse();

        const today = new Date().toISOString().substring(0, 10);
        const yesterday = new Date(Date.now() - 86400000).toISOString().substring(0, 10);

        if (sortedDays[0] !== today && sortedDays[0] !== yesterday) return 0;

        let streak = 0;
        let checkDate = new Date(sortedDays[0]);

        for (const day of sortedDays) {
          const dayDate = new Date(day);
          const diffMs = checkDate.getTime() - dayDate.getTime();
          const diffDays = Math.round(diffMs / 86400000);
          if (diffDays > 1) break;
          streak++;
          checkDate = dayDate;
        }
        return streak;
      },

      getTotalSessions: () => get().sessions.length,
      getTotalMinutes: () => get().sessions.reduce((sum, s) => sum + s.durationMinutes, 0),
      getMalaProgress: () => get().sessions.length % 108,
      getSessionsForTheme: (theme) =>
        get().sessions.filter((s) => s.theme === theme).length,
    }),
    {
      name: 'flowsome:history',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
