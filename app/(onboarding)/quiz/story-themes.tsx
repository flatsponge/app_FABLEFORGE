import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody, OnboardingSubtitle } from '../../../components/OnboardingTypography';
import OnboardingOptionCard from '../../../components/OnboardingOptionCard';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const THEMES = [
    { id: 'adventure', label: 'Adventure', emoji: '🗺️' },
    { id: 'animals', label: 'Animals', emoji: '🦁' },
    { id: 'space', label: 'Space', emoji: '🚀' },
    { id: 'fantasy', label: 'Fantasy & Magic', emoji: '🧙' },
    { id: 'dinosaurs', label: 'Dinosaurs', emoji: '🦖' },
    { id: 'ocean', label: 'Ocean & Sea', emoji: '🌊' },
    { id: 'superheroes', label: 'Superheroes', emoji: '🦸' },
    { id: 'nature', label: 'Nature', emoji: '🌳' },
    { id: 'vehicles', label: 'Vehicles', emoji: '🚗' },
    { id: 'robots', label: 'Robots & Tech', emoji: '🤖' },
];

export default function StoryThemesScreen() {
    const router = useRouter();
    const { data } = useOnboarding();
    const [selected, setSelected] = useState<string[]>([]);

    const toggleSelection = (id: string) => {
        setSelected(prev =>
            prev.includes(id)
                ? prev.filter(x => x !== id)
                : [...prev, id]
        );
    };

    const canProceed = selected.length >= 2;

    const handleNext = () => {
        if (canProceed) {
            // updateData({ storyThemes: selected }); // Keeping logic consistent with context not having this field yet
            router.push('/(onboarding)/quiz/previous-attempts');
        }
    };

    return (
        <OnboardingLayout
            progress={0.35}
            onNext={handleNext}
            nextLabel="Continue"
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <OnboardingTitle>What does {data.childName || 'your child'} love?</OnboardingTitle>
                <OnboardingBody>
                    Select 2 or more favorite themes.
                </OnboardingBody>
                <View style={styles.selectionCounter}>
                    <OnboardingBody style={styles.counterText}>
                        {selected.length} selected
                    </OnboardingBody>
                </View>

                <View style={styles.optionsContainer}>
                    {THEMES.map((theme) => (
                        <OnboardingOptionCard
                            key={theme.id}
                            title={theme.label}
                            selected={selected.includes(theme.id)}
                            onPress={() => toggleSelection(theme.id)}
                            icon={<View><OnboardingBody style={{ fontSize: 24 }}>{theme.emoji}</OnboardingBody></View>}
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