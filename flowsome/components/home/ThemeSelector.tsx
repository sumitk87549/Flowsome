// components/home/ThemeSelector.tsx
import { ScrollView, TouchableOpacity } from 'react-native';
import { FlowText } from '../ui/FlowText';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../store/appStore';
import { THEMES, THEME_ORDER, ThemeId } from '../../constants/themes';
import { HapticUtils } from '../../utils/hapticUtils';

interface ThemeChipProps {
  id: ThemeId;
  isActive: boolean;
  onPress: () => void;
}

function ThemeChip({ id, isActive, onPress }: ThemeChipProps) {
  const config = THEMES[id];
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 24,
        marginHorizontal: 4,
        backgroundColor: isActive ? theme.primary : theme.card,
        borderWidth: 1,
        borderColor: isActive ? theme.primary : theme.cardBorder,
      }}
    >
      <FlowText
        size="sm"
        color={isActive ? theme.background : theme.textSecondary}
      >
        {config.icon} {config.name}
      </FlowText>
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
      contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 8 }}
    >
      {THEME_ORDER.map((id) => (
        <ThemeChip
          key={id}
          id={id}
          isActive={activeTheme === id}
          onPress={() => handleThemeSelect(id)}
        />
      ))}
    </ScrollView>
  );
}
