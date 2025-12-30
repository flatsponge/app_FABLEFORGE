import React from 'react';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, BarChart2, Baby, Settings } from 'lucide-react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { TabIcon, CreateTabIcon } from '@/components/TabBarIcon';

type ColorScheme = 'light' | 'dark';

export default function TabLayout() {
  const colorScheme = useColorScheme() as ColorScheme;
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderTopWidth: 0,
          paddingTop: 8,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 20,
          height: 60 + (insets.bottom > 0 ? insets.bottom : 20),
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          position: 'absolute',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 20,
          elevation: 10,
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarShowLabel: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <TabIcon icon={Home} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <TabIcon icon={BarChart2} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <CreateTabIcon focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="child-hub"
        options={{
          title: 'Me',
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <TabIcon icon={Baby} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <TabIcon icon={Settings} color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
