import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { useOnboarding } from '../../../contexts/OnboardingContext';

const STRUGGLE_AREAS = [
    { id: 'sharing', label: 'Sharing toys & belongings', emoji: '🧸', skill: 'empathy' },
    { id: 'honesty', label: 'Telling the truth', emoji: '💬', skill: 'honesty' },
    { id: 'patience', label: 'Waiting their turn', emoji: '⏳', skill: 'patience' },
    { id: 'responsibility', label: 'Cleaning up after themselves', emoji: '🧹', skill: 'responsibility' },
    { id: 'gratitude', label: 'Saying thank you', emoji: '🙏', skill: 'gratitude' },
    { id: 'teamwork', label: 'Playing nicely with others', emoji: '👫', skill: 'teamwork' },
    { id: 'bravery', label: 'Trying new things', emoji: '🦸', skill: 'bravery' },
    { id: 'problem_solving', label: 'Handling disappointment', emoji: '😤', skill: 'problem_solving' },
];

export default function StruggleAreasScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
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
        // Store selected struggle areas for personalization
        router.push('/(onboarding)/quiz/moral-baseline');
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
                    <View className="h-full bg-primary-500" style={{ width: '50%' }} />
                </View>

                <Animated.View entering={FadeIn.delay(100)}>
                    <Text className="text-3xl font-bold text-gray-900 mb-2">
                        Where does your child struggle most?
                    </Text>
                    <Text className="text-lg text-gray-500 mb-2">
                        Select up to 3 areas where you'd like to see improvement.
                    </Text>
                    <Text className="text-sm text-primary-600 font-medium mb-8">
                        {selected.length}/3 selected
                    </Text>
                </Animated.View>

                <View className="flex-row flex-wrap gap-3">
                    {STRUGGLE_AREAS.map((area, index) => (
                        <Animated.View
                            key={area.id}
                            entering={FadeIn.duration(300)}
                            className="w-[48%]"
                        >
                            <TouchableOpacity
                                onPress={() => toggleSelection(area.id)}
                                className={`p-4 rounded-2xl border-2 ${selected.includes(area.id)
                                    ? 'bg-primary-50 border-primary-500'
                                    : 'bg-white border-gray-100'
                                    }`}
                            >
                                <Text className="text-3xl mb-2">{area.emoji}</Text>
                                <Text className={`text-sm font-semibold ${selected.includes(area.id) ? 'text-primary-900' : 'text-gray-800'
                                    }`}>
                                    {area.label}
                                </Text>
                                {selected.includes(area.id) && (
                                    <View className="absolute top-2 right-2 bg-primary-500 rounded-full p-1">
                                        <Ionicons name="checkmark" size={12} color="white" />
                                    </View>
                                )}
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
