import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { useOnboarding } from '../../../contexts/OnboardingContext';

const AGE_OPTIONS = ['2-3', '4-5', '6-7', '8-9', '10+'];

export default function ChildAgeScreen() {
    const router = useRouter();
    const { data, updateData } = useOnboarding();
    const [selectedAge, setSelectedAge] = useState<string | null>(null);

    const canProceed = selectedAge !== null;

    const handleNext = () => {
        if (canProceed) {
            updateData({ childAge: selectedAge! });
            router.push('/(onboarding)/quiz/goals-timeline');
        }
    };

    return (
        <View className="flex-1 bg-[#FDFBF7] px-6 pt-16 pb-8">
            <Animated.View entering={FadeIn.delay(100)}>
                <Text className="text-3xl font-bold text-gray-900 mb-2">
                    How old is {data.childName || 'your child'}?
                </Text>
                <Text className="text-lg text-gray-500 mb-8">
                    We'll tailor the stories to their age.
                </Text>
            </Animated.View>

            <Animated.View entering={SlideInUp.delay(200)}>
                <Text className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Age Range</Text>
                <View className="flex-row flex-wrap gap-3">
                    {AGE_OPTIONS.map((age) => (
                        <TouchableOpacity
                            key={age}
                            onPress={() => setSelectedAge(age)}
                            className={`px-6 py-3 rounded-full border-2 ${selectedAge === age
                                ? 'bg-primary-500 border-primary-500'
                                : 'bg-white border-gray-200'
                                }`}
                        >
                            <Text className={`text-lg font-bold ${selectedAge === age ? 'text-white' : 'text-gray-700'}`}>
                                {age}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </Animated.View>

            <View className="flex-1" />

            <Animated.View entering={SlideInUp.delay(300)}>
                <TouchableOpacity
                    onPress={handleNext}
                    disabled={!canProceed}
                    className={`py-5 rounded-full items-center ${canProceed ? 'bg-primary-600' : 'bg-gray-200'
                        }`}
                >
                    <Text className={`text-lg font-bold ${canProceed ? 'text-white' : 'text-gray-400'}`}>
                        Continue
                    </Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}
