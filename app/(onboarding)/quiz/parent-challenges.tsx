import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody, OnboardingSubtitle } from '../../../components/OnboardingTypography';
import OnboardingOptionCard from '../../../components/OnboardingOptionCard';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

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
    const { updateData } = useOnboarding();
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
        if (canProceed) {
            // updateData({ parentChallenges: selected }); // Update context if available
            router.push('/(onboarding)/quiz/diagnosis');
        }
    };

    return (
        <OnboardingLayout
            progress={0.45}
            onNext={handleNext}
            nextLabel="Continue"
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <OnboardingSubtitle>Step 8</OnboardingSubtitle>
                <OnboardingTitle>What's your biggest parenting challenge right now?</OnboardingTitle>
                <OnboardingBody>
                    Pick up to 3 that resonate with you.
                </OnboardingBody>
                <View style={styles.selectionCounter}>
                    <OnboardingBody style={styles.counterText}>
                        {selected.length}/3 selected
                    </OnboardingBody>
                </View>

                <View style={styles.optionsContainer}>
                    {CHALLENGES.map((challenge) => (
                        <OnboardingOptionCard
                            key={challenge.id}
                            title={challenge.label}
                            selected={selected.includes(challenge.id)}
                            onPress={() => toggleSelection(challenge.id)}
                            icon={<View><OnboardingBody style={{ fontSize: 24 }}>{challenge.emoji}</OnboardingBody></View>}
                        />
                    ))}
                </View>
            </ScrollView>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: OnboardingTheme.Spacing.xl,
    },
    selectionCounter: {
        marginTop: OnboardingTheme.Spacing.xs,
        marginBottom: OnboardingTheme.Spacing.md,
    },
    counterText: {
        fontSize: 14,
        fontWeight: '700',
        color: OnboardingTheme.Colors.Accent,
    },
    optionsContainer: {
        marginTop: OnboardingTheme.Spacing.md,
    },
});