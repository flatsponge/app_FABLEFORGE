import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown, SlideInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

export default function FinalWarningScreen() {
    const router = useRouter();
    const [showCards, setShowCards] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowCards(true), 600);
        return () => clearTimeout(timer);
    }, []);

    return (
        <View className="flex-1 bg-white">
            <ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View className="px-6 pt-16 pb-8">
                    <Animated.View entering={FadeIn.delay(200)} className="items-center">
                        <View className="bg-red-50 p-5 rounded-full mb-6 border border-red-100 relative">
                            <View className="absolute inset-0 bg-red-100 rounded-full animate-ping" />
                            <Ionicons name="hourglass-outline" size={40} color="#d92626" />
                        </View>
                        <Text className="text-3xl font-serif text-gray-900 text-center mb-3">
                            The Cost of Waiting
                        </Text>
                        <Text className="text-gray-500 text-center text-lg max-w-[280px]">
                            Every month of delay makes behavioral change harder.
                        </Text>
                    </Animated.View>
                </View>

                {/* Cards */}
                {showCards && (
                    <View className="px-6 gap-4">
                        <Animated.View entering={FadeInDown.delay(100)} className="bg-white p-5 rounded-3xl border border-gray-100">
                            <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Parent Regret</Text>
                            <View className="flex-row items-end">
                                <Text className="text-4xl font-black text-gray-900 mr-3">89%</Text>
                                <Text className="text-gray-500 pb-2 flex-1">of parents wish they had started earlier.</Text>
                            </View>
                        </Animated.View>

                        <Animated.View entering={FadeInDown.delay(300)} className="bg-white p-5 rounded-3xl border border-gray-100">
                            <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Avg Therapy Costs</Text>
                            <View className="flex-row items-end">
                                <Text className="text-4xl font-black text-gray-900 mr-3">$2.4k</Text>
                                <Text className="text-gray-500 pb-2 flex-1">per year for traditional child therapy.</Text>
                            </View>
                        </Animated.View>

                        <Animated.View entering={FadeInDown.delay(500)} className="bg-red-50 p-5 rounded-3xl border border-red-100">
                            <Text className="text-red-400 text-xs font-bold uppercase tracking-widest mb-1">Escalation Risk</Text>
                            <View className="flex-row items-end">
                                <Text className="text-4xl font-black text-red-600 mr-3">67%</Text>
                                <Text className="text-red-800/60 pb-2 flex-1">escalation rate without intervention.</Text>
                            </View>
                        </Animated.View>
                    </View>
                )}
            </ScrollView>

            {/* Floating CTA */}
            <Animated.View entering={FadeIn.delay(800).duration(600)} className="absolute bottom-0 left-0 right-0 p-6 bg-white/90 blur-xl">
                <TouchableOpacity
                    onPress={() => router.push('/(onboarding)/parent/positive-outlook')}
                    className="w-full bg-gray-900 py-5 rounded-full items-center flex-row justify-center"
                >
                    <Text className="text-white text-lg font-bold mr-2">See The Solution</Text>
                    <Ionicons name="arrow-forward" size={20} color="white" />
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}
