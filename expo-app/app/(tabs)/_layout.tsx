import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { View, Pressable } from 'react-native';
import { Home, BarChart2, PlusCircle, Baby, Settings } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

type ColorScheme = 'light' | 'dark';

const AnimatedView = Animated.createAnimatedComponent(View);

const TabIcon = ({
  icon: Icon,
  color,
  focused,
}: {
  icon: typeof Home;
  color: string;
  focused: boolean;
}) => {
  const translateY = useSharedValue(0);
  const indicatorScale = useSharedValue(0);
  const indicatorY = useSharedValue(0);

  useEffect(() => {
    if (focused) {
      translateY.value = withSpring(-4, { damping: 15, stiffness: 200 });
      indicatorScale.value = withSpring(1, { damping: 12, stiffness: 200 });
      indicatorY.value = withRepeat(
        withSequence(
          withTiming(-2, { duration: 400 }),
          withTiming(0, { duration: 400 })
        ),
        -1,
        true
      );
    } else {
      translateY.value = withSpring(0, { damping: 15, stiffness: 200 });
      indicatorScale.value = withSpring(0, { damping: 12, stiffness: 200 });
    }
  }, [focused]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [
      { scaleX: indicatorScale.value },
      { translateY: indicatorY.value },
    ],
    opacity: indicatorScale.value,
  }));

  return (
    <View className="items-center justify-center w-12 h-12">
      <AnimatedView style={indicatorStyle} className="absolute -top-3 w-8 h-1 bg-purple-500 rounded-full" />
      <AnimatedView style={iconStyle}>
        <Icon
          size={28}
          color={color}
          strokeWidth={focused ? 2.5 : 2}
        />
      </AnimatedView>
    </View>
  );
};

const CreateTabIcon = ({ focused }: { focused: boolean }) => {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (focused) {
      scale.value = withSpring(1.1, { damping: 10, stiffness: 200 });
      rotation.value = withSpring(90, { damping: 12, stiffness: 150 });
    } else {
      scale.value = withSpring(1, { damping: 10, stiffness: 200 });
      rotation.value = withSpring(0, { damping: 12, stiffness: 150 });
    }
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: focused ? '#9333ea' : '#a855f7',
  }));

  return (
    <AnimatedView
      style={containerStyle}
      className="w-14 h-14 rounded-full items-center justify-center -mt-8"
    >
      <AnimatedView style={animatedStyle}>
        <PlusCircle size={32} color="white" strokeWidth={2} />
      </AnimatedView>
    </AnimatedView>
  );
};

export default function TabLayout() {
  const colorScheme = useColorScheme() as ColorScheme;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderTopWidth: 0,
          paddingTop: 8,
          paddingBottom: 28,
          height: 80,
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          position: 'absolute',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 20,
          elevation: 10,
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
