import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import OnboardingOptionCard from '../../../components/OnboardingOptionCard';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const TIMELINES = [
    { id: 'immediate', label: 'Right away', description: 'We need help now', icon: 'flame-outline' },
    { id: 'month', label: 'Within a month', description: 'Noticeable progress soon', icon: 'calendar-number-outline' },
    { id: 'gradual', label: 'Gradual improvement', description: 'Long-term development', icon: 'leaf-outline' },
    { id: 'unsure', label: 'Not sure yet', description: 'Just exploring options', icon: 'help-circle-outline' },
];

export default function GoalsTimelineScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
    };

    const handleNext = () => {
        if (selected) {
            router.push('/(onboarding)/quiz/parenting-style');
        }
    };

    return (
        <OnboardingLayout
            showProgressBar={false} skipTopSafeArea progress={0.2}
            showNextButton={!!selected}
            onNext={handleNext}
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>How quickly do you want to see changes?</OnboardingTitle>
                <OnboardingBody>
                    This helps us set realistic milestones.
                </OnboardingBody>

                <View style={styles.optionsContainer}>
                    {TIMELINES.map((timeline) => (
                        <OnboardingOptionCard
                            key={timeline.id}
                            title={timeline.label}
                            description={timeline.description}
                            selected={selected === timeline.id}
                            showCheckbox={false}
                            onPress={() => handleSelect(timeline.id)}
                            icon={
                                <View style={styles.iconContainer}>
                                    <Ionicons name={timeline.icon as any} size={24} color={OnboardingTheme.Colors.IconColor} />
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
