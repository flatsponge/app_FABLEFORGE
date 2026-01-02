import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, ZoomIn, SlideInRight } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../../contexts/OnboardingContext';

export default function StatReveal3Screen() {
    const router = useRouter();
    const { data } = useOnboarding();
    const [showCitation, setShowCitation] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowCitation(true), 1200);
        return () => clearTimeout(timer);
    }, []);

    // Logic for dynamic content based on age
    const isOlder = ['6-7', '8-9', '10+'].includes(data.childAge);

    const content = isOlder ? {
        titlePart1: "Habits are",
        titleHighlight: "crystallizing",
        titlePart2: "rapidly right now.",
        stat: "85%",
        statLabel: "Personality Traits Fixed",
        citation: "By age 10, core personality traits and behavioral responses become deeply ingrained and resistant to change."
    } : {
        titlePart1: "Behavioral patterns",
        titleHighlight: "are largely fixed",
        titlePart2: "by age 7.",
        stat: "73%",
        statLabel: "Neural Pathways Formed",
        citation: "The neural circuitry for emotional regulation and social behavior is significantly established during the first seven years."
    };

    return (
        <View className="flex-1 bg-white items-center justify-center px-6">
            <Animated.View entering={FadeIn.delay(200)} className="items-center w-full mb-10">
                <View className="bg-amber-50 px-4 py-1.5 rounded-full mb-8 border border-amber-100 flex-row items-center">
                    <Ionicons name="school" size={16} color="#d97706" style={{ marginRight: 8 }} />
                    <Text className="text-amber-700 uppercase tracking-widest text-[11px] font-bold">
                        Clinical Research
                    </Text>
                </View>

                <Text className="text-3xl text-gray-900 font-serif text-center leading-relaxed">
                    {content.titlePart1}{'\n'}
                    <Text className="text-amber-600 font-bold italic">{content.titleHighlight}</Text>{'\n'}
                    {content.titlePart2}
                </Text>
            </Animated.View>

            {/* The big stat visualization */}
            <Animated.View entering={ZoomIn.springify()} className="items-center justify-center bg-white rounded-full w-64 h-64 border-[6px] border-amber-100 mb-10 relative">
                <Text className="text-8xl font-black text-amber-500 z-10">{content.stat}</Text>
                <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2 px-3 py-1 rounded-full text-center">
                    {content.statLabel}
                </Text>
            </Animated.View>

            {showCitation && (
                <Animated.View entering={SlideInRight.springify()} className="w-full">
                    <View className="bg-gray-50 p-6 rounded-2xl border-l-4 border-amber-500 mb-8">
                        <Text className="text-gray-600 italic mb-4 leading-relaxed font-medium">
                            "{content.citation}"
                        </Text>
                        <View className="flex-row items-center">
                            <View className="w-10 h-10 bg-white rounded-full items-center justify-center mr-3 border border-gray-100">
                                <Ionicons name="library" size={18} color="#78350f" />
                            </View>
                            <View>
                                <Text className="text-gray-900 font-bold text-sm">Harvard University</Text>
                                <Text className="text-gray-500 text-xs">Center on the Developing Child</Text>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={() => router.push('/(onboarding)/parent/stat-reveal-4')}
                        className="w-full bg-gray-900 py-4 rounded-full flex-row items-center justify-center"
                    >
                        <Text className="text-white text-lg font-bold mr-2">What this means for you</Text>
                        <Ionicons name="arrow-forward" size={20} color="white" />
                    </TouchableOpacity>
                </Animated.View>
            )}
        </View>
    );
}
