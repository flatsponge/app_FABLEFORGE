import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const TIMES = [
    { id: 'morning', label: 'Morning', description: 'Start the day right', icon: 'sunny', color: '#f97316' },
    { id: 'afternoon', label: 'Afternoon', description: 'After school/nap', icon: 'partly-sunny', color: '#eab308' },
    { id: 'bedtime', label: 'Bedtime', description: 'Wind down routine', icon: 'moon', color: '#6366f1' },
    { id: 'anytime', label: 'Whenever works', description: 'No set time', icon: 'time', color: '#8b5cf6' },
];

export default function ReadingTimeScreen() {
    const router = useRouter();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
        setTimeout(() => {
            router.push('/(onboarding)/quiz/story-length');
        }, 300);
    };

    return (
        <View className="flex-1 bg-[#FDFBF7] px-6 pt-12 pb-8">
            <View className="h-1.5 bg-gray-200 rounded-full mb-8 overflow-hidden">
                <View className="h-full bg-primary-500" style={{ width: '35%' }} />
            </View>

            <Animated.View entering={FadeIn.delay(100)}>
                <Text className="text-3xl font-bold text-gray-900 mb-2">
                    When do you usually read together?
                </Text>
                <Text className="text-lg text-gray-500 mb-8">
                    We'll remind you at the perfect moment.
                </Text>
            </Animated.View>

            <View className="flex-1">
                {TIMES.map((time, index) => (
                    <Animated.View key={time.id} entering={FadeIn.duration(300)}>
                        <TouchableOpacity
                            onPress={() => handleSelect(time.id)}
                            className={`mb-3 p-5 rounded-2xl border-2 flex-row items-center ${selected === time.id
                                    ? 'bg-primary-50 border-primary-500'
                                    : 'bg-white border-gray-100'
                                }`}
                        >
                            <View className={`w-12 h-12 rounded-xl items-center justify-center mr-4`} style={{ backgroundColor: `${time.color}20` }}>
                                <Ionicons name={time.icon as any} size={24} color={time.color} />
                            </View>
                            <View className="flex-1">
                                <Text className={`text-lg font-bold ${selected === time.id ? 'text-primary-900' : 'text-gray-900'}`}>
                                    {time.label}
                                </Text>
                                <Text className={`text-sm ${selected === time.id ? 'text-primary-700' : 'text-gray-500'}`}>
                                    {time.description}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                ))}
            </View>
        </View>
    );
}
