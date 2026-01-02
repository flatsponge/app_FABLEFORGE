import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';

const TRAITS = [
    { id: 'shy', label: 'Shy / Reserved', emoji: '🙈' },
    { id: 'outgoing', label: 'Outgoing / Social', emoji: '🌟' },
    { id: 'sensitive', label: 'Sensitive / Emotional', emoji: '💗' },
    { id: 'stubborn', label: 'Strong-willed', emoji: '🦁' },
    { id: 'curious', label: 'Curious / Explorer', emoji: '🔍' },
    { id: 'anxious', label: 'Anxious / Worried', emoji: '😰' },
    { id: 'energetic', label: 'High Energy', emoji: '⚡' },
    { id: 'calm', label: 'Calm / Easy-going', emoji: '🧘' },
];

export default function ChildPersonalityScreen() {
    const router = useRouter();
    const [selected, setSelected] = useState<string[]>([]);

    const toggleSelection = (id: string) => {
        setSelected(prev =>
            prev.includes(id)
                ? prev.filter(x => x !== id)
                : prev.length < 3 ? [...prev, id] : prev
        );
    };

    const canProceed = selected.length >= 1;

    const handleNext = () => {
        router.push('/(onboarding)/quiz/daily-routine');
    };

    return (
        <View className="flex-1 bg-[#FDFBF7]">
            <ScrollView className="flex-1 px-6 pt-12" contentContainerStyle={{ paddingBottom: 120 }}>
                <View className="h-1.5 bg-gray-200 rounded-full mb-8 overflow-hidden">
                    <View className="h-full bg-primary-500" style={{ width: '25%' }} />
                </View>

                <Animated.View entering={FadeIn.delay(100)}>
                    <Text className="text-3xl font-bold text-gray-900 mb-2">
                        Pick words that describe your child
                    </Text>
                    <Text className="text-lg text-gray-500 mb-2">
                        Select up to 3 personality traits.
                    </Text>
                    <Text className="text-sm text-primary-600 font-medium mb-8">
                        {selected.length}/3 selected
                    </Text>
                </Animated.View>

                <View className="flex-row flex-wrap gap-3">
                    {TRAITS.map((trait, index) => (
                        <Animated.View key={trait.id} entering={FadeIn.duration(300)}>
                            <TouchableOpacity
                                onPress={() => toggleSelection(trait.id)}
                                className={`px-4 py-3 rounded-full border-2 flex-row items-center ${selected.includes(trait.id)
                                        ? 'bg-primary-500 border-primary-500'
                                        : 'bg-white border-gray-200'
                                    }`}
                            >
                                <Text className="text-lg mr-2">{trait.emoji}</Text>
                                <Text className={`font-semibold ${selected.includes(trait.id) ? 'text-white' : 'text-gray-700'}`}>
                                    {trait.label}
                                </Text>
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </View>
            </ScrollView>

            <View className="absolute bottom-0 left-0 right-0 p-6 bg-[#FDFBF7]">
                <TouchableOpacity
                    onPress={handleNext}
                    disabled={!canProceed}
                    className={`py-5 rounded-full items-center ${canProceed ? 'bg-primary-600' : 'bg-gray-200'}`}
                >
                    <Text className={`text-lg font-bold ${canProceed ? 'text-white' : 'text-gray-400'}`}>
                        Continue
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
