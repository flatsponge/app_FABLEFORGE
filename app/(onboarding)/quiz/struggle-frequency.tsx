import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody, OnboardingSubtitle } from '../../../components/OnboardingTypography';
import OnboardingOptionCard from '../../../components/OnboardingOptionCard';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const FREQUENCIES = [
    { id: 'multiple_daily', label: 'Multiple times a day', emoji: '🔥', severity: 'critical' },
    { id: 'daily', label: 'Once a day', emoji: '⚠️', severity: 'high' },
    { id: 'few_weekly', label: 'A few times a week', emoji: '📊', severity: 'moderate' },
    { id: 'weekly', label: 'Once a week', emoji: '📈', severity: 'low' },
    { id: 'rarely', label: 'Rarely', emoji: '✨', severity: 'minimal' },
];

export default function StruggleFrequencyScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
        // updateData({ struggleFrequency: id }); // Update context if available
        setTimeout(() => {
            router.push('/(onboarding)/quiz/moral-baseline');
        }, 300);
    };

    return (
        <OnboardingLayout
            progress={0.75}
            showNextButton={false}
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>How often do these issues come up?</OnboardingTitle>
                <OnboardingBody>
                    This helps us gauge the intensity of support needed.
                </OnboardingBody>

                <View style={styles.optionsContainer}>
                    {FREQUENCIES.map((freq) => (
                        <OnboardingOptionCard
                            key={freq.id}
                            title={freq.label}
                            selected={selected === freq.id}
                            onPress={() => handleSelect(freq.id)}
                            icon={<View><OnboardingBody style={{ fontSize: 24 }}>{freq.emoji}</OnboardingBody></View>}
                            rightContent={
                                freq.severity === 'critical' ? (
                                    <View style={styles.badgeCritical}>
                                        <Text style={styles.badgeTextCritical}>Critical</Text>
                                    </View>
                                ) : freq.severity === 'high' ? (
                                    <View style={styles.badgeHigh}>
                                        <Text style={styles.badgeTextHigh}>High</Text>
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
    badgeCritical: {
        backgroundColor: '#fee2e2', // red-100
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeTextCritical: {
        color: '#b91c1c', // red-700
        fontSize: 10,
        fontWeight: 'bold',
    },
    badgeHigh: {
        backgroundColor: '#ffedd5', // orange-100
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeTextHigh: {
        color: '#c2410c', // orange-700
        fontSize: 10,
        fontWeight: 'bold',
    },
});