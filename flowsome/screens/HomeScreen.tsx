import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Screen } from '../components/Screen';
import { AppTitle } from '../components/AppTitle';
import { PrimaryButton } from '../components/PrimaryButton';
import { COLORS, SPACING } from '../constants/theme';

export function HomeScreen() {
  const handleOptionPress = (option: string) => {
    console.log(`Selected option: ${option}`);
  };

  const handleSettingsPress = () => {
    console.log('Settings pressed');
  };

  return (
    <Screen>
      <View style={styles.topContainer}>
        <AppTitle 
          title="Flowsome" 
          subtitle="Pause. Breathe. Flow." 
        />
      </View>

      <View style={styles.optionsContainer}>
        <PrimaryButton title="Focus" onPress={() => handleOptionPress('Focus')} />
        <PrimaryButton title="Pomodoro" onPress={() => handleOptionPress('Pomodoro')} />
        <PrimaryButton title="Meditation" onPress={() => handleOptionPress('Meditation')} />
        <PrimaryButton title="Breathing" onPress={() => handleOptionPress('Breathing')} />
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.settingsButton} 
          onPress={handleSettingsPress}
          activeOpacity={0.6}
        >
          <Text style={styles.settingsText}>SETTINGS</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    alignItems: 'center',
    paddingTop: SPACING.xxl,
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: SPACING.md,
  },
  bottomContainer: {
    paddingBottom: SPACING.xxxl,
    alignItems: 'center',
  },
  settingsButton: {
    padding: SPACING.md,
  },
  settingsText: {
    color: COLORS.text,
    opacity: 0.4,
    letterSpacing: 2,
    fontSize: 12,
    fontWeight: '400',
  },
});
