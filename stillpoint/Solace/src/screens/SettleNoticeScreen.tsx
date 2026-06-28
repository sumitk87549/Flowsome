import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, BackHandler } from 'react-native';
import Animated, {
  useSharedValue,
  withDelay,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import { COLORS } from '@/constants/colors';
import { FONT } from '@/constants/typography';
import { useSettings } from '@/context/SettingsContext';

type Props = NativeStackScreenProps<RootStackParamList, 'SettleNotice'>;

export default function SettleNoticeScreen({ navigation, route }: Props) {
  const { sessionNumber, totalSessions } = route.params;
  const { settings } = useSettings();

  const textOpacity = useSharedValue(0);
  const autoNavTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });

    // Text fades in at 600ms
    textOpacity.value = withDelay(600, withTiming(1, {
      duration: 500,
      easing: Easing.out(Easing.quad),
    }));

    // Auto-navigate after exactly 4000ms from mount
    autoNavTimerRef.current = setTimeout(() => {
      if (settings.autoStartWork) {
        navigation.navigate('WorkSession', { intentionWord: undefined });
      } else {
        navigation.navigate('ReturnPrompt', { sessionNumber, totalSessions });
      }
    }, 4000);

    return () => {
      if (autoNavTimerRef.current) clearTimeout(autoNavTimerRef.current);
      backHandler.remove();
    };
  }, []);

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.textContainer, textStyle]}>
        <Text style={styles.settleText}>Settle here for a moment.</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.forestNight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    paddingHorizontal: 40,
  },
  settleText: {
    fontFamily: FONT.light,
    fontSize: 24,
    color: COLORS.cream,
    textAlign: 'center',
    letterSpacing: 1.5,
  },
});
