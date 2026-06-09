// app/settings/index.tsx
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeScreen } from '../../components/ui/SafeScreen';
import { FlowText } from '../../components/ui/FlowText';
import { FlowButton } from '../../components/ui/FlowButton';
import { useTheme } from '../../hooks/useTheme';

export default function Settings() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <SafeScreen>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20 }}>
        <FlowText variant="heading" size="3xl" color={theme.primary}>
          ⚙️ Settings
        </FlowText>
        <FlowText variant="body" size="sm" color={theme.textMuted}>
          Full settings coming in Sprint 10
        </FlowText>
        <FlowButton label="← Back to Home" variant="ghost" onPress={() => router.back()} />
      </View>
    </SafeScreen>
  );
}
