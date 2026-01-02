import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';

const CHALLENGES = [
    { id: 'time', label: 'Not enough time', emoji: '⏰' },
    { id: 'consistency', label: 'Staying consistent', emoji: '📅' },
    { id: 'engagement', label: 'Keeping them engaged', emoji: '🎯' },
    { id: 'tantrums', label: 'Managing tantrums', emoji: '😤' },
    { id: 'communication', label: 'Getting them to talk', emoji: '💬' },
    { id: 'patience', label: 'My own patience', emoji: '🧘' },
    { id: 'partner', label: 'Co-parenting alignment', emoji: '👫' },
    { id: 'screen', label: 'Screen time battles', emoji: '📱' },
];

export default function ParentChallengesScreen() {
    const router = useRouter();
    const [selected, setSelected] = useState<string[]>([]);

    const toggleSelection = (id: string) => {
        setSelected(prev =>
            prev.includes(id)
                ? prev.filter(x => x !== id)
                : prev.length < 3 ? [...prev, id] : prev
        );
    };

    const canProceed = selected.length >= 1;

    const handleNext = () => {
        router.push('/(onboarding)/quiz/diagnosis');
    };

    return (
        <View className="flex-1 bg-[#FDFBF7]">
            <ScrollView className="flex-1 px-6 pt-12" contentContainerStyle={{ paddingBottom: 120 }}>
                <View className="h-1.5 bg-gray-200 rounded-full mb-8 overflow-hidden">
                    <View className="h-full bg-primary-500" style={{ width: '55%' }} />
                </View>

                <Animated.View entering={FadeIn.delay(100)}>
                    <Text className="text-3xl font-bold text-gray-900 mb-2">
                        What's your biggest parenting challenge right now?
                    </Text>
                    <Text className="text-lg text-gray-500 mb-2">
                        Pick up to 3 that resonate with you.
                    </Text>
                    <Text className="text-sm text-primary-600 font-medium mb-8">
                        {selected.length}/3 selected
                    </Text>
                </Animated.View>

                <View className="flex-row flex-wrap gap-3">
                    {CHALLENGES.map((challenge, index) => (
                        <Animated.View key={challenge.id} entering={FadeIn.duration(300)}>
                            <TouchableOpacity
                                onPress={() => toggleSelection(challenge.id)}
                                className={`px-4 py-3 rounded-2xl border-2 flex-row items-center ${selected.includes(challenge.id)
                                    ? 'bg-primary-500 border-primary-500'
                                    : 'bg-white border-gray-200'
                                    }`}
                            >
                                <Text className="text-xl mr-2">{challenge.emoji}</Text>
                                <Text className={`font-semibold ${selected.includes(challenge.id) ? 'text-white' : 'text-gray-700'}`}>
                                    {challenge.label}
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
