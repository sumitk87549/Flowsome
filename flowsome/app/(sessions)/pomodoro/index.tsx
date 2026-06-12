// app/(sessions)/pomodoro/index.tsx
import { View, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeScreen } from '../../../components/ui/SafeScreen';
import { FlowText } from '../../../components/ui/FlowText';
import { FlowCard } from '../../../components/ui/FlowCard';
import { FlowButton } from '../../../components/ui/FlowButton';
import { useTheme, useThemeConfig } from '../../../hooks/useTheme';
import { THEME_IMAGES } from '../../../constants/theme-images';
import { HapticUtils } from '../../../utils/hapticUtils';
import { IntentionInput } from '../../../components/focus/IntentionInput';

const WORK_OPTIONS = [15, 25, 45, 60, 90];
const BREAK_OPTIONS = [5, 10, 15, 20];
const POMODORO_COUNTS = [2, 3, 4, 6];

export default function PomodoroConfig() {
  const theme = useTheme();
  const config = useThemeConfig();
  const router = useRouter();
  const [workMin, setWorkMin] = useState(25);
  const [breakMin, setBreakMin] = useState(5);
  const [count, setCount] = useState(4);
  const [intention, setIntention] = useState('');

  const handleStart = () => {
    HapticUtils.medium();
    router.push({
      pathname: '/(sessions)/pomodoro/session',
      params: {
        workMin: String(workMin),
        breakMin: String(breakMin),
        count: String(count),
        intention: intention,
      },
    });
  };

  const OptionRow = ({ label, options, selected, onSelect }: {
    label: string;
    options: number[];
    selected: number;
    onSelect: (v: number) => void;
  }) => (
    <View style={{ gap: 10 }}>
      <FlowText
        variant="label"
        size="xs"
        color={theme.textMuted}
        style={{ letterSpacing: 2.5, textTransform: 'uppercase', paddingLeft: 4 }}
      >
        {label}
      </FlowText>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            onPress={() => {
              HapticUtils.light();
              onSelect(opt);
            }}
            style={{
              paddingHorizontal: 18,
              paddingVertical: 10,
              borderRadius: 14,
              backgroundColor: selected === opt ? theme.primary : theme.card,
              borderWidth: 1.5,
              borderColor: selected === opt ? theme.primary : theme.cardBorder,
            }}
          >
            <FlowText
              size="sm"
              color={selected === opt ? theme.background : theme.text}
              style={{ fontWeight: '500' }}
            >
              {opt}{label.includes('Pomodoros') ? '' : 'm'}
            </FlowText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeScreen>
      <View style={{ paddingHorizontal: 24, paddingTop: 16 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <FlowText color={theme.textMuted}>← Back</FlowText>
        </TouchableOpacity>
        <FlowText
          variant="heading"
          size="4xl"
          color={theme.primary}
          style={{ marginTop: 16 }}
        >
          ⏱️ Pomodoro
        </FlowText>
        <FlowText variant="body" size="sm" color={theme.textMuted} style={{ marginTop: 4 }}>
          Interval training for mental endurance
        </FlowText>
        
        {/* Landscape banner showcasing the selected region */}
        <View style={{ borderRadius: 16, overflow: 'hidden', height: 95, marginTop: 16, borderWidth: 1, borderColor: theme.cardBorder }}>
          <ImageBackground source={THEME_IMAGES[config.id]} style={{ width: '100%', height: '100%', justifyContent: 'flex-end' }}>
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.75)']} style={{ padding: 12 }}>
              <FlowText color="#FFFFFF" variant="headingItalic" size="sm" style={{ letterSpacing: 0.5 }}>
                Focusing with regional presence in {config.name} {config.icon}
              </FlowText>
            </LinearGradient>
          </ImageBackground>
        </View>
      </View>
      
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, gap: 24, paddingTop: 20, paddingBottom: 150 }}>
        <OptionRow
          label="Work Duration"
          options={WORK_OPTIONS}
          selected={workMin}
          onSelect={setWorkMin}
        />
        <OptionRow
          label="Break Duration"
          options={BREAK_OPTIONS}
          selected={breakMin}
          onSelect={setBreakMin}
        />
        <OptionRow
          label="Pomodoros"
          options={POMODORO_COUNTS}
          selected={count}
          onSelect={setCount}
        />
        <FlowCard style={{ padding: 18, marginTop: 4, borderWidth: 1, borderColor: theme.cardBorder }}>
          <FlowText size="sm" color={theme.textSecondary} style={{ textAlign: 'center', lineHeight: 20 }}>
            {count} × {workMin}m work + {breakMin}m break = <FlowText color={theme.primary} size="sm" style={{ fontWeight: '600' }}>{count * (workMin + breakMin)}m</FlowText> total session duration
          </FlowText>
        </FlowCard>
        <IntentionInput
          placeholder="What will you focus on?"
          value={intention}
          onChange={setIntention}
        />
      </ScrollView>
      
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 24, paddingBottom: 40 }}>
        <FlowButton
          label="Start Pomodoro"
          size="lg"
          onPress={handleStart}
          style={{ width: '100%', alignItems: 'center' }}
        />
      </View>
    </SafeScreen>
  );
}

