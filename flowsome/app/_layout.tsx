// app/_layout.tsx
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FONTS } from '../constants/typography';
import { useAppStore } from '../store/appStore';
import { THEMES } from '../constants/themes';

// ─── CRITICAL: Must be called at module level, NOT inside the component ───────
SplashScreen.preventAutoHideAsync();
// ─────────────────────────────────────────────────────────────────────────────

export default function RootLayout(): React.JSX.Element | null {
  const { activeTheme, dayNight } = useAppStore();
  const theme =
    dayNight === 'day'
      ? THEMES[activeTheme].dayColors
      : THEMES[activeTheme].nightColors;

  const [fontsLoaded, fontError] = useFonts({
    [FONTS.heading]:      require('../assets/fonts/CormorantGaramond-SemiBold.ttf'),
    [FONTS.headingLight]: require('../assets/fonts/CormorantGaramond-Light.ttf'),
    [FONTS.headingItalic]:require('../assets/fonts/CormorantGaramond-Italic.ttf'),
    [FONTS.body]:         require('../assets/fonts/DMSans-Regular.ttf'),
    [FONTS.bodyMedium]:   require('../assets/fonts/DMSans-Medium.ttf'),
    [FONTS.bodySemiBold]: require('../assets/fonts/DMSans-SemiBold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Return null while fonts load — splash screen stays visible
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="light" />
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
