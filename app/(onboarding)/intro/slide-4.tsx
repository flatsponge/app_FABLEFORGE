import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const { width } = Dimensions.get('window');

const SUCCESS_METRICS = [
    { id: 'improvement', value: '94%', label: 'see improvement' },
    { id: 'days', value: '14', label: 'days average' },
    { id: 'rating', value: '4.9★', label: 'parent rating' },
];

export default function IntroSlide4() {
    const router = useRouter();
    const [showMetrics, setShowMetrics] = useState(false);
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const timer1 = setTimeout(() => setShowMetrics(true), 800);
        const timer2 = setTimeout(() => setShowButton(true), 1800);
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    const handleNext = () => {
        // Navigate to main onboarding (goals selection)
        router.replace('/(onboarding)/goals');
    };

    return (
        <OnboardingLayout
            onNext={handleNext}
            nextLabel="Let's get started"
            showNextButton={showButton}
            showProgressBar={false}
        >
            <View style={styles.container}>
                {/* Main promise */}
                <Animated.View entering={FadeIn.delay(100).duration(600)} style={styles.headerContainer}>
                    <View style={styles.successBadge}>
                        <Ionicons name="checkmark-circle" size={16} color={OnboardingTheme.Colors.Success} />
                        <Text style={styles.successBadgeText}>QUICK RESULTS</Text>
                    </View>
                    <Text style={styles.title}>See visible changes in just 14 days</Text>
                    <Text style={styles.subtitle}>
                        Parents report calmer bedtimes, better sharing, and improved patience within 2 weeks
                    </Text>
                </Animated.View>

                {/* Guarantee card */}
                <Animated.View
                    entering={ZoomIn.delay(400).duration(600)}
                    style={styles.guaranteeCard}
                >
                    <View style={styles.guaranteeIcon}>
                        <Ionicons name="shield-checkmark" size={32} color={OnboardingTheme.Colors.Success} />
                    </View>
                    <Text style={styles.guaranteeTitle}>Our Promise</Text>
                    <Text style={styles.guaranteeText}>
                        If you don't see improvement, we'll work with you personally until you do
                    </Text>
                </Animated.View>

                {/* Success metrics */}
                {showMetrics && (
                    <View style={styles.metricsContainer}>
                        {SUCCESS_METRICS.map((metric, index) => (
                            <Animated.View
                                key={metric.id}
                                entering={FadeInUp.delay(800 + index * 150).duration(400)}
                                style={styles.metricItem}
                            >
                                <Text style={styles.metricValue}>{metric.value}</Text>
                                <Text style={styles.metricLabel}>{metric.label}</Text>
                            </Animated.View>
                        ))}
                    </View>
                )}

                {/* Quick setup note */}
                <Animated.View
                    entering={FadeIn.delay(1500).duration(400)}
                    style={styles.setupNote}
                >
                    <Ionicons name="time-outline" size={18} color={OnboardingTheme.Colors.TextSecondary} />
                    <Text style={styles.setupNoteText}>Takes just 2 minutes to personalize</Text>
                </Animated.View>
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
    successBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0fdf4',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 9999,
        borderWidth: 1,
        borderColor: '#dcfce7',
        marginBottom: OnboardingTheme.Spacing.md,
        gap: 6,
    },
    successBadgeText: {
        color: OnboardingTheme.Colors.Success,
        fontSize: 11,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: OnboardingTheme.Colors.Text,
        textAlign: 'center',
        marginBottom: OnboardingTheme.Spacing.sm,
        lineHeight: 34,
    },
    subtitle: {
        fontSize: 16,
        color: OnboardingTheme.Colors.TextSecondary,
        textAlign: 'center',
        lineHeight: 24,
    },
    guaranteeCard: {
        width: '100%',
        backgroundColor: '#f0fdf4',
        borderRadius: OnboardingTheme.Radius.xl,
        padding: OnboardingTheme.Spacing.lg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#dcfce7',
        marginBottom: OnboardingTheme.Spacing.xl,
    },
    guaranteeIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: OnboardingTheme.Spacing.md,
    },
    guaranteeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#166534',
        marginBottom: OnboardingTheme.Spacing.xs,
    },
    guaranteeText: {
        fontSize: 14,
        color: '#15803d',
        textAlign: 'center',
        lineHeight: 20,
    },
    metricsContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        marginBottom: OnboardingTheme.Spacing.xl,
    },
    metricItem: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        paddingVertical: OnboardingTheme.Spacing.md,
        marginHorizontal: 4,
        borderRadius: OnboardingTheme.Radius.lg,
    },
    metricValue: {
        fontSize: 24,
        fontWeight: '900',
        color: OnboardingTheme.Colors.Text,
    },
    metricLabel: {
        fontSize: 11,
        color: OnboardingTheme.Colors.TextSecondary,
        marginTop: 2,
    },
    setupNote: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    setupNoteText: {
        fontSize: 14,
        color: OnboardingTheme.Colors.TextSecondary,
    },
});
