import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, ZoomIn, Easing, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

export default function StatReveal4Screen() {
    const router = useRouter();
    const { data } = useOnboarding();
    const [showContext, setShowContext] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowContext(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    const isOlder = ['6-7', '8-9', '10+'].includes(data.childAge);

    const content = isOlder ? {
        intro: "Reversing these habits later becomes",
        val: "Harder",
        desc: "Correction is significantly more difficult than prevention. The 'rewiring' process takes 400% more repetition after age 10."
    } : {
        intro: "Once the development window closes, change becomes",
        val: "Harder",
        desc: "Early intervention is the key. Waiting makes behavioral correction significantly more difficult and expensive."
    };

    const handleNext = () => {
        router.push('/(onboarding)/parent/social-warning');
    };

    return (
        <OnboardingLayout
            showProgressBar={false} progress={1.0}
            showNextButton={showContext}
            onNext={handleNext}
            nextLabel="See The Ripple Effect"
            backgroundColor={OnboardingTheme.Colors.Error}
            progressBarColor="white"
            progressBarTrackColor="rgba(255, 255, 255, 0.3)"
            backButtonColor="white"
            isScrollable={true}
            fadeInButton={true}
        >
            <View style={styles.container}>
                <Animated.View entering={FadeIn.delay(200)} style={styles.headerContainer}>
                    <View style={styles.iconWrapper}>
                        <Ionicons name="alarm" size={40} color="white" />
                    </View>

                    <Text style={styles.introText}>{content.intro}</Text>

                    <Animated.View entering={ZoomIn.duration(600)} style={styles.statContainer}>
                        <Text style={styles.statValue}>4x</Text>
                        <Text style={styles.statLabel}>{content.val}</Text>
                    </Animated.View>
                </Animated.View>

                {showContext && (
                    <Animated.View entering={FadeInDown.delay(100).duration(400).easing(Easing.out(Easing.cubic))} style={styles.contextCard}>
                        <Text style={styles.description}>
                            "{content.desc}"
                        </Text>
                        <View style={styles.sourceBadge}>
                            <Text style={styles.sourceText}>Journal of Pediatric Psychology</Text>
                        </View>
                    </Animated.View>
                )}
            </View>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: OnboardingTheme.Spacing.xl,
    },
    iconWrapper: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 16,
        borderRadius: 9999,
        marginBottom: OnboardingTheme.Spacing.lg,
    },
    introText: {
        fontSize: 22,
        color: 'white',
        textAlign: 'center',
        marginBottom: OnboardingTheme.Spacing.md,
        fontWeight: '500',
        paddingHorizontal: 16,
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
    statContainer: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 120,
        fontWeight: '900',
        color: 'white',
        lineHeight: 130,
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 10,
        fontFamily: OnboardingTheme.Typography.Title.fontFamily,
    },
    statLabel: {
        fontSize: 40,
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 4,
        marginTop: -10,
        fontFamily: OnboardingTheme.Typography.Title.fontFamily,
    },
    contextCard: {
        width: '100%',
        backgroundColor: 'white',
        padding: OnboardingTheme.Spacing.lg,
        borderRadius: OnboardingTheme.Radius.xl,
        alignItems: 'center',
    },
    description: {
        color: OnboardingTheme.Colors.Text,
        textAlign: 'center',
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '500',
        marginBottom: OnboardingTheme.Spacing.md,
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
    sourceBadge: {
        backgroundColor: '#fef2f2', // red-50
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 9999,
    },
    sourceText: {
        color: '#b91c1c', // red-700
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
});