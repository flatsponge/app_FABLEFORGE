import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';

const LENGTHS = [
    { id: 'quick', label: '2-3 minutes', description: 'Quick and focused', emoji: '⚡' },
    { id: 'medium', label: '5-7 minutes', description: 'Perfect for bedtime', emoji: '📖' },
    { id: 'long', label: '10-15 minutes', description: 'Deep story experience', emoji: '📚' },
    { id: 'varies', label: 'Depends on the day', description: 'Flexibility is key', emoji: '🎯' },
];

export default function StoryLengthScreen() {
    const router = useRouter();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
        setTimeout(() => {
            router.push('/(onboarding)/quiz/story-themes');
        }, 300);
    };

    return (
        <View className="flex-1 bg-[#FDFBF7] px-6 pt-12 pb-8">
            <View className="h-1.5 bg-gray-200 rounded-full mb-8 overflow-hidden">
                <View className="h-full bg-primary-500" style={{ width: '40%' }} />
            </View>

            <Animated.View entering={FadeIn.delay(100)}>
                <Text className="text-3xl font-bold text-gray-900 mb-2">
                    How long should stories be?
                </Text>
                <Text className="text-lg text-gray-500 mb-8">
                    We'll adjust the story length to fit.
                </Text>
            </Animated.View>

            <View className="flex-1">
                {LENGTHS.map((length, index) => (
                    <Animated.View key={length.id} entering={FadeIn.duration(300)}>
                        <TouchableOpacity
                            onPress={() => handleSelect(length.id)}
                            className={`mb-3 p-5 rounded-2xl border-2 flex-row items-center ${selected === length.id
                                    ? 'bg-primary-50 border-primary-500'
                                    : 'bg-white border-gray-100'
                                }`}
                        >
                            <Text className="text-3xl mr-4">{length.emoji}</Text>
                            <View className="flex-1">
                                <Text className={`text-lg font-bold ${selected === length.id ? 'text-primary-900' : 'text-gray-900'}`}>
                                    {length.label}
                                </Text>
                                <Text className={`text-sm ${selected === length.id ? 'text-primary-700' : 'text-gray-500'}`}>
                                    {length.description}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                ))}
            </View>
        </View>
    );
}
