// components/ui/Button.tsx
import { ACCENT, FG, SURFACE } from '@/constants';
import React, { ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

interface ButtonProps {
  title?: string;
  children?: ReactNode
  onPress: () => void;
  style?: ViewStyle;
  stroke?: boolean;
  disabled?: boolean;
}

export default function Button({ title, onPress, style, children, stroke = false, disabled = false }: ButtonProps) {
  return (
    <TouchableOpacity style={[styles.wrapper, stroke ? styles.strokeWrapper : styles.solidWrapper, style, disabled ? styles.disabled : {}]} onPress={onPress} disabled={disabled}>
      {children ?? <Text style={styles.text}>{title}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: { borderRadius: 8, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', minWidth: 100 },

  strokeWrapper:  { backgroundColor: SURFACE, borderColor: ACCENT, borderWidth: 1 },
  solidWrapper: { backgroundColor: ACCENT },
  text: { color: FG, fontSize: 16, fontFamily: "IBMPlexSansSemiBold" },
  disabled: { opacity: .5 }
});