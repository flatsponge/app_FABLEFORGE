import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import OnboardingSingleSelect, { SelectOption } from '../../../components/OnboardingSingleSelect';
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
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
    };

    const handleNext = () => {
        if (selected) {
            router.push('/(onboarding)/quiz/story-length');
        }
    };

    return (
        <OnboardingLayout
            showProgressBar={false} skipTopSafeArea progress={0.25}
            showNextButton={!!selected}
            onNext={handleNext}
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>When do you usually read together?</OnboardingTitle>
                <OnboardingBody>
                    We'll remind you at the perfect moment.
                </OnboardingBody>

                <OnboardingSingleSelect
                    options={TIMES}
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
