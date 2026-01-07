import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import OnboardingSingleSelect, { SelectOption } from '../../../components/OnboardingSingleSelect';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const OPTIONS: SelectOption[] = [
    { id: 'tried_all', title: 'Yes, tried everything', description: 'Books, apps, charts...', icon: 'library-outline' },
    { id: 'tried_some', title: 'Tried a few things', description: 'Some worked, some didn\'t', icon: 'repeat-outline' },
    { id: 'first_time', title: 'This is my first try', description: 'Looking for the right solution', icon: 'sparkles-outline' },
    { id: 'professional', title: 'Working with a professional', description: 'Therapist, counselor, etc.', icon: 'person-outline' },
];

export default function PreviousAttemptsScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
    };

    const handleNext = () => {
        if (selected) {
            router.push('/(onboarding)/quiz/parent-challenges');
        }
    };

    return (
        <OnboardingLayout
            showProgressBar={false} skipTopSafeArea progress={0.4}
            showNextButton={!!selected}
            onNext={handleNext}
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>Have you tried other solutions before?</OnboardingTitle>
                <OnboardingBody>
                    Understanding your journey helps us help you.
                </OnboardingBody>

                <OnboardingSingleSelect
                    options={OPTIONS}
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
