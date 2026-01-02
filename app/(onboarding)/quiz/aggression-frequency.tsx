import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { useOnboarding } from '../../../contexts/OnboardingContext';

const FREQUENCIES = [
    { id: 'daily', label: 'Daily', description: 'Almost every day', severity: 'high' },
    { id: 'weekly', label: 'Weekly', description: 'A few times per week', severity: 'medium' },
    { id: 'monthly', label: 'Monthly', description: 'A few times per month', severity: 'low' },
    { id: 'rarely', label: 'Rarely', description: 'Once in a while', severity: 'minimal' },
];

export default function AggressionFrequencyScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
        updateData({ aggressionFrequency: id });
        setTimeout(() => {
            router.push('/(onboarding)/quiz/struggle-areas');
        }, 300);
    };

    return (
        <View className="flex-1 bg-[#FDFBF7] px-6 pt-16 pb-8">
            <Animated.View entering={FadeIn.delay(100)}>
                <Text className="text-3xl font-bold text-gray-900 mb-2">
                    How often does this happen?
                </Text>
                <Text className="text-lg text-gray-500 mb-8">
                    This helps us understand the urgency level.
                </Text>
            </Animated.View>

            <View className="flex-1">
                {FREQUENCIES.map((freq, index) => (
                    <Animated.View key={freq.id} entering={SlideInUp.delay(150 + index * 80)}>
                        <TouchableOpacity
                            onPress={() => handleSelect(freq.id)}
                            className={`mb-4 p-5 rounded-2xl border-2 flex-row items-center ${selected === freq.id
                                ? 'bg-primary-50 border-primary-500'
                                : 'bg-white border-gray-100'
                                }`}
                        >
                            <View className="flex-1">
                                <Text className={`text-xl font-bold mb-1 ${selected === freq.id ? 'text-primary-900' : 'text-gray-900'
                                    }`}>
                                    {freq.label}
                                </Text>
                                <Text className={`text-sm ${selected === freq.id ? 'text-primary-700' : 'text-gray-500'
                                    }`}>
                                    {freq.description}
                                </Text>
                            </View>

                            {freq.severity === 'high' && (
                                <View className="bg-red-100 px-3 py-1 rounded-full">
                                    <Text className="text-red-700 text-xs font-bold">Urgent</Text>
                                </View>
                            )}
                            {freq.severity === 'medium' && (
                                <View className="bg-orange-100 px-3 py-1 rounded-full">
                                    <Text className="text-orange-700 text-xs font-bold">Moderate</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </Animated.View>
                ))}
            </View>
        </View>
    );
}
