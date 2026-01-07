import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import OnboardingOptionCard from '../../../components/OnboardingOptionCard';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const GENDER_OPTIONS = [
    { id: 'boy', title: 'Boy', icon: 'male' as const },
    { id: 'girl', title: 'Girl', icon: 'female' as const },
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
            showProgressBar={false} skipTopSafeArea
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
                                    <Ionicons
                                        name={option.icon}
                                        size={24}
                                        color={OnboardingTheme.Colors.IconColor}
                                    />
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
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: OnboardingTheme.Colors.IconBackground,
    },
});
