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
import { TransitionScreen } from '@/screens/TransitionScreen';
import { RestExperienceScreen } from '@/screens/RestExperienceScreen';
import SettleNoticeScreen from '@/screens/SettleNoticeScreen';

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
        <Stack.Screen 
          name="Transition" 
          component={TransitionScreen} 
          options={{ animation: 'fade' }}
        />
        <Stack.Screen 
          name="RestExperience" 
          component={RestExperienceScreen} 
          options={{ animation: 'fade' }}
        />
        <Stack.Screen 
          name="SettleNotice" 
          component={SettleNoticeScreen} 
          options={{ animation: 'fade' }}
        />
        <Stack.Screen 
          name="ReturnPrompt" 
          component={ReturnPromptScreen} 
          options={{ animation: 'fade' }}
        />
        <Stack.Screen 
          name="LongBreak" 
          component={LongBreakScreen} 
          options={{ animation: 'fade' }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ gestureEnabled: true }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
