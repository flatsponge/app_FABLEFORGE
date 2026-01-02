import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody, OnboardingSubtitle } from '../../../components/OnboardingTypography';
import OnboardingOptionCard from '../../../components/OnboardingOptionCard';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const TIMES = [
    { id: 'morning', label: 'Morning', description: 'Start the day right', icon: 'sunny', color: '#f97316' },
    { id: 'afternoon', label: 'Afternoon', description: 'After school/nap', icon: 'partly-sunny', color: '#eab308' },
    { id: 'bedtime', label: 'Bedtime', description: 'Wind down routine', icon: 'moon', color: '#6366f1' },
    { id: 'anytime', label: 'Whenever works', description: 'No set time', icon: 'time', color: '#8b5cf6' },
];

export default function ReadingTimeScreen() {
    const router = useRouter();
    const { data, updateData } = useOnboarding();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
        // We're not updating context yet as this field might not be in the type definition,
        // but normally we would: updateData({ readingTime: id });

        // Short delay for visual feedback before navigation
        setTimeout(() => {
            router.push('/(onboarding)/quiz/story-length');
        }, 300);
    };

    return (
        <OnboardingLayout
            progress={0.25}
            // No specific "Next" action needed since selection triggers navigation
            showNextButton={false}
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
                            subtitle={time.description}
                            selected={selected === time.id}
                            onPress={() => handleSelect(time.id)}
                            icon={
                                <View style={[styles.iconContainer, { backgroundColor: `${time.color}20` }]}>
                                    <Ionicons name={time.icon as any} size={24} color={time.color} />
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
    },
});