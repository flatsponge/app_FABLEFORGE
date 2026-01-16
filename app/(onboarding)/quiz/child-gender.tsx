import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import { useQuizFooter } from '../../../contexts/QuizFooterContext';
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
    const { setFooter } = useQuizFooter();
    const [selectedGender, setSelectedGender] = useState<'boy' | 'girl' | null>(null);

    const canProceed = selectedGender !== null;

    const handleNext = () => {
        if (canProceed) {
            updateData({ gender: selectedGender! });
            router.push('/quiz/vocabulary-level');
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
            showProgressBar={false} skipTopSafeArea
            progress={0.12}
            hideFooter={true}
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
