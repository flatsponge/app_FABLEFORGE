import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody, OnboardingSubtitle } from '../../../components/OnboardingTypography';
import OnboardingOptionCard from '../../../components/OnboardingOptionCard';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const TRAITS = [
    { id: 'shy', label: 'Shy / Reserved', emoji: '🙈' },
    { id: 'outgoing', label: 'Outgoing / Social', emoji: '🌟' },
    { id: 'sensitive', label: 'Sensitive / Emotional', emoji: '💗' },
    { id: 'stubborn', label: 'Strong-willed', emoji: '🦁' },
    { id: 'curious', label: 'Curious / Explorer', emoji: '🔍' },
    { id: 'anxious', label: 'Anxious / Worried', emoji: '😰' },
    { id: 'energetic', label: 'High Energy', emoji: '⚡' },
    { id: 'calm', label: 'Calm / Easy-going', emoji: '🧘' },
];

export default function ChildPersonalityScreen() {
    const router = useRouter();
    const { data } = useOnboarding();
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
            // Note: Not currently saving traits to context as it's not in the type definition,
            // but keeping logic consistent with existing screen.
            router.push('/(onboarding)/quiz/daily-routine');
        }
    };

    return (
        <OnboardingLayout
            progress={0.2}
            onNext={handleNext}
            nextLabel="Continue"
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <OnboardingTitle>Describe {data.childName || 'your child'}</OnboardingTitle>
                <OnboardingBody>
                    Select up to 3 personality traits so we can match the story tone.
                </OnboardingBody>
                <View style={styles.selectionCounter}>
                    <OnboardingBody style={styles.counterText}>
                        {selected.length}/3 selected
                    </OnboardingBody>
                </View>

                <View style={styles.optionsContainer}>
                    {TRAITS.map((trait) => (
                        <OnboardingOptionCard
                            key={trait.id}
                            title={trait.label}
                            selected={selected.includes(trait.id)}
                            onPress={() => toggleSelection(trait.id)}
                            icon={<View><OnboardingBody style={{ fontSize: 24 }}>{trait.emoji}</OnboardingBody></View>}
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