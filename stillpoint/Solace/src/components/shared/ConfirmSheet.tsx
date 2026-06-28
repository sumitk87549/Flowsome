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

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
          <View style={styles.actions}>
            <Pressable style={styles.button} onPress={onCancel}>
              <Text style={[styles.buttonText, { color: theme.colors.textMuted }]}>{cancelLabel}</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.confirmButton]} onPress={onConfirm}>
              <Text style={[styles.buttonText, { color: theme.colors.danger }]}>{confirmLabel}</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheet: {
    width: '80%',
    borderRadius: 16,
    padding: 24,
  },
  title: {
    fontFamily: FONT.regular,
    fontSize: FS.lg,
    textAlign: 'center',
    marginBottom: 32,
    letterSpacing: TRACKING.wide,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  confirmButton: {
  },
  buttonText: {
    fontFamily: FONT.regular,
    fontSize: FS.base,
    letterSpacing: TRACKING.base,
  },
});
