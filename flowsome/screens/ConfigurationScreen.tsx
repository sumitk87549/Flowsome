import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Screen } from '../components/Screen';
import { PrimaryButton } from '../components/PrimaryButton';
import { Chip } from '../components/Chip';
import { COLORS, SPACING } from '../constants/theme';
import { SessionConfig, NavigationProps } from '../types';

interface ConfigurationScreenProps extends NavigationProps {
  sessionType: SessionConfig['type'];
}

export function ConfigurationScreen({ sessionType, navigate, goBack }: ConfigurationScreenProps) {
  const [duration, setDuration] = useState<number>(15);
  const [workDuration, setWorkDuration] = useState<number>(25);
  const [breakDuration, setBreakDuration] = useState<number>(5);
  const [cycles, setCycles] = useState<number>(4);
  const [breathingPattern, setBreathingPattern] = useState<string>('4-7-8');

  const handleStart = () => {
    const config: SessionConfig = {
      type: sessionType,
      duration: sessionType !== 'Pomodoro' ? duration : undefined,
      workDuration: sessionType === 'Pomodoro' ? workDuration : undefined,
      breakDuration: sessionType === 'Pomodoro' ? breakDuration : undefined,
      cycles: sessionType === 'Pomodoro' ? cycles : undefined,
      breathingPattern: sessionType === 'Breathing' ? breathingPattern : undefined,
    };
    navigate({ name: 'Session', config });
  };

  const renderSection = (title: string, options: any[], selectedValue: any, onSelect: (val: any) => void) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.chipsContainer}>
        {options.map((opt) => (
          <Chip
            key={String(opt.value)}
            label={opt.label}
            selected={selectedValue === opt.value}
            onPress={() => onSelect(opt.value)}
          />
        ))}
      </View>
    </View>
  );

  return (
    <Screen>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backText}>← BACK</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{sessionType}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {(sessionType === 'Focus' || sessionType === 'Meditation' || sessionType === 'Breathing') && renderSection(
          'DURATION',
          [
            { label: '5 Min', value: 5 },
            { label: '10 Min', value: 10 },
            { label: '15 Min', value: 15 },
            { label: '30 Min', value: 30 },
            { label: '60 Min', value: 60 },
          ],
          duration,
          setDuration
        )}

        {sessionType === 'Pomodoro' && (
          <>
            {renderSection(
              'WORK DURATION',
              [
                { label: '25 Min', value: 25 },
                { label: '45 Min', value: 45 },
                { label: '50 Min', value: 50 },
              ],
              workDuration,
              setWorkDuration
            )}
            {renderSection(
              'BREAK DURATION',
              [
                { label: '5 Min', value: 5 },
                { label: '10 Min', value: 10 },
                { label: '15 Min', value: 15 },
              ],
              breakDuration,
              setBreakDuration
            )}
            {renderSection(
              'CYCLES',
              [
                { label: '2', value: 2 },
                { label: '4', value: 4 },
                { label: '6', value: 6 },
              ],
              cycles,
              setCycles
            )}
          </>
        )}

        {sessionType === 'Breathing' && renderSection(
          'PATTERN',
          [
            { label: '4-7-8 Relax', value: '4-7-8' },
            { label: 'Box Breathing', value: 'Box' },
            { label: 'Awake', value: 'Awake' },
          ],
          breathingPattern,
          setBreathingPattern
        )}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton title="Start Session" onPress={handleStart} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.md,
  },
  backButton: {
    marginBottom: SPACING.lg,
  },
  backText: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    color: COLORS.text,
    letterSpacing: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  section: {
    marginBottom: SPACING.xxl,
  },
  sectionTitle: {
    color: COLORS.text,
    opacity: 0.5,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: SPACING.lg,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  footer: {
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxxl,
    paddingHorizontal: SPACING.md,
  },
});
