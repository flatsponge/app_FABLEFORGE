import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

export default function ReferralCodeScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const [code, setCode] = useState('');

    const handleNext = () => {
        if (code.trim()) {
            updateData({ referralCode: code.trim() });
        }
        router.push('/(onboarding)/quiz/child-name');
    };

    const handleSkip = () => {
        router.push('/(onboarding)/quiz/child-name');
    };

    return (
        <OnboardingLayout
            showProgressBar={false}
            skipTopSafeArea
            onNext={handleNext}
            nextLabel="Continue"
            showNextButton={true}
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>Do you have a referral code?</OnboardingTitle>
                <OnboardingBody>Enter it below for a special bonus, or skip if you don't have one.</OnboardingBody>

                <View style={styles.inputContainer}>
                    <TextInput
                        value={code}
                        onChangeText={setCode}
                        placeholder="e.g., FRIEND2024"
                        placeholderTextColor={OnboardingTheme.Colors.TextSecondary}
                        style={styles.input}
                        autoCapitalize="characters"
                        autoCorrect={false}
                        autoFocus
                    />
                </View>

                <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
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
    skipButton: {
        marginTop: OnboardingTheme.Spacing.lg,
        alignSelf: 'center',
        padding: 4,
    },
    skipText: {
        color: OnboardingTheme.Colors.TextSecondary,
        fontSize: 14,
        fontWeight: '600',
    },
});
