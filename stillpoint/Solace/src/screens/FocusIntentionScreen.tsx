import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
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
import { FONT, FS, TRACKING } from '@/constants/typography';
import { TIMING } from '@/constants/timing';
import { EASE } from '@/constants/easing';
import { BackButton } from '@/components/shared/BackButton';
import { useTheme } from '@/design/theme';
import { PeacefulBackground } from '@/components/shared/PeacefulBackground';

type FocusNavProp = NativeStackNavigationProp<RootStackParamList, 'FocusIntention'>;

const INTENTION_WORDS = [
  'Write',
  'Code',
  'Design',
  'Study',
  'Read',
  'Plan',
  'Review',
  'Build',
  'Think',
  'Create',
];

export default function FocusIntentionScreen() {
  const navigation = useNavigation<FocusNavProp>();
  const { currentIntentionWord } = useSession();
  const theme = useTheme();

  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [customWord, setCustomWord] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasNavigatedRef = useRef(false);

  // Content fade-in
  const contentOpacity = useSharedValue(0);

  useEffect(() => {
    contentOpacity.value = withTiming(1, {
      duration: TIMING.SCREEN_B_FADE_DURATION,
      easing: EASE.outQuad,
    });
  }, []);

  function navigateToWork(word: string | undefined) {
    if (hasNavigatedRef.current) return;
    hasNavigatedRef.current = true;

    if (autoAdvanceRef.current !== null) {
      clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = null;
    }

    navigation.navigate('WorkSession', { intentionWord: word });
  }

  const handleTilePress = useCallback((word: string) => {
    setSelectedWord(word);
    setTimeout(() => {
      navigateToWork(word);
    }, 400);
  }, []);

  function handleSkip() {
    navigateToWork(undefined);
  }

  function handleCustomSubmit() {
    if (customWord.trim()) {
      handleTilePress(customWord.trim());
    }
  }

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  // Put previous intention first if it exists
  const displayWords = currentIntentionWord && !INTENTION_WORDS.includes(currentIntentionWord)
    ? [currentIntentionWord, ...INTENTION_WORDS]
    : INTENTION_WORDS;

  return (
    <KeyboardAvoidingView 
      style={styles.root} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <PeacefulBackground />
      </View>
      <StatusBar hidden />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <BackButton />
        </View>
        
        <Animated.View style={[styles.content, contentStyle]}>
          <View style={styles.promptContainer}>
            <Text style={[styles.promptText, { color: theme.colors.textPrimary }]}>
              What is this session for?
            </Text>
            <Text style={[styles.helperText, { color: theme.colors.textMuted }]}>
              One word is enough.
            </Text>
          </View>

          <View style={styles.stackContainer}>
            {isTyping ? (
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { color: theme.colors.textPrimary, borderColor: theme.colors.textMuted }]}
                  placeholder="Write my own..."
                  placeholderTextColor={theme.colors.textMuted}
                  value={customWord}
                  onChangeText={setCustomWord}
                  onSubmitEditing={handleCustomSubmit}
                  autoFocus
                  returnKeyType="done"
                />
                <Pressable onPress={() => setIsTyping(false)} style={styles.cancelButton}>
                  <Text style={[styles.cancelText, { color: theme.colors.textMuted }]}>Cancel</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.chipsGrid}>
                {displayWords.map(word => {
                  const isSelected = selectedWord === word;
                  return (
                    <Pressable
                      key={word}
                      onPress={() => handleTilePress(word)}
                      style={[
                        styles.chip,
                        { 
                          backgroundColor: isSelected ? theme.colors.accent : theme.colors.surface,
                          borderColor: isSelected ? theme.colors.accent : theme.colors.line 
                        }
                      ]}
                    >
                      <Text style={[styles.chipText, { color: isSelected ? theme.colors.background : theme.colors.textPrimary }]}>
                        {word}
                      </Text>
                    </Pressable>
                  );
                })}
                <Pressable
                  onPress={() => setIsTyping(true)}
                  style={[styles.chip, { backgroundColor: theme.colors.surface, borderColor: theme.colors.line }]}
                >
                  <Text style={[styles.chipText, { color: theme.colors.textPrimary }]}>
                    Write my own...
                  </Text>
                </Pressable>
              </View>
            )}
          </View>

          <View style={styles.skipContainer}>
            <Pressable onPress={handleSkip} hitSlop={16}>
              <Text style={[styles.skipText, { color: theme.colors.textMuted }]}>Skip for now</Text>
            </Pressable>
          </View>
        </Animated.View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  promptContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  promptText: {
    fontFamily: FONT.medium,
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 12,
  },
  helperText: {
    fontFamily: FONT.regular,
    fontSize: 16,
    textAlign: 'center',
  },
  stackContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  chipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
  },
  chipText: {
    fontFamily: FONT.medium,
    fontSize: FS.base,
  },
  inputContainer: {
    alignItems: 'center',
    width: '100%',
  },
  input: {
    width: '80%',
    height: 56,
    borderBottomWidth: 1,
    fontFamily: FONT.medium,
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  cancelButton: {
    padding: 12,
  },
  cancelText: {
    fontFamily: FONT.regular,
    fontSize: 16,
  },
  skipContainer: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  skipText: {
    fontFamily: FONT.regular,
    fontSize: FS.md,
    letterSpacing: TRACKING.wide,
  },
});
