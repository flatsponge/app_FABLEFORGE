import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import { useQuizFooter } from '../../../contexts/QuizFooterContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import OnboardingMultiSelect, { SelectOption } from '../../../components/OnboardingMultiSelect';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const STRUGGLE_AREAS: SelectOption[] = [
    { id: 'sharing', title: 'Sharing toys & belongings', icon: 'gift-outline' },
    { id: 'honesty', title: 'Telling the truth', icon: 'chatbubble-outline' },
    { id: 'patience', title: 'Waiting their turn', icon: 'hourglass-outline' },
    { id: 'responsibility', title: 'Cleaning up after themselves', icon: 'home-outline' },
    { id: 'gratitude', title: 'Saying thank you', icon: 'hand-left-outline' },
    { id: 'teamwork', title: 'Playing nicely with others', icon: 'people-outline' },
    { id: 'bravery', title: 'Trying new things', icon: 'rocket-outline' },
    { id: 'problem_solving', title: 'Handling disappointment', icon: 'sad-outline' },
];

export default function StruggleAreasScreen() {
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
            updateData({ struggleAreas: selected });
            router.push('/(onboarding)/quiz/struggle-frequency');
        }
    };

    useEffect(() => {
        setFooter({
            onNext: handleNext,
            nextLabel: "Continue",
            showNextButton: canProceed
        });
    }, [canProceed, selected]);

    return (
        <OnboardingLayout
            showProgressBar={false} skipTopSafeArea progress={0.7}
            hideFooter={true}
            isScrollable={true}
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>Where does your child struggle most?</OnboardingTitle>
                <OnboardingBody>
                    Select all that apply.
                </OnboardingBody>

                <OnboardingMultiSelect
                    options={STRUGGLE_AREAS}
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
