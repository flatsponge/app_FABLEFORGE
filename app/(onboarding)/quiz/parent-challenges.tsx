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

const CHALLENGES = [
    { id: 'time', label: 'Not enough time', icon: 'time-outline' },
    { id: 'consistency', label: 'Staying consistent', icon: 'calendar-outline' },
    { id: 'engagement', label: 'Keeping them engaged', icon: 'bulb-outline' },
    { id: 'tantrums', label: 'Managing tantrums', icon: 'thunderstorm-outline' },
    { id: 'communication', label: 'Getting them to talk', icon: 'chatbubbles-outline' },
    { id: 'patience', label: 'My own patience', icon: 'leaf-outline' },
    { id: 'partner', label: 'Co-parenting alignment', icon: 'people-outline' },
    { id: 'screen', label: 'Screen time battles', icon: 'phone-portrait-outline' },
];

export default function ParentChallengesScreen() {
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
            router.push('/(onboarding)/quiz/diagnosis');
        }
    };

    return (
        <OnboardingLayout
            showProgressBar={false} progress={0.45}
            onNext={handleNext}
            nextLabel="Continue"
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <OnboardingTitle>What's your biggest parenting challenge right now?</OnboardingTitle>
                <OnboardingBody>
                    Select all that apply.
                </OnboardingBody>

                <View style={styles.optionsContainer}>
                    {CHALLENGES.map((challenge) => (
                        <OnboardingOptionCard
                            key={challenge.id}
                            title={challenge.label}
                            selected={selected.includes(challenge.id)}
                            onPress={() => toggleSelection(challenge.id)}
                            icon={
                                <View style={styles.iconContainer}>
                                    <Ionicons name={challenge.icon as any} size={24} color={ICON_COLOR} />
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
