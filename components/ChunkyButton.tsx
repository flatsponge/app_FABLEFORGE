import React from 'react';
import { Pressable, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';

interface ChunkyButtonProps {
  onPress?: () => void;
  children: React.ReactNode;
  bgColor?: string;
  borderColor?: string;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
}

const SIZE_STYLES = {
  small: { depth: 4, borderSide: 2, borderTop: 2 },
  medium: { depth: 6, borderSide: 3, borderTop: 3 },
  large: { depth: 8, borderSide: 3, borderTop: 3 },
};

export function ChunkyButton({
  onPress,
  children,
  bgColor = '#ffffff',
  borderColor = '#e2e8f0',
  size = 'large',
  disabled = false,
  style,
}: ChunkyButtonProps) {
  const pressed = useSharedValue(0);
  const s = SIZE_STYLES[size];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(pressed.value, [0, 1], [0, s.depth - 2]) }],
  }));



  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={() => {
        if (!disabled) pressed.value = withSpring(1, { damping: 25, stiffness: 600 });
      }}
      onPressOut={() => {
        if (!disabled) pressed.value = withSpring(0, { damping: 25, stiffness: 600 });
      }}
      style={[style, { opacity: disabled ? 0.5 : 1 }]}
    >
      {/* Fixed-height container */}
      <View>
        {/* 3D shadow/depth layer - sits behind the button */}
        <View
          style={{
            position: 'absolute',
            top: s.depth, // Shifted down by the depth amount
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: borderColor,
            borderRadius: 20,
          }}
        />
        {/* Main button surface */}
        <Animated.View
          style={[
            animatedStyle,
            {
              borderWidth: s.borderSide,
              borderColor,
              backgroundColor: bgColor,
              borderRadius: 20,
              // opacity removed from here
              marginBottom: s.depth,
            },
          ]}
        >
          {children}
        </Animated.View>
      </View>
    </Pressable>
  );
}
