import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import OnboardingSingleSelect, { SelectOption } from '../../../components/OnboardingSingleSelect';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const MORAL_SKILLS = [
    { id: 'sharing', label: 'Sharing', icon: 'people-outline', question: 'How well does your child share with others?' },
    { id: 'honesty', label: 'Telling the Truth', icon: 'chatbubbles-outline', question: 'How honest is your child typically?' },
    { id: 'patience', label: 'Patience', icon: 'hourglass-outline', question: 'How patient is your child in difficult situations?' },
    { id: 'kindness', label: 'Kindness to Others', icon: 'heart-outline', question: 'How kind is your child to others?' },
];

const RATING_OPTIONS: SelectOption[] = [
    { id: '1', title: 'Needs work', description: 'This is a growth area' },
    { id: '2', title: 'Sometimes', description: 'Depends on the day' },
    { id: '3', title: 'Usually good', description: 'More often than not' },
    { id: '4', title: 'Very good', description: 'Rarely an issue' },
    { id: '5', title: 'Excellent', description: 'A real strength!' },
];

export default function MoralBaselineScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const [ratings, setRatings] = useState<Record<string, number>>({});
    const [currentSelection, setCurrentSelection] = useState<string | null>(null);

    const currentSkillIndex = Object.keys(ratings).length;
    const currentSkill = MORAL_SKILLS[currentSkillIndex];
    const isComplete = currentSkillIndex >= MORAL_SKILLS.length;

    const baseProgress = 0.8;
    const stepProgress = 0.1 / MORAL_SKILLS.length;
    const currentProgress = baseProgress + (currentSkillIndex * stepProgress);

    const handleSelect = (id: string) => {
        setCurrentSelection(id);
    };

    const handleNext = () => {
        if (currentSelection !== null && currentSkill) {
            const newRatings = { ...ratings, [currentSkill.id]: parseInt(currentSelection, 10) };
            setRatings(newRatings);
            setCurrentSelection(null);

            if (Object.keys(newRatings).length >= MORAL_SKILLS.length) {
                const avg = Object.values(newRatings).reduce((a, b) => a + b, 0) / MORAL_SKILLS.length;
                updateData({ moralScore: avg * 20 });
                router.push('/(onboarding)/quiz/parent-guilt');
            }
        }
    };

    if (isComplete) {
        return null;
    }

    return (
        <OnboardingLayout
            showProgressBar={false} skipTopSafeArea progress={currentProgress}
            showNextButton={currentSelection !== null}
            onNext={handleNext}
            nextLabel="Continue"
        >
            <Animated.View
                key={currentSkillIndex}
                entering={FadeIn.duration(280)}
                exiting={FadeOut.duration(200)}
                style={styles.contentContainer}
            >
                <OnboardingTitle>{currentSkill.label}</OnboardingTitle>
                <OnboardingBody>
                    {currentSkill.question}
                </OnboardingBody>

                <View style={styles.iconContainer}>
                    <Ionicons name={currentSkill.icon as any} size={48} color={OnboardingTheme.Colors.IconColor} />
                </View>

                <OnboardingSingleSelect
                    options={RATING_OPTIONS}
                    selectedId={currentSelection}
                    onSelect={handleSelect}
                    showCheckbox={false}
                />
            </Animated.View>
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
});
