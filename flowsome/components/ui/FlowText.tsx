// components/ui/FlowText.tsx
import { Text, TextProps } from 'react-native';
import { FONTS, FONT_SIZES } from '../../constants/typography';
import { useTheme } from '../../hooks/useTheme';

interface FlowTextProps extends TextProps {
  variant?: 'heading' | 'headingLight' | 'headingItalic' | 'body' | 'bodyMedium' | 'label';
  size?: keyof typeof FONT_SIZES;
  color?: string;
}

export function FlowText({
  variant = 'body',
  size = 'md',
  color,
  style,
  children,
  ...props
}: FlowTextProps) {
  const theme = useTheme();

  const fontFamily = {
    heading: FONTS.heading,
    headingLight: FONTS.headingLight,
    headingItalic: FONTS.headingItalic,
    body: FONTS.body,
    bodyMedium: FONTS.bodyMedium,
    label: FONTS.bodySemiBold,
  }[variant];

  return (
    <Text
      style={[
        {
          fontFamily,
          fontSize: FONT_SIZES[size],
          color: color ?? theme.text,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}
