import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import OnboardingMultiSelect, { SelectOption } from '../../../components/OnboardingMultiSelect';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const THEMES: SelectOption[] = [
    { id: 'adventure', title: 'Adventure', icon: 'map-outline' },
    { id: 'animals', title: 'Animals', icon: 'paw-outline' },
    { id: 'space', title: 'Space', icon: 'rocket-outline' },
    { id: 'fantasy', title: 'Fantasy & Magic', icon: 'sparkles-outline' },
    { id: 'dinosaurs', title: 'Dinosaurs', icon: 'skull-outline' },
    { id: 'ocean', title: 'Ocean & Sea', icon: 'water-outline' },
    { id: 'superheroes', title: 'Superheroes', icon: 'flash-outline' },
    { id: 'nature', title: 'Nature', icon: 'leaf-outline' },
    { id: 'vehicles', title: 'Vehicles', icon: 'car-outline' },
    { id: 'robots', title: 'Robots & Tech', icon: 'hardware-chip-outline' },
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

                <OnboardingMultiSelect
                    options={THEMES}
                    selectedValues={selected}
                    onToggle={toggleSelection}
                />
            </View>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        width: '100%',
    },
});
