// app/index.tsx — Sprint 2 test screen: confirms fonts and theme constants load correctly
import { View, Text, ScrollView } from 'react-native';
import { useFonts } from 'expo-font';
import { FONTS, FONT_SIZES } from '../constants/typography';
import { THEMES, THEME_ORDER } from '../constants/themes';
import { BREATHING_PATTERNS } from '../constants/breathing-patterns';
import { MEDITATION_TYPES } from '../constants/meditation-types';
import { FOCUS_MODES } from '../constants/focus-modes';

export default function HomeScreen(): React.JSX.Element {
  const [fontsLoaded] = useFonts({
    [FONTS.heading]: require('../assets/fonts/CormorantGaramond-SemiBold.ttf'),
    [FONTS.headingLight]: require('../assets/fonts/CormorantGaramond-Light.ttf'),
    [FONTS.headingItalic]: require('../assets/fonts/CormorantGaramond-Italic.ttf'),
    [FONTS.body]: require('../assets/fonts/DMSans-Regular.ttf'),
    [FONTS.bodyMedium]: require('../assets/fonts/DMSans-Medium.ttf'),
    [FONTS.bodySemiBold]: require('../assets/fonts/DMSans-SemiBold.ttf'),
  });

  const theme = THEMES.rajasthan;
  const colors = theme.dayColors;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 24, paddingTop: 60 }}
    >
      {/* Title */}
      <Text
        style={{
          fontFamily: fontsLoaded ? FONTS.heading : undefined,
          fontSize: FONT_SIZES['4xl'],
          color: colors.primary,
          marginBottom: 4,
        }}
      >
        🌿 FLOWSOME
      </Text>

      {/* Font status */}
      <Text
        style={{
          fontFamily: fontsLoaded ? FONTS.body : undefined,
          fontSize: FONT_SIZES.md,
          color: fontsLoaded ? '#4ADE80' : colors.textMuted,
          marginBottom: 24,
        }}
      >
        {fontsLoaded ? 'Fonts: ✅ Loaded (6/6)' : 'Fonts: ⏳ Loading...'}
      </Text>

      {/* Themes */}
      <Text
        style={{
          fontFamily: fontsLoaded ? FONTS.bodyMedium : undefined,
          fontSize: FONT_SIZES.sm,
          color: colors.textMuted,
          letterSpacing: 2,
          marginBottom: 8,
        }}
      >
        THEMES ({THEME_ORDER.length})
      </Text>
      {THEME_ORDER.map((id) => {
        const t = THEMES[id];
        return (
          <View
            key={id}
            style={{
              backgroundColor: t.dayColors.card,
              borderColor: t.dayColors.cardBorder,
              borderWidth: 1,
              borderRadius: 8,
              padding: 10,
              marginBottom: 6,
            }}
          >
            <Text
              style={{
                fontFamily: fontsLoaded ? FONTS.bodyMedium : undefined,
                fontSize: FONT_SIZES.md,
                color: t.dayColors.primary,
              }}
            >
              {t.icon} {t.name} — {t.nameHindi}
            </Text>
            <Text
              style={{
                fontFamily: fontsLoaded ? FONTS.body : undefined,
                fontSize: FONT_SIZES.xs,
                color: t.dayColors.textMuted,
                marginTop: 2,
              }}
            >
              {t.tagline}
            </Text>
          </View>
        );
      })}

      {/* Breathing Patterns */}
      <Text
        style={{
          fontFamily: fontsLoaded ? FONTS.bodyMedium : undefined,
          fontSize: FONT_SIZES.sm,
          color: colors.textMuted,
          letterSpacing: 2,
          marginTop: 16,
          marginBottom: 8,
        }}
      >
        BREATHING PATTERNS ({BREATHING_PATTERNS.length})
      </Text>
      {BREATHING_PATTERNS.map((p) => (
        <Text
          key={p.id}
          style={{
            fontFamily: fontsLoaded ? FONTS.body : undefined,
            fontSize: FONT_SIZES.sm,
            color: colors.textSecondary,
            marginBottom: 4,
          }}
        >
          • {p.name} — {p.phases.length} phases · {p.cycles} cycles
        </Text>
      ))}

      {/* Meditation Types */}
      <Text
        style={{
          fontFamily: fontsLoaded ? FONTS.bodyMedium : undefined,
          fontSize: FONT_SIZES.sm,
          color: colors.textMuted,
          letterSpacing: 2,
          marginTop: 16,
          marginBottom: 8,
        }}
      >
        MEDITATION TYPES ({MEDITATION_TYPES.length})
      </Text>
      {MEDITATION_TYPES.map((m) => (
        <Text
          key={m.id}
          style={{
            fontFamily: fontsLoaded ? FONTS.body : undefined,
            fontSize: FONT_SIZES.sm,
            color: colors.textSecondary,
            marginBottom: 4,
          }}
        >
          • {m.name} — {m.durationMinutes.join(', ')} min
        </Text>
      ))}

      {/* Focus Modes */}
      <Text
        style={{
          fontFamily: fontsLoaded ? FONTS.bodyMedium : undefined,
          fontSize: FONT_SIZES.sm,
          color: colors.textMuted,
          letterSpacing: 2,
          marginTop: 16,
          marginBottom: 8,
        }}
      >
        FOCUS MODES ({FOCUS_MODES.length})
      </Text>
      {FOCUS_MODES.map((f) => (
        <Text
          key={f.id}
          style={{
            fontFamily: fontsLoaded ? FONTS.body : undefined,
            fontSize: FONT_SIZES.sm,
            color: colors.textSecondary,
            marginBottom: 4,
          }}
        >
          • {f.name} — {f.defaultWorkMinutes}m work / {f.defaultBreakMinutes}m break
        </Text>
      ))}

      {/* Sprint badge */}
      <Text
        style={{
          fontFamily: fontsLoaded ? FONTS.headingItalic : undefined,
          fontSize: FONT_SIZES.sm,
          color: colors.textMuted,
          marginTop: 32,
          marginBottom: 24,
          textAlign: 'center',
        }}
      >
        Sprint 2 — Constants & Font Foundation ✅
      </Text>
    </ScrollView>
  );
}
