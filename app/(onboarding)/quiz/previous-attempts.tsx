import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody, OnboardingSubtitle } from '../../../components/OnboardingTypography';
import OnboardingOptionCard from '../../../components/OnboardingOptionCard';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const OPTIONS = [
    { id: 'tried_all', label: 'Yes, tried everything', description: 'Books, apps, charts...', emoji: '📚' },
    { id: 'tried_some', label: 'Tried a few things', description: 'Some worked, some didn\'t', emoji: '🔄' },
    { id: 'first_time', label: 'This is my first try', description: 'Looking for the right solution', emoji: '🌟' },
    { id: 'professional', label: 'Working with a professional', description: 'Therapist, counselor, etc.', emoji: '👨‍⚕️' },
];

export default function PreviousAttemptsScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
        // updateData({ previousAttempts: id }); // Update context if available

        setTimeout(() => {
            router.push('/(onboarding)/quiz/parent-challenges');
        }, 300);
    };

    return (
        <OnboardingLayout
            progress={0.4}
            showNextButton={false}
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>Have you tried other solutions before?</OnboardingTitle>
                <OnboardingBody>
                    Understanding your journey helps us help you.
                </OnboardingBody>

                <View style={styles.optionsContainer}>
                    {OPTIONS.map((option) => (
                        <OnboardingOptionCard
                            key={option.id}
                            title={option.label}
                            subtitle={option.description}
                            selected={selected === option.id}
                            onPress={() => handleSelect(option.id)}
                            icon={<View><OnboardingBody style={{ fontSize: 24 }}>{option.emoji}</OnboardingBody></View>}
                        />
                    ))}
                </View>
            </View>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        width: '100%',
    },
    optionsContainer: {
        marginTop: OnboardingTheme.Spacing.xl,
    },
});