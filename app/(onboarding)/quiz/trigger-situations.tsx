import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import OnboardingOptionCard from '../../../components/OnboardingOptionCard';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const SITUATIONS = [
    { id: 'bedtime', label: 'Bedtime resistance', icon: 'moon-outline' },
    { id: 'screen_time', label: 'Screen time battles', icon: 'phone-portrait-outline' },
    { id: 'homework', label: 'Homework struggles', icon: 'book-outline' },
    { id: 'sibling', label: 'Sibling conflicts', icon: 'people-outline' },
    { id: 'meal_time', label: 'Meal time issues', icon: 'restaurant-outline' },
    { id: 'morning_routine', label: 'Morning routine chaos', icon: 'sunny-outline' },
    { id: 'public_behavior', label: 'Public meltdowns', icon: 'storefront-outline' },
    { id: 'transitions', label: 'Difficulty with transitions', icon: 'swap-horizontal-outline' },
];

export default function TriggerSituationsScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const [selected, setSelected] = useState<string[]>([]);

    const toggleSelection = (id: string) => {
        setSelected(prev =>
            prev.includes(id)
                ? prev.filter(x => x !== id)
                : [...prev, id]
        );
    };

    const canProceed = selected.length >= 1;

    const handleNext = () => {
        if (canProceed) {
            router.push('/(onboarding)/quiz/struggle-areas');
        }
    };

    return (
        <OnboardingLayout
            showProgressBar={false} skipTopSafeArea progress={0.65}
            onNext={handleNext}
            nextLabel="Continue"
            isScrollable={true}
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>What situations trigger the most conflict?</OnboardingTitle>
                <OnboardingBody>
                    Select all that apply. We'll create stories that address these moments.
                </OnboardingBody>

                <View style={styles.optionsContainer}>
                    {SITUATIONS.map((situation) => (
                        <OnboardingOptionCard
                            key={situation.id}
                            title={situation.label}
                            selected={selected.includes(situation.id)}
                            onPress={() => toggleSelection(situation.id)}
                            icon={
                                <View style={styles.iconContainer}>
                                    <Ionicons name={situation.icon as any} size={24} color={OnboardingTheme.Colors.IconColor} />
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
