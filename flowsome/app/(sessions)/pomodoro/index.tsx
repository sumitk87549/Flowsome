// app/(sessions)/pomodoro/index.tsx
import { View, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeScreen } from '../../../components/ui/SafeScreen';
import { FlowText } from '../../../components/ui/FlowText';
import { FlowCard } from '../../../components/ui/FlowCard';
import { FlowButton } from '../../../components/ui/FlowButton';
import { useTheme } from '../../../hooks/useTheme';
import { HapticUtils } from '../../../utils/hapticUtils';

const WORK_OPTIONS = [15, 25, 45, 60, 90];
const BREAK_OPTIONS = [5, 10, 15, 20];
const POMODORO_COUNTS = [2, 3, 4, 6];

export default function PomodoroConfig() {
  const theme = useTheme();
  const router = useRouter();
  const [workMin, setWorkMin] = useState(25);
  const [breakMin, setBreakMin] = useState(5);
  const [count, setCount] = useState(4);

  const handleStart = () => {
    HapticUtils.medium();
    router.push({
      pathname: '/(sessions)/pomodoro/session',
      params: {
        workMin: String(workMin),
        breakMin: String(breakMin),
        count: String(count),
      },
    });
  };

  const OptionRow = ({ label, options, selected, onSelect }: {
    label: string;
    options: number[];
    selected: number;
    onSelect: (v: number) => void;
  }) => (
    <View style={{ gap: 8 }}>
      <FlowText
        variant="label"
        size="xs"
        color={theme.textMuted}
        style={{ letterSpacing: 2, textTransform: 'uppercase' }}
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
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 12,
              backgroundColor: selected === opt ? theme.primary : theme.card,
              borderWidth: 1,
              borderColor: selected === opt ? theme.primary : theme.cardBorder,
            }}
          >
            <FlowText
              size="sm"
              color={selected === opt ? theme.background : theme.text}
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
      </View>
      <View style={{ flex: 1, paddingHorizontal: 24, gap: 24, paddingTop: 24 }}>
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
        <FlowCard style={{ padding: 16 }}>
          <FlowText size="sm" color={theme.textSecondary}>
            {count} × {workMin}m work + {breakMin}m break = {count * (workMin + breakMin)}m total session
          </FlowText>
        </FlowCard>
      </View>
      <View style={{ paddingHorizontal: 24, paddingBottom: 40 }}>
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
