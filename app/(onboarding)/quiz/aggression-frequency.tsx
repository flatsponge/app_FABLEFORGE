import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import OnboardingSingleSelect, { SelectOption } from '../../../components/OnboardingSingleSelect';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const FREQUENCIES: (SelectOption & { severity: string })[] = [
    { id: 'daily', title: 'Daily', description: 'Almost every day', severity: 'high' },
    { id: 'weekly', title: 'Weekly', description: 'A few times per week', severity: 'medium' },
    { id: 'monthly', title: 'Monthly', description: 'A few times per month', severity: 'low' },
    { id: 'rarely', title: 'Rarely', description: 'Once in a while', severity: 'minimal' },
];

export default function AggressionFrequencyScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
        updateData({ aggressionFrequency: id });
    };

    const handleNext = () => {
        if (selected) {
            router.push('/(onboarding)/quiz/struggle-areas');
        }
    };

    const optionsWithContent = FREQUENCIES.map(freq => ({
        ...freq,
        rightContent: freq.severity === 'high' ? (
            <View style={styles.badgeUrgent}>
                <Text style={styles.badgeTextUrgent}>Urgent</Text>
            </View>
        ) : freq.severity === 'medium' ? (
            <View style={styles.badgeModerate}>
                <Text style={styles.badgeTextModerate}>Moderate</Text>
            </View>
        ) : undefined
    }));

    return (
        <OnboardingLayout
            showProgressBar={false} skipTopSafeArea progress={0.6}
            showNextButton={!!selected}
            onNext={handleNext}
            nextLabel="Continue"
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>How often does this happen?</OnboardingTitle>
                <OnboardingBody>
                    This helps us understand the urgency level.
                </OnboardingBody>

                <OnboardingSingleSelect
                    options={optionsWithContent}
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
    badgeUrgent: {
        backgroundColor: '#fee2e2', // red-100
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeTextUrgent: {
        color: '#b91c1c', // red-700
        fontSize: 10,
        fontWeight: 'bold',
    },
    badgeModerate: {
        backgroundColor: '#ffedd5', // orange-100
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeTextModerate: {
        color: '#c2410c', // orange-700
        fontSize: 10,
        fontWeight: 'bold',
    },
});