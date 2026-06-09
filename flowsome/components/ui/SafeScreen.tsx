// components/ui/SafeScreen.tsx
import { View, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, useThemeConfig } from '../../hooks/useTheme';
import { useAppStore } from '../../store/appStore';

interface SafeScreenProps extends ViewProps {
  withGradient?: boolean;
}

export function SafeScreen({
  children,
  withGradient = true,
  style,
  ...props
}: SafeScreenProps) {
  const theme = useTheme();
  const config = useThemeConfig();
  const { dayNight } = useAppStore();
  const colors = dayNight === 'day' ? config.dayColors : config.nightColors;

  if (withGradient) {
    return (
      <LinearGradient
        colors={[colors.gradientStart + '40', colors.gradientEnd, colors.background]}
        locations={[0, 0.4, 1]}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={[{ flex: 1 }, style]} {...props}>
          {children}
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <View style={[{ flex: 1, backgroundColor: theme.background }, style]} {...props}>
      <SafeAreaView style={{ flex: 1 }}>
        {children}
      </SafeAreaView>
    </View>
  );
}
