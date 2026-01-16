import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import { useQuizFooter } from '../../../contexts/QuizFooterContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import OnboardingSingleSelect, { SelectOption } from '../../../components/OnboardingSingleSelect';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const LENGTHS: SelectOption[] = [
    { id: 'quick', title: '2-3 minutes', description: 'Quick and focused', icon: 'flash-outline' },
    { id: 'medium', title: '5-7 minutes', description: 'Perfect for bedtime', icon: 'book-outline' },
    { id: 'long', title: '10-15 minutes', description: 'Deep story experience', icon: 'library-outline' },
    { id: 'varies', title: 'Depends on the day', description: 'Flexibility is key', icon: 'options-outline' },
];

export default function StoryLengthScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const { setFooter } = useQuizFooter();
    const [selected, setSelected] = useState<string | null>(null);

    const handleNext = () => {
        if (selected) {
            updateData({ storyLength: selected });
            router.push('/(onboarding)/quiz/story-themes');
        }
    };

    useEffect(() => {
        setFooter({
            onNext: handleNext,
            nextLabel: 'Continue',
            showNextButton: !!selected,
        });
    }, [selected]);

    const handleSelect = (id: string) => {
        setSelected(id);
    };

    return (
        <OnboardingLayout
            showProgressBar={false} skipTopSafeArea progress={0.3}
            hideFooter={true}
            isScrollable={true}
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>How long should stories be?</OnboardingTitle>
                <OnboardingBody>
                    We'll adjust the story length to fit.
                </OnboardingBody>
                <Text style={styles.changeNote}>Can be changed later in settings</Text>

                <OnboardingSingleSelect
                    options={LENGTHS}
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
    changeNote: {
        fontSize: 13,
        color: OnboardingTheme.Colors.TextSecondary,
        fontStyle: 'italic',
        marginTop: OnboardingTheme.Spacing.xs,
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
});
