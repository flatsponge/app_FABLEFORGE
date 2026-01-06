import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody, OnboardingSubtitle } from '../../../components/OnboardingTypography';
import OnboardingOptionCard from '../../../components/OnboardingOptionCard';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const ICON_COLOR = '#6b7280';

const MORAL_SKILLS = [
    { id: 'sharing', label: 'Sharing', icon: 'people-outline', question: 'How well does your child share with others?' },
    { id: 'honesty', label: 'Telling the Truth', icon: 'chatbubbles-outline', question: 'How honest is your child typically?' },
    { id: 'patience', label: 'Patience', icon: 'hourglass-outline', question: 'How patient is your child in difficult situations?' },
    { id: 'kindness', label: 'Kindness to Others', icon: 'heart-outline', question: 'How kind is your child to others?' },
];

const RATING_OPTIONS = [
    { value: 1, label: 'Needs work', description: 'This is a growth area' },
    { value: 2, label: 'Sometimes', description: 'Depends on the day' },
    { value: 3, label: 'Usually good', description: 'More often than not' },
    { value: 4, label: 'Very good', description: 'Rarely an issue' },
    { value: 5, label: 'Excellent', description: 'A real strength!' },
];

export default function MoralBaselineScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const [ratings, setRatings] = useState<Record<string, number>>({});

    const currentSkillIndex = Object.keys(ratings).length;
    const currentSkill = MORAL_SKILLS[currentSkillIndex];
    const isComplete = currentSkillIndex >= MORAL_SKILLS.length;

    const baseProgress = 0.8;
    const stepProgress = 0.1 / MORAL_SKILLS.length;
    const currentProgress = baseProgress + (currentSkillIndex * stepProgress);

    useEffect(() => {
        if (isComplete) {
            const avg = Object.values(ratings).reduce((a, b) => a + b, 0) / MORAL_SKILLS.length;
            updateData({ moralScore: avg * 20 });
            router.push('/(onboarding)/quiz/parent-guilt');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isComplete, ratings]);

    const handleSelect = (value: number) => {
        if (currentSkill) {
            setRatings(prev => ({ ...prev, [currentSkill.id]: value }));
        }
    };

    if (isComplete) {
        return null;
    }

    return (
        <OnboardingLayout
            progress={currentProgress}
            showNextButton={false}
            onNext={() => { }}
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>{currentSkill.label}</OnboardingTitle>
                <OnboardingBody>
                    {currentSkill.question}
                </OnboardingBody>

                <View style={styles.iconContainer}>
                    <Ionicons name={currentSkill.icon as any} size={48} color={ICON_COLOR} />
                </View>

                <View style={styles.optionsContainer}>
                    {RATING_OPTIONS.map((option) => (
                        <OnboardingOptionCard
                            key={option.value}
                            title={option.label}
                            description={option.description}
                            showCheckbox={false}
                            onPress={() => handleSelect(option.value)}
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
    iconContainer: {
        alignItems: 'center',
        marginVertical: OnboardingTheme.Spacing.md,
    },
    optionsContainer: {
        marginTop: OnboardingTheme.Spacing.sm,
    },
});
