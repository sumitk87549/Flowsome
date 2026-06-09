// app/_layout.tsx — Root Layout (Sprint 4 version)
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SystemUI from 'expo-system-ui';
import * as Localization from 'expo-localization';
import { FONTS } from '../constants/typography';
import { useAppStore } from '../store/appStore';
import { useSettingsStore } from '../store/settingsStore';
import { THEMES } from '../constants/themes';

// Keep splash screen visible while fonts load
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { activeTheme, dayNight } = useAppStore();
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

  // ── Effect 1: Sync Android navigation bar color to active theme ──────────────
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
        {/* @ts-ignore */}
        <StatusBar style="light" backgroundColor={theme.background} translucent={false} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: theme.background },
          }}
        />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
