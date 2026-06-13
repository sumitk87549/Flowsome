// utils/achievementUtils.ts
import { ACHIEVEMENTS } from '../constants/achievements';
import type { AchievementStats } from '../constants/achievements';
import { useHistoryStore } from '../store/historyStore';

export function computeAchievementStats(): AchievementStats {
  const store = useHistoryStore.getState();
  const { sessions } = store;

  const sessionsByTheme: Record<string, number> = {};
  const sessionsByType: Record<string, number> = {};
  let morningCount = 0;
  let nightCount = 0;

  for (const session of sessions) {
    sessionsByTheme[session.theme] = (sessionsByTheme[session.theme] ?? 0) + 1;
    sessionsByType[session.type] = (sessionsByType[session.type] ?? 0) + 1;
    const hour = new Date(session.completedAt).getHours();
    if (hour < 7) morningCount++;
    if (hour >= 22) nightCount++;
  }

  const hasCompletedDeepWork90 = sessions.some(
    (s) => s.type === 'focus' && s.durationMinutes >= 90
  );
  const hasCompletedMeditation30 = sessions.some(
    (s) => s.type === 'meditation' && s.durationMinutes >= 30
  );

  return {
    totalSessions: sessions.length,
    streak: store.getStreak(),
    sessionsByTheme,
    sessionsByType,
    totalMinutes: store.getTotalMinutes(),
    hasCompletedDeepWork90,
    hasCompletedMeditation30,
    morningSessionCount: morningCount,
    nightSessionCount: nightCount,
    breathingSessions: sessionsByType['breathing'] ?? 0,
  };
}

export function checkAndAwardBadges(
  awardBadge: (id: string) => void,
  showToast: (badge: typeof ACHIEVEMENTS[0]) => void,
): void {
  const { earnedBadgeIds } = useHistoryStore.getState();
  const stats = computeAchievementStats();

  for (const achievement of ACHIEVEMENTS) {
    if (earnedBadgeIds.includes(achievement.id)) continue;
    if (achievement.checkCondition(stats)) {
      awardBadge(achievement.id);
      showToast(achievement);
    }
  }
}
