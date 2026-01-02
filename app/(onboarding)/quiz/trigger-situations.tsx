import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';

const SITUATIONS = [
    { id: 'bedtime', label: 'Bedtime resistance', emoji: '🌙' },
    { id: 'screen_time', label: 'Screen time battles', emoji: '📱' },
    { id: 'homework', label: 'Homework struggles', emoji: '📚' },
    { id: 'sibling', label: 'Sibling conflicts', emoji: '👫' },
    { id: 'meal_time', label: 'Meal time issues', emoji: '🍽️' },
    { id: 'morning_routine', label: 'Morning routine chaos', emoji: '🌅' },
    { id: 'public_behavior', label: 'Public meltdowns', emoji: '🏪' },
    { id: 'transitions', label: 'Difficulty with transitions', emoji: '🔄' },
];

export default function TriggerSituationsScreen() {
    const router = useRouter();
    const [selected, setSelected] = useState<string[]>([]);

    const toggleSelection = (id: string) => {
        setSelected(prev =>
            prev.includes(id)
                ? prev.filter(x => x !== id)
                : [...prev, id]
        );
    };

    const canProceed = selected.length >= 1;

    const handleNext = () => {
        router.push('/(onboarding)/quiz/struggle-areas');
    };

    return (
        <View className="flex-1 bg-[#FDFBF7]">
            <ScrollView
                className="flex-1 px-6 pt-12"
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Progress */}
                <View className="h-1.5 bg-gray-200 rounded-full mb-8 overflow-hidden">
                    <View className="h-full bg-primary-500" style={{ width: '33%' }} />
                </View>

                <Animated.View entering={FadeIn.delay(100)}>
                    <Text className="text-3xl font-bold text-gray-900 mb-2">
                        What situations trigger the most conflict?
                    </Text>
                    <Text className="text-lg text-gray-500 mb-8">
                        Select all that apply. We'll create stories that address these moments.
                    </Text>
                </Animated.View>

                <View className="flex-row flex-wrap gap-3">
                    {SITUATIONS.map((situation, index) => (
                        <Animated.View
                            key={situation.id}
                            entering={FadeIn.duration(300)}
                        >
                            <TouchableOpacity
                                onPress={() => toggleSelection(situation.id)}
                                className={`px-4 py-3 rounded-full border-2 flex-row items-center ${selected.includes(situation.id)
                                    ? 'bg-primary-500 border-primary-500'
                                    : 'bg-white border-gray-200'
                                    }`}
                            >
                                <Text className="text-lg mr-2">{situation.emoji}</Text>
                                <Text className={`font-semibold ${selected.includes(situation.id) ? 'text-white' : 'text-gray-700'
                                    }`}>
                                    {situation.label}
                                </Text>
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </View>
            </ScrollView>

            {/* Fixed CTA */}
            <View className="absolute bottom-0 left-0 right-0 p-6 bg-[#FDFBF7]">
                <TouchableOpacity
                    onPress={handleNext}
                    disabled={!canProceed}
                    className={`py-5 rounded-full items-center ${canProceed ? 'bg-primary-600' : 'bg-gray-200'
                        }`}
                >
                    <Text className={`text-lg font-bold ${canProceed ? 'text-white' : 'text-gray-400'}`}>
                        Continue
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
