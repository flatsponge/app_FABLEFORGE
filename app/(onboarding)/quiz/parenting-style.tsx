import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';

const STYLES = [
    { id: 'authoritative', label: 'Balanced', description: 'Clear rules with warmth and flexibility', emoji: '⚖️' },
    { id: 'permissive', label: 'Relaxed', description: 'Few rules, lots of freedom', emoji: '🌊' },
    { id: 'strict', label: 'Structured', description: 'Clear expectations and consequences', emoji: '📐' },
    { id: 'helicopter', label: 'Protective', description: 'Very involved in every decision', emoji: '🚁' },
    { id: 'unsure', label: 'Still figuring it out', description: 'Every day is different', emoji: '🤔' },
];

export default function ParentingStyleScreen() {
    const router = useRouter();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
        setTimeout(() => {
            router.push('/(onboarding)/quiz/child-personality');
        }, 300);
    };

    return (
        <View className="flex-1 bg-[#FDFBF7] px-6 pt-12 pb-8">
            <View className="h-1.5 bg-gray-200 rounded-full mb-8 overflow-hidden">
                <View className="h-full bg-primary-500" style={{ width: '20%' }} />
            </View>

            <Animated.View entering={FadeIn.delay(100)}>
                <Text className="text-3xl font-bold text-gray-900 mb-2">
                    How would you describe your parenting style?
                </Text>
                <Text className="text-lg text-gray-500 mb-8">
                    No judgment—just helps us tailor the approach.
                </Text>
            </Animated.View>

            <View className="flex-1">
                {STYLES.map((style, index) => (
                    <Animated.View key={style.id} entering={FadeIn.duration(300)}>
                        <TouchableOpacity
                            onPress={() => handleSelect(style.id)}
                            className={`mb-3 p-4 rounded-2xl border-2 flex-row items-center ${selected === style.id
                                    ? 'bg-primary-50 border-primary-500'
                                    : 'bg-white border-gray-100'
                                }`}
                        >
                            <Text className="text-3xl mr-4">{style.emoji}</Text>
                            <View className="flex-1">
                                <Text className={`text-lg font-bold ${selected === style.id ? 'text-primary-900' : 'text-gray-900'}`}>
                                    {style.label}
                                </Text>
                                <Text className={`text-sm ${selected === style.id ? 'text-primary-700' : 'text-gray-500'}`}>
                                    {style.description}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                ))}
            </View>
        </View>
    );
}
