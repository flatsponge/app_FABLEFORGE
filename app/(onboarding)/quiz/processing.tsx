import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const MESSAGES = [
    { text: "Analyzing behavioral patterns...", icon: "analytics" },
    { text: "Cross-referencing with child development research...", icon: "library" },
    { text: "Identifying key intervention points...", icon: "bulb" },
    { text: "Matching with proven story frameworks...", icon: "book" },
    { text: "Building personalized character model...", icon: "person" },
    { text: "Preparing your child's hero journey...", icon: "rocket" },
];

export default function ProcessingScreen() {
    const router = useRouter();
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    useEffect(() => {
        const messageInterval = setInterval(() => {
            setCurrentMessageIndex((prev) => {
                if (prev < MESSAGES.length - 1) return prev + 1;
                return prev;
            });
        }, 1200);

        const navigationTimer = setTimeout(() => {
            router.push('/(onboarding)/child/setup');
        }, 1200 * MESSAGES.length + 800);

        return () => {
            clearInterval(messageInterval);
            clearTimeout(navigationTimer);
        };
    }, []);

    const progress = ((currentMessageIndex + 1) / MESSAGES.length) * 100;

    return (
        <View className="flex-1 bg-gray-900 items-center justify-center px-8">
            <Animated.View entering={FadeIn.duration(800)} className="items-center w-full">
                {/* Animated Icon */}
                <View className="mb-10 p-8 bg-primary-900 rounded-full border border-primary-700">
                    <ActivityIndicator size="large" color="#a855f7" />
                </View>

                {/* Title */}
                <Text className="text-2xl font-bold text-white text-center mb-2">
                    Analyzing Your Responses
                </Text>
                <Text className="text-gray-400 text-center mb-10">
                    Creating your personalized plan...
                </Text>

                {/* Current Task */}
                <View className="h-20 items-center justify-center w-full">
                    <Animated.View
                        key={currentMessageIndex}
                        entering={FadeIn.duration(300)}
                        exiting={FadeOut.duration(300)}
                        className="flex-row items-center bg-gray-800 px-6 py-4 rounded-2xl"
                    >
                        <Ionicons
                            name={MESSAGES[currentMessageIndex].icon as any}
                            size={24}
                            color="#a855f7"
                            style={{ marginRight: 12 }}
                        />
                        <Text className="text-white font-medium text-center flex-1">
                            {MESSAGES[currentMessageIndex].text}
                        </Text>
                    </Animated.View>
                </View>

                {/* Progress Bar */}
                <View className="w-full mt-10">
                    <View className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                        <View
                            className="h-full bg-primary-500 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </View>
                    <View className="flex-row justify-between mt-3">
                        <Text className="text-gray-500 text-xs">Processing...</Text>
                        <Text className="text-primary-400 text-xs font-medium">{Math.round(progress)}%</Text>
                    </View>
                </View>

                {/* Trust indicators */}
                <View className="mt-12 flex-row items-center justify-center">
                    <Ionicons name="shield-checkmark" size={16} color="#4ade80" />
                    <Text className="text-gray-400 text-xs ml-2">Your data is encrypted and secure</Text>
                </View>
            </Animated.View>
        </View>
    );
}
