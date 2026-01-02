import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function StatReveal2Screen() {
    const router = useRouter();
    const [showContext, setShowContext] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowContext(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <View className="flex-1 bg-white items-center justify-center px-6">
            <Animated.View entering={FadeIn.delay(200)} className="items-center w-full mb-10">
                <View className="flex-row items-center mb-6">
                    <View className="bg-red-50 px-3 py-1 rounded-full border border-red-100 flex-row items-center">
                        <View className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2" />
                        <Text className="text-red-600 uppercase tracking-widest text-[10px] font-bold">
                            Critical Finding 2 of 4
                        </Text>
                    </View>
                </View>

                <Text className="text-2xl text-gray-900 font-serif text-center mb-8">
                    Responsibility Score
                </Text>

                <Animated.View entering={ZoomIn.springify()} className="items-center mb-8">
                    <Text className="text-9xl font-black text-red-500 leading-none">18%</Text>
                    <View className="bg-red-50 px-6 py-2 rounded-full mt-4">
                        <Text className="text-red-700 font-bold uppercase tracking-wider text-sm">Action Needed</Text>
                    </View>
                </Animated.View>

                {/* Visual Comparison */}
                <Animated.View entering={FadeInUp.delay(500)} className="w-full flex-row items-end justify-center h-32 gap-6 mb-4">
                    <View className="items-center w-16">
                        <Text className="text-red-600 font-bold mb-2">18%</Text>
                        <View className="flex-1 w-full bg-red-50 rounded-t-lg border border-red-100 border-b-0 relative overflow-hidden">
                            <View className="absolute bottom-0 left-0 right-0 bg-red-500 h-[18%]" />
                        </View>
                        <Text className="text-gray-400 text-xs mt-2 font-medium">Child</Text>
                    </View>
                    <View className="items-center w-16">
                        <Text className="text-green-600 font-bold mb-2">65%</Text>
                        <View className="flex-1 w-full bg-green-50 rounded-t-lg border border-green-100 border-b-0 relative overflow-hidden">
                            <View className="absolute bottom-0 left-0 right-0 bg-green-500 h-[65%]" />
                        </View>
                        <Text className="text-gray-400 text-xs mt-2 font-medium">Avg</Text>
                    </View>
                </Animated.View>
            </Animated.View>

            {showContext && (
                <Animated.View entering={FadeInUp.springify().damping(15)} className="w-full bg-red-600 p-6 rounded-3xl">
                    <View className="flex-row items-start">
                        <View className="bg-white/20 p-3 rounded-full mr-4">
                            <Ionicons name="stats-chart" size={24} color="white" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-white font-bold text-lg mb-2">High Risk Factor</Text>
                            <Text className="text-red-50 leading-relaxed mb-6">
                                Children with low responsibility scores are <Text className="font-bold text-white uppercase">3x more likely</Text> to struggle with academic independence later.
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={() => router.push('/(onboarding)/parent/stat-reveal-3')}
                        className="w-full bg-white py-4 rounded-full flex-row items-center justify-center"
                    >
                        <Text className="text-gray-900 text-lg font-bold mr-2">Continue</Text>
                        <Ionicons name="arrow-forward" size={20} color="#111827" />
                    </TouchableOpacity>
                </Animated.View>
            )}
        </View>
    );
}
