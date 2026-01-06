import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody, OnboardingSubtitle } from '../../../components/OnboardingTypography';
import OnboardingOptionCard from '../../../components/OnboardingOptionCard';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const ICON_COLOR = '#6b7280';

const FREQUENCIES = [
    { id: 'multiple_daily', label: 'Multiple times a day', icon: 'flame-outline' },
    { id: 'daily', label: 'Once a day', icon: 'alert-circle-outline' },
    { id: 'few_weekly', label: 'A few times a week', icon: 'bar-chart-outline' },
    { id: 'weekly', label: 'Once a week', icon: 'trending-up-outline' },
    { id: 'rarely', label: 'Rarely', icon: 'sparkles-outline' },
];

export default function StruggleFrequencyScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
    };

    const handleNext = () => {
        if (selected) {
            router.push('/(onboarding)/quiz/moral-baseline');
        }
    };

    return (
        <OnboardingLayout
            progress={0.75}
            showNextButton={!!selected}
            onNext={handleNext}
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
                            showCheckbox={false}
                            onPress={() => handleSelect(freq.id)}
                            icon={
                                <View style={styles.iconContainer}>
                                    <Ionicons name={freq.icon as any} size={24} color={ICON_COLOR} />
                                </View>
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
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
    },
});
