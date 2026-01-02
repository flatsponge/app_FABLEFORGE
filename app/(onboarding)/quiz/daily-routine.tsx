import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';

const ROUTINES = [
    { id: 'structured', label: 'Very structured', description: 'Set times for everything', emoji: '📅' },
    { id: 'flexible', label: 'Flexible', description: 'General routine with wiggle room', emoji: '🌈' },
    { id: 'chaotic', label: 'Chaotic', description: 'Every day is different', emoji: '🌪️' },
    { id: 'working', label: 'Working on it', description: 'Trying to build better habits', emoji: '🔨' },
];

export default function DailyRoutineScreen() {
    const router = useRouter();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
        setTimeout(() => {
            router.push('/(onboarding)/quiz/reading-time');
        }, 300);
    };

    return (
        <View className="flex-1 bg-[#FDFBF7] px-6 pt-12 pb-8">
            <View className="h-1.5 bg-gray-200 rounded-full mb-8 overflow-hidden">
                <View className="h-full bg-primary-500" style={{ width: '30%' }} />
            </View>

            <Animated.View entering={FadeIn.delay(100)}>
                <Text className="text-3xl font-bold text-gray-900 mb-2">
                    How would you describe your daily routine?
                </Text>
                <Text className="text-lg text-gray-500 mb-8">
                    This helps us suggest the best story times.
                </Text>
            </Animated.View>

            <View className="flex-1">
                {ROUTINES.map((routine, index) => (
                    <Animated.View key={routine.id} entering={FadeIn.duration(300)}>
                        <TouchableOpacity
                            onPress={() => handleSelect(routine.id)}
                            className={`mb-3 p-5 rounded-2xl border-2 flex-row items-center ${selected === routine.id
                                    ? 'bg-primary-50 border-primary-500'
                                    : 'bg-white border-gray-100'
                                }`}
                        >
                            <Text className="text-3xl mr-4">{routine.emoji}</Text>
                            <View className="flex-1">
                                <Text className={`text-lg font-bold ${selected === routine.id ? 'text-primary-900' : 'text-gray-900'}`}>
                                    {routine.label}
                                </Text>
                                <Text className={`text-sm ${selected === routine.id ? 'text-primary-700' : 'text-gray-500'}`}>
                                    {routine.description}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                ))}
            </View>
        </View>
    );
}
