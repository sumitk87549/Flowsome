// app/_layout.tsx — Root Layout (Sprint 4 version)
import { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SystemUI from 'expo-system-ui';
import * as Localization from 'expo-localization';
import { NavigationBar } from 'expo-navigation-bar';
import { FONTS } from '../constants/typography';
import { useAppStore } from '../store/appStore';
import { useSettingsStore } from '../store/settingsStore';
import { THEMES } from '../constants/themes';
import NowPlayingBar from '../components/session/NowPlayingBar';

// Keep splash screen visible while fonts load
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { activeTheme, dayNight } = useAppStore();
  const hasCompletedOnboarding = useSettingsStore((s) => s.hasCompletedOnboarding);
  const theme =
    dayNight === 'day'
      ? THEMES[activeTheme].dayColors
      : THEMES[activeTheme].nightColors;

  const [fontsLoaded, fontError] = useFonts({
    [FONTS.heading]: require('../assets/fonts/CormorantGaramond-SemiBold.ttf'),
    [FONTS.headingLight]: require('../assets/fonts/CormorantGaramond-Light.ttf'),
    [FONTS.headingItalic]: require('../assets/fonts/CormorantGaramond-Italic.ttf'),
    [FONTS.body]: require('../assets/fonts/DMSans-Regular.ttf'),
    [FONTS.bodyMedium]: require('../assets/fonts/DMSans-Medium.ttf'),
    [FONTS.bodySemiBold]: require('../assets/fonts/DMSans-SemiBold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if (fontsLoaded && !hasCompletedOnboarding) {
      router.replace('/onboarding' as any);
    }
  }, [fontsLoaded, hasCompletedOnboarding]);

  // ── Effect 1: Sync Android window background to theme ────────
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.background);
  }, [theme.background]);

  // ── Effect 2: Auto-detect device language on very first launch ───────────────
  useEffect(() => {
    // Only auto-set if user has never manually changed the language (still at default 'en-IN')
    const storedLang = useSettingsStore.getState().language;
    if (storedLang === 'en-IN') {
      const locales = Localization.getLocales();
      const deviceLang = locales[0]?.languageCode;
      if (deviceLang === 'hi') {
        useSettingsStore.getState().setLanguage('hi-IN');
      }
    }
  }, []); // Empty deps — runs once on app launch

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="light" />
        <NavigationBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: theme.background },
          }}
        >
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="(screens)" options={{ headerShown: false }} />
        </Stack>
        <NowPlayingBar />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

