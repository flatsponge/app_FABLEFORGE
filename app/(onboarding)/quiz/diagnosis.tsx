import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { useOnboarding } from '../../../contexts/OnboardingContext';

const BEHAVIORS = [
    { id: 'arguing', title: 'Verbal Defiance', description: 'Argues back or refuses to listen', icon: 'chatbox-ellipses', severity: 'common' },
    { id: 'aggression', title: 'Physical Aggression', description: 'Hitting, throwing, or biting', icon: 'hand-left', severity: 'urgent' },
    { id: 'shut_down', title: 'Shuts Down', description: 'Goes silent or ignores you', icon: 'moon', severity: 'moderate' },
    { id: 'tantrums', title: 'Big Tantrums', description: 'Crying, screaming, emotional meltdowns', icon: 'thunderstorm', severity: 'urgent' },
];

export default function DiagnosisScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
        updateData({ struggleBehavior: id });

        setTimeout(() => {
            if (id === 'aggression') {
                router.push('/(onboarding)/quiz/aggression-details');
            } else {
                router.push('/(onboarding)/quiz/trigger-situations');
            }
        }, 300);
    };

    return (
        <View className="flex-1 bg-[#FDFBF7] px-6 pt-12 pb-8">
            <View className="h-1.5 bg-gray-200 rounded-full mb-8 overflow-hidden">
                <View className="h-full bg-primary-500" style={{ width: '60%' }} />
            </View>

            <Animated.View entering={FadeIn.delay(100)}>
                <Text className="text-3xl font-bold text-gray-900 mb-2">
                    How does your child typically handle frustration?
                </Text>
                <Text className="text-lg text-gray-500 mb-2">
                    This helps us identify their primary coping mechanism.
                </Text>
                <View className="bg-amber-50 border border-amber-200 p-3 rounded-xl mb-6">
                    <Text className="text-amber-800 text-sm">
                        <Ionicons name="information-circle" size={14} color="#92400e" /> Studies show 67% of children lack healthy coping skills by age 6.
                    </Text>
                </View>
            </Animated.View>

            <View className="flex-1">
                {BEHAVIORS.map((behavior, index) => (
                    <Animated.View key={behavior.id} entering={SlideInUp.delay(150 + index * 60)}>
                        <TouchableOpacity
                            onPress={() => handleSelect(behavior.id)}
                            className={`mb-3 p-4 rounded-2xl border-2 flex-row items-center ${selected === behavior.id
                                ? 'bg-primary-50 border-primary-500'
                                : 'bg-white border-gray-100'
                                }`}
                        >
                            <View className={`w-12 h-12 rounded-xl items-center justify-center mr-4 ${selected === behavior.id ? 'bg-primary-100' : 'bg-gray-50'
                                }`}>
                                <Ionicons
                                    name={behavior.icon as any}
                                    size={24}
                                    color={selected === behavior.id ? '#9333ea' : '#6b7280'}
                                />
                            </View>
                            <View className="flex-1">
                                <Text className={`text-lg font-bold ${selected === behavior.id ? 'text-primary-900' : 'text-gray-900'}`}>
                                    {behavior.title}
                                </Text>
                                <Text className={`text-sm ${selected === behavior.id ? 'text-primary-700' : 'text-gray-500'}`}>
                                    {behavior.description}
                                </Text>
                            </View>
                            {behavior.severity === 'urgent' && (
                                <View className="bg-red-100 px-2 py-1 rounded">
                                    <Text className="text-red-700 text-xs font-bold">Priority</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </Animated.View>
                ))}
            </View>
        </View>
    );
}
