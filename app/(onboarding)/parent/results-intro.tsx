import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown, useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, withSequence } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

export default function ResultsIntroScreen() {
    const router = useRouter();
    const [showContent, setShowContent] = useState(false);

    // Pulse animation for the analyzing icon
    const scale = useSharedValue(1);

    useEffect(() => {
        scale.value = withRepeat(
            withSequence(
                withTiming(1.1, { duration: 1000, easing: Easing.ease }),
                withTiming(1, { duration: 1000, easing: Easing.ease })
            ),
            -1,
            true
        );

        const timer = setTimeout(() => setShowContent(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    const animatedCircleStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handleNext = () => {
        router.push('/(onboarding)/parent/stat-reveal-1');
    };

    return (
        <OnboardingLayout
            progress={1.0} // Transition to results phase
            showNextButton={showContent}
            onNext={handleNext}
            nextLabel="Reveal My Results"
        >
            <View style={styles.container}>
                <Animated.View entering={FadeIn.delay(300)} style={styles.animationContainer}>
                    <View style={styles.iconWrapper}>
                        <Animated.View
                            style={[
                                styles.pulseCircle,
                                animatedCircleStyle
                            ]}
                        />
                        <View style={styles.iconCircle}>
                            <Ionicons name="scan" size={48} color={OnboardingTheme.Colors.Primary} />
                        </View>
                    </View>

                    <OnboardingTitle style={styles.title}>Analysis Complete</OnboardingTitle>
                    <Text style={styles.subtitle}>Processing 14 Data Points</Text>
                </Animated.View>

                {showContent && (
                    <Animated.View entering={FadeInDown.duration(600)} style={styles.warningContainer}>
                        <View style={styles.warningContent}>
                            <View style={styles.warningIconWrapper}>
                                <Ionicons name="warning" size={24} color="#ef4444" />
                            </View>
                            <View style={styles.warningTextWrapper}>
                                <Text style={styles.warningTitle}>Attention Needed</Text>
                                <Text style={styles.warningBody}>
                                    We've identified 2 critical areas that diverge from standard developmental benchmarks for this age group.
                                </Text>
                            </View>
                        </View>
                    </Animated.View>
                )}
            </View>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingTop: OnboardingTheme.Spacing.xl,
    },
    animationContainer: {
        alignItems: 'center',
        marginBottom: OnboardingTheme.Spacing.xl * 2,
    },
    iconWrapper: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: OnboardingTheme.Spacing.lg,
    },
    pulseCircle: {
        position: 'absolute',
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#f3e8ff', // primary-100
    },
    iconCircle: {
        width: 112, // w-28
        height: 112,
        backgroundColor: 'white',
        borderRadius: 56,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: '#f3e8ff', // primary-100
        zIndex: 10,
    },
    title: {
        textAlign: 'center',
        marginBottom: OnboardingTheme.Spacing.xs,
    },
    subtitle: {
        color: OnboardingTheme.Colors.TextSecondary,
        fontWeight: '500',
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        fontSize: 12,
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
    warningContainer: {
        width: '100%',
        backgroundColor: '#fef2f2', // red-50
        borderColor: '#fee2e2', // red-100
        borderWidth: 1,
        borderRadius: OnboardingTheme.Radius.xl,
        padding: OnboardingTheme.Spacing.lg,
    },
    warningContent: {
        flexDirection: 'row',
        alignItems: 'start',
    },
    warningIconWrapper: {
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 9999,
        marginRight: OnboardingTheme.Spacing.md,
    },
    warningTextWrapper: {
        flex: 1,
    },
    warningTitle: {
        color: '#7f1d1d', // red-900
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 4,
        fontFamily: OnboardingTheme.Typography.Title.fontFamily,
    },
    warningBody: {
        color: '#991b1b', // red-800
        opacity: 0.8,
        lineHeight: 20,
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
});