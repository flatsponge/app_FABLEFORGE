import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import OnboardingOptionCard from '../../../components/OnboardingOptionCard';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const TIMES = [
    { id: 'morning', label: 'Morning', description: 'Start the day right', icon: 'sunny-outline' },
    { id: 'afternoon', label: 'Afternoon', description: 'After school/nap', icon: 'partly-sunny-outline' },
    { id: 'bedtime', label: 'Bedtime', description: 'Wind down routine', icon: 'moon-outline' },
    { id: 'anytime', label: 'Whenever works', description: 'No set time', icon: 'time-outline' },
];

export default function ReadingTimeScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
    };

    const handleNext = () => {
        if (selected) {
            router.push('/(onboarding)/quiz/story-length');
        }
    };

    return (
        <OnboardingLayout
            showProgressBar={false} progress={0.25}
            showNextButton={!!selected}
            onNext={handleNext}
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>When do you usually read together?</OnboardingTitle>
                <OnboardingBody>
                    We'll remind you at the perfect moment.
                </OnboardingBody>

                <View style={styles.optionsContainer}>
                    {TIMES.map((time) => (
                        <OnboardingOptionCard
                            key={time.id}
                            title={time.label}
                            description={time.description}
                            selected={selected === time.id}
                            showCheckbox={false}
                            onPress={() => handleSelect(time.id)}
                            icon={
                                <View style={styles.iconContainer}>
                                    <Ionicons name={time.icon as any} size={24} color={OnboardingTheme.Colors.IconColor} />
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
        backgroundColor: OnboardingTheme.Colors.IconBackground,
    },
});
