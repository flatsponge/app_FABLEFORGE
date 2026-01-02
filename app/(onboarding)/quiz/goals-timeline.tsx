import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody, OnboardingSubtitle } from '../../../components/OnboardingTypography';
import OnboardingOptionCard from '../../../components/OnboardingOptionCard';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const TIMELINES = [
    { id: 'immediate', label: 'Right away', description: 'We need help now', emoji: '🔥', urgency: 'high' },
    { id: 'month', label: 'Within a month', description: 'Noticeable progress soon', emoji: '📆' },
    { id: 'gradual', label: 'Gradual improvement', description: 'Long-term development', emoji: '🌱' },
    { id: 'unsure', label: 'Not sure yet', description: 'Just exploring options', emoji: '🤷' },
];

export default function GoalsTimelineScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
        // updateData({ goalsTimeline: id }); // Update context if available
        setTimeout(() => {
            router.push('/(onboarding)/quiz/parenting-style');
        }, 300);
    };

    return (
        <OnboardingLayout
            progress={0.2} // Adjusted progress to fit sequence (child-age is 0.15)
            showNextButton={false}
        >
            <View style={styles.contentContainer}>
                <OnboardingSubtitle>Step 3</OnboardingSubtitle>
                <OnboardingTitle>How quickly do you want to see changes?</OnboardingTitle>
                <OnboardingBody>
                    This helps us set realistic milestones.
                </OnboardingBody>

                <View style={styles.optionsContainer}>
                    {TIMELINES.map((timeline) => (
                        <OnboardingOptionCard
                            key={timeline.id}
                            title={timeline.label}
                            subtitle={timeline.description}
                            selected={selected === timeline.id}
                            onPress={() => handleSelect(timeline.id)}
                            icon={<View><OnboardingBody style={{ fontSize: 24 }}>{timeline.emoji}</OnboardingBody></View>}
                            rightContent={timeline.urgency === 'high' ? (
                                <View style={styles.badgeUrgent}>
                                    <Text style={styles.badgeTextUrgent}>Urgent</Text>
                                </View>
                            ) : undefined}
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
    badgeUrgent: {
        backgroundColor: '#fee2e2', // red-100
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    badgeTextUrgent: {
        color: '#b91c1c', // red-700
        fontSize: 10,
        fontWeight: 'bold',
    },
});