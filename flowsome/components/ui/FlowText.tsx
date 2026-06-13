// components/ui/FlowText.tsx — Sprint 13: Built-in text shadows for headings
import { Text, TextProps, TextStyle } from 'react-native';
import { FONTS, FONT_SIZES } from '../../constants/typography';
import { useTheme } from '../../hooks/useTheme';

interface FlowTextProps extends TextProps {
  variant?: 'heading' | 'headingLight' | 'headingItalic' | 'body' | 'bodyMedium' | 'label';
  size?: keyof typeof FONT_SIZES;
  color?: string;
}

// Heading variants get a subtle text shadow for contrast over particle backgrounds
const HEADING_SHADOW: TextStyle = {
  textShadowColor: 'rgba(0,0,0,0.35)',
  textShadowOffset: { width: 0, height: 1 },
  textShadowRadius: 3,
};

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

  const isHeading = variant === 'heading' || variant === 'headingLight' || variant === 'headingItalic';

  return (
    <Text
      style={[
        {
          fontFamily,
          fontSize: FONT_SIZES[size],
          color: color ?? theme.text,
        },
        isHeading ? HEADING_SHADOW : undefined,
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}
