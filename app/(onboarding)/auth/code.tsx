import React, { useState, useRef } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

export default function CodeScreen() {
    const router = useRouter();
    const [code, setCode] = useState(['', '', '', '']);
    const inputRefs = useRef<Array<TextInput | null>>([]);

    const isComplete = code.every(digit => digit !== '');

    const handleNext = () => {
        if (isComplete) {
            router.push('/(onboarding)/child/setup');
        }
    };

    const handleChange = (text: string, index: number) => {
        // Take only numeric and last char
        const digit = text.replace(/[^0-9]/g, '').slice(-1);

        const newCode = [...code];
        newCode[index] = digit;
        setCode(newCode);

        // Auto-advance
        if (digit !== '' && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && code[index] === '' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <OnboardingLayout
            showProgressBar={false}
            progress={0.99}
            onNext={handleNext}
            nextLabel="Verify"
            valid={isComplete}
        >
            <View style={styles.contentContainer}>
                {/* Icon */}
                <Animated.View entering={FadeIn.delay(100).duration(500)} style={styles.iconContainer}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="keypad" size={40} color={OnboardingTheme.Colors.Primary} />
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200).duration(500)}>
                    <OnboardingTitle style={styles.title}>Enter your code</OnboardingTitle>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(300).duration(500)}>
                    <OnboardingBody style={styles.subtitle}>
                        We sent a 4-digit code to your email.
                    </OnboardingBody>
                </Animated.View>

                {/* Code Inputs */}
                <Animated.View
                    entering={FadeInDown.delay(400).duration(500)}
                    style={styles.codeContainer}
                >
                    {code.map((digit, index) => (
                        <View
                            key={index}
                            style={[
                                styles.codeInputWrapper,
                                digit !== '' && styles.codeInputFilled
                            ]}
                        >
                            <TextInput
                                ref={ref => { inputRefs.current[index] = ref; }}
                                value={digit}
                                onChangeText={(text) => handleChange(text, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                style={styles.codeInput}
                                keyboardType="number-pad"
                                maxLength={1}
                                autoFocus={index === 0}
                                selectTextOnFocus
                            />
                        </View>
                    ))}
                </Animated.View>

                {/* Resend Button */}
                <Animated.View entering={FadeIn.delay(600).duration(500)}>
                    <TouchableOpacity style={styles.resendButton} onPress={() => { /* TODO: resend logic */ }}>
                        <Ionicons name="refresh" size={18} color={OnboardingTheme.Colors.Primary} />
                        <Text style={styles.resendText}>Resend code</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Trust indicator */}
                <Animated.View
                    entering={FadeIn.delay(700).duration(500)}
                    style={styles.trustContainer}
                >
                    <Ionicons name="time-outline" size={16} color={OnboardingTheme.Colors.TextSecondary} />
                    <Text style={styles.trustText}>Code expires in 10 minutes</Text>
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
    codeContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 14,
        marginTop: OnboardingTheme.Spacing.xl,
        marginBottom: OnboardingTheme.Spacing.lg,
    },
    codeInputWrapper: {
        width: 64,
        height: 76,
        backgroundColor: OnboardingTheme.Colors.White,
        borderWidth: 2,
        borderColor: OnboardingTheme.Colors.Border,
        borderRadius: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    codeInputFilled: {
        borderColor: OnboardingTheme.Colors.Primary,
        backgroundColor: '#faf5ff',
    },
    codeInput: {
        width: '100%',
        height: '100%',
        fontSize: 32,
        fontWeight: 'bold',
        color: OnboardingTheme.Colors.Text,
        textAlign: 'center',
    },
    resendButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: OnboardingTheme.Spacing.sm,
        paddingHorizontal: OnboardingTheme.Spacing.md,
        gap: 6,
    },
    resendText: {
        color: OnboardingTheme.Colors.Primary,
        fontWeight: '600',
        fontSize: 16,
    },
    trustContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: OnboardingTheme.Spacing.xl,
        gap: 6,
    },
    trustText: {
        fontSize: 13,
        color: OnboardingTheme.Colors.TextSecondary,
    },
});
