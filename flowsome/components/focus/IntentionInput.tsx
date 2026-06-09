// components/focus/IntentionInput.tsx
import { TextInput, View } from 'react-native';
import { FlowText } from '../ui/FlowText';
import { useTheme } from '../../hooks/useTheme';
import { FONTS } from '../../constants/typography';

interface IntentionInputProps {
  value: string;
  onChange: (text: string) => void;
  placeholder: string;
}

export function IntentionInput({ value, onChange, placeholder }: IntentionInputProps) {
  const theme = useTheme();

  return (
    <View style={{ gap: 8 }}>
      <FlowText variant="label" size="xs" color={theme.textMuted} style={{ letterSpacing: 2, textTransform: 'uppercase' }}>Your Intention</FlowText>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={theme.textMuted}
        multiline
        maxLength={120}
        style={{
          fontFamily: FONTS.body,
          fontSize: 17,
          color: theme.text,
          backgroundColor: theme.card,
          borderWidth: 1,
          borderColor: theme.cardBorder,
          borderRadius: 16,
          padding: 16,
          minHeight: 80,
          textAlignVertical: 'top',
        }}
      />
    </View>
  );
}
