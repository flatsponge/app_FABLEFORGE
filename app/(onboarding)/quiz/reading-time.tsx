import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import OnboardingMultiSelect, { SelectOption } from '../../../components/OnboardingMultiSelect';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const TIMES: SelectOption[] = [
    { id: 'morning', title: 'Morning', description: 'Start the day right', icon: 'sunny-outline' },
    { id: 'afternoon', title: 'Afternoon', description: 'After school/nap', icon: 'partly-sunny-outline' },
    { id: 'bedtime', title: 'Bedtime', description: 'Wind down routine', icon: 'moon-outline' },
    { id: 'anytime', title: 'Whenever works', description: 'No set time', icon: 'time-outline' },
];

export default function ReadingTimeScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const [selected, setSelected] = useState<string[]>([]);

    const handleToggle = (id: string) => {
        setSelected(prev => {
            if (prev.includes(id)) {
                return prev.filter(item => item !== id);
            }
            return [...prev, id];
        });
    };

    const handleNext = () => {
        if (selected.length > 0) {
            updateData({ readingTime: selected.join(',') });
            router.push('/(onboarding)/quiz/story-length');
        }
    };

    return (
        <OnboardingLayout
            showProgressBar={false} skipTopSafeArea progress={0.25}
            showNextButton={selected.length > 0}
            onNext={handleNext}
            isScrollable={true}
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>When do you usually read together?</OnboardingTitle>
                <OnboardingBody>
                    We'll remind you at the perfect moment.
                </OnboardingBody>
                <Text style={styles.selectLabel}>Select all that apply</Text>

                <OnboardingMultiSelect
                    options={TIMES}
                    selectedValues={selected}
                    onToggle={handleToggle}
                    showCheckbox={true}
                />
            </View>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        width: '100%',
    },
    selectLabel: {
        fontSize: 14,
        color: OnboardingTheme.Colors.Primary,
        fontWeight: '600',
        marginTop: OnboardingTheme.Spacing.sm,
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
});
