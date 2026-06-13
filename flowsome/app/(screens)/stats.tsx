// app/(screens)/stats.tsx — Premium: Visual Overhaul
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useHistoryStore } from '../../store/historyStore';
import { SafeScreen } from '../../components/ui/SafeScreen';
import HeatmapCalendar from '../../components/stats/HeatmapCalendar';
import { hapticLight } from '../../utils/hapticUtils';

export default function StatsScreen() {
  const theme = useTheme();
  const store = useHistoryStore();

  const totalSessions = store.getTotalSessions();
  const totalMinutes = store.getTotalMinutes();
  const streak = store.getStreak();
  const malaProgress = store.getMalaProgress();

  // Compute favourite theme
  const themeCountMap: Record<string, number> = {};
  for (const s of store.sessions) {
    themeCountMap[s.theme] = (themeCountMap[s.theme] ?? 0) + 1;
  }
  const favoriteTheme =
    Object.entries(themeCountMap).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

  const textShadow = {
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  };

  return (
    <SafeScreen>
      <LinearGradient
        colors={['rgba(0,0,0,0.65)', 'rgba(0,0,0,0.30)', 'rgba(0,0,0,0.55)']}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.container, { paddingBottom: 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              hapticLight();
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/');
              }
            }}
            style={styles.backBtn}
          >
            <Ionicons name="chevron-back" size={20} color={theme.textMuted} />
          </TouchableOpacity>
          <Text style={{
            fontFamily: 'CormorantGaramond-SemiBold',
            fontSize: 24,
            color: theme.primary,
            letterSpacing: 1,
            ...textShadow,
          }}>
            Your Practice
          </Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Summary stats row */}
        <View style={styles.statsRow}>
          <StatBox label="Sessions" value={totalSessions.toString()} theme={theme} />
          <StatBox label="Minutes" value={totalMinutes.toString()} theme={theme} />
          <StatBox label="Streak" value={`${streak}d`} theme={theme} />
          <StatBox label="Favourite" value={favoriteTheme.charAt(0).toUpperCase() + favoriteTheme.slice(1)} theme={theme} />
        </View>

        {/* Heatmap section */}
        <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>
          365 DAYS
        </Text>
        <HeatmapCalendar sessions={store.sessions} theme={theme} />

        {/* Mala progress section */}
        <Text
          style={[styles.sectionLabel, { color: theme.textMuted, marginTop: 24 }]}
        >
          MALA PROGRESS — BEAD {malaProgress}/108
        </Text>
        <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 4, fontFamily: 'DMSans-Regular' }}>
          {108 - malaProgress} sessions until next mala completes
        </Text>
      </ScrollView>
    </SafeScreen>
  );
}

interface StatBoxProps {
  label: string;
  value: string;
  theme: { text: string; textMuted: string };
}

function StatBox({ label, value, theme }: StatBoxProps) {
  return (
    <View style={styles.statBox}>
      <Text
        style={{
          color: '#FFFFFF',
          fontSize: 22,
          fontFamily: 'CormorantGaramond-Medium',
          textShadowColor: 'rgba(0,0,0,0.5)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 4,
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: 10,
          marginTop: 4,
          letterSpacing: 1,
          fontFamily: 'DMSans-Regular',
        }}
      >
        {label.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(0,0,0,0.42)',
    borderRadius: 20,
    marginBottom: 24,
    overflow: 'hidden',
  },
  statBox: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 2,
    fontFamily: 'DMSans-Medium',
    marginBottom: 12,
  },
});
