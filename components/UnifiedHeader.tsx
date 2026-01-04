import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  SharedValue
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

type HeaderVariant = 'default' | 'child';

interface UnifiedHeaderProps {
  variant?: HeaderVariant;
  title: string;
  showBackButton?: boolean;
  rightAction?: React.ReactNode;
  scrollY?: SharedValue<number>;
}

export function UnifiedHeader({
  variant = 'default',
  title,
  showBackButton = false,
  rightAction,
  scrollY,
}: UnifiedHeaderProps) {
  const insets = useSafeAreaInsets();
  // const router = useRouter(); removed to avoid context error

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  // Base styles
  const isChild = variant === 'child';

  // Dynamic styles via Reanimated
  const containerAnimatedStyle = useAnimatedStyle(() => {
    if (!scrollY || isChild) return {};

    const opacity = interpolate(
      scrollY.value,
      [10, 50],
      [0, 1],
      Extrapolation.CLAMP
    );

    return {
      backgroundColor: `rgba(253, 251, 247, ${opacity})`, // Use hex-to-rgb for 'background' #FDFBF7 if possible, or simple opacity logic
      borderBottomWidth: interpolate(scrollY.value, [49, 50], [0, 1], Extrapolation.CLAMP),
      borderBottomColor: `rgba(226, 232, 240, ${opacity})`, // slate-200
      // Shadow simulation
      shadowOpacity: interpolate(scrollY.value, [49, 50], [0, 0.05], Extrapolation.CLAMP),
    };
  });

  const titleAnimatedStyle = useAnimatedStyle(() => {
    if (!scrollY || isChild) return {};

    return {
      opacity: interpolate(
        scrollY.value,
        [30, 50],
        [0, 1],
        Extrapolation.CLAMP
      ),
    };
  });

  // Static fallback styles
  const staticContainerClass = isChild
    ? 'bg-yellow-400 border-b-4 border-yellow-500'
    : scrollY ? '' : 'bg-background dark:bg-slate-900 shadow-sm';

  // We need to resolve colors for the animated background manually or use a simple hack.
  // For simplicity with NativeWind + Reanimated, we'll apply the static class if NO scrollY,
  // and manage styles manually if scrollY exists.

  const titleClass = isChild
    ? 'text-2xl font-bold text-yellow-900'
    : 'text-xl font-bold text-slate-900 dark:text-white';

  const iconColor = isChild ? '#713f12' : '#0f172a';

  return (
    <Animated.View
      className={`px-4 pb-4 z-10 ${staticContainerClass}`}
      style={[
        { paddingTop: insets.top },
        !isChild && scrollY ? containerAnimatedStyle : {},
        // If animated, we default to transparent/no shadow until scrolled
        !isChild && scrollY ? { backgroundColor: undefined, shadowOpacity: 0 } : {}
      ]}
      accessibilityRole="header"
    >
      <View className="flex-row items-center justify-between h-12">
        {/* Left: Back Button or Spacer */}
        <View className="min-w-[40px] flex-row justify-start items-center">
          {showBackButton && (
            <TouchableOpacity
              onPress={handleBack}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityLabel="Go back"
              accessibilityRole="button"
            >
              <ArrowLeft size={24} color={iconColor} />
            </TouchableOpacity>
          )}
        </View>

        {/* Center: Title */}
        <View className="flex-1 items-center justify-center mx-2">
          <Animated.Text
            className={titleClass}
            numberOfLines={1}
            style={!isChild && scrollY ? titleAnimatedStyle : {}}
          >
            {title}
          </Animated.Text>
        </View>

        {/* Right: Action or Spacer */}
        <View className="min-w-[40px] flex-row justify-end items-center">
          {rightAction}
        </View>
      </View>
    </Animated.View>
  );
}
