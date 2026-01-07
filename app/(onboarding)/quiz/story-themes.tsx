import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import OnboardingOptionCard from '../../../components/OnboardingOptionCard';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

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

    const canProceed = selected.length >= 1;

    const handleNext = () => {
        if (canProceed) {
            router.push('/(onboarding)/quiz/previous-attempts');
        }
    };

    return (
        <OnboardingLayout
            showProgressBar={false} skipTopSafeArea progress={0.35}
            onNext={handleNext}
            nextLabel="Continue"
            isScrollable={true}
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>What does {data.childName || 'your child'} love?</OnboardingTitle>
                <OnboardingBody>
                    Select all that apply.
                </OnboardingBody>

                <View style={styles.optionsContainer}>
                    {THEMES.map((theme) => (
                        <OnboardingOptionCard
                            key={theme.id}
                            title={theme.label}
                            selected={selected.includes(theme.id)}
                            onPress={() => toggleSelection(theme.id)}
                            icon={
                                <View style={styles.iconContainer}>
                                    <Ionicons name={theme.icon as any} size={24} color={OnboardingTheme.Colors.IconColor} />
                                </View>
                            }
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
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: OnboardingTheme.Colors.IconBackground,
    },
});
