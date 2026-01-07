import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody, OnboardingSubtitle } from '../../../components/OnboardingTypography';
import OnboardingOptionCard from '../../../components/OnboardingOptionCard';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const AGE_OPTIONS = ['2-3', '4-5', '6-7', '8-9', '10+'];

export default function ChildAgeScreen() {
    const router = useRouter();
    const { data, updateData } = useOnboarding();
    const [selectedAge, setSelectedAge] = useState<string | null>(data.childAge || null);

    const canProceed = selectedAge !== null;

    const handleNext = () => {
        if (canProceed) {
            updateData({ childAge: selectedAge! });
            router.push('/(onboarding)/quiz/child-gender');
        }
    };

    return (
        <OnboardingLayout
            showProgressBar={false} skipTopSafeArea progress={0.15}
            onNext={handleNext}
            nextLabel="Continue"
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>How old is {data.childName || 'your child'}?</OnboardingTitle>
                <OnboardingBody>
                    We'll tailor the stories to their age.
                </OnboardingBody>

                <View style={styles.optionsContainer}>
                    {AGE_OPTIONS.map((age) => (
                        <OnboardingOptionCard
                            key={age}
                            title={age}
                            selected={selectedAge === age}
                            onPress={() => setSelectedAge(age)}
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
});