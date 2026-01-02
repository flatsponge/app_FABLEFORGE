import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, SlideInRight, useAnimatedStyle, withSpring } from 'react-native-reanimated';

type OnboardingScreenProps = {
    title: string;
    subtitle?: string;
    currentStep: number;
    totalSteps: number;
    children: React.ReactNode;
    onBack?: () => void;
    showBack?: boolean;
};

export function OnboardingScreen({
    title,
    subtitle,
    currentStep,
    totalSteps,
    children,
    onBack,
    showBack = true,
}: OnboardingScreenProps) {
    const router = useRouter();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            if (router.canGoBack()) {
                router.back();
            }
        }
    };

    const progress = (currentStep / totalSteps) * 100;

    const progressWidth = React.useMemo(() => ({ width: `${progress}%` }), [progress]);
    
    // Animate the width change
    const animatedStyle = useAnimatedStyle(() => {
        return {
            width: withSpring(`${progress}%`, { damping: 20, stiffness: 90 })
        };
    });

    return (
        <SafeAreaView className="flex-1 bg-[#FDFBF7]">
            {/* Header */}
            <View className="px-4 py-2 flex-row items-center justify-between">
                <View className="w-10">
                    {showBack && (
                        <TouchableOpacity onPress={handleBack} className="p-2 -ml-2">
                            <Ionicons name="chevron-back" size={24} color="#1F2937" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Progress Bar */}
                <View className="flex-1 h-1.5 bg-gray-200 rounded-full mx-4 overflow-hidden">
                    <Animated.View
                        className="h-full bg-primary-600 rounded-full"
                        style={animatedStyle}
                    />
                </View>

                <View className="w-10" />
            </View>

            <ScrollView
                className="flex-1 px-6"
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View entering={FadeIn.duration(600).delay(100)} className="mt-6 mb-8">
                    <Text className="text-3xl font-bold text-gray-900 mb-3 leading-tight font-sans">
                        {title}
                    </Text>
                    {subtitle && (
                        <Text className="text-lg text-gray-500 leading-relaxed">
                            {subtitle}
                        </Text>
                    )}
                </Animated.View>

                <Animated.View entering={FadeIn.duration(400)}>
                    {children}
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}
