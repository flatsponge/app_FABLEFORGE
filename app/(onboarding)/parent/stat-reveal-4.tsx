import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInUp, ZoomIn, Easing } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../../contexts/OnboardingContext';

export default function StatReveal4Screen() {
    const router = useRouter();
    const { data } = useOnboarding();
    const [showContext, setShowContext] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowContext(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    const isOlder = ['6-7', '8-9', '10+'].includes(data.childAge);

    const content = isOlder ? {
        intro: "Reversing these habits later becomes",
        val: "Harder",
        desc: "Correction is significantly more difficult than prevention. The 'rewiring' process takes 400% more repetition after age 10."
    } : {
        intro: "Once the development window closes, change becomes",
        val: "Harder",
        desc: "Early intervention is the key. Waiting makes behavioral correction significantly more difficult and expensive."
    };

    return (
        <View className="flex-1 bg-red-600 items-center justify-center px-6">

            <Animated.View entering={FadeIn.delay(200)} className="items-center w-full mb-12">
                <View className="bg-white/20 p-4 rounded-full mb-8 backdrop-blur-sm">
                    <Ionicons name="alarm" size={40} color="white" />
                </View>

                <Text className="text-2xl text-red-100 text-center mb-6 font-medium leading-relaxed px-4">
                    {content.intro}
                </Text>

                <Animated.View entering={ZoomIn.duration(600)} className="items-center">
                    <Text className="text-[140px] font-black text-white leading-tight" style={{ textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 0, height: 4 }, textShadowRadius: 10 }}>4x</Text>
                    <Text className="text-5xl text-red-200 font-bold uppercase tracking-[0.2em] -mt-5">{content.val}</Text>
                </Animated.View>
            </Animated.View>

            {showContext && (
                <Animated.View entering={FadeInUp.duration(600).easing(Easing.out(Easing.cubic))} className="w-full">
                    <View className="bg-white p-6 rounded-3xl mb-8">
                        <Text className="text-gray-900 text-center text-lg leading-relaxed font-medium mb-4">
                            "{content.desc}"
                        </Text>
                        <View className="bg-red-50 self-center px-3 py-1 rounded-full">
                            <Text className="text-red-700 text-xs uppercase tracking-wide font-bold">
                                Journal of Pediatric Psychology
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={() => router.push('/(onboarding)/parent/social-warning')}
                        className="w-full bg-gray-900 py-4 rounded-full flex-row items-center justify-center"
                    >
                        <Text className="text-white text-lg font-bold mr-2">See The Ripple Effect</Text>
                        <Ionicons name="arrow-forward" size={20} color="white" />
                    </TouchableOpacity>
                </Animated.View>
            )}
        </View>
    );
}
