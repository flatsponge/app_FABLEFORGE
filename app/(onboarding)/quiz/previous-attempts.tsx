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

const OPTIONS = [
    { id: 'tried_all', label: 'Yes, tried everything', description: 'Books, apps, charts...', icon: 'library-outline' },
    { id: 'tried_some', label: 'Tried a few things', description: 'Some worked, some didn\'t', icon: 'repeat-outline' },
    { id: 'first_time', label: 'This is my first try', description: 'Looking for the right solution', icon: 'sparkles-outline' },
    { id: 'professional', label: 'Working with a professional', description: 'Therapist, counselor, etc.', icon: 'person-outline' },
];

export default function PreviousAttemptsScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
    };

    const handleNext = () => {
        if (selected) {
            router.push('/(onboarding)/quiz/parent-challenges');
        }
    };

    return (
        <OnboardingLayout
            progress={0.4}
            showNextButton={!!selected}
            onNext={handleNext}
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>Have you tried other solutions before?</OnboardingTitle>
                <OnboardingBody>
                    Understanding your journey helps us help you.
                </OnboardingBody>

                <View style={styles.optionsContainer}>
                    {OPTIONS.map((option) => (
                        <OnboardingOptionCard
                            key={option.id}
                            title={option.label}
                            description={option.description}
                            selected={selected === option.id}
                            showCheckbox={false}
                            onPress={() => handleSelect(option.id)}
                            icon={
                                <View style={styles.iconContainer}>
                                    <Ionicons name={option.icon as any} size={24} color={ICON_COLOR} />
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
