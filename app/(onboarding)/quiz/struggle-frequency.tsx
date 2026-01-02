import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';

const FREQUENCIES = [
    { id: 'multiple_daily', label: 'Multiple times a day', emoji: '🔥', severity: 'critical', color: 'red' },
    { id: 'daily', label: 'Once a day', emoji: '⚠️', severity: 'high', color: 'orange' },
    { id: 'few_weekly', label: 'A few times a week', emoji: '📊', severity: 'moderate', color: 'yellow' },
    { id: 'weekly', label: 'Once a week', emoji: '📈', severity: 'low', color: 'green' },
    { id: 'rarely', label: 'Rarely', emoji: '✨', severity: 'minimal', color: 'gray' },
];

export default function StruggleFrequencyScreen() {
    const router = useRouter();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
        setTimeout(() => {
            router.push('/(onboarding)/quiz/parent-guilt');
        }, 400);
    };

    return (
        <View className="flex-1 bg-[#FDFBF7] px-6 pt-12 pb-8">
            {/* Progress */}
            <View className="h-1.5 bg-gray-200 rounded-full mb-8 overflow-hidden">
                <View className="h-full bg-primary-500" style={{ width: '58%' }} />
            </View>

            <Animated.View entering={FadeIn.delay(100)}>
                <Text className="text-3xl font-bold text-gray-900 mb-2">
                    How often do these issues come up?
                </Text>
                <Text className="text-lg text-gray-500 mb-8">
                    This helps us gauge the intensity of support needed.
                </Text>
            </Animated.View>

            <View className="flex-1">
                {FREQUENCIES.map((freq, index) => (
                    <Animated.View key={freq.id} entering={FadeIn.duration(300)}>
                        <TouchableOpacity
                            onPress={() => handleSelect(freq.id)}
                            className={`mb-4 p-5 rounded-2xl border-2 flex-row items-center ${selected === freq.id
                                    ? 'bg-primary-50 border-primary-500'
                                    : 'bg-white border-gray-100'
                                }`}
                        >
                            <Text className="text-2xl mr-4">{freq.emoji}</Text>
                            <View className="flex-1">
                                <Text className={`text-lg font-bold ${selected === freq.id ? 'text-primary-900' : 'text-gray-900'
                                    }`}>
                                    {freq.label}
                                </Text>
                            </View>

                            {freq.severity === 'critical' && (
                                <View className="bg-red-100 px-3 py-1 rounded-full">
                                    <Text className="text-red-700 text-xs font-bold">Critical</Text>
                                </View>
                            )}
                            {freq.severity === 'high' && (
                                <View className="bg-orange-100 px-3 py-1 rounded-full">
                                    <Text className="text-orange-700 text-xs font-bold">High</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </Animated.View>
                ))}
            </View>
        </View>
    );
}
