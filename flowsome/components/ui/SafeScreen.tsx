// components/ui/SafeScreen.tsx
import { View, ViewProps, ImageBackground } from 'react-native';
import { NativeSafeAreaViewProps, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, useThemeConfig } from '../../hooks/useTheme';
import { useAppStore } from '../../store/appStore';
import { THEME_IMAGES } from '../../constants/theme-images';

interface SafeScreenProps extends NativeSafeAreaViewProps {
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
      <ImageBackground
        source={THEME_IMAGES[config.id]}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <LinearGradient
          colors={[
            colors.gradientStart + '20', // soft top visibility
            colors.background + 'B0',     // beautiful center gradient blending
            colors.background,           // solid bottom readability
          ]}
          locations={[0, 0.45, 0.85]}
          style={{ flex: 1 }}
        >
          <SafeAreaView style={[{ flex: 1 }, style]} {...props}>
            {children}
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
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

