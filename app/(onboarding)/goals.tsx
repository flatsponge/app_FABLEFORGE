import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../contexts/OnboardingContext';
import OnboardingLayout from '../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody, OnboardingSubtitle } from '../../components/OnboardingTypography';
import OnboardingOptionCard from '../../components/OnboardingOptionCard';
import { OnboardingTheme } from '../../constants/OnboardingTheme';
import { Ionicons } from '@expo/vector-icons';

const GOALS = [
    { id: 'resilience', title: 'Emotional Resilience', description: 'Help them handle big feelings better', icon: 'heart' },
    { id: 'moral', title: 'Strong Moral Compass', description: 'Teach honesty, sharing, and kindness', icon: 'compass' },
    { id: 'leadership', title: 'Leadership Skills', description: 'Build confidence and decision making', icon: 'ribbon' },
    { id: 'agency', title: 'Healthy Independence', description: 'Encourage responsibility and self-care', icon: 'bicycle' },
];

export default function OnboardingStart() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
        updateData({ primaryGoal: id });
        setTimeout(() => {
            router.push('/(onboarding)/quiz/child-name');
        }, 300);
    };

    return (
        <OnboardingLayout
            progress={0.05}
            showNextButton={false}
        >
            <View style={styles.contentContainer}>
                <OnboardingSubtitle>Welcome</OnboardingSubtitle>
                <OnboardingTitle>What is your ultimate goal for your child?</OnboardingTitle>
                <OnboardingBody>
                    We'll tailor the stories to help them grow in this direction.
                </OnboardingBody>

                <View style={styles.optionsContainer}>
                    {GOALS.map((goal) => (
                        <OnboardingOptionCard
                            key={goal.id}
                            title={goal.title}
                            subtitle={goal.description}
                            selected={selected === goal.id}
                            onPress={() => handleSelect(goal.id)}
                            icon={
                                <View style={[styles.iconContainer, selected === goal.id && styles.iconContainerSelected]}>
                                    <Ionicons
                                        name={goal.icon as any}
                                        size={24}
                                        color={selected === goal.id ? OnboardingTheme.Colors.Primary : '#6b7280'}
                                    />
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
        backgroundColor: '#f9fafb', // gray-50
    },
    iconContainerSelected: {
        backgroundColor: '#f3e8ff', // primary-100 (approx)
    },
});