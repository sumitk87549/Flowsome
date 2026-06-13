// app/(sessions)/pomodoro/index.tsx — Premium: Visual overhaul
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '../../../components/ui/SafeScreen';
import { FlowText } from '../../../components/ui/FlowText';
import { FlowCard } from '../../../components/ui/FlowCard';
import { FlowButton } from '../../../components/ui/FlowButton';
import { useTheme } from '../../../hooks/useTheme';
import { HapticUtils } from '../../../utils/hapticUtils';
import { IntentionInput } from '../../../components/focus/IntentionInput';

const WORK_OPTIONS = [15, 25, 45, 60, 90];
const BREAK_OPTIONS = [5, 10, 15, 20];
const POMODORO_COUNTS = [2, 3, 4, 6];

export default function PomodoroConfig() {
  const theme = useTheme();
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
        <TouchableOpacity 
          onPress={() => { HapticUtils.light(); router.back(); }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            marginBottom: 12,
          }}
        >
          <Ionicons name="chevron-back" size={20} color={theme.textMuted} />
          <Text style={{
            fontFamily: 'DMSans-Medium',
            fontSize: 14,
            color: theme.textMuted,
          }}>
            Back
          </Text>
        </TouchableOpacity>

        <FlowText
          variant="heading"
          size="4xl"
          color={theme.primary}
          style={{ marginTop: 4 }}
        >
          Focus
        </FlowText>
        <FlowText variant="body" size="sm" color={theme.textMuted} style={{ marginTop: 2 }}>
          Interval work cycles for mental endurance
        </FlowText>
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
          label="Start Focus Session"
          size="lg"
          onPress={handleStart}
          style={{ width: '100%', alignItems: 'center' }}
        />
      </View>
    </SafeScreen>
  );
}
