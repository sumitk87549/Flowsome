import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ListRenderItemInfo,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import { useSession } from '@/context/SessionContext';
import { COLORS } from '@/constants/colors';
import { FONT, FS, TRACKING } from '@/constants/typography';
import { TIMING } from '@/constants/timing';
import { EASE } from '@/constants/easing';
import WordTile, {
  TILE_WIDTH,
  TILE_HEIGHT,
  TILE_HORIZONTAL_MARGIN,
} from '@/components/home/WordTile';

type FocusNavProp = NativeStackNavigationProp<RootStackParamList, 'FocusIntention'>;

// Fixed word list — order matters, never change it
const INTENTION_WORDS = [
  'Write',
  'Code',
  'Design',
  'Think',
  'Study',
  'Read',
  'Plan',
  'Create',
  'Review',
  'Build',
];

const ITEM_TOTAL_WIDTH = TILE_WIDTH + TILE_HORIZONTAL_MARGIN * 2;

export default function FocusIntentionScreen() {
  const navigation = useNavigation<FocusNavProp>();
  const { currentIntentionWord } = useSession();

  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasNavigatedRef = useRef(false);
  const flatListRef = useRef<FlatList<string>>(null);

  // Content fade-in
  const contentOpacity = useSharedValue(0);

  useEffect(() => {
    // Fade in content
    contentOpacity.value = withTiming(1, {
      duration: TIMING.SCREEN_B_FADE_DURATION,
      easing: EASE.outQuad,
    });

    // Auto-advance after 3 seconds
    autoAdvanceRef.current = setTimeout(() => {
      navigateToWork(undefined);
    }, TIMING.FOCUS_AUTO_ADVANCE_MS);

    return () => {
      if (autoAdvanceRef.current !== null) {
        clearTimeout(autoAdvanceRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll to previously selected word on entry
  useEffect(() => {
    if (currentIntentionWord) {
      const index = INTENTION_WORDS.indexOf(currentIntentionWord);
      if (index !== -1 && flatListRef.current) {
        // Small delay to let FlatList render before scrolling
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({ index, animated: false });
        }, 100);
      }
    }
  }, [currentIntentionWord]);

  function navigateToWork(word: string | undefined) {
    if (hasNavigatedRef.current) return;
    hasNavigatedRef.current = true;

    // Cancel auto-advance if still pending
    if (autoAdvanceRef.current !== null) {
      clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = null;
    }

    navigation.navigate('WorkSession', { intentionWord: word });
  }

  const handleTilePress = useCallback(
    (word: string) => {
      setSelectedWord(word);

      // Navigate after tile selection animation plays
      setTimeout(() => {
        navigateToWork(word);
      }, TIMING.FOCUS_TILE_NAV_DELAY);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  function handleSkip() {
    navigateToWork(undefined);
  }

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  // FlatList helpers
  const getItemLayout = useCallback(
    (_data: ArrayLike<string> | null | undefined, index: number) => ({
      length: ITEM_TOTAL_WIDTH,
      offset: ITEM_TOTAL_WIDTH * index,
      index,
    }),
    []
  );

  // Calculate initialScrollIndex — scroll to previously used word
  const initialScrollIndex = currentIntentionWord
    ? Math.max(0, INTENTION_WORDS.indexOf(currentIntentionWord))
    : 0;

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<string>) => (
      <WordTile
        word={item}
        isSelected={selectedWord === item}
        onPress={() => handleTilePress(item)}
      />
    ),
    [selectedWord, handleTilePress]
  );

  const keyExtractor = useCallback((item: string) => item, []);

  return (
    <View style={styles.root}>
      <StatusBar hidden />
      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[styles.content, contentStyle]}>

          {/* Prompt text — top third */}
          <View style={styles.promptContainer}>
            <Text style={styles.promptText}>What are you here to do?</Text>
          </View>

          {/* Word tiles — horizontal FlatList, middle */}
          <View style={styles.tilesContainer}>
            <FlatList
              ref={flatListRef}
              data={INTENTION_WORDS}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              horizontal
              showsHorizontalScrollIndicator={false}
              getItemLayout={getItemLayout}
              initialScrollIndex={initialScrollIndex}
              contentContainerStyle={styles.flatListContent}
              // Prevent the list from capturing the full-screen swipe gesture
              keyboardShouldPersistTaps="handled"
              onScrollToIndexFailed={(info) => {
                // Retry after layout
                setTimeout(() => {
                  flatListRef.current?.scrollToIndex({
                    index: info.index,
                    animated: false,
                  });
                }, 200);
              }}
            />
          </View>

          {/* Skip — bottom */}
          <View style={styles.skipContainer}>
            <Pressable onPress={handleSkip} hitSlop={16}>
              <Text style={styles.skipText}>skip</Text>
            </Pressable>
          </View>

        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.workBlue,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 48,
  },
  promptContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  promptText: {
    fontFamily: FONT.light,
    fontSize: FS.display,
    color: COLORS.cream,
    textAlign: 'center',
    lineHeight: 30,
  },
  tilesContainer: {
    width: '100%',
    height: TILE_HEIGHT + 16,
    justifyContent: 'center',
  },
  flatListContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  skipContainer: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  skipText: {
    fontFamily: FONT.light,
    fontSize: FS.md,
    color: COLORS.cream,
    opacity: 0.5,
    letterSpacing: TRACKING.wide,
  },
});
