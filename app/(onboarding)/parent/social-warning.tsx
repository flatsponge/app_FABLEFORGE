import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInUp, ZoomIn, Easing } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

export default function SocialWarningScreen() {
    const router = useRouter();
    const [showStat, setShowStat] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowStat(true), 1200);
        return () => clearTimeout(timer);
    }, []);

    return (
        <View className="flex-1 bg-white items-center justify-center px-6">

            <Animated.View entering={FadeIn.delay(200)} className="items-center w-full mb-10">
                <View className="bg-gray-100 p-4 rounded-full mb-6">
                    <Ionicons name="people" size={40} color="#374151" />
                </View>

                <Text className="text-gray-400 font-bold tracking-widest uppercase text-xs mb-3">
                    The Social Impact
                </Text>
                <Text className="text-3xl text-gray-900 font-serif text-center font-bold leading-tight">
                    It's not just about home.
                </Text>
            </Animated.View>

            <Animated.View entering={ZoomIn.delay(400).duration(600)} className="w-full bg-gray-50 border border-gray-200 p-8 rounded-3xl mb-8 items-center relative overflow-hidden">
                <View className="absolute -right-10 -top-10 w-32 h-32 bg-red-100 rounded-full" />
                <View className="absolute -left-10 -bottom-10 w-32 h-32 bg-red-100 rounded-full" />

                <Ionicons name="school-outline" size={48} color="#ef4444" style={{ marginBottom: 16 }} />

                <Text className="text-center text-gray-800 text-lg leading-relaxed font-medium">
                    Children who struggle with emotional regulation are
                </Text>

                <Text className="text-5xl font-black text-red-600 my-4">2x</Text>

                <Text className="text-center text-gray-800 text-lg leading-relaxed font-medium">
                    more likely to face <Text className="font-bold text-red-600">social isolation</Text> or difficulty making friends at school.
                </Text>
            </Animated.View>

            {showStat && (
                <Animated.View entering={FadeInUp.duration(600).easing(Easing.out(Easing.cubic))} className="w-full">
                    <View className="bg-red-50 p-4 rounded-2xl border border-red-100 mb-8 flex-row items-center">
                        <Ionicons name="alert-circle" size={24} color="#dc2626" style={{ marginRight: 12 }} />
                        <Text className="text-red-800 text-sm flex-1 leading-relaxed">
                            "Social rejection in early schooling is a primary predictor of negative attitudes towards education."
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => router.push('/(onboarding)/parent/parent-warning')}
                        className="w-full bg-gray-900 py-4 rounded-full flex-row items-center justify-center"
                    >
                        <Text className="text-white text-lg font-bold mr-2">And the toll on you...</Text>
                        <Ionicons name="arrow-forward" size={20} color="white" />
                    </TouchableOpacity>
                </Animated.View>
            )}
        </View>
    );
}
