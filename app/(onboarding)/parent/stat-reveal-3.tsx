import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, ZoomIn, FadeInUp, Easing } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

export default function StatReveal3Screen() {
    const router = useRouter();
    const { data } = useOnboarding();
    const [showCitation, setShowCitation] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowCitation(true), 1200);
        return () => clearTimeout(timer);
    }, []);

    // Logic for dynamic content based on age
    const isOlder = ['6-7', '8-9', '10+'].includes(data.childAge);

    const content = isOlder ? {
        titlePart1: "Habits are",
        titleHighlight: "crystallizing",
        titlePart2: "rapidly right now.",
        stat: "85%",
        statLabel: "Personality Traits Fixed",
        citation: "By age 10, core personality traits and behavioral responses become deeply ingrained and resistant to change."
    } : {
        titlePart1: "Behavioral patterns",
        titleHighlight: "are largely fixed",
        titlePart2: "by age 7.",
        stat: "73%",
        statLabel: "Neural Pathways Formed",
        citation: "The neural circuitry for emotional regulation and social behavior is significantly established during the first seven years."
    };

    const handleNext = () => {
        router.push('/(onboarding)/parent/stat-reveal-4');
    };

    return (
        <OnboardingLayout
            showProgressBar={false} progress={1.0}
            showNextButton={showCitation}
            onNext={handleNext}
            nextLabel="What this means for you"
        >
            <View style={styles.container}>
                <Animated.View entering={FadeIn.delay(200)} style={styles.headerContainer}>
                    <View style={styles.badge}>
                        <Ionicons name="school" size={16} color="#d97706" style={styles.badgeIcon} />
                        <Text style={styles.badgeText}>Clinical Research</Text>
                    </View>

                    <OnboardingTitle style={styles.title}>
                        {content.titlePart1}{' '}
                        <Text style={styles.titleHighlight}>{content.titleHighlight}</Text>
                        {'\n'}{content.titlePart2}
                    </OnboardingTitle>
                </Animated.View>

                {/* The big stat visualization */}
                <Animated.View entering={ZoomIn.duration(600)} style={styles.statWrapper}>
                    <Text style={styles.statValue}>{content.stat}</Text>
                    <Text style={styles.statLabel}>{content.statLabel}</Text>
                </Animated.View>

                {showCitation && (
                    <Animated.View entering={FadeInUp.duration(600)} style={styles.citationCard}>
                        <Text style={styles.citationText}>
                            "{content.citation}"
                        </Text>
                        <View style={styles.sourceContainer}>
                            <View style={styles.sourceIconWrapper}>
                                <Ionicons name="library" size={18} color="#78350f" />
                            </View>
                            <View>
                                <Text style={styles.sourceTitle}>Harvard University</Text>
                                <Text style={styles.sourceSubtitle}>Center on the Developing Child</Text>
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
        alignItems: 'center',
        width: '100%',
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: OnboardingTheme.Spacing.lg,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fffbeb', // amber-50
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 9999,
        borderWidth: 1,
        borderColor: '#fef3c7', // amber-100
        marginBottom: OnboardingTheme.Spacing.md,
    },
    badgeIcon: {
        marginRight: 8,
    },
    badgeText: {
        color: '#b45309', // amber-700
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        fontSize: 11,
        fontWeight: 'bold',
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
    title: {
        textAlign: 'center',
        lineHeight: 36,
    },
    titleHighlight: {
        color: '#d97706', // amber-600
        fontWeight: 'bold',
        fontStyle: 'italic',
    },
    statWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 9999,
        width: 256, // w-64
        height: 256,
        borderWidth: 6,
        borderColor: '#fffbeb', // amber-50
        marginBottom: OnboardingTheme.Spacing.xl,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    statValue: {
        fontSize: 80,
        fontWeight: '900',
        color: '#f59e0b', // amber-500
        fontFamily: OnboardingTheme.Typography.Title.fontFamily,
    },
    statLabel: {
        color: OnboardingTheme.Colors.TextSecondary,
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginTop: 8,
        paddingHorizontal: 12,
        textAlign: 'center',
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
    citationCard: {
        width: '100%',
        backgroundColor: '#f9fafb', // gray-50
        padding: OnboardingTheme.Spacing.lg,
        borderRadius: OnboardingTheme.Radius.xl,
        borderLeftWidth: 4,
        borderLeftColor: '#f59e0b', // amber-500
    },
    citationText: {
        color: OnboardingTheme.Colors.TextSecondary,
        fontStyle: 'italic',
        marginBottom: OnboardingTheme.Spacing.md,
        lineHeight: 22,
        fontWeight: '500',
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
    sourceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sourceIconWrapper: {
        width: 40,
        height: 40,
        backgroundColor: 'white',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: OnboardingTheme.Spacing.sm,
        borderWidth: 1,
        borderColor: '#f3f4f6', // gray-100
    },
    sourceTitle: {
        color: OnboardingTheme.Colors.Text,
        fontWeight: 'bold',
        fontSize: 14,
        fontFamily: OnboardingTheme.Typography.Title.fontFamily,
    },
    sourceSubtitle: {
        color: OnboardingTheme.Colors.TextSecondary,
        fontSize: 12,
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
});