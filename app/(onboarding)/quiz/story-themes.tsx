import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';

const THEMES = [
    { id: 'adventure', label: 'Adventure', emoji: '🗺️' },
    { id: 'animals', label: 'Animals', emoji: '🦁' },
    { id: 'space', label: 'Space', emoji: '🚀' },
    { id: 'fantasy', label: 'Fantasy & Magic', emoji: '🧙' },
    { id: 'dinosaurs', label: 'Dinosaurs', emoji: '🦖' },
    { id: 'ocean', label: 'Ocean & Sea', emoji: '🌊' },
    { id: 'superheroes', label: 'Superheroes', emoji: '🦸' },
    { id: 'nature', label: 'Nature', emoji: '🌳' },
    { id: 'vehicles', label: 'Vehicles', emoji: '🚗' },
    { id: 'robots', label: 'Robots & Tech', emoji: '🤖' },
];

export default function StoryThemesScreen() {
    const router = useRouter();
    const [selected, setSelected] = useState<string[]>([]);

    const toggleSelection = (id: string) => {
        setSelected(prev =>
            prev.includes(id)
                ? prev.filter(x => x !== id)
                : [...prev, id]
        );
    };

    const canProceed = selected.length >= 2;

    const handleNext = () => {
        router.push('/(onboarding)/quiz/previous-attempts');
    };

    return (
        <View className="flex-1 bg-[#FDFBF7]">
            <ScrollView className="flex-1 px-6 pt-12" contentContainerStyle={{ paddingBottom: 120 }}>
                <View className="h-1.5 bg-gray-200 rounded-full mb-8 overflow-hidden">
                    <View className="h-full bg-primary-500" style={{ width: '45%' }} />
                </View>

                <Animated.View entering={FadeIn.delay(100)}>
                    <Text className="text-3xl font-bold text-gray-900 mb-2">
                        What does your child love?
                    </Text>
                    <Text className="text-lg text-gray-500 mb-2">
                        Select 2 or more favorite themes.
                    </Text>
                    <Text className="text-sm text-primary-600 font-medium mb-8">
                        {selected.length} selected
                    </Text>
                </Animated.View>

                <View className="flex-row flex-wrap gap-3">
                    {THEMES.map((theme, index) => (
                        <Animated.View key={theme.id} entering={SlideInUp.delay(80 + index * 30)}>
                            <TouchableOpacity
                                onPress={() => toggleSelection(theme.id)}
                                className={`px-4 py-3 rounded-2xl border-2 flex-row items-center ${selected.includes(theme.id)
                                    ? 'bg-primary-500 border-primary-500'
                                    : 'bg-white border-gray-200'
                                    }`}
                            >
                                <Text className="text-xl mr-2">{theme.emoji}</Text>
                                <Text className={`font-semibold ${selected.includes(theme.id) ? 'text-white' : 'text-gray-700'}`}>
                                    {theme.label}
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
