import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChildSetupScreen() {
    const router = useRouter();

    return (
        <View className="flex-1 bg-primary-900">
            <SafeAreaView className="flex-1 items-center justify-center px-6">
                <Animated.View entering={FadeIn.delay(200)} className="items-center mb-12">
                    <View className="bg-white p-4 rounded-3xl mb-6 shadow-2xl">
                        <Ionicons name="sparkles" size={48} color="#9333ea" />
                    </View>
                    <Text className="text-3xl font-bold text-white text-center mb-4">
                        Ready for the Magic?
                    </Text>
                    <Text className="text-lg text-primary-100 text-center leading-relaxed">
                        We have analyzed the plan. Now, let's get your child excited!
                        {'\n\n'}
                        Please hand the device to your child to build their Hero Character.
                    </Text>
                </Animated.View>

                <Animated.View entering={FadeIn.delay(500).duration(600)} className="w-full">
                    <View className="p-6 bg-gray-800 rounded-2xl border border-gray-700 mb-8">
                        <Text className="text-white text-center font-bold mb-2">PARENTAL GATE</Text>
                        <Text className="text-gray-300 text-center text-sm">
                            Tap the lock icon to unlock Child Mode
                        </Text>
                    </View>

                    <TouchableOpacity
                        className="bg-white py-4 rounded-2xl flex-row justify-center items-center active:scale-95"
                        onPress={() => router.push('/(onboarding)/child/avatar')}
                    >
                        <Ionicons name="lock-open" size={24} color="#9333ea" style={{ marginRight: 8 }} />
                        <Text className="text-xl font-bold text-primary-900">Unlock & Hand Over</Text>
                    </TouchableOpacity>
                </Animated.View>
            </SafeAreaView>
        </View>
    );
}
