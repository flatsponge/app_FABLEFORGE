import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import { OnboardingScreen } from '../../../components/OnboardingScreen';

const MORAL_SKILLS = [
    { id: 'sharing', label: 'Sharing', emoji: '🤝', question: 'How well does your child share with others?' },
    { id: 'honesty', label: 'Telling the Truth', emoji: '💬', question: 'How honest is your child typically?' },
    { id: 'patience', label: 'Patience', emoji: '⏳', question: 'How patient is your child in difficult situations?' },
    { id: 'kindness', label: 'Kindness to Others', emoji: '❤️', question: 'How kind is your child to others?' },
];

const RATING_OPTIONS = [
    { value: 1, label: 'Needs work', description: 'This is a growth area', color: 'bg-amber-50', borderColor: 'border-amber-200', selectedBg: 'bg-amber-100', selectedBorder: 'border-amber-500' },
    { value: 2, label: 'Sometimes', description: 'Depends on the day', color: 'bg-orange-50', borderColor: 'border-orange-200', selectedBg: 'bg-orange-100', selectedBorder: 'border-orange-500' },
    { value: 3, label: 'Usually good', description: 'More often than not', color: 'bg-blue-50', borderColor: 'border-blue-200', selectedBg: 'bg-blue-100', selectedBorder: 'border-blue-500' },
    { value: 4, label: 'Very good', description: 'Rarely an issue', color: 'bg-emerald-50', borderColor: 'border-emerald-200', selectedBg: 'bg-emerald-100', selectedBorder: 'border-emerald-500' },
    { value: 5, label: 'Excellent', description: 'A real strength!', color: 'bg-primary-50', borderColor: 'border-primary-200', selectedBg: 'bg-primary-100', selectedBorder: 'border-primary-500' },
];

interface OptionCardProps {
    option: typeof RATING_OPTIONS[0];
    isSelected: boolean;
    onPress: () => void;
    delay: number;
}

function OptionCard({ option, isSelected, onPress, delay }: OptionCardProps) {
    return (
        <Pressable
            onPress={onPress}
            className={`flex-row items-center p-4 rounded-2xl border-2 mb-3 ${isSelected
                ? `${option.selectedBg} ${option.selectedBorder}`
                : `${option.color} ${option.borderColor}`
                }`}
        >
            <View className="flex-1">
                <Text className={`text-lg font-semibold ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                    {option.label}
                </Text>
                <Text className={`text-sm ${isSelected ? 'text-gray-600' : 'text-gray-500'}`}>
                    {option.description}
                </Text>
            </View>
            <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${isSelected ? 'border-primary-500 bg-primary-500' : 'border-gray-300 bg-white'
                }`}>
                {isSelected && (
                    <View className="w-2 h-2 bg-white rounded-full" />
                )}
            </View>
        </Pressable>
    );
}

export default function MoralBaselineScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const [ratings, setRatings] = useState<Record<string, number>>({});
    const [currentRating, setCurrentRating] = useState<number | null>(null);

    const currentSkillIndex = Object.keys(ratings).length;
    const currentSkill = MORAL_SKILLS[currentSkillIndex];
    const isComplete = currentSkillIndex >= MORAL_SKILLS.length;

    // Reset rating when moving to next skill
    React.useEffect(() => {
        setCurrentRating(null);
    }, [currentSkillIndex]);

    const handleSelect = (value: number) => {
        setCurrentRating(value);
    };

    const handleNext = () => {
        if (!currentSkill || currentRating === null) return;

        const newRatings = { ...ratings, [currentSkill.id]: currentRating };
        setRatings(newRatings);

        if (Object.keys(newRatings).length >= MORAL_SKILLS.length) {
            // Calculate average score
            const avg = Object.values(newRatings).reduce((a, b) => a + b, 0) / MORAL_SKILLS.length;
            updateData({ moralScore: avg * 20 }); // Convert to 0-100 scale
            setTimeout(() => {
                router.push('/(onboarding)/quiz/parent-guilt');
            }, 300);
        }
    };

    if (isComplete) {
        return (
            <View className="flex-1 bg-[#FDFBF7] items-center justify-center">
                <Text className="text-2xl font-bold text-primary-600">Great! Moving on...</Text>
            </View>
        );
    }

    return (
        <OnboardingScreen
            title={currentSkill.label}
            subtitle={currentSkill.question}
            currentStep={currentSkillIndex + 1}
            totalSteps={MORAL_SKILLS.length}
        >
            <Animated.View 
                key={currentSkill.id}
                entering={FadeIn.duration(400)}
                className="flex-1"
            >
                <View className="items-center mb-6">
                    <Text className="text-5xl mb-3">{currentSkill.emoji}</Text>
                </View>

                {/* Options */}
                <View className="flex-1">
                    {RATING_OPTIONS.map((option, index) => (
                        <OptionCard
                            key={option.value}
                            option={option}
                            isSelected={currentRating === option.value}
                            onPress={() => handleSelect(option.value)}
                            delay={index * 50}
                        />
                    ))}
                </View>

                {/* Next Button */}
                <TouchableOpacity
                    onPress={handleNext}
                    disabled={currentRating === null}
                    className={`py-4 rounded-full mt-6 ${currentRating !== null
                        ? 'bg-primary-600'
                        : 'bg-gray-200'
                        }`}
                >
                    <Text className={`text-center text-lg font-bold ${currentRating !== null ? 'text-white' : 'text-gray-400'
                        }`}>
                        Next
                    </Text>
                </TouchableOpacity>
            </Animated.View>
        </OnboardingScreen>
    );
}
