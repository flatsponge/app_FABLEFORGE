import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import OnboardingSingleSelect, { SelectOption } from '../../../components/OnboardingSingleSelect';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const AGE_OPTIONS: SelectOption[] = [
    { id: '2-3', title: '2-3' },
    { id: '4-5', title: '4-5' },
    { id: '6-7', title: '6-7' },
    { id: '8-9', title: '8-9' },
    { id: '10+', title: '10+' },
];

export default function ChildAgeScreen() {
    const router = useRouter();
    const { data, updateData } = useOnboarding();
    const [selectedAge, setSelectedAge] = useState<string | null>(data.childAge || null);

    const canProceed = selectedAge !== null;

    const handleNext = () => {
        if (canProceed) {
            updateData({ childAge: selectedAge! });
            router.push('/(onboarding)/quiz/child-gender');
        }
    };

    return (
        <OnboardingLayout
            showProgressBar={false} skipTopSafeArea progress={0.15}
            onNext={handleNext}
            nextLabel="Continue"
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>How old is {data.childName || 'your child'}?</OnboardingTitle>
                <OnboardingBody>
                    We'll tailor the stories to their age.
                </OnboardingBody>

                <OnboardingSingleSelect
                    options={AGE_OPTIONS}
                    selectedId={selectedAge}
                    onSelect={setSelectedAge}
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