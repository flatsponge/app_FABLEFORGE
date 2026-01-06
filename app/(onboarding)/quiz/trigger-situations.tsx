import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody, OnboardingSubtitle } from '../../../components/OnboardingTypography';
import OnboardingOptionCard from '../../../components/OnboardingOptionCard';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const ICON_COLOR = '#6b7280';

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
            progress={0.65}
            onNext={handleNext}
            nextLabel="Continue"
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <OnboardingTitle>What situations trigger the most conflict?</OnboardingTitle>
                <OnboardingBody>
                    Select all that apply. We'll create stories that address these moments.
                </OnboardingBody>
                <View style={styles.selectionCounter}>
                    <OnboardingBody style={styles.counterText}>
                        {selected.length} selected
                    </OnboardingBody>
                </View>

                <View style={styles.optionsContainer}>
                    {SITUATIONS.map((situation) => (
                        <OnboardingOptionCard
                            key={situation.id}
                            title={situation.label}
                            selected={selected.includes(situation.id)}
                            onPress={() => toggleSelection(situation.id)}
                            icon={
                                <View style={styles.iconContainer}>
                                    <Ionicons name={situation.icon as any} size={24} color={ICON_COLOR} />
                                </View>
                            }
                        />
                    ))}
                </View>
            </ScrollView>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: OnboardingTheme.Spacing.xl,
    },
    selectionCounter: {
        marginTop: OnboardingTheme.Spacing.xs,
        marginBottom: OnboardingTheme.Spacing.md,
    },
    counterText: {
        fontSize: 14,
        fontWeight: '700',
        color: OnboardingTheme.Colors.Accent,
    },
    optionsContainer: {
        marginTop: OnboardingTheme.Spacing.md,
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
