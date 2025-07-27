import React from 'react';

import { ACCENT, FG } from '@/constants';
import { Tabs } from 'expo-router';
import { Settings, Swords, Table } from 'lucide-react-native';
import { Platform, StyleProp, ViewStyle } from 'react-native';

export default function TabLayout() {
  const commonStyle: StyleProp<ViewStyle> = { marginTop: 10 }
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <Settings size={28} color={focused ? ACCENT : FG} style={commonStyle} />,
        }}
      />
      <Tabs.Screen
        name="fight"
        options={{
          tabBarIcon: ({ focused }) => <Swords size={28} color={focused ? ACCENT : FG} style={commonStyle} />,
        }}
      />
      <Tabs.Screen
        name="grid"
        options={{
          tabBarIcon: ({ focused }) => <Table size={28} color={focused ? ACCENT : FG} style={commonStyle} />,
        }}
      />
    </Tabs>
  );
}
