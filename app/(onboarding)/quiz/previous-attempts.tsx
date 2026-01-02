import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';

const OPTIONS = [
    { id: 'tried_all', label: 'Yes, tried everything', description: 'Books, apps, charts...', emoji: '📚' },
    { id: 'tried_some', label: 'Tried a few things', description: 'Some worked, some didn\'t', emoji: '🔄' },
    { id: 'first_time', label: 'This is my first try', description: 'Looking for the right solution', emoji: '🌟' },
    { id: 'professional', label: 'Working with a professional', description: 'Therapist, counselor, etc.', emoji: '👨‍⚕️' },
];

export default function PreviousAttemptsScreen() {
    const router = useRouter();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
        setTimeout(() => {
            router.push('/(onboarding)/quiz/parent-challenges');
        }, 300);
    };

    return (
        <View className="flex-1 bg-[#FDFBF7] px-6 pt-12 pb-8">
            <View className="h-1.5 bg-gray-200 rounded-full mb-8 overflow-hidden">
                <View className="h-full bg-primary-500" style={{ width: '50%' }} />
            </View>

            <Animated.View entering={FadeIn.delay(100)}>
                <Text className="text-3xl font-bold text-gray-900 mb-2">
                    Have you tried other solutions before?
                </Text>
                <Text className="text-lg text-gray-500 mb-8">
                    Understanding your journey helps us help you.
                </Text>
            </Animated.View>

            <View className="flex-1">
                {OPTIONS.map((option, index) => (
                    <Animated.View key={option.id} entering={SlideInUp.delay(150 + index * 60)}>
                        <TouchableOpacity
                            onPress={() => handleSelect(option.id)}
                            className={`mb-3 p-5 rounded-2xl border-2 flex-row items-center ${selected === option.id
                                    ? 'bg-primary-50 border-primary-500'
                                    : 'bg-white border-gray-100'
                                }`}
                        >
                            <Text className="text-3xl mr-4">{option.emoji}</Text>
                            <View className="flex-1">
                                <Text className={`text-lg font-bold ${selected === option.id ? 'text-primary-900' : 'text-gray-900'}`}>
                                    {option.label}
                                </Text>
                                <Text className={`text-sm ${selected === option.id ? 'text-primary-700' : 'text-gray-500'}`}>
                                    {option.description}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                ))}
            </View>
        </View>
    );
}
