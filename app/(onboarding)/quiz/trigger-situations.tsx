import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import { useQuizFooter } from '../../../contexts/QuizFooterContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import OnboardingMultiSelect, { SelectOption } from '../../../components/OnboardingMultiSelect';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const SITUATIONS: SelectOption[] = [
    { id: 'bedtime', title: 'Bedtime resistance', icon: 'moon-outline' },
    { id: 'screen_time', title: 'Screen time battles', icon: 'phone-portrait-outline' },
    { id: 'homework', title: 'Homework struggles', icon: 'book-outline' },
    { id: 'sibling', title: 'Sibling conflicts', icon: 'people-outline' },
    { id: 'meal_time', title: 'Meal time issues', icon: 'restaurant-outline' },
    { id: 'morning_routine', title: 'Morning routine chaos', icon: 'sunny-outline' },
    { id: 'public_behavior', title: 'Public meltdowns', icon: 'storefront-outline' },
    { id: 'transitions', title: 'Difficulty with transitions', icon: 'swap-horizontal-outline' },
];

export default function TriggerSituationsScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const { setFooter } = useQuizFooter();
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
            updateData({ triggerSituations: selected });
            router.push('/(onboarding)/quiz/struggle-areas');
        }
    };

    useEffect(() => {
        setFooter({
            onNext: handleNext,
            nextLabel: "Continue",
            showNextButton: canProceed
        });
    }, [canProceed]);

    return (
        <OnboardingLayout
            showProgressBar={false} skipTopSafeArea progress={0.65}
            hideFooter={true}
            isScrollable={true}
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>What situations trigger the most conflict?</OnboardingTitle>
                <OnboardingBody>
                    Select all that apply. We'll create stories that address these moments.
                </OnboardingBody>

                <OnboardingMultiSelect
                    options={SITUATIONS}
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
