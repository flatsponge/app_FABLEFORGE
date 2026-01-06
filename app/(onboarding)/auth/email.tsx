import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

export default function EmailScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');

    const isValidEmail = email.includes('@') && email.includes('.');

    const handleNext = () => {
        if (isValidEmail) {
            router.push('/(onboarding)/auth/code');
        }
    };

    return (
        <OnboardingLayout
            showProgressBar={false}
            progress={0.98}
            onNext={handleNext}
            nextLabel="Continue"
            valid={isValidEmail}
        >
            <View style={styles.contentContainer}>
                {/* Icon */}
                <Animated.View entering={FadeIn.delay(100).duration(500)} style={styles.iconContainer}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="mail" size={40} color={OnboardingTheme.Colors.Primary} />
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200).duration(500)}>
                    <OnboardingTitle style={styles.title}>What's your email?</OnboardingTitle>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(300).duration(500)}>
                    <OnboardingBody style={styles.subtitle}>
                        We'll save your progress and send you a verification code.
                    </OnboardingBody>
                </Animated.View>

                <Animated.View
                    entering={FadeInDown.delay(400).duration(500)}
                    style={styles.inputContainer}
                >
                    <View style={[
                        styles.inputWrapper,
                        isValidEmail && styles.inputWrapperValid
                    ]}>
                        <Ionicons
                            name="mail-outline"
                            size={22}
                            color={isValidEmail ? OnboardingTheme.Colors.Primary : OnboardingTheme.Colors.TextSecondary}
                            style={styles.inputIcon}
                        />
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="parent@example.com"
                            placeholderTextColor={OnboardingTheme.Colors.TextSecondary}
                            style={styles.input}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            autoFocus
                        />
                        {isValidEmail && (
                            <Ionicons
                                name="checkmark-circle"
                                size={24}
                                color="#22c55e"
                            />
                        )}
                    </View>
                </Animated.View>

                {/* Trust indicator */}
                <Animated.View
                    entering={FadeIn.delay(600).duration(500)}
                    style={styles.trustContainer}
                >
                    <Ionicons name="shield-checkmark" size={16} color="#4ade80" />
                    <Text style={styles.trustText}>Your email is secure and never shared</Text>
                </Animated.View>
            </View>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        width: '100%',
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: OnboardingTheme.Spacing.lg,
    },
    iconCircle: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: '#f3e8ff',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e9d5ff',
    },
    title: {
        textAlign: 'center',
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: OnboardingTheme.Spacing.md,
    },
    inputContainer: {
        width: '100%',
        marginTop: OnboardingTheme.Spacing.lg,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: OnboardingTheme.Colors.White,
        borderWidth: 2,
        borderColor: OnboardingTheme.Colors.Border,
        borderRadius: 16,
        paddingHorizontal: OnboardingTheme.Spacing.md,
        paddingVertical: OnboardingTheme.Spacing.sm,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    inputWrapperValid: {
        borderColor: OnboardingTheme.Colors.Primary,
    },
    inputIcon: {
        marginRight: OnboardingTheme.Spacing.sm,
    },
    input: {
        flex: 1,
        fontSize: 18,
        color: OnboardingTheme.Colors.Text,
        paddingVertical: OnboardingTheme.Spacing.sm,
    },
    trustContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: OnboardingTheme.Spacing.xl * 2,
    },
    trustText: {
        marginLeft: OnboardingTheme.Spacing.xs,
        fontSize: 13,
        color: OnboardingTheme.Colors.TextSecondary,
    },
});
