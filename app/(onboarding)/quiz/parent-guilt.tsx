import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody, OnboardingSubtitle } from '../../../components/OnboardingTypography';
import OnboardingOptionCard from '../../../components/OnboardingOptionCard';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const REACTIONS = [
    { id: 'calm', title: 'I stay calm (mostly)', icon: 'happy', emoji: '😌' },
    { id: 'yell', title: 'I yell (and feel guilty later)', icon: 'megaphone', emoji: '😤' },
    { id: 'give_in', title: 'I give in to stop the noise', icon: 'flag', emoji: '🏳️' },
    { id: 'time_out', title: 'I use time-outs / punishments', icon: 'timer', emoji: '⏱️' },
    { id: 'distract', title: 'I distract with screens', icon: 'phone-portrait', emoji: '📱' },
];

export default function ParentGuiltScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
        // updateData({ parentReaction: id }); // Update context if available
        setTimeout(() => {
            router.push('/(onboarding)/quiz/commitment');
        }, 300);
    };

    return (
        <OnboardingLayout
            progress={0.8}
            showNextButton={false}
        >
            <View style={styles.contentContainer}>
                <OnboardingSubtitle>Step 15</OnboardingSubtitle>
                <OnboardingTitle>Be honest: how do you usually react?</OnboardingTitle>
                <OnboardingBody>
                    There's no judgment here—this is a safe space.
                </OnboardingBody>

                <View style={styles.privacyBanner}>
                    <Ionicons name="lock-closed" size={16} color={OnboardingTheme.Colors.Primary} style={styles.privacyIcon} />
                    <Text style={styles.privacyText}>
                        Your answers are private and help us create the right approach.
                    </Text>
                </View>

                <View style={styles.optionsContainer}>
                    {REACTIONS.map((reaction) => (
                        <OnboardingOptionCard
                            key={reaction.id}
                            title={reaction.title}
                            selected={selected === reaction.id}
                            onPress={() => handleSelect(reaction.id)}
                            icon={<View><OnboardingBody style={{ fontSize: 24 }}>{reaction.emoji}</OnboardingBody></View>}
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
    privacyBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3e8ff', // primary-50
        borderColor: '#e9d5ff', // primary-100
        borderWidth: 1,
        borderRadius: OnboardingTheme.Radius.md,
        padding: OnboardingTheme.Spacing.sm,
        marginTop: OnboardingTheme.Spacing.sm,
        marginBottom: OnboardingTheme.Spacing.sm,
    },
    privacyIcon: {
        marginRight: OnboardingTheme.Spacing.xs,
    },
    privacyText: {
        flex: 1,
        color: '#6b21a8', // primary-800
        fontSize: 14,
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
    optionsContainer: {
        marginTop: OnboardingTheme.Spacing.md,
    },
    reassuranceContainer: {
        marginTop: OnboardingTheme.Spacing.xl,
        backgroundColor: '#f9fafb', // gray-50
        padding: OnboardingTheme.Spacing.md,
        borderRadius: OnboardingTheme.Radius.lg,
    },
    reassuranceText: {
        color: OnboardingTheme.Colors.TextSecondary,
        fontSize: 14,
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
        fontStyle: 'italic',
        textAlign: 'center',
    },
});