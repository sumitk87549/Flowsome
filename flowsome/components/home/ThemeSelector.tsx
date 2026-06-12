// components/home/ThemeSelector.tsx
import { ScrollView, TouchableOpacity, ImageBackground, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useEffect } from 'react';
import { FlowText } from '../ui/FlowText';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../store/appStore';
import { THEMES, THEME_ORDER, ThemeId } from '../../constants/themes';
import { THEME_IMAGES } from '../../constants/theme-images';
import { HapticUtils } from '../../utils/hapticUtils';

interface ThemeCardProps {
  id: ThemeId;
  isActive: boolean;
  onPress: () => void;
}

function ThemeCard({ id, isActive, onPress }: ThemeCardProps) {
  const config = THEMES[id];
  const theme = useTheme();
  const scale = useSharedValue(isActive ? 1.04 : 0.96);

  useEffect(() => {
    scale.value = withSpring(isActive ? 1.04 : 0.96, { damping: 15, stiffness: 100 });
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{ marginHorizontal: 6, paddingVertical: 12 }}
    >
      <Animated.View
        style={[
          animatedStyle,
          {
            width: 135,
            height: 190,
            borderRadius: 20,
            overflow: 'hidden',
            borderWidth: 2.5,
            borderColor: isActive ? theme.primary : 'transparent',
            backgroundColor: theme.card,
            shadowColor: theme.primary,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: isActive ? 0.4 : 0,
            shadowRadius: 10,
            elevation: isActive ? 5 : 0,
          }
        ]}
      >
        <ImageBackground
          source={THEME_IMAGES[id]}
          style={{ width: '100%', height: '100%', justifyContent: 'flex-end' }}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.85)']}
            style={{
              padding: 12,
              paddingBottom: 16,
              height: '70%',
              justifyContent: 'flex-end',
            }}
          >
            <FlowText
              variant="heading"
              size="lg"
              color="#FFFFFF"
              style={{
                textShadowColor: 'rgba(0, 0, 0, 0.6)',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 3,
              }}
            >
              {config.icon} {config.name}
            </FlowText>
            <FlowText
              size="xs"
              color="rgba(255, 255, 255, 0.8)"
              style={{
                marginTop: 2,
                textShadowColor: 'rgba(0, 0, 0, 0.6)',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 2,
              }}
            >
              {config.nameHindi}
            </FlowText>
          </LinearGradient>
        </ImageBackground>
      </Animated.View>
    </TouchableOpacity>
  );
}

export function ThemeSelector() {
  const { activeTheme, setTheme } = useAppStore();

  const handleThemeSelect = (id: ThemeId) => {
    HapticUtils.medium();
    setTheme(id);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={147} // 135 width + 12 margin
      decelerationRate="fast"
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 4 }}
    >
      {THEME_ORDER.map((id) => (
        <ThemeCard
          key={id}
          id={id}
          isActive={activeTheme === id}
          onPress={() => handleThemeSelect(id)}
        />
      ))}
    </ScrollView>
  );
}

