// components/session/NowPlayingBar.tsx
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAppStore } from '../../store/appStore';
import { useSessionStore } from '../../store/sessionStore';
import { useTheme } from '../../hooks/useTheme';
import { formatTime } from '../../utils/timeUtils';

const SESSION_ROUTES: Record<string, string> = {
  breathing: '/(sessions)/breathing/session',
  pomodoro:  '/(sessions)/pomodoro/session',
  meditation:'/(sessions)/meditation/session',
  focus:     '/(sessions)/focus/session',
};

const SESSION_ICONS: Record<string, string> = {
  breathing: '🌬️',
  pomodoro:  '⏱️',
  meditation:'🧘',
  focus:     '✨',
};

export default function NowPlayingBar() {
  const isSessionActive = useAppStore((s) => s.isSessionActive);
  const activeMode      = useSessionStore((s) => s.activeMode);
  const secondsRemaining= useSessionStore((s) => s.secondsRemaining);
  const theme = useTheme();

  if (!isSessionActive || !activeMode) return null;

  return (
    <TouchableOpacity
      style={[styles.bar, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
      onPress={() => {
        const route = SESSION_ROUTES[activeMode];
        if (route) router.push(route as any);
      }}
      activeOpacity={0.85}
    >
      <Text style={{ fontSize: 18 }}>{SESSION_ICONS[activeMode] ?? '🌿'}</Text>
      <Text style={[styles.label, { color: theme.text }]}>
        {activeMode.charAt(0).toUpperCase() + activeMode.slice(1)} in progress
      </Text>
      <Text style={[styles.time, { color: theme.primary }]}>
        {formatTime(secondsRemaining)}
      </Text>
      <Text style={{ color: theme.textMuted, fontSize: 16, marginLeft: 4 }}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderRadius: 0,
  },
  label: { flex: 1, fontSize: 14, fontFamily: 'DMSans-Regular' },
  time:  { fontSize: 14, fontFamily: 'DMSans-Medium' },
});
