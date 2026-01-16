import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import { useQuizFooter } from '../../../contexts/QuizFooterContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import OnboardingMultiSelect, { SelectOption } from '../../../components/OnboardingMultiSelect';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const STYLES: SelectOption[] = [
    { id: 'authoritative', title: 'Balanced', description: 'Clear rules with warmth and flexibility', icon: 'scale-outline' },
    { id: 'permissive', title: 'Relaxed', description: 'Few rules, lots of freedom', icon: 'water-outline' },
    { id: 'strict', title: 'Structured', description: 'Clear expectations and consequences', icon: 'grid-outline' },
    { id: 'helicopter', title: 'Protective', description: 'Very involved in every decision', icon: 'shield-outline' },
    { id: 'unsure', title: 'Still figuring it out', description: 'Every day is different', icon: 'help-circle-outline' },
];

export default function ParentingStyleScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const { setFooter } = useQuizFooter();
    const [selected, setSelected] = useState<string[]>([]);

    const handleToggle = (id: string) => {
        setSelected(prev => {
            if (prev.includes(id)) {
                return prev.filter(item => item !== id);
            }
            // Allow up to 4 selections
            if (prev.length >= 4) {
                return prev;
            }
            return [...prev, id];
        });
    };

    const handleNext = () => {
        if (selected.length > 0) {
            updateData({ parentingStyle: selected.join(',') });
            router.push('/(onboarding)/quiz/child-personality');
        }
    };

    useEffect(() => {
        setFooter({
            onNext: handleNext,
            nextLabel: 'Continue',
            showNextButton: selected.length > 0
        });
    }, [selected.length, setFooter]);

    return (
        <OnboardingLayout
            showProgressBar={false} skipTopSafeArea progress={0.25}
            hideFooter={true}
            isScrollable={true}
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>How would you describe your parenting style?</OnboardingTitle>
                <OnboardingBody>
                    Select what describes you most, plus any additional styles that apply.
                </OnboardingBody>
                <Text style={styles.selectLabel}>Select all that apply (up to 4)</Text>

                <OnboardingMultiSelect
                    options={STYLES}
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
