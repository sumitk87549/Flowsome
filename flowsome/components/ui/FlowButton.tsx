// components/ui/FlowButton.tsx
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { FlowText } from './FlowText';
import { useTheme } from '../../hooks/useTheme';
import { HapticUtils } from '../../utils/hapticUtils';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface FlowButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function FlowButton({
  label,
  variant = 'primary',
  size = 'md',
  onPress,
  style,
  ...props
}: FlowButtonProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = (e: any) => {
    scale.value = withSpring(0.95, { duration: 80 }, () => {
      scale.value = withSpring(1, { duration: 120 });
    });
    HapticUtils.light();
    onPress?.(e);
  };

  const bg = {
    primary: theme.primary,
    secondary: theme.card,
    ghost: 'transparent',
  }[variant];

  const textColor = variant === 'primary' ? theme.background : theme.text;

  const padding = {
    sm: { paddingHorizontal: 16 as number, paddingVertical: 8 as number },
    md: { paddingHorizontal: 24 as number, paddingVertical: 14 as number },
    lg: { paddingHorizontal: 32 as number, paddingVertical: 18 as number },
  }[size];

  const fontSize = { sm: 'sm' as const, md: 'md' as const, lg: 'lg' as const }[size];

  return (
    <AnimatedTouchable
      onPress={handlePress}
      style={[
        animStyle,
        {
          backgroundColor: bg,
          borderRadius: 16,
          borderWidth: variant === 'secondary' ? 1 : 0,
          borderColor: theme.cardBorder,
          alignItems: 'center',
          justifyContent: 'center',
          ...padding,
        },
        style,
      ]}
      activeOpacity={0.9}
      {...props}
    >
      <FlowText variant="bodyMedium" size={fontSize} color={textColor}>
        {label}
      </FlowText>
    </AnimatedTouchable>
  );
}
