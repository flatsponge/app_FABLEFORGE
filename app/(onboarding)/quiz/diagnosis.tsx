import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import OnboardingOptionCard from '../../../components/OnboardingOptionCard';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const BEHAVIORS = [
    { id: 'arguing', title: 'Verbal Defiance', description: 'Argues back or refuses to listen', icon: 'chatbox-ellipses', severity: 'common' },
    { id: 'aggression', title: 'Physical Aggression', description: 'Hitting, throwing, or biting', icon: 'hand-left', severity: 'urgent' },
    { id: 'shut_down', title: 'Shuts Down', description: 'Goes silent or ignores you', icon: 'moon', severity: 'moderate' },
    { id: 'tantrums', title: 'Big Tantrums', description: 'Crying, screaming, emotional meltdowns', icon: 'thunderstorm', severity: 'urgent' },
];

export default function DiagnosisScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
        updateData({ struggleBehavior: id });
    };

    const handleNext = () => {
        if (selected) {
            if (selected === 'aggression') {
                router.push('/(onboarding)/quiz/aggression-details');
            } else {
                router.push('/(onboarding)/quiz/trigger-situations');
            }
        }
    };

    return (
        <OnboardingLayout
            showProgressBar={false} progress={0.5}
            showNextButton={!!selected}
            onNext={handleNext}
            nextLabel="Continue"
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>How does your child typically handle frustration?</OnboardingTitle>
                <OnboardingBody>
                    This helps us identify their primary coping mechanism.
                </OnboardingBody>

                <View style={styles.infoBanner}>
                    <Ionicons name="information-circle" size={16} color="#92400e" style={styles.infoIcon} />
                    <Text style={styles.infoText}>
                        Studies show 67% of children lack healthy coping skills by age 6.
                    </Text>
                </View>

                <View style={styles.optionsContainer}>
                    {BEHAVIORS.map((behavior) => (
                        <OnboardingOptionCard
                            key={behavior.id}
                            title={behavior.title}
                            description={behavior.description}
                            selected={selected === behavior.id}
                            onPress={() => handleSelect(behavior.id)}
                            icon={
                                <View style={[styles.iconContainer, selected === behavior.id && styles.iconContainerSelected]}>
                                    <Ionicons
                                        name={behavior.icon as any}
                                        size={24}
                                        color={selected === behavior.id ? OnboardingTheme.Colors.Primary : OnboardingTheme.Colors.IconColor}
                                    />
                                </View>
                            }
                            rightContent={behavior.severity === 'urgent' ? (
                                <View style={styles.priorityBadge}>
                                    <Text style={styles.priorityText}>Priority</Text>
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
    infoBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fffbeb', // amber-50
        borderColor: '#fde68a', // amber-200
        borderWidth: 1,
        borderRadius: OnboardingTheme.Radius.md,
        padding: OnboardingTheme.Spacing.sm,
        marginTop: OnboardingTheme.Spacing.sm,
        marginBottom: OnboardingTheme.Spacing.sm,
    },
    infoIcon: {
        marginRight: OnboardingTheme.Spacing.xs,
    },
    infoText: {
        flex: 1,
        color: '#92400e', // amber-800
        fontSize: 14,
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
    iconContainerSelected: {
        backgroundColor: '#f3e8ff', // primary-100 (approx)
    },
    priorityBadge: {
        backgroundColor: '#fee2e2', // red-100
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    priorityText: {
        color: '#b91c1c', // red-700
        fontSize: 10,
        fontWeight: 'bold',
    },
});