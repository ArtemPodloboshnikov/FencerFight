// components/CenterToast.tsx
import { SURFACE } from '@/constants';
import React, { ReactNode } from 'react';
import { Modal, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function ToastCustom({
  visible,
  onClose,
  children
}: Props) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>
      <View style={styles.center}>
        <View style={styles.card}>{children}</View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: SURFACE,
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    height: 200,
    width: '80%',
  },
});