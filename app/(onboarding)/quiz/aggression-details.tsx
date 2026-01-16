import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import { useQuizFooter } from '../../../contexts/QuizFooterContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import OnboardingSingleSelect, { SelectOption } from '../../../components/OnboardingSingleSelect';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const TARGETS: SelectOption[] = [
    { id: 'sibling', title: 'Siblings', icon: 'people' },
    { id: 'parent', title: 'Parents', icon: 'home' },
    { id: 'peer', title: 'Friends / Peers', icon: 'school' },
    { id: 'objects', title: 'Toys / Objects', icon: 'cube' },
];

export default function AggressionDetailsScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const { setFooter } = useQuizFooter();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
        updateData({ aggressionTarget: id });
    };

    const handleNext = () => {
        if (selected) {
            router.push('/(onboarding)/quiz/aggression-frequency');
        }
    };

    useEffect(() => {
        setFooter({
            onNext: handleNext,
            nextLabel: "Continue",
            showNextButton: !!selected
        });
    }, [selected]);

    return (
        <OnboardingLayout
            showProgressBar={false} skipTopSafeArea progress={0.55}
            hideFooter={true}
            isScrollable={true}
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>Who is this aggression usually directed toward?</OnboardingTitle>
                <OnboardingBody>
                    Understanding the trigger helps us script the solution.
                </OnboardingBody>

                <OnboardingSingleSelect
                    options={TARGETS}
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