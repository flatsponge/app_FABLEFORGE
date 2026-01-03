import React from 'react';
import { Tabs } from 'expo-router';
import { CustomTabBar } from '@/components/CustomTabBar';
import { ChildLockProvider, useChildLock } from '@/contexts/ChildLockContext';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

function TabBar(props: BottomTabBarProps) {
  const currentRoute = props.state.routes[props.state.index].name;
  const { isChildLocked, isOnChildHub } = useChildLock();

  // Hide tab bar when locked and on child-hub
  const shouldHide = isChildLocked && isOnChildHub;

  return (
    <CustomTabBar
      activeTab={currentRoute === 'index' ? 'home' : currentRoute}
      onTabChange={(tab) => {
        const route = tab === 'home' ? 'index' : tab;
        props.navigation.navigate(route);
      }}
      onFabPress={() => props.navigation.navigate('create')}
      hidden={shouldHide}
    />
  );
}

function TabLayoutContent() {
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

export default function TabLayout() {
  return (
    <ChildLockProvider>
      <TabLayoutContent />
    </ChildLockProvider>
  );
}
