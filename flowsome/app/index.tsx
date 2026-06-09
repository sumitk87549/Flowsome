// app/index.tsx — Full Home Screen (Sprint 4)
import { View } from 'react-native';
import { SafeScreen } from '../components/ui/SafeScreen';
import { FlowText } from '../components/ui/FlowText';
import { ThemeSelector } from '../components/home/ThemeSelector';
import { DayNightToggle } from '../components/home/DayNightToggle';
import { SessionCard, SESSION_CARDS } from '../components/home/SessionCard';
import { useTheme, useThemeConfig } from '../hooks/useTheme';
import { useSettings } from '../hooks/useSettings';

export default function HomeScreen() {
  const theme = useTheme();
  const config = useThemeConfig();
  const { language } = useSettings();

  return (
    <SafeScreen>
      {/* Header Row */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 24,
          paddingTop: 12,
          paddingBottom: 4,
        }}
      >
        <View>
          <FlowText variant="heading" size="2xl" color={theme.primary}>
            Flowsome
          </FlowText>
          <FlowText variant="headingLight" size="sm" color={theme.textMuted}>
            {language === 'hi-IN' ? config.taglineHindi : config.tagline}
          </FlowText>
        </View>
        <DayNightToggle />
      </View>

      {/* Theme Selector Strip */}
      <ThemeSelector />

      {/* Region Label */}
      <View style={{ paddingHorizontal: 24, paddingVertical: 16 }}>
        <FlowText
          variant="headingItalic"
          size="lg"
          color={theme.textSecondary}
          style={{ textAlign: 'center', lineHeight: 28 }}
        >
          {config.name} {config.icon}
        </FlowText>
        <FlowText
          variant="body"
          size="sm"
          color={theme.textMuted}
          style={{ textAlign: 'center', marginTop: 4 }}
        >
          {language === 'hi-IN' ? config.nameHindi : config.name}
        </FlowText>
      </View>

      {/* Session Cards Grid */}
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <FlowText
          variant="label"
          size="xs"
          color={theme.textMuted}
          style={{ marginBottom: 12, letterSpacing: 2, textTransform: 'uppercase' }}
        >
          Choose Your Practice
        </FlowText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {SESSION_CARDS.map((card) => (
            <SessionCard key={card.id} data={card} />
          ))}
        </View>
      </View>
    </SafeScreen>
  );
}
