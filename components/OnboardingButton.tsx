import React, { useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, ViewStyle, TextStyle } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  interpolateColor, 
  useSharedValue, 
  interpolate 
} from 'react-native-reanimated';
import { OnboardingTheme } from '../constants/OnboardingTheme';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedText = Animated.createAnimatedComponent(Text);

interface OnboardingButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  textStyle?: TextStyle;
}

export default function OnboardingButton({ title, style, variant = 'primary', textStyle, disabled, ...props }: OnboardingButtonProps) {
  const disableAnim = useSharedValue(disabled ? 1 : 0);

  useEffect(() => {
    disableAnim.value = withTiming(disabled ? 1 : 0, { duration: 300 });
  }, [disabled]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    // Determine target colors based on variant
    let activeBgColor = OnboardingTheme.Colors.Primary;
    let activeBorderColor = 'transparent';
    let shadowOpacity = 0;
    
    if (variant === 'primary') {
      activeBgColor = OnboardingTheme.Colors.Primary;
      shadowOpacity = 0.1;
    } else if (variant === 'secondary') {
      activeBgColor = OnboardingTheme.Colors.Surface;
      activeBorderColor = OnboardingTheme.Colors.Border;
    } else if (variant === 'outline') {
      activeBgColor = 'transparent';
      activeBorderColor = OnboardingTheme.Colors.Primary;
    }

    const backgroundColor = interpolateColor(
      disableAnim.value,
      [0, 1],
      [activeBgColor, OnboardingTheme.Colors.Border]
    );

    const borderColor = interpolateColor(
      disableAnim.value,
      [0, 1],
      [activeBorderColor, 'transparent']
    );

    const opacity = interpolate(
      disableAnim.value,
      [0, 1],
      [shadowOpacity, 0]
    );

    return {
      backgroundColor,
      borderColor,
      shadowOpacity: opacity,
      elevation: interpolate(disableAnim.value, [0, 1], [variant === 'primary' ? 3 : 0, 0]),
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    let activeTextColor = '#FFFFFF';
    
    if (variant === 'secondary') {
      activeTextColor = OnboardingTheme.Colors.Text;
    } else if (variant === 'outline') {
      activeTextColor = OnboardingTheme.Colors.Primary;
    }

    const color = interpolateColor(
      disableAnim.value,
      [0, 1],
      [activeTextColor, OnboardingTheme.Colors.TextSecondary]
    );

    return { color };
  });

  return (
    <AnimatedTouchableOpacity
      style={[
        styles.base,
        // Base variant styles (layout/border width only)
        variant === 'primary' && styles.primaryLayout,
        variant === 'secondary' && styles.secondaryLayout,
        variant === 'outline' && styles.outlineLayout,
        animatedContainerStyle,
        style
      ]}
      activeOpacity={0.8}
      disabled={disabled}
      {...props}
    >
      <AnimatedText style={[
        styles.textBase,
        animatedTextStyle,
        textStyle
      ]}>{title}</AnimatedText>
    </AnimatedTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primaryLayout: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  secondaryLayout: {
    borderWidth: 1,
  },
  outlineLayout: {
    borderWidth: 1,
  },
  textBase: {
    fontSize: 18,
    fontWeight: '700',
  },
});
