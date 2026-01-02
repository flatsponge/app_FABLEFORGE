import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody, OnboardingSubtitle } from '../../../components/OnboardingTypography';
import OnboardingOptionCard from '../../../components/OnboardingOptionCard';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const STRUGGLE_AREAS = [
    { id: 'sharing', label: 'Sharing toys & belongings', emoji: '🧸', skill: 'empathy' },
    { id: 'honesty', label: 'Telling the truth', emoji: '💬', skill: 'honesty' },
    { id: 'patience', label: 'Waiting their turn', emoji: '⏳', skill: 'patience' },
    { id: 'responsibility', label: 'Cleaning up after themselves', emoji: '🧹', skill: 'responsibility' },
    { id: 'gratitude', label: 'Saying thank you', emoji: '🙏', skill: 'gratitude' },
    { id: 'teamwork', label: 'Playing nicely with others', emoji: '👫', skill: 'teamwork' },
    { id: 'bravery', label: 'Trying new things', emoji: '🦸', skill: 'bravery' },
    { id: 'problem_solving', label: 'Handling disappointment', emoji: '😤', skill: 'problem_solving' },
];

export default function StruggleAreasScreen() {
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
            // updateData({ struggleAreas: selected }); // Update context if available
            router.push('/(onboarding)/quiz/struggle-frequency');
        }
    };

    return (
        <OnboardingLayout
            progress={0.7}
            onNext={handleNext}
            nextLabel="Continue"
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <OnboardingSubtitle>Step 13</OnboardingSubtitle>
                <OnboardingTitle>Where does your child struggle most?</OnboardingTitle>
                <OnboardingBody>
                    Select up to 3 areas where you'd like to see improvement.
                </OnboardingBody>
                <View style={styles.selectionCounter}>
                    <OnboardingBody style={styles.counterText}>
                        {selected.length}/3 selected
                    </OnboardingBody>
                </View>

                <View style={styles.optionsContainer}>
                    {STRUGGLE_AREAS.map((area) => (
                        <OnboardingOptionCard
                            key={area.id}
                            title={area.label}
                            selected={selected.includes(area.id)}
                            onPress={() => toggleSelection(area.id)}
                            icon={<View><OnboardingBody style={{ fontSize: 24 }}>{area.emoji}</OnboardingBody></View>}
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