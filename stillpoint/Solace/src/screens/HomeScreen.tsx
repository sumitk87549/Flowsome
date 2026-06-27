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
import { COLORS } from '@/constants/colors';
import { FONT, FS, TRACKING } from '@/constants/typography';
import { TIMING } from '@/constants/timing';
import { EASE } from '@/constants/easing';
import { LAYOUT } from '@/constants/layout';
import * as Haptics from 'expo-haptics';
import AmbientOrb from '@/components/home/AmbientOrb';
import SessionDots from '@/components/home/SessionDots';
import SessionSummarySheet from '@/components/home/SessionSummarySheet';

type HomeNavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavProp>();
  const { sessionsCompletedToday, totalMinutesToday } = useSession();
  const { fire } = useHaptic();
  const [sheetOpen, setSheetOpen] = useState(false);
  const navigatingRef = useRef(false);

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

  // ── Animated styles ──
  const bgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      bgProgress.value,
      [0, 1],
      ['#000000', COLORS.neutralDark]
    ),
  }));

  // Exit: neutralDark → workBlue driven by exitProgress
  const exitBgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      exitProgress.value,
      [0, 1],
      [COLORS.neutralDark, COLORS.workBlue]
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

        {/* AmbientOrb — behind everything */}
        <AmbientOrb />

        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>

            {/* Gear icon — navigate to Settings */}
            <Pressable
              style={styles.gearButton}
              onPress={() => navigation.navigate('Settings')}
              hitSlop={16}
            >
              <Text style={styles.gearIcon}>⚙</Text>
            </Pressable>

            {/* Center group */}
            <View style={styles.centerGroup}>
              {/* Wordmark */}
              <Animated.Text style={[styles.wordmark, wordmarkStyle]}>
                SOLACE
              </Animated.Text>

              {/* Tagline */}
              <Animated.Text style={[styles.tagline, taglineStyle]}>
                work with intention
              </Animated.Text>

              {/* Session dots */}
              <View style={styles.dotsContainer}>
                <SessionDots
                  entryDelay={TIMING.HOME_DOT_FIRST_DELAY}
                  containerOpacity={dotsContainerOpacity}
                />
              </View>

              {/* Begin pressable */}
              <Pressable
                style={styles.beginPressable}
                onPress={handleBeginPress}
              >
                <Animated.Text style={[styles.beginText, beginStyle]}>
                  Begin
                </Animated.Text>
              </Pressable>

              {/* Stat line */}
              <Animated.Text style={[styles.statText, statStyle]}>
                {statText}
              </Animated.Text>
            </View>

          </View>
        </SafeAreaView>

        {/* Session Summary Sheet */}
        <GestureDetector gesture={swipeDownGesture}>
          <View style={StyleSheet.absoluteFill} pointerEvents={sheetOpen ? 'box-none' : 'none'}>
            <SessionSummarySheet
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
  gearButton: {
    position: 'absolute',
    top: 16,
    right: 20,
    zIndex: 10,
  },
  gearIcon: {
    fontSize: 18,
    color: COLORS.creamFaint,
    opacity: 0.5,
  },
  centerGroup: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmark: {
    fontFamily: FONT.thin,
    fontSize: FS.wordmark,
    color: COLORS.cream,
    letterSpacing: TRACKING.widest,
    marginBottom: 10,
  },
  tagline: {
    fontFamily: FONT.light,
    fontSize: FS.sm,
    color: COLORS.creamFaint,
    letterSpacing: TRACKING.base,
    marginBottom: 40,
  },
  dotsContainer: {
    marginBottom: 44,
    height: 16,
    justifyContent: 'center',
  },
  beginPressable: {
    width: LAYOUT.screenWidth,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  beginText: {
    fontFamily: FONT.light,
    fontSize: FS.body,
    color: COLORS.cream,
    letterSpacing: TRACKING.wider,
  },
  statText: {
    fontFamily: FONT.light,
    fontSize: FS.xs,
    color: COLORS.creamFaint,
    letterSpacing: TRACKING.tight,
  },
});
