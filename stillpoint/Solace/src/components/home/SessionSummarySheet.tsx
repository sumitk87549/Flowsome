import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { useSession } from '@/context/SessionContext';
import { COLORS } from '@/constants/colors';
import { FONT, FS, TRACKING } from '@/constants/typography';
import { TIMING } from '@/constants/timing';

const SCREEN_HEIGHT = Dimensions.get('screen').height;
const SHEET_TOP = SCREEN_HEIGHT * 0.38; // sheet rests at 62% from top = 38% from top
const SPRING_CONFIG = {
  stiffness: TIMING.SHEET_SPRING_STIFFNESS,
  damping: TIMING.SHEET_SPRING_DAMPING,
  mass: TIMING.SHEET_SPRING_MASS,
};

// Drift periods for watermark words (in ms)
const DRIFT_PERIODS = [11000, 13000, 15000, 12000];

interface WatermarkWordProps {
  word: string;
  index: number;
}

function WatermarkWord({ word, index }: WatermarkWordProps) {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);
  const period = DRIFT_PERIODS[index] ?? 11000;

  useEffect(() => {
    opacity.value = withDelay(index * 200, withTiming(1, { duration: 600 }));
    translateX.value = withRepeat(
      withSequence(
        withTiming(7, { duration: period / 2 }),
        withTiming(-7, { duration: period / 2 })
      ),
      -1,
      false // Never use reverse mode
    );
  }, [index, opacity, period, translateX]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value * 0.06,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.Text style={[styles.watermarkWord, style]}>
      {word}
    </Animated.Text>
  );
}

interface SessionSummarySheetProps {
  isOpen: boolean;
  onClose: () => void;
}

function formatTodayDate(): string {
  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`;
}

export default function SessionSummarySheet({ isOpen, onClose }: SessionSummarySheetProps) {
  const { sessionsCompletedToday, totalMinutesToday, streak, intentionWordsToday } = useSession();
  const translateY = useSharedValue(SCREEN_HEIGHT);

  useEffect(() => {
    if (isOpen) {
      translateY.value = withSpring(SHEET_TOP, SPRING_CONFIG);
    } else {
      translateY.value = withSpring(SCREEN_HEIGHT, SPRING_CONFIG);
    }
  }, [isOpen, translateY]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Show only up to 4 intention words
  const displayWords = intentionWordsToday.slice(-4);

  return (
    <>
      {/* Backdrop — tap to close */}
      {isOpen && (
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      )}

      <Animated.View style={[styles.sheet, sheetStyle]}>
        {/* Handle */}
        <View style={styles.handle} />

        {/* Date */}
        <Text style={styles.dateText}>{formatTodayDate()}</Text>

        {/* Stats */}
        <Text style={styles.statHeadline}>
          {sessionsCompletedToday === 0
            ? 'No sessions yet today'
            : `${sessionsCompletedToday} session${sessionsCompletedToday === 1 ? '' : 's'} completed`}
        </Text>

        <Text style={styles.statSecondary}>
          {totalMinutesToday > 0 ? `${totalMinutesToday} minutes of focus` : ''}
        </Text>

        <Text style={styles.streakText}>
          {streak > 0 ? `${streak} day streak` : 'Start your streak today'}
        </Text>

        {/* Intention word watermarks */}
        {displayWords.length > 0 && (
          <View style={styles.watermarkContainer}>
            {displayWords.map((word, i) => (
              <WatermarkWord key={`${word}-${i}`} word={word} index={i} />
            ))}
          </View>
        )}
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: COLORS.restSlate,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 28,
    paddingTop: 16,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.creamGhost,
    alignSelf: 'center',
    marginBottom: 32,
  },
  dateText: {
    fontFamily: FONT.light,
    fontSize: FS.sm,
    color: COLORS.creamFaint,
    letterSpacing: TRACKING.base,
    marginBottom: 24,
  },
  statHeadline: {
    fontFamily: FONT.thin,
    fontSize: 28,
    color: COLORS.cream,
    letterSpacing: TRACKING.tight,
    marginBottom: 8,
  },
  statSecondary: {
    fontFamily: FONT.light,
    fontSize: FS.body,
    color: COLORS.creamFaint,
    marginBottom: 6,
  },
  streakText: {
    fontFamily: FONT.light,
    fontSize: FS.md,
    color: COLORS.amber,
    letterSpacing: TRACKING.tight,
    marginBottom: 40,
  },
  watermarkContainer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 8,
  },
  watermarkWord: {
    fontFamily: FONT.thin,
    fontSize: 52,
    color: COLORS.cream,
    letterSpacing: TRACKING.widest,
    textTransform: 'uppercase',
  },
});
