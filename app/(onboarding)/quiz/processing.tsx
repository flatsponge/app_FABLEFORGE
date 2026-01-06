import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const MESSAGES = [
    { text: "Analyzing behavioral patterns...", icon: "analytics" },
    { text: "Cross-referencing with child development research...", icon: "library" },
    { text: "Identifying key intervention points...", icon: "bulb" },
    { text: "Matching with proven story frameworks...", icon: "book" },
    { text: "Building personalized character model...", icon: "person" },
    { text: "Preparing your child's hero journey...", icon: "rocket" },
];

export default function ProcessingScreen() {
    const router = useRouter();
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    useEffect(() => {
        const messageInterval = setInterval(() => {
            setCurrentMessageIndex((prev) => {
                if (prev < MESSAGES.length - 1) return prev + 1;
                return prev;
            });
        }, 1200);

        const navigationTimer = setTimeout(() => {
            router.push('/(onboarding)/auth/email');
        }, 1200 * MESSAGES.length + 800);

        return () => {
            clearInterval(messageInterval);
            clearTimeout(navigationTimer);
        };
    }, []);

    const progress = ((currentMessageIndex + 1) / MESSAGES.length) * 100;

    return (
        <OnboardingLayout
            showProgressBar={false} progress={0.95}
            showNextButton={false}
        >
            <View style={styles.contentContainer}>
                <View style={styles.spinnerContainer}>
                    <ActivityIndicator size="large" color={OnboardingTheme.Colors.Primary} />
                </View>

                <OnboardingTitle style={styles.centerText}>Analyzing Your Responses</OnboardingTitle>
                <OnboardingBody style={[styles.centerText, styles.subtitle]}>
                    Creating your personalized plan...
                </OnboardingBody>

                <View style={styles.messageWrapper}>
                    <Animated.View
                        key={currentMessageIndex}
                        entering={FadeIn.duration(300)}
                        exiting={FadeOut.duration(300)}
                        style={styles.messageContainer}
                    >
                        <Ionicons
                            name={MESSAGES[currentMessageIndex].icon as any}
                            size={24}
                            color={OnboardingTheme.Colors.Primary}
                            style={styles.icon}
                        />
                        <OnboardingBody style={styles.messageText}>
                            {MESSAGES[currentMessageIndex].text}
                        </OnboardingBody>
                    </Animated.View>
                </View>

                <View style={styles.progressBarContainer}>
                    <View style={styles.progressBarBackground}>
                        <View
                            style={[styles.progressBarFill, { width: `${progress}%` }]}
                        />
                    </View>
                    <View style={styles.progressTextContainer}>
                        <OnboardingBody style={styles.progressLabel}>Processing...</OnboardingBody>
                        <OnboardingBody style={styles.progressValue}>{Math.round(progress)}%</OnboardingBody>
                    </View>
                </View>

                <View style={styles.trustContainer}>
                    <Ionicons name="shield-checkmark" size={16} color="#4ade80" />
                    <OnboardingBody style={styles.trustText}>Your data is encrypted and secure</OnboardingBody>
                </View>
            </View>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        alignItems: 'center',
        width: '100%',
        paddingTop: OnboardingTheme.Spacing.xl,
    },
    spinnerContainer: {
        marginBottom: OnboardingTheme.Spacing.xl,
        padding: 24,
        backgroundColor: '#f3e8ff', // primary-50
        borderRadius: 9999,
        borderWidth: 1,
        borderColor: '#e9d5ff', // primary-100
    },
    centerText: {
        textAlign: 'center',
    },
    subtitle: {
        marginBottom: OnboardingTheme.Spacing.xl,
        color: OnboardingTheme.Colors.TextSecondary,
    },
    messageWrapper: {
        height: 80,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: OnboardingTheme.Spacing.lg,
        paddingVertical: OnboardingTheme.Spacing.md,
        borderRadius: OnboardingTheme.Radius.lg,
        borderWidth: 1,
        borderColor: OnboardingTheme.Colors.Border,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    icon: {
        marginRight: OnboardingTheme.Spacing.md,
    },
    messageText: {
        flex: 1,
        fontSize: 14,
    },
    progressBarContainer: {
        width: '100%',
        marginTop: OnboardingTheme.Spacing.xl,
    },
    progressBarBackground: {
        width: '100%',
        height: 8,
        backgroundColor: '#e5e7eb', // gray-200
        borderRadius: 9999,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: OnboardingTheme.Colors.Primary,
        borderRadius: 9999,
    },
    progressTextContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: OnboardingTheme.Spacing.xs,
    },
    progressLabel: {
        fontSize: 12,
        color: OnboardingTheme.Colors.TextSecondary,
    },
    progressValue: {
        fontSize: 12,
        color: OnboardingTheme.Colors.Primary,
        fontWeight: 'bold',
    },
    trustContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: OnboardingTheme.Spacing.xl * 2,
    },
    trustText: {
        marginLeft: OnboardingTheme.Spacing.xs,
        fontSize: 12,
        color: OnboardingTheme.Colors.TextSecondary,
    },
});