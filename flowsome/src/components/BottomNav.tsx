import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useAppStore } from '../store/appStore';
import { t } from '../localization/i18n';
import { RootStackParamList } from '../types';
import { TYPE } from '../constants/typography';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
} from 'react-native-reanimated';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

interface NavItem {
  labelKey: 'nav.home' | 'nav.themes' | 'nav.settings';
  route: keyof RootStackParamList;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { labelKey: 'nav.home', route: 'Home', icon: '◉' },
  { labelKey: 'nav.themes', route: 'Themes', icon: '◈' },
  { labelKey: 'nav.settings', route: 'Settings', icon: '◎' },
];

export function BottomNav() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const uiLanguage = useAppStore((s) => s.settings.uiLanguage);

  return (
    <Animated.View
      entering={FadeIn.delay(500).duration(400)}
      style={[
        styles.container,
        {
          borderTopColor: theme.accentColor + '14',
          paddingBottom: Math.max(insets.bottom, 12),
        },
      ]}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = route.name === item.route;
        return (
          <NavTab
            key={String(item.route)}
            item={item}
            isActive={isActive}
            onPress={() => {
              if (!isActive) navigation.navigate(item.route as any);
            }}
            uiLanguage={uiLanguage}
          />
        );
      })}
    </Animated.View>
  );
}

interface NavTabProps {
  item: NavItem;
  isActive: boolean;
  onPress: () => void;
  uiLanguage: ReturnType<typeof useAppStore.getState>['settings']['uiLanguage'];
}

function NavTab({ item, isActive, onPress, uiLanguage }: NavTabProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.82, { damping: 14, stiffness: 320 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 10, stiffness: 200 });
      }}
      activeOpacity={1}
      style={styles.tab}
    >
      <Animated.View style={[styles.tabInner, animStyle]}>
        <Text
          style={[
            styles.tabIcon,
            {
              color: isActive ? theme.accentColor : theme.subtextColor + '45',
              fontSize: isActive ? 21 : 16,
            },
          ]}
        >
          {item.icon}
        </Text>
        <Text
          style={[
            styles.tabLabel,
            {
              color: isActive ? theme.accentColor : theme.subtextColor + '52',
              fontWeight: isActive ? '600' : '400',
            },
          ]}
        >
          {t(uiLanguage, item.labelKey)}
        </Text>
        {isActive && (
          <View style={[styles.activePip, { backgroundColor: theme.accentColor }]} />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    backgroundColor: 'transparent',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  tabInner: {
    alignItems: 'center',
    gap: 3,
  },
  tabIcon: {
    fontSize: 17,
  },
  tabLabel: {
    ...TYPE.MICRO,
    textTransform: 'uppercase',
  },
  activePip: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    marginTop: 2,
  },
});
