// components/ui/FlowCard.tsx
import { View, ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../hooks/useTheme';

interface FlowCardProps extends ViewProps {
  intensity?: number;
  useBlur?: boolean;
}

export function FlowCard({
  children,
  style,
  intensity = 20,
  useBlur = true,
  ...props
}: FlowCardProps) {
  const theme = useTheme();

  if (useBlur) {
    return (
      <BlurView
        intensity={intensity}
        tint="dark"
        style={[
          {
            borderRadius: 20,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: theme.cardBorder,
          },
          style,
        ]}
        {...(props as any)}
      >
        {children}
      </BlurView>
    );
  }

  return (
    <View
      style={[
        {
          backgroundColor: theme.card,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: theme.cardBorder,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
