import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInUp, ZoomIn, Easing } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

export default function SocialWarningScreen() {
    const router = useRouter();
    const [showStat, setShowStat] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowStat(true), 1200);
        return () => clearTimeout(timer);
    }, []);

    const handleNext = () => {
        router.push('/(onboarding)/parent/parent-warning');
    };

    return (
        <OnboardingLayout
            showProgressBar={false} progress={1.0}
            showNextButton={showStat}
            onNext={handleNext}
            nextLabel="And the toll on you..."
        >
            <View style={styles.container}>
                <Animated.View entering={FadeIn.delay(200)} style={styles.header}>
                    <View style={styles.iconWrapper}>
                        <Ionicons name="people" size={40} color={OnboardingTheme.Colors.TextSecondary} />
                    </View>

                    <Text style={styles.badgeText}>The Social Impact</Text>
                    <OnboardingTitle style={styles.title}>It's not just about home.</OnboardingTitle>
                </Animated.View>

                <Animated.View entering={ZoomIn.delay(400).duration(600)} style={styles.statCard}>
                    <Ionicons name="school-outline" size={48} color={OnboardingTheme.Colors.Error} style={styles.statIcon} />

                    <Text style={styles.statDescription}>
                        Children who struggle with emotional regulation are
                    </Text>

                    <Text style={styles.statValue}>2x</Text>

                    <Text style={styles.statDescription}>
                        more likely to face <Text style={styles.highlightText}>social isolation</Text> or difficulty making friends at school.
                    </Text>
                </Animated.View>

                {showStat && (
                    <Animated.View entering={FadeInUp.duration(600)} style={styles.contextCard}>
                        <View style={styles.contextHeader}>
                            <Ionicons name="alert-circle" size={24} color="#dc2626" style={styles.contextIcon} />
                            <Text style={styles.contextText}>
                                "Social rejection in early schooling is a primary predictor of negative attitudes towards education."
                            </Text>
                        </View>
                    </Animated.View>
                )}
            </View>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: OnboardingTheme.Spacing.lg,
    },
    iconWrapper: {
        backgroundColor: '#f3f4f6', // gray-100
        padding: 16,
        borderRadius: 9999,
        marginBottom: OnboardingTheme.Spacing.md,
    },
    badgeText: {
        color: OnboardingTheme.Colors.TextSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
    title: {
        textAlign: 'center',
    },
    statCard: {
        width: '100%',
        backgroundColor: '#f9fafb', // gray-50
        borderColor: '#e5e7eb', // gray-200
        borderWidth: 1,
        borderRadius: OnboardingTheme.Radius.xl,
        padding: OnboardingTheme.Spacing.xl,
        alignItems: 'center',
        marginBottom: OnboardingTheme.Spacing.lg,
        overflow: 'hidden',
    },
    statIcon: {
        marginBottom: 16,
    },
    statDescription: {
        textAlign: 'center',
        color: '#374151', // gray-800
        fontSize: 18,
        fontWeight: '500',
        lineHeight: 26,
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
    statValue: {
        fontSize: 64,
        fontWeight: '900',
        color: OnboardingTheme.Colors.Error,
        marginVertical: OnboardingTheme.Spacing.sm,
        fontFamily: OnboardingTheme.Typography.Title.fontFamily,
    },
    highlightText: {
        fontWeight: 'bold',
        color: OnboardingTheme.Colors.Error,
    },
    contextCard: {
        width: '100%',
        backgroundColor: '#fef2f2', // red-50
        borderColor: '#fee2e2', // red-100
        borderWidth: 1,
        borderRadius: OnboardingTheme.Radius.lg,
        padding: OnboardingTheme.Spacing.md,
    },
    contextHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    contextIcon: {
        marginRight: 12,
    },
    contextText: {
        color: '#991b1b', // red-800
        fontSize: 14,
        flex: 1,
        lineHeight: 20,
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
});