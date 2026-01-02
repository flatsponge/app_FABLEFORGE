import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody, OnboardingSubtitle } from '../../../components/OnboardingTypography';
import OnboardingOptionCard from '../../../components/OnboardingOptionCard';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const LENGTHS = [
    { id: 'quick', label: '2-3 minutes', description: 'Quick and focused', emoji: '⚡' },
    { id: 'medium', label: '5-7 minutes', description: 'Perfect for bedtime', emoji: '📖' },
    { id: 'long', label: '10-15 minutes', description: 'Deep story experience', emoji: '📚' },
    { id: 'varies', label: 'Depends on the day', description: 'Flexibility is key', emoji: '🎯' },
];

export default function StoryLengthScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
        // updateData({ storyLength: id }); // Updating context if type allows

        setTimeout(() => {
            router.push('/(onboarding)/quiz/story-themes');
        }, 300);
    };

    return (
        <OnboardingLayout
            progress={0.3}
            showNextButton={false}
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>How long should stories be?</OnboardingTitle>
                <OnboardingBody>
                    We'll adjust the story length to fit.
                </OnboardingBody>

                <View style={styles.optionsContainer}>
                    {LENGTHS.map((length) => (
                        <OnboardingOptionCard
                            key={length.id}
                            title={length.label}
                            subtitle={length.description}
                            selected={selected === length.id}
                            onPress={() => handleSelect(length.id)}
                            icon={<View><OnboardingBody style={{ fontSize: 24 }}>{length.emoji}</OnboardingBody></View>}
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