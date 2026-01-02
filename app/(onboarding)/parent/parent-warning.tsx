import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

export default function ParentWarningScreen() {
    const router = useRouter();
    const [showStat, setShowStat] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowStat(true), 1200);
        return () => clearTimeout(timer);
    }, []);

    return (
        <View className="flex-1 bg-white items-center justify-center px-6">

            <Animated.View entering={FadeIn.delay(200)} className="items-center w-full mb-10">
                <View className="bg-orange-50 p-4 rounded-full mb-6 relative">
                    <View className="absolute inset-0 bg-orange-100 rounded-full animate-ping" />
                    <Ionicons name="heart-half" size={40} color="#ea580c" />
                </View>

                <Text className="text-gray-400 font-bold tracking-widest uppercase text-xs mb-3">
                    Parental Well-being
                </Text>
                <Text className="text-3xl text-gray-900 font-serif text-center font-bold leading-tight">
                    The Hidden Cost
                </Text>
            </Animated.View>

            <Animated.View entering={ZoomIn.delay(400).springify()} className="w-full bg-orange-50 border border-orange-100 p-8 rounded-3xl mb-8 items-center">

                <Text className="text-center text-gray-800 text-lg leading-relaxed font-medium">
                    Chronic parenting stress increases the risk of cardiovascular issues by
                </Text>

                <Text className="text-6xl font-black text-orange-600 my-6">40%</Text>

                <View className="h-px w-full bg-orange-200 my-2" />

                <Text className="text-center text-gray-500 text-sm mt-4 font-medium italic">
                    "You cannot pour from an empty cup."
                </Text>
            </Animated.View>

            {showStat && (
                <Animated.View entering={FadeInUp.springify().damping(15)} className="w-full">
                    <Text className="text-gray-600 text-center mb-8 px-4 leading-relaxed">
                        Addressing your child's behavior isn't just about them—it's about reclaiming your <Text className="font-bold text-gray-900">peace of mind</Text>.
                    </Text>

                    <TouchableOpacity
                        onPress={() => router.push('/(onboarding)/parent/trajectory')}
                        className="w-full bg-gray-900 py-4 rounded-full flex-row items-center justify-center"
                    >
                        <Text className="text-white text-lg font-bold mr-2">See The Path Forward</Text>
                        <Ionicons name="arrow-forward" size={20} color="white" />
                    </TouchableOpacity>
                </Animated.View>
            )}
        </View>
    );
}
