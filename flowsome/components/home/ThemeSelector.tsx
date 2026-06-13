// components/home/ThemeSelector.tsx — Compact landscape thumbnails
import { useRef, useEffect } from 'react';
import { ScrollView, TouchableOpacity, ImageBackground, View, Animated as RNAnimated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ReAnimated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { FlowText } from '../ui/FlowText';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../store/appStore';
import { THEMES, THEME_ORDER, ThemeId } from '../../constants/themes';
import { THEME_IMAGES } from '../../constants/theme-images';
import { HapticUtils } from '../../utils/hapticUtils';
import { useSFX } from '../../hooks/useAudio';

interface ThemeCardProps {
  id: ThemeId;
  isActive: boolean;
  onPress: () => void;
}

function ThemeCard({ id, isActive, onPress }: ThemeCardProps) {
  const config = THEMES[id];
  const theme = useTheme();
  const scale = useSharedValue(isActive ? 1.02 : 0.97);
  const pressScale = useRef(new RNAnimated.Value(1)).current;

  useEffect(() => {
    scale.value = withSpring(isActive ? 1.02 : 0.97, { damping: 14, stiffness: 100 });
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    RNAnimated.spring(pressScale, { toValue: 0.95, useNativeDriver: true, damping: 15, stiffness: 200 }).start();
  };
  const handlePressOut = () => {
    RNAnimated.spring(pressScale, { toValue: 1, useNativeDriver: true, damping: 12, stiffness: 180 }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      style={{ marginHorizontal: 5, paddingVertical: 6 }}
    >
      <RNAnimated.View style={{ transform: [{ scale: pressScale }] }}>
        <ReAnimated.View
          style={[
            animatedStyle,
            {
              width: 110,
              height: 80,
              borderRadius: 14,
              overflow: 'hidden',
              borderWidth: isActive ? 2 : 1,
              borderColor: isActive ? theme.primary : 'rgba(255,255,255,0.08)',
              backgroundColor: theme.card,
              opacity: isActive ? 1 : 0.55,
              // Subtle glow for selected
              shadowColor: isActive ? theme.primary : 'transparent',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isActive ? 0.4 : 0,
              shadowRadius: 8,
              elevation: isActive ? 4 : 0,
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
                paddingHorizontal: 10,
                paddingBottom: 8,
                paddingTop: 20,
              }}
            >
              <FlowText
                variant="heading"
                size="sm"
                color="#FFFFFF"
                style={{
                  textShadowColor: 'rgba(0,0,0,0.8)',
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 3,
                }}
              >
                {config.name}
              </FlowText>
            </LinearGradient>
          </ImageBackground>
        </ReAnimated.View>
      </RNAnimated.View>
    </TouchableOpacity>
  );
}

export function ThemeSelector() {
  const { activeTheme, setTheme } = useAppStore();
  const { playRegionSelect } = useSFX();

  const handleThemeSelect = (id: ThemeId) => {
    HapticUtils.medium();
    playRegionSelect();
    setTheme(id);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={120}
      decelerationRate="fast"
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 2 }}
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
