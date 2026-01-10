import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown, ZoomIn, Easing } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

export default function StatReveal2Screen() {
    const router = useRouter();
    const [showContext, setShowContext] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowContext(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    const handleNext = () => {
        router.push('/(onboarding)/parent/stat-reveal-3');
    };

    return (
        <OnboardingLayout
            showProgressBar={false} progress={1.0}
            showNextButton={showContext}
            onNext={handleNext}
            nextLabel="Continue"
            isScrollable={true}
            fadeInButton={true}
        >
            <View style={styles.container}>
                <Animated.View entering={FadeIn.delay(200)} style={styles.headerContainer}>
                    <View style={styles.badge}>
                        <View style={styles.badgeDot} />
                        <Text style={styles.badgeText}>Critical Finding 2 of 4</Text>
                    </View>

                    <OnboardingTitle style={styles.title}>Responsibility Score</OnboardingTitle>
                </Animated.View>

                <Animated.View entering={ZoomIn.duration(600)} style={styles.statContainer}>
                    <Text style={styles.statValue}>18%</Text>
                    <View style={styles.severityBadge}>
                        <Text style={styles.severityText}>Action Needed</Text>
                    </View>
                </Animated.View>

                {/* Visual Comparison */}
                <Animated.View entering={FadeInDown.delay(500)} style={styles.comparisonContainer}>
                    <View style={styles.comparisonItem}>
                        <Text style={styles.itemValueActual}>18%</Text>
                        <View style={styles.barWrapperActual}>
                            <View style={[styles.barFillActual, { height: '18%' }]} />
                        </View>
                        <Text style={styles.itemLabel}>Child</Text>
                    </View>
                    <View style={styles.comparisonItem}>
                        <Text style={styles.itemValueAvg}>65%</Text>
                        <View style={styles.barWrapperAvg}>
                            <View style={[styles.barFillAvg, { height: '65%' }]} />
                        </View>
                        <Text style={styles.itemLabel}>Avg</Text>
                    </View>
                </Animated.View>

                {showContext && (
                    <Animated.View entering={FadeInDown.delay(100).duration(500).springify().damping(14).stiffness(100)} style={styles.contextCard}>
                        <View style={styles.contextContent}>
                            <View style={styles.contextIconWrapper}>
                                <Ionicons name="stats-chart" size={24} color="white" />
                            </View>
                            <View style={styles.contextTextWrapper}>
                                <Text style={styles.contextTitle}>High Risk Factor</Text>
                                <Text style={styles.contextBody}>
                                    Children with low responsibility scores are <Text style={styles.contextBold}>3x more likely</Text> to struggle with academic independence later.
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
        backgroundColor: '#fef2f2', // red-50
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 9999,
        borderWidth: 1,
        borderColor: '#fee2e2', // red-100
        marginBottom: OnboardingTheme.Spacing.md,
    },
    badgeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: OnboardingTheme.Colors.Error,
        marginRight: 8,
    },
    badgeText: {
        color: OnboardingTheme.Colors.Error,
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        fontSize: 10,
        fontWeight: 'bold',
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
    title: {
        textAlign: 'center',
    },
    statContainer: {
        alignItems: 'center',
        marginBottom: OnboardingTheme.Spacing.xl,
    },
    statValue: {
        fontSize: 100,
        fontWeight: '900',
        color: OnboardingTheme.Colors.Error,
        lineHeight: 110,
        fontFamily: OnboardingTheme.Typography.Title.fontFamily,
    },
    severityBadge: {
        backgroundColor: '#fef2f2',
        paddingHorizontal: 24,
        paddingVertical: 8,
        borderRadius: 9999,
        marginTop: -10,
    },
    severityText: {
        color: '#b91c1c',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontSize: 14,
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
    comparisonContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        height: 128,
        gap: 24,
        marginBottom: OnboardingTheme.Spacing.xl,
    },
    comparisonItem: {
        alignItems: 'center',
        width: 64,
    },
    itemValueActual: {
        color: OnboardingTheme.Colors.Error,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
    itemValueAvg: {
        color: OnboardingTheme.Colors.Success,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
    barWrapperActual: {
        flex: 1,
        width: '100%',
        backgroundColor: '#fef2f2',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderWidth: 1,
        borderColor: '#fee2e2',
        borderBottomWidth: 0,
        position: 'relative',
        overflow: 'hidden',
    },
    barFillActual: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: OnboardingTheme.Colors.Error,
    },
    barWrapperAvg: {
        flex: 1,
        width: '100%',
        backgroundColor: '#f0fdf4',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderWidth: 1,
        borderColor: '#dcfce7',
        borderBottomWidth: 0,
        position: 'relative',
        overflow: 'hidden',
    },
    barFillAvg: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: OnboardingTheme.Colors.Success,
    },
    itemLabel: {
        color: OnboardingTheme.Colors.TextSecondary,
        fontSize: 12,
        marginTop: 8,
        fontWeight: '500',
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
    contextCard: {
        width: '100%',
        backgroundColor: OnboardingTheme.Colors.Error,
        padding: OnboardingTheme.Spacing.lg,
        borderRadius: OnboardingTheme.Radius.xl,
    },
    contextContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    contextIconWrapper: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 12,
        borderRadius: 9999,
        marginRight: OnboardingTheme.Spacing.md,
    },
    contextTextWrapper: {
        flex: 1,
    },
    contextTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 8,
        fontFamily: OnboardingTheme.Typography.Title.fontFamily,
    },
    contextBody: {
        color: 'rgba(255, 255, 255, 0.9)',
        lineHeight: 22,
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
    contextBold: {
        fontWeight: 'bold',
        color: 'white',
        textTransform: 'uppercase',
    },
});