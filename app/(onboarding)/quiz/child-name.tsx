import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { useOnboarding } from '../../../contexts/OnboardingContext';

export default function ChildNameScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const [childName, setChildName] = useState('');

    const canProceed = childName.trim().length > 0;

    const handleNext = () => {
        if (canProceed) {
            updateData({ childName: childName.trim() });
            router.push('/(onboarding)/quiz/child-age');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-[#FDFBF7]"
        >
            <View className="flex-1 px-6 pt-16 pb-8">
                <Animated.View entering={FadeIn.delay(100)}>
                    <Text className="text-3xl font-bold text-gray-900 mb-2">
                        What's your child's name?
                    </Text>
                    <Text className="text-lg text-gray-500 mb-8">
                        We'll personalize every story just for them.
                    </Text>
                </Animated.View>

                <Animated.View entering={SlideInUp.delay(200)} className="mb-8">
                    <Text className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Child's Name</Text>
                    <TextInput
                        value={childName}
                        onChangeText={setChildName}
                        placeholder="e.g., Emma"
                        placeholderTextColor="#9ca3af"
                        className="bg-white border-2 border-gray-100 rounded-2xl px-5 py-4 text-xl text-gray-900"
                        autoCapitalize="words"
                        autoCorrect={false}
                        autoFocus
                    />
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
        </KeyboardAvoidingView>
    );
}
