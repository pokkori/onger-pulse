import React from "react";
import {
  View,
  Modal as RNModal,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { COLORS } from "../../constants/colors";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ visible, onClose, children }: ModalProps) {
  return (
    <RNModal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="モーダルを閉じる"
        accessibilityHint="背景をタップしてモーダルを閉じます"
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.content}
          accessibilityViewIsModal
        >
          {children}
        </TouchableOpacity>
      </TouchableOpacity>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: "#1A1A2E",
    borderRadius: 16,
    padding: 24,
    minWidth: 280,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
});
