import React, { useEffect } from 'react';
import { View } from 'react-native';
import { LucideIcon, PlusCircle } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const AnimatedView = Animated.createAnimatedComponent(View);

export const TabIcon = ({
  icon: Icon,
  color,
  focused,
}: {
  icon: LucideIcon;
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

export const CreateTabIcon = ({ focused }: { focused: boolean }) => {
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
