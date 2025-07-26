import { ACCENT, FG, SURFACE } from '@/constants';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

interface DataTableProps {
  data: string[][]; // [col1, col2, col3, col4]
  headers?: string[];
}

export default function DataTable({ data, headers }: DataTableProps) {
  const renderRow = ({ item }: { item: string[] }) => (
    <View style={styles.row}>
      {item.map((cell, i) => (
        <View key={i} style={[styles.cell, { flex: 1 }]}>
          <Text style={styles.text}>{cell}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {headers && (
        <View style={[styles.row, styles.header]}>
          {headers.map((h, i) => (
            <View key={i} style={[styles.cell, { flex: 1 }]}>
              <Text style={[styles.text, styles.headerText]}>{h}</Text>
            </View>
          ))}
        </View>
      )}
      <FlatList
        data={data}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={renderRow}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: SURFACE, borderRadius: 8, overflow: 'hidden' },
  row: { flexDirection: 'row', borderBottomWidth: 0.5, borderColor: FG + '33' },
  header: { backgroundColor: FG + '11' },
  cell: { paddingVertical: 12, paddingHorizontal: 8, justifyContent: 'center', alignItems: 'center' },
  text: { color: FG, fontFamily: 'IBMPlexSansRegular', fontSize: 14 },
  headerText: { fontFamily: 'IBMPlexSansBold', color: ACCENT },
});