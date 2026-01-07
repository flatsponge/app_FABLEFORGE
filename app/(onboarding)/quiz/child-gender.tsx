import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import OnboardingOptionCard from '../../../components/OnboardingOptionCard';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const GENDER_OPTIONS = [
    { id: 'boy', title: 'Boy', icon: '👦' },
    { id: 'girl', title: 'Girl', icon: '👧' },
];

export default function ChildGenderScreen() {
    const router = useRouter();
    const { data, updateData } = useOnboarding();
    const [selectedGender, setSelectedGender] = useState<'boy' | 'girl' | null>(data.gender || null);

    const canProceed = selectedGender !== null;

    const handleNext = () => {
        if (canProceed) {
            updateData({ gender: selectedGender! });
            router.push('/(onboarding)/quiz/goals-timeline');
        }
    };

    return (
        <OnboardingLayout
            showProgressBar={false}
            progress={0.12}
            onNext={handleNext}
            nextLabel="Continue"
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>Is {data.childName || 'your child'} a boy or girl?</OnboardingTitle>
                <OnboardingBody>
                    We'll personalize the stories and characters to match.
                </OnboardingBody>

                <View style={styles.optionsContainer}>
                    {GENDER_OPTIONS.map((option) => (
                        <OnboardingOptionCard
                            key={option.id}
                            title={option.title}
                            icon={
                                <View style={styles.iconContainer}>
                                    <Text style={styles.emojiText}>{option.icon}</Text>
                                </View>
                            }
                            selected={selectedGender === option.id}
                            onPress={() => setSelectedGender(option.id as 'boy' | 'girl')}
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
        borderRadius: 24,
        backgroundColor: OnboardingTheme.Colors.Surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emojiText: {
        fontSize: 28,
    },
});
