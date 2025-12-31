import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

type HeaderVariant = 'default' | 'child';

interface UnifiedHeaderProps {
  variant?: HeaderVariant;
  title: string;
  showBackButton?: boolean;
  rightAction?: React.ReactNode;
}

export function UnifiedHeader({
  variant = 'default',
  title,
  showBackButton = false,
  rightAction,
}: UnifiedHeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  // Styles based on variant
  const containerClass = variant === 'child'
    ? 'bg-yellow-400 border-b-4 border-yellow-500'
    : 'bg-background dark:bg-slate-900 shadow-sm';

  const titleClass = variant === 'child'
    ? 'text-2xl font-bold text-yellow-900'
    : 'text-xl font-bold text-slate-900 dark:text-white';

  const iconColor = variant === 'child' ? '#713f12' : '#0f172a'; // yellow-900 or slate-900

  return (
    <View
      className={`px-4 pb-4 ${containerClass}`}
      style={{ paddingTop: insets.top }}
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
          <Text className={titleClass} numberOfLines={1}>
            {title}
          </Text>
        </View>

        {/* Right: Action or Spacer */}
        <View className="min-w-[40px] flex-row justify-end items-center">
          {rightAction}
        </View>
      </View>
    </View>
  );
}
