import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import { useQuizFooter } from '../../../contexts/QuizFooterContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import OnboardingSingleSelect, { SelectOption } from '../../../components/OnboardingSingleSelect';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const FREQUENCIES: SelectOption[] = [
    { id: 'multiple_daily', title: 'Multiple times a day', icon: 'flame-outline' },
    { id: 'daily', title: 'Once a day', icon: 'alert-circle-outline' },
    { id: 'few_weekly', title: 'A few times a week', icon: 'bar-chart-outline' },
    { id: 'weekly', title: 'Once a week', icon: 'trending-up-outline' },
    { id: 'rarely', title: 'Rarely', icon: 'sparkles-outline' },
];

export default function StruggleFrequencyScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const { setFooter } = useQuizFooter();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
    };

    const handleNext = () => {
        if (selected) {
            updateData({ struggleFrequency: selected });
            router.push('/(onboarding)/quiz/moral-sharing');
        }
    };

    useEffect(() => {
        setFooter({
            onNext: handleNext,
            showNextButton: !!selected,
        });
    }, [selected, setFooter]);

    return (
        <OnboardingLayout
            showProgressBar={false} skipTopSafeArea progress={0.75}
            hideFooter={true}
            isScrollable={true}
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>How often do these issues come up?</OnboardingTitle>
                <OnboardingBody>
                    This helps us gauge the intensity of support needed.
                </OnboardingBody>

                <OnboardingSingleSelect
                    options={FREQUENCIES}
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
