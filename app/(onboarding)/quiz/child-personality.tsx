import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import { useQuizFooter } from '../../../contexts/QuizFooterContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import OnboardingMultiSelect, { SelectOption } from '../../../components/OnboardingMultiSelect';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const PERSONALITIES: SelectOption[] = [
    { id: 'sensitive', title: 'Sensitive & Empathetic', icon: 'heart-outline' },
    { id: 'energetic', title: 'High Energy & Active', icon: 'flash-outline' },
    { id: 'strong_willed', title: 'Strong-willed & Determined', icon: 'flower-outline' },
    { id: 'curious', title: 'Curious & Analytical', icon: 'search-outline' },
    { id: 'social', title: 'Social & Outgoing', icon: 'people-outline' },
    { id: 'cautious', title: 'Cautious & Observant', icon: 'eye-outline' },
    { id: 'imaginative', title: 'Creative & Imaginative', icon: 'color-palette-outline' },
];

export default function ChildPersonalityScreen() {
    const router = useRouter();
    const { data, updateData } = useOnboarding();
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
            updateData({ childPersonality: selected });
            router.push('/(onboarding)/quiz/daily-routine');
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
            showProgressBar={false} skipTopSafeArea progress={0.15}
            hideFooter={true}
            isScrollable={true}
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>Describe {data.childName || 'your child'}</OnboardingTitle>
                <OnboardingBody>
                    Select all that apply.
                </OnboardingBody>

                <OnboardingMultiSelect
                    options={PERSONALITIES}
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
