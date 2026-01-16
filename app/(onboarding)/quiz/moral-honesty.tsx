import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import { useQuizFooter } from '../../../contexts/QuizFooterContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import OnboardingSingleSelect, { SelectOption } from '../../../components/OnboardingSingleSelect';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const RATING_OPTIONS: SelectOption[] = [
    { id: '1', title: 'Needs work', description: 'This is a growth area', icon: 'trending-down-outline' },
    { id: '2', title: 'Sometimes', description: 'Depends on the day', icon: 'swap-horizontal-outline' },
    { id: '3', title: 'Usually good', description: 'More often than not', icon: 'thumbs-up-outline' },
    { id: '4', title: 'Very good', description: 'Rarely an issue', icon: 'star-half-outline' },
    { id: '5', title: 'Excellent', description: 'A real strength!', icon: 'star-outline' },
];

export default function MoralHonestyScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const { setFooter } = useQuizFooter();
    const [selected, setSelected] = useState<string | null>(null);

    const handleNext = () => {
        if (selected) {
            updateData({ moralHonesty: selected });
            router.push('/(onboarding)/quiz/moral-patience');
        }
    };

    useEffect(() => {
        setFooter({
            onNext: handleNext,
            nextLabel: "Continue",
            showNextButton: !!selected
        });
    }, [selected]);

    const handleSelect = (id: string) => {
        setSelected(id);
    };

    return (
        <OnboardingLayout
            showProgressBar={false}
            skipTopSafeArea
            hideFooter={true}
            isScrollable={true}
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>Telling the Truth</OnboardingTitle>
                <OnboardingBody>
                    How honest is your child typically?
                </OnboardingBody>

                <View style={styles.iconContainer}>
                    <Ionicons name="chatbubbles-outline" size={48} color={OnboardingTheme.Colors.IconColor} />
                </View>

                <OnboardingSingleSelect
                    options={RATING_OPTIONS}
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
    iconContainer: {
        alignItems: 'center',
        marginVertical: OnboardingTheme.Spacing.md,
    },
});
