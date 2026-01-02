import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';

export default function CommitmentScreen() {
    const router = useRouter();

    return (
        <View className="flex-1 bg-[#FDFBF7] px-6 pt-12 pb-8">
            <View className="h-1.5 bg-gray-200 rounded-full mb-8 overflow-hidden">
                <View className="h-full bg-primary-500" style={{ width: '75%' }} />
            </View>

            <View className="flex-1 items-center justify-center">
                <Animated.View entering={FadeIn.delay(200)} className="items-center">
                    <View className="bg-primary-100 p-6 rounded-full mb-6">
                        <Ionicons name="heart" size={48} color="#9333ea" />
                    </View>

                    <Text className="text-3xl font-bold text-center text-gray-900 mb-4">
                        One last thing...
                    </Text>

                    <Text className="text-xl text-center text-gray-600 mb-8 leading-relaxed">
                        Are you ready to commit{'\n'}
                        <Text className="font-bold text-primary-600">5 minutes a day</Text>{'\n'}
                        to your child's character growth?
                    </Text>

                    <View className="bg-white p-6 rounded-3xl border border-gray-100 mb-8 w-full">
                        <View className="flex-row items-center mb-3">
                            <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
                            <Text className="text-gray-800 font-medium ml-3">Just one story per day</Text>
                        </View>
                        <View className="flex-row items-center mb-3">
                            <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
                            <Text className="text-gray-800 font-medium ml-3">See results in 7-14 days</Text>
                        </View>
                        <View className="flex-row items-center">
                            <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
                            <Text className="text-gray-800 font-medium ml-3">Cancel anytime, no pressure</Text>
                        </View>
                    </View>
                </Animated.View>
            </View>

            <Animated.View entering={FadeIn.duration(300)}>
                <TouchableOpacity
                    onPress={() => router.push('/(onboarding)/quiz/softening')}
                    className="bg-primary-600 py-5 rounded-full items-center"
                >
                    <Text className="text-white text-lg font-bold">Yes, I'm Ready!</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push('/(onboarding)/quiz/softening')}
                    className="py-4"
                >
                    <Text className="text-center text-gray-400 font-medium">
                        I'll try my best
                    </Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}
