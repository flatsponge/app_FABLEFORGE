import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown, useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, withSequence } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ResultsIntroScreen() {
    const router = useRouter();
    const [showContent, setShowContent] = useState(false);

    // Pulse animation for the analyzing icon
    const scale = useSharedValue(1);

    useEffect(() => {
        scale.value = withRepeat(
            withSequence(
                withTiming(1.1, { duration: 1000, easing: Easing.ease }),
                withTiming(1, { duration: 1000, easing: Easing.ease })
            ),
            -1,
            true
        );

        const timer = setTimeout(() => setShowContent(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    const animatedCircleStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <View className="flex-1 bg-white items-center justify-center px-6">
            <Animated.View entering={FadeIn.delay(300)} className="items-center mb-12">
                <View className="relative items-center justify-center mb-8">
                    <Animated.View
                        style={[
                            { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: '#f3e8ff' },
                            animatedCircleStyle
                        ]}
                    />
                    <View className="w-28 h-28 bg-white rounded-full items-center justify-center border-4 border-primary-100 z-10">
                        <Ionicons name="scan" size={48} color="#9333ea" />
                    </View>
                </View>

                <Text className="text-4xl font-black text-gray-900 text-center mb-2 tracking-tight">
                    Analysis Complete
                </Text>
                <Text className="text-gray-500 font-medium tracking-widest uppercase text-xs">
                    Processing 14 Data Points
                </Text>
            </Animated.View>

            {showContent && (
                <Animated.View entering={FadeInDown.duration(600)} className="w-full">
                    <View className="bg-red-50 border border-red-100 p-6 rounded-3xl mb-8 w-full">
                        <View className="flex-row items-start mb-4">
                            <View className="bg-white p-2 rounded-full mr-4">
                                <Ionicons name="warning" size={24} color="#ef4444" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-red-900 font-bold text-lg mb-1">
                                    Attention Needed
                                </Text>
                                <Text className="text-red-800/80 leading-relaxed">
                                    We've identified 2 critical areas that diverge from standard developmental benchmarks for this age group.
                                </Text>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={() => router.push('/(onboarding)/parent/stat-reveal-1')}
                        className="w-full bg-gray-900 py-5 rounded-full flex-row items-center justify-center"
                    >
                        <Text className="text-white text-lg font-bold mr-2">Reveal My Results</Text>
                        <Ionicons name="arrow-forward" size={20} color="white" />
                    </TouchableOpacity>
                </Animated.View>
            )}
        </View>
    );
}
