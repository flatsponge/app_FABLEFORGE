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

const ROUTINES = [
    { id: 'structured', label: 'Very structured', description: 'Set times for everything', icon: 'calendar-outline' },
    { id: 'flexible', label: 'Flexible', description: 'General routine with wiggle room', icon: 'color-palette-outline' },
    { id: 'chaotic', label: 'Chaotic', description: 'Every day is different', icon: 'shuffle-outline' },
    { id: 'working', label: 'Working on it', description: 'Trying to build better habits', icon: 'construct-outline' },
];

export default function DailyRoutineScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
    };

    const handleNext = () => {
        if (selected) {
            router.push('/(onboarding)/quiz/reading-time');
        }
    };

    return (
        <OnboardingLayout
            progress={0.35}
            showNextButton={!!selected}
            onNext={handleNext}
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>How would you describe your daily routine?</OnboardingTitle>
                <OnboardingBody>
                    This helps us suggest the best story times.
                </OnboardingBody>

                <View style={styles.optionsContainer}>
                    {ROUTINES.map((routine) => (
                        <OnboardingOptionCard
                            key={routine.id}
                            title={routine.label}
                            description={routine.description}
                            selected={selected === routine.id}
                            onPress={() => handleSelect(routine.id)}
                            icon={
                                <View style={styles.iconContainer}>
                                    <Ionicons name={routine.icon as any} size={24} color={ICON_COLOR} />
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
