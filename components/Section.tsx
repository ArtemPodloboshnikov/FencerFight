// components/ui/Section.tsx
import { FG, SURFACE } from '@/constants';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface SectionProps {
  title?: string;
  children: React.ReactNode;
}

export default function Section({ title, children }: SectionProps) {
  return (
  <View style={styles.section}>
    {title && <Text style={styles.title}>{title}</Text>}
    {children}
  </View>
  )
};

const styles = StyleSheet.create({
  section: { backgroundColor: SURFACE, borderRadius: 16, padding: 16, marginBottom: 24 },
  title:   { color: FG, fontSize: 18, marginBottom: 12, fontFamily: "IBMPlexSansBold" },
});