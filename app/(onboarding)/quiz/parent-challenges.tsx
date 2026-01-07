import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import OnboardingOptionCard from '../../../components/OnboardingOptionCard';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

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
            showProgressBar={false} skipTopSafeArea progress={0.45}
            onNext={handleNext}
            nextLabel="Continue"
            isScrollable={true}
        >
            <View style={styles.contentContainer}>
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
                                    <Ionicons name={challenge.icon as any} size={24} color={OnboardingTheme.Colors.IconColor} />
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
