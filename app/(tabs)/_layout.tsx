import React from 'react';
import { Tabs } from 'expo-router';
import { CustomTabBar } from '@/components/CustomTabBar';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

function TabBar(props: BottomTabBarProps) {
  const currentRoute = props.state.routes[props.state.index].name;
  return (
    <CustomTabBar
      activeTab={currentRoute === 'index' ? 'home' : currentRoute}
      onTabChange={(tab) => {
        const route = tab === 'home' ? 'index' : tab;
        props.navigation.navigate(route);
      }}
      onFabPress={() => props.navigation.navigate('create')}
    />
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="stats" />
      <Tabs.Screen name="create" />
      <Tabs.Screen name="child-hub" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
