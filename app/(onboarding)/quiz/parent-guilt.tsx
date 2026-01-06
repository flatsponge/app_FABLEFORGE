import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody, OnboardingSubtitle } from '../../../components/OnboardingTypography';
import OnboardingOptionCard from '../../../components/OnboardingOptionCard';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const ICON_COLOR = '#6b7280';

const REACTIONS = [
    { id: 'calm', title: 'I stay calm (mostly)', icon: 'happy-outline' },
    { id: 'yell', title: 'I yell (and feel guilty later)', icon: 'megaphone-outline' },
    { id: 'give_in', title: 'I give in to stop the noise', icon: 'flag-outline' },
    { id: 'time_out', title: 'I use time-outs / punishments', icon: 'timer-outline' },
    { id: 'distract', title: 'I distract with screens', icon: 'phone-portrait-outline' },
];

export default function ParentGuiltScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
    };

    const handleNext = () => {
        if (selected) {
            router.push('/(onboarding)/quiz/commitment');
        }
    };

    return (
        <OnboardingLayout
            progress={0.8}
            showNextButton={!!selected}
            isScrollable={true}
            onNext={handleNext}
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>Be honest: how do you usually react?</OnboardingTitle>
                <OnboardingBody>
                    There's no judgment here—this is a safe space.
                </OnboardingBody>

                <View style={styles.optionsContainer}>
                    {REACTIONS.map((reaction) => (
                        <OnboardingOptionCard
                            key={reaction.id}
                            title={reaction.title}
                            selected={selected === reaction.id}
                            onPress={() => handleSelect(reaction.id)}
                            icon={
                                <View style={styles.iconContainer}>
                                    <Ionicons name={reaction.icon as any} size={24} color={ICON_COLOR} />
                                </View>
                            }
                        />
                    ))}
                </View>

                <View style={styles.reassuranceContainer}>
                    <Text style={styles.reassuranceText}>
                        "The goal isn't perfect parenting—it's having better tools."
                    </Text>
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
    reassuranceContainer: {
        marginTop: OnboardingTheme.Spacing.xl,
        backgroundColor: '#f9fafb',
        padding: OnboardingTheme.Spacing.md,
        borderRadius: OnboardingTheme.Radius.lg,
    },
    reassuranceText: {
        color: OnboardingTheme.Colors.TextSecondary,
        fontSize: 14,
        fontStyle: 'italic',
        textAlign: 'center',
    },
});
