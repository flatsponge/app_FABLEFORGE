import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';

export default function SofteningScreen() {
    const router = useRouter();

    return (
        <View className="flex-1 bg-primary-50 px-6 pt-12 pb-8">
            <View className="h-1.5 bg-gray-200 rounded-full mb-8 overflow-hidden">
                <View className="h-full bg-primary-500" style={{ width: '80%' }} />
            </View>

            <Animated.View entering={FadeIn.delay(200)} className="flex-1 items-center justify-center">
                <View className="bg-white p-5 rounded-full mb-8">
                    <Ionicons name="heart" size={56} color="#9333ea" />
                </View>

                <Text className="text-3xl font-bold text-center text-gray-900 mb-4">
                    You're not alone in this.
                </Text>

                <Text className="text-xl text-center text-gray-600 leading-relaxed mb-6">
                    <Text className="font-bold text-primary-700">8 out of 10 parents</Text> struggle with the same behavioral challenges you mentioned.
                </Text>

                {/* Stats */}
                <View className="w-full bg-white p-6 rounded-3xl border border-primary-100 mb-6">
                    <View className="flex-row justify-between mb-4">
                        <View className="items-center flex-1">
                            <Text className="text-3xl font-black text-primary-600">65%</Text>
                            <Text className="text-xs text-gray-500 text-center">Lose patience{'\n'}weekly</Text>
                        </View>
                        <View className="w-px bg-gray-200" />
                        <View className="items-center flex-1">
                            <Text className="text-3xl font-black text-primary-600">78%</Text>
                            <Text className="text-xs text-gray-500 text-center">Feel guilty{'\n'}about yelling</Text>
                        </View>
                        <View className="w-px bg-gray-200" />
                        <View className="items-center flex-1">
                            <Text className="text-3xl font-black text-primary-600">91%</Text>
                            <Text className="text-xs text-gray-500 text-center">Want a{'\n'}better way</Text>
                        </View>
                    </View>
                </View>

                <View className="bg-green-50 p-5 rounded-2xl border border-green-100 w-full">
                    <Text className="text-center text-gray-700 leading-relaxed">
                        The fact that you're here means you <Text className="font-bold text-green-700">care deeply</Text> about your child's development.
                        {'\n\n'}
                        Our AI creates <Text className="font-bold text-green-700">personalized stories</Text> that address exactly the behaviors you mentioned—<Text className="font-bold">without lectures, timeouts, or guilt</Text>.
                    </Text>
                </View>
            </Animated.View>

            <Animated.View entering={FadeIn.duration(300)}>
                <TouchableOpacity
                    onPress={() => router.push('/(onboarding)/quiz/processing')}
                    className="bg-primary-600 py-5 rounded-full items-center"
                >
                    <Text className="text-white text-lg font-bold">Build My Personalized Plan</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}
