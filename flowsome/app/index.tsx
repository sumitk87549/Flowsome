// app/index.tsx — Sprint 3 test: store + theme switching + persistence
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme, useThemeConfig } from '../hooks/useTheme';
import { useAppStore } from '../store/appStore';
import { THEMES, THEME_ORDER } from '../constants/themes';
import { FONTS, FONT_SIZES } from '../constants/typography';

export default function HomeScreen(): React.JSX.Element {
  const theme = useTheme();
  const config = useThemeConfig();
  const { setTheme, activeTheme, setDayNight, dayNight } = useAppStore();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        gap: 16,
      }}
    >
      {/* App Title */}
      <Text
        style={{
          fontFamily: FONTS.heading,
          fontSize: FONT_SIZES['4xl'],
          color: theme.primary,
        }}
      >
        🌿 FLOWSOME
      </Text>

      {/* Active theme + mode label */}
      <Text
        style={{
          fontFamily: FONTS.body,
          fontSize: FONT_SIZES.md,
          color: theme.textSecondary,
        }}
      >
        {config.icon} {config.name} · {dayNight === 'day' ? '☀️ Day' : '🌙 Night'}
      </Text>

      {/* Theme Picker Buttons */}
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 8,
          justifyContent: 'center',
        }}
      >
        {THEME_ORDER.map((id) => (
          <TouchableOpacity
            key={id}
            onPress={() => setTheme(id)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
              backgroundColor:
                activeTheme === id ? theme.primary : theme.card,
              borderWidth: 1,
              borderColor: theme.cardBorder,
            }}
          >
            <Text
              style={{
                fontFamily: FONTS.body,
                fontSize: FONT_SIZES.sm,
                color:
                  activeTheme === id ? theme.background : theme.text,
              }}
            >
              {THEMES[id].icon} {THEMES[id].name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Day / Night Toggle */}
      <TouchableOpacity
        onPress={() =>
          setDayNight(dayNight === 'day' ? 'night' : 'day')
        }
        style={{
          padding: 12,
          borderRadius: 12,
          backgroundColor: theme.card,
          borderWidth: 1,
          borderColor: theme.cardBorder,
        }}
      >
        <Text
          style={{ fontFamily: FONTS.body, color: theme.text, fontSize: FONT_SIZES.md }}
        >
          Toggle {dayNight === 'day' ? '🌙 Night Mode' : '☀️ Day Mode'}
        </Text>
      </TouchableOpacity>

      {/* Status Footer */}
      <Text
        style={{
          fontFamily: FONTS.body,
          fontSize: FONT_SIZES.xs,
          color: theme.textMuted,
          textAlign: 'center',
          marginTop: 8,
        }}
      >
        Sprint 3 · Stores ✅ · Fonts ✅{'\n'}
        Close and reopen the app → theme should persist
      </Text>
    </View>
  );
}
