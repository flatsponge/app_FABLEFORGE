import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody, OnboardingSubtitle } from '../../../components/OnboardingTypography';
import OnboardingOptionCard from '../../../components/OnboardingOptionCard';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const ICON_COLOR = '#6b7280';

const THEMES = [
    { id: 'adventure', label: 'Adventure', icon: 'map-outline' },
    { id: 'animals', label: 'Animals', icon: 'paw-outline' },
    { id: 'space', label: 'Space', icon: 'rocket-outline' },
    { id: 'fantasy', label: 'Fantasy & Magic', icon: 'sparkles-outline' },
    { id: 'dinosaurs', label: 'Dinosaurs', icon: 'skull-outline' },
    { id: 'ocean', label: 'Ocean & Sea', icon: 'water-outline' },
    { id: 'superheroes', label: 'Superheroes', icon: 'flash-outline' },
    { id: 'nature', label: 'Nature', icon: 'leaf-outline' },
    { id: 'vehicles', label: 'Vehicles', icon: 'car-outline' },
    { id: 'robots', label: 'Robots & Tech', icon: 'hardware-chip-outline' },
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
                            icon={
                                <View style={styles.iconContainer}>
                                    <Ionicons name={theme.icon as any} size={24} color={ICON_COLOR} />
                                </View>
                            }
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
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
    },
});
