import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import { useQuizFooter } from '../../../contexts/QuizFooterContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody, OnboardingSubtitle } from '../../../components/OnboardingTypography';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

export default function ChildNameScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const { setFooter } = useQuizFooter();
    const [childName, setChildName] = useState('');

    const canProceed = childName.trim().length > 0;

    const handleNext = () => {
        if (canProceed) {
            updateData({ childName: childName.trim() });
            router.push('/(onboarding)/quiz/child-age');
        }
    };

    useEffect(() => {
        setFooter({
            onNext: handleNext,
            nextLabel: "Continue",
            showNextButton: canProceed
        });
    }, [canProceed]);

    return (
        <OnboardingLayout
            showProgressBar={false}
            skipTopSafeArea
            progress={0.1}
            hideFooter={true}
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>What's your child's name?</OnboardingTitle>
                <OnboardingBody>
                    We'll personalize every story just for them.
                </OnboardingBody>

                <View style={styles.inputContainer}>
                    <TextInput
                        value={childName}
                        onChangeText={setChildName}
                        placeholder="e.g., Emma"
                        placeholderTextColor={OnboardingTheme.Colors.TextSecondary}
                        style={styles.input}
                        autoCapitalize="words"
                        autoCorrect={false}
                        autoFocus
                    />
                </View>
            </View>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        width: '100%',
    },
    inputContainer: {
        marginTop: OnboardingTheme.Spacing.xl,
    },
    input: {
        backgroundColor: OnboardingTheme.Colors.White,
        borderWidth: 2,
        borderColor: OnboardingTheme.Colors.Border,
        borderRadius: 16,
        paddingHorizontal: OnboardingTheme.Spacing.lg,
        paddingVertical: OnboardingTheme.Spacing.md,
        fontSize: 20,
        color: OnboardingTheme.Colors.Text,
    },
});
