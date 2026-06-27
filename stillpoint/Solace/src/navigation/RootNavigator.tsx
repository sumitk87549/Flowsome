import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import { COLORS } from '@/constants/colors';

import HomeScreen from '@/screens/HomeScreen';
import FocusIntentionScreen from '@/screens/FocusIntentionScreen';
import WorkSessionScreen from '@/screens/WorkSessionScreen';
import WorkRestTransitionScreen from '@/screens/WorkRestTransitionScreen';
import RestSessionScreen from '@/screens/RestSessionScreen';
import CycleCompleteScreen from '@/screens/CycleCompleteScreen';
import ReturnPromptScreen from '@/screens/ReturnPromptScreen';
import LongBreakScreen from '@/screens/LongBreakScreen';
import SettingsScreen from '@/screens/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          animation: 'none',
          headerShown: false,
          gestureEnabled: false,
          contentStyle: { backgroundColor: COLORS.neutralDark },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ gestureEnabled: true }}
        />
        <Stack.Screen name="FocusIntention" component={FocusIntentionScreen} />
        <Stack.Screen name="WorkSession" component={WorkSessionScreen} />
        <Stack.Screen name="WorkRestTransition" component={WorkRestTransitionScreen} />
        <Stack.Screen name="RestSession" component={RestSessionScreen} />
        <Stack.Screen name="CycleComplete" component={CycleCompleteScreen} />
        <Stack.Screen name="ReturnPrompt" component={ReturnPromptScreen} />
        <Stack.Screen name="LongBreak" component={LongBreakScreen} />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ gestureEnabled: true }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
