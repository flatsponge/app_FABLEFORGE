import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';

const TIMELINES = [
    { id: 'immediate', label: 'Right away', description: 'We need help now', emoji: '🔥', urgency: 'high' },
    { id: 'month', label: 'Within a month', description: 'Noticeable progress soon', emoji: '📆' },
    { id: 'gradual', label: 'Gradual improvement', description: 'Long-term development', emoji: '🌱' },
    { id: 'unsure', label: 'Not sure yet', description: 'Just exploring options', emoji: '🤷' },
];

export default function GoalsTimelineScreen() {
    const router = useRouter();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
        setTimeout(() => {
            router.push('/(onboarding)/quiz/parenting-style');
        }, 300);
    };

    return (
        <View className="flex-1 bg-[#FDFBF7] px-6 pt-12 pb-8">
            <View className="h-1.5 bg-gray-200 rounded-full mb-8 overflow-hidden">
                <View className="h-full bg-primary-500" style={{ width: '15%' }} />
            </View>

            <Animated.View entering={FadeIn.delay(100)}>
                <Text className="text-3xl font-bold text-gray-900 mb-2">
                    How quickly do you want to see changes?
                </Text>
                <Text className="text-lg text-gray-500 mb-8">
                    This helps us set realistic milestones.
                </Text>
            </Animated.View>

            <View className="flex-1">
                {TIMELINES.map((timeline, index) => (
                    <Animated.View key={timeline.id} entering={SlideInUp.delay(150 + index * 60)}>
                        <TouchableOpacity
                            onPress={() => handleSelect(timeline.id)}
                            className={`mb-3 p-5 rounded-2xl border-2 flex-row items-center ${selected === timeline.id
                                    ? 'bg-primary-50 border-primary-500'
                                    : 'bg-white border-gray-100'
                                }`}
                        >
                            <Text className="text-3xl mr-4">{timeline.emoji}</Text>
                            <View className="flex-1">
                                <Text className={`text-lg font-bold ${selected === timeline.id ? 'text-primary-900' : 'text-gray-900'}`}>
                                    {timeline.label}
                                </Text>
                                <Text className={`text-sm ${selected === timeline.id ? 'text-primary-700' : 'text-gray-500'}`}>
                                    {timeline.description}
                                </Text>
                            </View>
                            {timeline.urgency === 'high' && (
                                <View className="bg-red-100 px-2 py-1 rounded">
                                    <Text className="text-red-700 text-xs font-bold">Urgent</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </Animated.View>
                ))}
            </View>
        </View>
    );
}
