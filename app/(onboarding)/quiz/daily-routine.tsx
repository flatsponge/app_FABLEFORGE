import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import OnboardingSingleSelect, { SelectOption } from '../../../components/OnboardingSingleSelect';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const ROUTINES: SelectOption[] = [
    { id: 'structured', title: 'Very structured', description: 'Set times for everything', icon: 'calendar-outline' },
    { id: 'flexible', title: 'Flexible', description: 'General routine with wiggle room', icon: 'color-palette-outline' },
    { id: 'chaotic', title: 'Chaotic', description: 'Every day is different', icon: 'shuffle-outline' },
    { id: 'working', title: 'Working on it', description: 'Trying to build better habits', icon: 'construct-outline' },
];

export default function DailyRoutineScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
    };

    const handleNext = () => {
        if (selected) {
            updateData({ dailyRoutine: selected });
            router.push('/(onboarding)/quiz/reading-time');
        }
    };

    return (
        <OnboardingLayout
            showProgressBar={false} skipTopSafeArea progress={0.35}
            showNextButton={!!selected}
            onNext={handleNext}
            isScrollable={true}
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>How would you describe your daily routine?</OnboardingTitle>
                <OnboardingBody>
                    This helps us suggest the best story times.
                </OnboardingBody>

                <OnboardingSingleSelect
                    options={ROUTINES}
                    selectedId={selected}
                    onSelect={handleSelect}
                    showCheckbox={false}
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
