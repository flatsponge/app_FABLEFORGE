import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown, ZoomIn, useSharedValue, useAnimatedProps, withTiming, Easing, withDelay } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const { width } = Dimensions.get('window');

const CIRCLE_SIZE = width * 0.6;
const RADIUS = CIRCLE_SIZE / 2 - 10;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function StatReveal1Screen() {
    const router = useRouter();
    const [showContext, setShowContext] = useState(false);

    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withDelay(500, withTiming(0.22, { duration: 1500, easing: Easing.out(Easing.exp) }));

        const timer = setTimeout(() => setShowContext(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    const animatedProps = useAnimatedProps(() => {
        return {
            strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
        };
    });

    const handleNext = () => {
        router.push('/(onboarding)/parent/stat-reveal-2');
    };

    return (
        <OnboardingLayout
            showProgressBar={false} progress={1.0}
            showNextButton={showContext}
            onNext={handleNext}
            nextLabel="Continue"
        >
            <View style={styles.container}>
                <Animated.View entering={FadeIn.delay(200)} style={styles.headerContainer}>
                    <View style={styles.badge}>
                        <View style={styles.badgeDot} />
                        <Text style={styles.badgeText}>Critical Finding 1 of 4</Text>
                    </View>

                    <OnboardingTitle style={styles.title}>Patience Score</OnboardingTitle>
                </Animated.View>

                {/* Circular Progress */}
                <View style={styles.chartWrapper}>
                    <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE} style={styles.svg}>
                        <Circle
                            cx={CIRCLE_SIZE / 2}
                            cy={CIRCLE_SIZE / 2}
                            r={RADIUS}
                            stroke="#f3f4f6"
                            strokeWidth={20}
                            fill="none"
                        />
                        <AnimatedCircle
                            cx={CIRCLE_SIZE / 2}
                            cy={CIRCLE_SIZE / 2}
                            r={RADIUS}
                            stroke={OnboardingTheme.Colors.Error}
                            strokeWidth={20}
                            fill="none"
                            strokeDasharray={CIRCUMFERENCE}
                            strokeLinecap="round"
                            rotation="-90"
                            origin={`${CIRCLE_SIZE / 2}, ${CIRCLE_SIZE / 2}`}
                            animatedProps={animatedProps}
                        />
                    </Svg>

                    <View style={styles.chartContent}>
                        <Animated.Text entering={ZoomIn.delay(800).duration(600)} style={styles.statValue}>
                            22%
                        </Animated.Text>
                        <View style={styles.severityBadge}>
                            <Text style={styles.severityText}>Critical Area</Text>
                        </View>
                    </View>
                </View>

                {showContext && (
                    <Animated.View entering={FadeInDown.delay(100).duration(500).springify().damping(14).stiffness(100)} style={styles.contextContainer}>
                        <View style={styles.comparisonHeader}>
                            <Text style={styles.comparisonLabel}>Ideally by this age</Text>
                            <Text style={styles.comparisonValue}>70%</Text>
                        </View>

                        <View style={styles.comparisonBarWrapper}>
                            <View style={[styles.benchmarkLine, { left: '70%' }]} />
                            <View style={[styles.actualBar, { width: '22%' }]} />
                        </View>

                        <Text style={styles.contextText}>
                            Your child is scoring <Text style={styles.highlightText}>48 points lower</Text> than the healthy benchmark for their age group.
                        </Text>
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
    chartWrapper: {
        position: 'relative',
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: OnboardingTheme.Spacing.xl,
    },
    svg: {
        position: 'absolute',
    },
    chartContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    statValue: {
        fontSize: 60,
        fontWeight: '900',
        color: OnboardingTheme.Colors.Text,
        lineHeight: 70,
        fontFamily: OnboardingTheme.Typography.Title.fontFamily,
    },
    severityBadge: {
        backgroundColor: '#fee2e2', // red-100
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 9999,
        marginTop: 8,
    },
    severityText: {
        color: '#b91c1c', // red-700
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
    contextContainer: {
        width: '100%',
        backgroundColor: '#f9fafb', // gray-50
        padding: OnboardingTheme.Spacing.lg,
        borderRadius: OnboardingTheme.Radius.xl,
        borderWidth: 1,
        borderColor: OnboardingTheme.Colors.Border,
    },
    comparisonHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: OnboardingTheme.Spacing.sm,
    },
    comparisonLabel: {
        color: OnboardingTheme.Colors.TextSecondary,
        fontWeight: '500',
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
    comparisonValue: {
        color: OnboardingTheme.Colors.Success,
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: OnboardingTheme.Typography.Title.fontFamily,
    },
    comparisonBarWrapper: {
        height: 10,
        backgroundColor: '#e5e7eb', // gray-200
        borderRadius: 9999,
        marginBottom: OnboardingTheme.Spacing.md,
        overflow: 'hidden',
        position: 'relative',
    },
    benchmarkLine: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: 2,
        backgroundColor: OnboardingTheme.Colors.Success,
        zIndex: 10,
    },
    actualBar: {
        height: '100%',
        backgroundColor: OnboardingTheme.Colors.Error,
        borderRadius: 9999,
    },
    contextText: {
        color: OnboardingTheme.Colors.TextSecondary,
        textAlign: 'center',
        lineHeight: 22,
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
    highlightText: {
        color: OnboardingTheme.Colors.Error,
        fontWeight: 'bold',
    },
});