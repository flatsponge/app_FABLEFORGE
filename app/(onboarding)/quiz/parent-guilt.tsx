import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import OnboardingSingleSelect, { SelectOption } from '../../../components/OnboardingSingleSelect';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const REACTIONS: SelectOption[] = [
    { id: 'calm', title: 'I stay calm (mostly)', icon: 'happy-outline' },
    { id: 'yell', title: 'I yell (and feel guilty later)', icon: 'megaphone-outline' },
    { id: 'give_in', title: 'I give in to stop the noise', icon: 'flag-outline' },
    { id: 'time_out', title: 'I use time-outs / punishments', icon: 'timer-outline' },
    { id: 'distract', title: 'I distract with screens', icon: 'phone-portrait-outline' },
];

export default function ParentGuiltScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
    };

    const handleNext = () => {
        if (selected) {
            router.push('/(onboarding)/quiz/commitment');
        }
    };

    return (
        <OnboardingLayout
            showProgressBar={false} skipTopSafeArea progress={0.8}
            showNextButton={!!selected}
            isScrollable={true}
            onNext={handleNext}
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>Be honest: how do you usually react?</OnboardingTitle>
                <OnboardingBody>
                    There's no judgment here—this is a safe space.
                </OnboardingBody>

                <OnboardingSingleSelect
                    options={REACTIONS}
                    selectedId={selected}
                    onSelect={handleSelect}
                    showCheckbox={false}
                />

                <View style={styles.reassuranceContainer}>
                    <Text style={styles.reassuranceText}>
                        "The goal isn't perfect parenting—it's having better tools."
                    </Text>
                </View>
            </View>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        width: '100%',
    },
    reassuranceContainer: {
        marginTop: OnboardingTheme.Spacing.xl,
        backgroundColor: OnboardingTheme.Colors.Surface,
        padding: OnboardingTheme.Spacing.md,
        borderRadius: OnboardingTheme.Radius.lg,
    },
    reassuranceText: {
        color: OnboardingTheme.Colors.TextSecondary,
        fontSize: 14,
        fontStyle: 'italic',
        textAlign: 'center',
    },
});
