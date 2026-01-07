import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import OnboardingSingleSelect, { SelectOption } from '../../../components/OnboardingSingleSelect';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const GENDER_OPTIONS: SelectOption[] = [
    { id: 'boy', title: 'Boy', icon: 'male' },
    { id: 'girl', title: 'Girl', icon: 'female' },
];

export default function ChildGenderScreen() {
    const router = useRouter();
    const { data, updateData } = useOnboarding();
    const [selectedGender, setSelectedGender] = useState<'boy' | 'girl' | null>(data.gender || null);

    const canProceed = selectedGender !== null;

    const handleNext = () => {
        if (canProceed) {
            updateData({ gender: selectedGender! });
            router.push('/(onboarding)/quiz/goals-timeline');
        }
    };

    return (
        <OnboardingLayout
            showProgressBar={false} skipTopSafeArea
            progress={0.12}
            onNext={handleNext}
            nextLabel="Continue"
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>Is {data.childName || 'your child'} a boy or girl?</OnboardingTitle>
                <OnboardingBody>
                    We'll personalize the stories and characters to match.
                </OnboardingBody>

                <OnboardingSingleSelect
                    options={GENDER_OPTIONS}
                    selectedId={selectedGender}
                    onSelect={(id) => setSelectedGender(id as 'boy' | 'girl')}
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
