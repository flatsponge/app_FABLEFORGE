import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';

const REACTIONS = [
    { id: 'calm', title: 'I stay calm (mostly)', icon: 'happy', emoji: '😌' },
    { id: 'yell', title: 'I yell (and feel guilty later)', icon: 'megaphone', emoji: '😤' },
    { id: 'give_in', title: 'I give in to stop the noise', icon: 'flag', emoji: '🏳️' },
    { id: 'time_out', title: 'I use time-outs / punishments', icon: 'timer', emoji: '⏱️' },
    { id: 'distract', title: 'I distract with screens', icon: 'phone-portrait', emoji: '📱' },
];

export default function ParentGuiltScreen() {
    const router = useRouter();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
        setTimeout(() => {
            router.push('/(onboarding)/quiz/commitment');
        }, 300);
    };

    return (
        <View className="flex-1 bg-[#FDFBF7] px-6 pt-12 pb-8">
            <View className="h-1.5 bg-gray-200 rounded-full mb-8 overflow-hidden">
                <View className="h-full bg-primary-500" style={{ width: '72%' }} />
            </View>

            <Animated.View entering={FadeIn.delay(100)}>
                <Text className="text-3xl font-bold text-gray-900 mb-2">
                    Be honest: how do you usually react?
                </Text>
                <Text className="text-lg text-gray-500 mb-2">
                    There's no judgment here—this is a safe space.
                </Text>
                <View className="bg-primary-50 border border-primary-100 p-3 rounded-xl mb-6 flex-row items-center">
                    <Ionicons name="lock-closed" size={16} color="#7c3aed" style={{ marginRight: 8 }} />
                    <Text className="text-primary-800 text-sm flex-1">
                        Your answers are private and help us create the right approach.
                    </Text>
                </View>
            </Animated.View>

            <View className="flex-1">
                {REACTIONS.map((reaction, index) => (
                    <Animated.View key={reaction.id} entering={SlideInUp.delay(150 + index * 50)}>
                        <TouchableOpacity
                            onPress={() => handleSelect(reaction.id)}
                            className={`mb-3 p-4 rounded-2xl border-2 flex-row items-center ${selected === reaction.id
                                    ? 'bg-primary-50 border-primary-500'
                                    : 'bg-white border-gray-100'
                                }`}
                        >
                            <Text className="text-3xl mr-4">{reaction.emoji}</Text>
                            <Text className={`text-lg font-semibold flex-1 ${selected === reaction.id ? 'text-primary-900' : 'text-gray-900'
                                }`}>
                                {reaction.title}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                ))}
            </View>

            {/* Reassurance */}
            <View className="bg-gray-50 p-4 rounded-xl">
                <Text className="text-gray-500 text-sm text-center italic">
                    "The goal isn't perfect parenting—it's having better tools."
                </Text>
            </View>
        </View>
    );
}
