import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  interpolateColor,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import { useSession } from '@/context/SessionContext';
import { useHaptic } from '@/hooks/useHaptic';
import { useTheme } from '@/design/theme';
import { ThemeToggle } from '@/components/home/ThemeToggle';
import { FONT, FS, TRACKING } from '@/constants/typography';
import { TIMING } from '@/constants/timing';
import { EASE } from '@/constants/easing';
import { LAYOUT } from '@/constants/layout';
import * as Haptics from 'expo-haptics';
import AmbientOrb from '@/components/home/AmbientOrb';
import SessionDots from '@/components/home/SessionDots';
import { SessionSetupSheet } from '@/components/home/SessionSetupSheet';
import { PeacefulBackground } from '@/components/shared/PeacefulBackground';
import { useSettings } from '@/context/SettingsContext';

const TAGLINES = [
  'Work deeply. Return softly.',
  'Rest is part of the work.',
  'A quiet rhythm for focus.',
  'Begin with one intention.',
];

type HomeNavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavProp>();
  const { sessionsCompletedToday, totalMinutesToday } = useSession();
  const { fire } = useHaptic();
  const [sheetOpen, setSheetOpen] = useState(false);
  const navigatingRef = useRef(false);
  const theme = useTheme();
  const { settings } = useSettings();
  
  const [tagline] = useState(() => TAGLINES[Math.floor(Math.random() * TAGLINES.length)]);

  // ── Entry animation shared values ──
  const bgProgress = useSharedValue(0);       // 0 = black, 1 = neutralDark
  const wordmarkOpacity = useSharedValue(0);
  const wordmarkTranslateY = useSharedValue(8);
  const taglineOpacity = useSharedValue(0);
  const beginOpacity = useSharedValue(0);
  const statOpacity = useSharedValue(0);
  const dotsContainerOpacity = useSharedValue(0);

  // ── Begin press / exit animation shared values ──
  const exitProgress = useSharedValue(0);     // 0 = neutralDark, 1 = workBlue

  useEffect(() => {
    // Background fade in
    bgProgress.value = withTiming(1, { duration: TIMING.HOME_BG_FADE });

    // Wordmark fade + rise
    wordmarkOpacity.value = withDelay(
      TIMING.HOME_WORDMARK_DELAY,
      withTiming(1, { duration: TIMING.HOME_WORDMARK_DURATION, easing: EASE.outQuad })
    );
    wordmarkTranslateY.value = withDelay(
      TIMING.HOME_WORDMARK_DELAY,
      withTiming(0, { duration: TIMING.HOME_WORDMARK_DURATION, easing: EASE.outQuad })
    );

    // Tagline
    taglineOpacity.value = withDelay(
      TIMING.HOME_TAGLINE_DELAY,
      withTiming(1, { duration: TIMING.HOME_TAGLINE_DURATION })
    );

    // Dots container
    dotsContainerOpacity.value = withDelay(
      TIMING.HOME_DOT_FIRST_DELAY,
      withTiming(1, { duration: TIMING.HOME_DOT_DURATION })
    );

    // Begin label
    beginOpacity.value = withDelay(
      TIMING.HOME_BEGIN_DELAY,
      withTiming(0.72, { duration: TIMING.HOME_BEGIN_DURATION })
    );

    // Stat line
    statOpacity.value = withDelay(
      TIMING.HOME_STAT_DELAY,
      withTiming(1, { duration: TIMING.HOME_STAT_DURATION })
    );
  }, [
    bgProgress,
    wordmarkOpacity,
    wordmarkTranslateY,
    taglineOpacity,
    dotsContainerOpacity,
    beginOpacity,
    statOpacity,
  ]);

  const bgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      bgProgress.value,
      [0, 1],
      [theme.colors.surface, theme.colors.background]
    ),
  }));

  // Exit: background → workBg driven by exitProgress
  const exitBgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      exitProgress.value,
      [0, 1],
      [theme.colors.background, theme.colors.backgroundDeep]
    ),
  }));

  const wordmarkStyle = useAnimatedStyle(() => ({
    opacity: wordmarkOpacity.value,
    transform: [{ translateY: wordmarkTranslateY.value }],
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
  }));

  const beginStyle = useAnimatedStyle(() => ({
    opacity: beginOpacity.value,
  }));

  const statStyle = useAnimatedStyle(() => ({
    opacity: statOpacity.value,
  }));

  // ── Begin tap handler ──
  function handleBeginPress() {
    if (navigatingRef.current || sheetOpen) return;
    navigatingRef.current = true;

    fire(Haptics.ImpactFeedbackStyle.Light, false);

    // Press feedback: dim then restore
    beginOpacity.value = withTiming(0.38, { duration: TIMING.BEGIN_PRESS_DURATION });
    setTimeout(() => {
      beginOpacity.value = withTiming(0.72, { duration: TIMING.BEGIN_PRESS_DURATION });
    }, TIMING.BEGIN_PRESS_DURATION);

    // Fade out content
    setTimeout(() => {
      wordmarkOpacity.value = withTiming(0, { duration: TIMING.BEGIN_FADE_OUT_DURATION });
      taglineOpacity.value = withTiming(0, { duration: TIMING.BEGIN_FADE_OUT_DURATION });
      beginOpacity.value = withTiming(0, { duration: TIMING.BEGIN_FADE_OUT_DURATION });
      statOpacity.value = withTiming(0, { duration: TIMING.BEGIN_FADE_OUT_DURATION });
      dotsContainerOpacity.value = withTiming(0, { duration: TIMING.BEGIN_DOTS_FADE });
    }, TIMING.BEGIN_FADE_OUT_START);

    // Background shift to workBlue
    setTimeout(() => {
      exitProgress.value = withTiming(1, { duration: TIMING.BEGIN_BG_DURATION });
    }, TIMING.BEGIN_BG_TRANSITION);

    // Navigate
    setTimeout(() => {
      navigation.navigate('FocusIntention');
      // Reset nav lock after a short delay to allow back-navigation later
      setTimeout(() => { navigatingRef.current = false; }, 500);
    }, TIMING.SCREEN_B_FADE_IN);
  }

  // ── Swipe-up gesture to open sheet ──
  const swipeUpGesture = Gesture.Pan()
    .runOnJS(true)
    .onEnd((event) => {
      if (event.translationY < -50 || event.velocityY < -500) {
        setSheetOpen(true);
      }
    });

  // ── Swipe-down on sheet to close ──
  const swipeDownGesture = Gesture.Pan()
    .runOnJS(true)
    .onEnd((event) => {
      if (event.translationY > 50 || event.velocityY > 500) {
        setSheetOpen(false);
      }
    });

  const statText =
    sessionsCompletedToday > 0
      ? `${sessionsCompletedToday} session${sessionsCompletedToday === 1 ? '' : 's'} · ${totalMinutesToday} min today`
      : '';

  return (
    <GestureDetector gesture={swipeUpGesture}>
      <Animated.View style={[styles.root, bgStyle, exitBgStyle]}>
        <StatusBar hidden />

        {/* PeacefulBackground replaces AmbientOrb */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <PeacefulBackground />
        </View>

        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>

            {/* Top Bar */}
            <View style={styles.topBar}>
              <ThemeToggle />
              <Pressable
                style={styles.gearButton}
                onPress={() => navigation.navigate('Settings')}
                hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
                accessibilityLabel="Settings"
              >
                <Text style={[styles.gearIcon, { color: theme.colors.textMuted }]}>Settings</Text>
              </Pressable>
            </View>

            {/* Center group */}
            <View style={styles.centerGroup}>
              {/* Wordmark */}
              <Animated.Text style={[styles.wordmark, wordmarkStyle, { color: theme.colors.textPrimary }]}>
                SOLACE
              </Animated.Text>

              {/* Tagline */}
              <Animated.Text style={[styles.tagline, taglineStyle, { color: theme.colors.textMuted }]}>
                {tagline}
              </Animated.Text>

              {/* Session dots */}
              <View style={styles.dotsContainer}>
                <SessionDots
                  entryDelay={TIMING.HOME_DOT_FIRST_DELAY}
                  containerOpacity={dotsContainerOpacity}
                />
              </View>

              {/* Actions */}
              <Animated.View style={[styles.actionsContainer, beginStyle]}>
                <Pressable
                  style={[styles.beginPressable, { backgroundColor: theme.colors.surface }]}
                  onPress={handleBeginPress}
                >
                  <Text style={[styles.beginText, { color: theme.colors.textPrimary }]}>
                    Begin a focus session
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.adjustPressable}
                  onPress={() => setSheetOpen(true)}
                >
                  <Text style={[styles.adjustText, { color: theme.colors.textMuted }]}>
                    Adjust session
                  </Text>
                </Pressable>
              </Animated.View>

              {/* Stat line */}
              <Animated.View style={[styles.statContainer, statStyle]}>
                <Text style={[styles.statText, { color: theme.colors.textMuted }]}>
                  {sessionsCompletedToday > 0 ? `${sessionsCompletedToday} session${sessionsCompletedToday === 1 ? '' : 's'} · ${totalMinutesToday} min today\n` : ''}
                  {settings.workDuration} · {settings.shortRestDuration} · {settings.longRestDuration}
                </Text>
              </Animated.View>
            </View>

          </View>
        </SafeAreaView>

        {/* Session Setup Sheet */}
        <GestureDetector gesture={swipeDownGesture}>
          <View style={StyleSheet.absoluteFill} pointerEvents={sheetOpen ? 'box-none' : 'none'}>
            <SessionSetupSheet
              isOpen={sheetOpen}
              onClose={() => setSheetOpen(false)}
            />
          </View>
        </GestureDetector>

      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    zIndex: 10,
  },
  gearButton: {
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  gearIcon: {
    fontSize: FS.sm,
    fontFamily: FONT.regular,
  },
  centerGroup: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmark: {
    fontFamily: FONT.thin,
    fontSize: FS.wordmark,
    letterSpacing: TRACKING.widest,
    marginBottom: 10,
  },
  tagline: {
    fontFamily: FONT.light,
    fontSize: FS.sm,
    letterSpacing: TRACKING.base,
    marginBottom: 40,
  },
  dotsContainer: {
    marginBottom: 44,
    height: 16,
    justifyContent: 'center',
  },
  actionsContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  beginPressable: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  beginText: {
    fontFamily: FONT.regular,
    fontSize: FS.base,
    letterSpacing: TRACKING.base,
  },
  adjustPressable: {
    padding: 8,
  },
  adjustText: {
    fontFamily: FONT.regular,
    fontSize: FS.sm,
  },
  statContainer: {
    alignItems: 'center',
  },
  statText: {
    fontFamily: FONT.light,
    fontSize: FS.xs,
    letterSpacing: TRACKING.tight,
    textAlign: 'center',
    lineHeight: 18,
  },
});
