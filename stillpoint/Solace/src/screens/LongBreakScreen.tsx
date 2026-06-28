import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  withSpring,
  withDelay,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import { RestMode } from '@/types/session';
import { COLORS } from '@/constants/colors';
import { FONT } from '@/constants/typography';
import { useHaptic } from '@/hooks/useHaptic';
import { useBell } from '@/utils/bellPlayer';
import * as Haptics from 'expo-haptics';
import { BackButton } from '@/components/shared/BackButton';
import { useTheme } from '@/design/theme';
import { useSettings } from '@/context/SettingsContext';

type Props = NativeStackScreenProps<RootStackParamList, 'LongBreak'>;

const LONG_BREAK_OPTIONS = [
  {
    key: 'walk',
    label: 'Walk',
    descriptor: 'Step outside. No timer.',
    mode: 'walk' as RestMode,
  },
  {
    key: 'room',
    label: 'The Room',
    descriptor: 'A guided rest in your space.',
    mode: 'storyMoment' as RestMode,  // uses StoryMoment with a room scene — use forest for now
  },
  {
    key: 'forest',
    label: 'The Forest',
    descriptor: 'Let the trees carry it.',
    mode: 'storyMoment' as RestMode,
  },
  {
    key: 'memory',
    label: 'Memory',
    descriptor: 'Visit somewhere from before.',
    mode: 'memory' as RestMode,
  },
] as const;

interface LongBreakTileProps {
  option: typeof LONG_BREAK_OPTIONS[number];
  scaleValue: ReturnType<typeof useSharedValue<number>>;
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
}

function LongBreakTile({ option, scaleValue, onPress, onPressIn, onPressOut }: LongBreakTileProps) {
  const tileStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const theme = useTheme();
  return (
    <Animated.View style={tileStyle}>
      <Pressable
        style={[styles.tile, { borderColor: theme.colors.line, backgroundColor: theme.colors.surface }]}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <Text style={[styles.tileLabel, { color: theme.colors.text }]}>{option.label}</Text>
        <Text style={[styles.tileDescriptor, { color: theme.colors.textMuted }]}>{option.descriptor}</Text>
      </Pressable>
    </Animated.View>
  );
}

export default function LongBreakScreen({ navigation }: Props) {
  const { settings } = useSettings();
  const { fire: hapticFire } = useHaptic();
  const theme = useTheme();

  const longBreakBell = useBell('long_break');

  // Headline and tile animation values
  const headlineOpacity = useSharedValue(0);
  const tile0Scale = useSharedValue(1);
  const tile1Scale = useSharedValue(1);
  const tile2Scale = useSharedValue(1);
  const tile3Scale = useSharedValue(1);
  const tilesOpacity = useSharedValue(0);

  const tileScales = [tile0Scale, tile1Scale, tile2Scale, tile3Scale];

  useEffect(() => {
    // Heavy haptic on entry
    hapticFire(Haptics.ImpactFeedbackStyle.Heavy, true);

    longBreakBell.play();

    // Headline fades in
    headlineOpacity.value = withDelay(300, withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.quad),
    }));

    // Tiles fade in after headline
    tilesOpacity.value = withDelay(800, withTiming(1, { duration: 500 }));
  }, []);

  const headlineStyle = useAnimatedStyle(() => ({ opacity: headlineOpacity.value }));
  const tilesContainerStyle = useAnimatedStyle(() => ({ opacity: tilesOpacity.value }));

  const handleTilePress = (option: typeof LONG_BREAK_OPTIONS[number]) => {
    hapticFire(Haptics.ImpactFeedbackStyle.Light, false);
    navigation.navigate('RestExperience', {
      mode: option.mode,
      duration: settings.longRestDuration,
    });
  };

  const handleTilePressIn = (index: number) => {
    tileScales[index].value = withSpring(0.97, { stiffness: 300, damping: 20 });
  };

  const handleTilePressOut = (index: number) => {
    tileScales[index].value = withSpring(1, { stiffness: 300, damping: 20 });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <BackButton style={styles.backButton} />
      <Animated.Text style={[styles.headline, headlineStyle, { color: theme.colors.text }]}>
        You've earned a longer rest.
      </Animated.Text>

      <Animated.View style={[styles.tilesContainer, tilesContainerStyle]}>
        {LONG_BREAK_OPTIONS.map((option, index) => (
          <LongBreakTile
            key={option.key}
            option={option}
            scaleValue={tileScales[index]}
            onPress={() => handleTilePress(option)}
            onPressIn={() => handleTilePressIn(index)}
            onPressOut={() => handleTilePressOut(index)}
          />
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  backButton: {
    marginBottom: 40,
    marginLeft: -8,
  },
  headline: {
    fontFamily: FONT.light,
    fontSize: 32,
    marginBottom: 48,
    lineHeight: 42,
  },
  tilesContainer: {
    gap: 16,
  },
  tile: {
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
  },
  tileLabel: {
    fontFamily: FONT.light,
    fontSize: 18,
    marginBottom: 4,
  },
  tileDescriptor: {
    fontFamily: FONT.light,
    fontSize: 12,
    letterSpacing: 0.3,
  },
});
