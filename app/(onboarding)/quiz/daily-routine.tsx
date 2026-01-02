import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody, OnboardingSubtitle } from '../../../components/OnboardingTypography';
import OnboardingOptionCard from '../../../components/OnboardingOptionCard';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const ROUTINES = [
    { id: 'structured', label: 'Very structured', description: 'Set times for everything', emoji: '📅' },
    { id: 'flexible', label: 'Flexible', description: 'General routine with wiggle room', emoji: '🌈' },
    { id: 'chaotic', label: 'Chaotic', description: 'Every day is different', emoji: '🌪️' },
    { id: 'working', label: 'Working on it', description: 'Trying to build better habits', emoji: '🔨' },
];

export default function DailyRoutineScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
        // updateData({ dailyRoutine: id }); // Update context if available
        setTimeout(() => {
            router.push('/(onboarding)/quiz/reading-time');
        }, 300);
    };

    return (
        <OnboardingLayout
            progress={0.35}
            showNextButton={false}
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>How would you describe your daily routine?</OnboardingTitle>
                <OnboardingBody>
                    This helps us suggest the best story times.
                </OnboardingBody>

                <View style={styles.optionsContainer}>
                    {ROUTINES.map((routine) => (
                        <OnboardingOptionCard
                            key={routine.id}
                            title={routine.label}
                            subtitle={routine.description}
                            selected={selected === routine.id}
                            onPress={() => handleSelect(routine.id)}
                            icon={<View><OnboardingBody style={{ fontSize: 24 }}>{routine.emoji}</OnboardingBody></View>}
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