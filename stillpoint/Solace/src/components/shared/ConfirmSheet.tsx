import React from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { useTheme } from '@/design/theme';
import { FONT, FS, TRACKING } from '@/constants/typography';

interface ConfirmSheetProps {
  visible: boolean;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

export function ConfirmSheet({
  visible,
  title,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
}: ConfirmSheetProps) {
  const theme = useTheme();
  const isNight = theme.mode === 'night';

  // Always fully opaque card — no transparency bleed-through
  const cardBg = isNight ? '#1A1F2A' : '#F5F0EA';
  const dividerColor = isNight ? 'rgba(241,233,218,0.10)' : 'rgba(37,35,31,0.10)';

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      {/* Dark scrim — always dark so background content is masked properly */}
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: cardBg }]}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{title}</Text>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: dividerColor }]} />

          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
              onPress={onCancel}
            >
              <Text style={[styles.buttonText, { color: theme.colors.textMuted }]}>
                {cancelLabel}
              </Text>
            </Pressable>

            {/* Vertical separator */}
            <View style={[styles.verticalDivider, { backgroundColor: dividerColor }]} />

            <Pressable
              style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
              onPress={onConfirm}
            >
              <Text style={[styles.buttonText, { color: theme.colors.danger, fontFamily: FONT.medium }]}>
                {confirmLabel}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    // Deep opaque scrim so nothing bleeds through
    backgroundColor: 'rgba(5, 7, 12, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  sheet: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    // Shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  title: {
    fontFamily: FONT.medium,
    fontSize: FS.base,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 24,
    letterSpacing: 0.3,
  },
  divider: {
    height: 1,
    marginHorizontal: 0,
  },
  actions: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.6,
  },
  verticalDivider: {
    width: 1,
  },
  buttonText: {
    fontFamily: FONT.regular,
    fontSize: FS.base,
    letterSpacing: TRACKING.tight,
  },
});
