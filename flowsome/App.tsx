import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SceneEngine } from './src/context/ThemeContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {/*
          SceneEngine wraps the entire tree.
          It reads Zustand (theme + settings) and exposes animated SharedValues
          via React context. Navigation and store architecture unchanged.
        */}
        <SceneEngine>
          <AppNavigator />
        </SceneEngine>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
