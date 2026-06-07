import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppStore } from '../store/appStore';
import { AppTheme, RootStackParamList } from '../types';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

interface NavItem {
  label: string;
  route: keyof RootStackParamList;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', route: 'Home', icon: '◉' },
  { label: 'Themes', route: 'Themes', icon: '◈' },
  { label: 'Settings', route: 'Settings', icon: '◎' },
];

export function BottomNav() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute();
  const theme = useAppStore((s) => s.currentTheme);

  return (
    <View style={[styles.container, { borderTopColor: theme.accentColor + '20' }]}>
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
            theme={theme}
          />
        );
      })}
    </View>
  );
}

interface NavTabProps {
  item: NavItem;
  isActive: boolean;
  onPress: () => void;
  theme: AppTheme;
}

function NavTab({ item, isActive, onPress, theme }: NavTabProps) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handlePressIn() {
    scale.value = withSpring(0.88, { damping: 12, stiffness: 280 });
  }
  function handlePressOut() {
    scale.value = withSpring(1, { damping: 12, stiffness: 280 });
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      style={styles.tab}
    >
      <Animated.View style={[styles.tabInner, animStyle]}>
        <Text
          style={[
            styles.tabIcon,
            { color: isActive ? theme.accentColor : theme.subtextColor + '80' },
          ]}
        >
          {item.icon}
        </Text>
        <Text
          style={[
            styles.tabLabel,
            { color: isActive ? theme.accentColor : theme.subtextColor + '60' },
          ]}
        >
          {item.label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingBottom: 8,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    backgroundColor: 'transparent',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  tabInner: {
    alignItems: 'center',
    gap: 4,
  },
  tabIcon: {
    fontSize: 18,
  },
  tabLabel: {
    fontSize: 10,
    letterSpacing: 0.8,
    fontWeight: '500',
  },
});
