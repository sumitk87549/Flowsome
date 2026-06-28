import React, { useState, useEffect, useCallback } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { SettingsProvider } from '@/context/SettingsContext';
import { SessionProvider } from '@/context/SessionContext';
import RootNavigator from '@/navigation/RootNavigator';
import { ThemeProvider } from '@/design/ThemeProvider';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    'DMSans-Thin': require('./assets/fonts/DMSans-Thin.ttf'),
    'DMSans-Light': require('./assets/fonts/DMSans-Light.ttf'),
    'DMSans-Regular': require('./assets/fonts/DMSans-Regular.ttf'),
  });

  const [settingsReady, setSettingsReady] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  const fontsReady = fontsLoaded || fontError !== null;
  const appReady = fontsReady && settingsReady && sessionReady;

  useEffect(() => {
    if (appReady) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [appReady]);

  // Safety net: if contexts never call onLoaded, unblock after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setSettingsReady(true);
      setSessionReady(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SettingsProvider onLoaded={() => setSettingsReady(true)}>
        <SessionProvider onLoaded={() => setSessionReady(true)}>
          <ThemeProvider>
            {appReady ? <RootNavigator /> : null}
          </ThemeProvider>
        </SessionProvider>
      </SettingsProvider>
    </GestureHandlerRootView>
  );
}
