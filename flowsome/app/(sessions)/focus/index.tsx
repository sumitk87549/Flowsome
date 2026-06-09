// app/(sessions)/focus/index.tsx
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeScreen } from '../../../components/ui/SafeScreen';
import { FlowText } from '../../../components/ui/FlowText';
import { FlowButton } from '../../../components/ui/FlowButton';
import { useTheme } from '../../../hooks/useTheme';

export default function FocusSetup() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <SafeScreen>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20 }}>
        <FlowText variant="heading" size="4xl" color={theme.primary}>
          ✨ Flow
        </FlowText>
        <FlowText variant="body" size="sm" color={theme.textMuted}>
          Full session coming in Sprint 9
        </FlowText>
        <FlowButton label="← Back to Home" variant="ghost" onPress={() => router.back()} />
      </View>
    </SafeScreen>
  );
}
