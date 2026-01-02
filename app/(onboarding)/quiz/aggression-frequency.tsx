import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody, OnboardingSubtitle } from '../../../components/OnboardingTypography';
import OnboardingOptionCard from '../../../components/OnboardingOptionCard';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const FREQUENCIES = [
    { id: 'daily', label: 'Daily', description: 'Almost every day', severity: 'high' },
    { id: 'weekly', label: 'Weekly', description: 'A few times per week', severity: 'medium' },
    { id: 'monthly', label: 'Monthly', description: 'A few times per month', severity: 'low' },
    { id: 'rarely', label: 'Rarely', description: 'Once in a while', severity: 'minimal' },
];

export default function AggressionFrequencyScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
        updateData({ aggressionFrequency: id });
        setTimeout(() => {
            router.push('/(onboarding)/quiz/struggle-areas');
        }, 300);
    };

    return (
        <OnboardingLayout
            progress={0.6}
            showNextButton={false}
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>How often does this happen?</OnboardingTitle>
                <OnboardingBody>
                    This helps us understand the urgency level.
                </OnboardingBody>

                <View style={styles.optionsContainer}>
                    {FREQUENCIES.map((freq) => (
                        <OnboardingOptionCard
                            key={freq.id}
                            title={freq.label}
                            subtitle={freq.description}
                            selected={selected === freq.id}
                            onPress={() => handleSelect(freq.id)}
                            rightContent={
                                freq.severity === 'high' ? (
                                    <View style={styles.badgeUrgent}>
                                        <Text style={styles.badgeTextUrgent}>Urgent</Text>
                                    </View>
                                ) : freq.severity === 'medium' ? (
                                    <View style={styles.badgeModerate}>
                                        <Text style={styles.badgeTextModerate}>Moderate</Text>
                                    </View>
                                ) : undefined
                            }
                        />
                    ))}
                </View>
            </View>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        width: '100%',
    },
    optionsContainer: {
        marginTop: OnboardingTheme.Spacing.xl,
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