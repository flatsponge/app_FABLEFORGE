import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Svg, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, { FadeIn, FadeInDown, useSharedValue, withTiming, useAnimatedProps, withDelay } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const { width } = Dimensions.get('window');
const GRAPH_WIDTH = width - 48;
const GRAPH_HEIGHT = 180;

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function PositiveOutlookScreen() {
    const router = useRouter();
    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withDelay(300, withTiming(1, { duration: 1500 }));
    }, []);

    // Cubic Bézier (C) requires exactly 3 points: control1, control2, end
    const path = `M 0 ${GRAPH_HEIGHT} C ${GRAPH_WIDTH * 0.3} ${GRAPH_HEIGHT * 0.5}, ${GRAPH_WIDTH * 0.6} ${GRAPH_HEIGHT * 0.2}, ${GRAPH_WIDTH} 10`;

    const fillPath = `${path} L ${GRAPH_WIDTH} ${GRAPH_HEIGHT} L 0 ${GRAPH_HEIGHT} Z`;

    const animatedProps = useAnimatedProps(() => ({
        strokeDashoffset: 1000 * (1 - progress.value),
    }));

    const handleNext = () => {
        router.push('/(onboarding)/paywall');
    };

    return (
        <OnboardingLayout
            showProgressBar={false} progress={1.0}
            onNext={handleNext}
            nextLabel="Start My 7-Day Free Trial"
            isScrollable={true}
        >
            <View style={styles.container}>
                {/* Hero Section */}
                <Animated.View entering={FadeInDown} style={styles.heroSection}>
                    <View style={styles.heroIconWrapper}>
                        <Ionicons name="sparkles" size={32} color={OnboardingTheme.Colors.Success} />
                    </View>
                    <OnboardingTitle style={styles.heroTitle}>A Brighter Future</OnboardingTitle>
                    <OnboardingBody style={styles.heroSubtitle}>
                        With consistent storytelling, your child can master these skills in weeks, not years.
                    </OnboardingBody>

                    {/* Success Chart */}
                    <View style={styles.chartCard}>
                        <Text style={styles.chartTitle}>Projected Skill Growth</Text>
                        <View style={styles.chartWrapper}>
                            <Svg width={GRAPH_WIDTH - 48} height={GRAPH_HEIGHT}>
                                <Defs>
                                    <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                                        <Stop offset="0%" stopColor={OnboardingTheme.Colors.Success} stopOpacity={0.2} />
                                        <Stop offset="100%" stopColor={OnboardingTheme.Colors.Success} stopOpacity={0} />
                                    </LinearGradient>
                                </Defs>
                                <Path d={fillPath} fill="url(#grad)" />
                                <AnimatedPath
                                    d={path}
                                    stroke={OnboardingTheme.Colors.Success}
                                    strokeWidth={4}
                                    fill="none"
                                    strokeDasharray={1000}
                                    animatedProps={animatedProps}
                                />
                            </Svg>
                            {/* Floating improvement badge */}
                            <Animated.View
                                entering={FadeIn.delay(1500)}
                                style={styles.improvementBadge}
                            >
                                <Text style={styles.improvementBadgeText}>+72% Improved</Text>
                            </Animated.View>
                        </View>
                        <View style={styles.chartLabels}>
                            <Text style={styles.chartLabelText}>Week 1</Text>
                            <Text style={styles.chartLabelText}>Week 4</Text>
                            <Text style={styles.chartLabelText}>Week 8</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Benefits Grid */}
                <View style={styles.benefitsSection}>
                    <Text style={styles.sectionTitle}>What you can expect</Text>

                    <View style={styles.benefitsGrid}>
                        {[
                            { title: "Better Sleep", icon: "moon", color: "#8b5cf6" },
                            { title: "More Patience", icon: "hourglass", color: "#f59e0b" },
                            { title: "Less Conflict", icon: "heart", color: "#ec4899" },
                            { title: "Confidence", icon: "star", color: "#3b82f6" },
                        ].map((item, i) => (
                            <Animated.View
                                key={i}
                                entering={FadeInDown.delay(400 + (i * 100))}
                                style={styles.benefitItem}
                            >
                                <Ionicons name={item.icon as any} size={24} color={item.color} style={{ marginBottom: 12 }} />
                                <Text style={styles.benefitTitle}>{item.title}</Text>
                                <Text style={styles.benefitStatus}>Improved</Text>
                            </Animated.View>
                        ))}
                    </View>

                    <Animated.View entering={FadeInDown.delay(800)} style={styles.socialProofCard}>
                        <View style={styles.socialProofHeader}>
                            <View style={styles.socialProofIconWrapper}>
                                <Ionicons name="people" size={20} color="white" />
                            </View>
                            <Text style={styles.socialProofTitle}>Join 50,000+ Parents</Text>
                        </View>
                        <Text style={styles.socialProofQuote}>
                            "It used to take me 45 minutes to calm him down. Now we read one story and he's ready to listen. It's like magic."
                        </Text>
                        <Text style={styles.socialProofAuthor}>— Sarah J., Mom of 5-year-old</Text>
                    </Animated.View>
                </View>
            </View>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingTop: OnboardingTheme.Spacing.lg,
    },
    heroSection: {
        backgroundColor: '#f0fdf4', // green-50
        borderRadius: OnboardingTheme.Radius.xl,
        padding: OnboardingTheme.Spacing.xl,
        alignItems: 'center',
        marginBottom: OnboardingTheme.Spacing.xl,
    },
    heroIconWrapper: {
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 9999,
        marginBottom: OnboardingTheme.Spacing.md,
    },
    heroTitle: {
        textAlign: 'center',
        marginBottom: OnboardingTheme.Spacing.xs,
        color: '#064e3b', // green-900
    },
    heroSubtitle: {
        textAlign: 'center',
        color: '#047857', // green-700
        marginBottom: OnboardingTheme.Spacing.lg,
    },
    chartCard: {
        backgroundColor: 'white',
        borderRadius: OnboardingTheme.Radius.xl,
        padding: OnboardingTheme.Spacing.lg,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    chartTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: OnboardingTheme.Colors.TextSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        marginBottom: OnboardingTheme.Spacing.lg,
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
    chartWrapper: {
        height: GRAPH_HEIGHT,
        width: '100%',
        position: 'relative',
    },
    improvementBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#dcfce7', // green-100
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 9999,
        borderWidth: 1,
        borderColor: '#bbf7d0', // green-200
    },
    improvementBadgeText: {
        color: '#15803d', // green-700
        fontSize: 10,
        fontWeight: 'bold',
    },
    chartLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    chartLabelText: {
        fontSize: 10,
        color: OnboardingTheme.Colors.TextSecondary,
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
    benefitsSection: {
        marginBottom: OnboardingTheme.Spacing.xl,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: OnboardingTheme.Colors.Text,
        marginBottom: OnboardingTheme.Spacing.lg,
        fontFamily: OnboardingTheme.Typography.Title.fontFamily,
    },
    benefitsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    benefitItem: {
        width: '48%',
        backgroundColor: '#f9fafb', // gray-50
        padding: OnboardingTheme.Spacing.md,
        borderRadius: OnboardingTheme.Radius.lg,
        marginBottom: OnboardingTheme.Spacing.md,
        borderWidth: 1,
        borderColor: OnboardingTheme.Colors.Border,
    },
    benefitTitle: {
        fontWeight: 'bold',
        color: OnboardingTheme.Colors.Text,
        fontFamily: OnboardingTheme.Typography.Title.fontFamily,
    },
    benefitStatus: {
        color: OnboardingTheme.Colors.Success,
        fontSize: 10,
        fontWeight: 'bold',
        marginTop: 4,
        textTransform: 'uppercase',
    },
    socialProofCard: {
        backgroundColor: '#111827', // gray-900
        borderRadius: OnboardingTheme.Radius.xl,
        padding: OnboardingTheme.Spacing.lg,
        marginTop: OnboardingTheme.Spacing.md,
    },
    socialProofHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: OnboardingTheme.Spacing.md,
    },
    socialProofIconWrapper: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 8,
        borderRadius: 9999,
        marginRight: OnboardingTheme.Spacing.sm,
    },
    socialProofTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        fontFamily: OnboardingTheme.Typography.Title.fontFamily,
    },
    socialProofQuote: {
        color: '#9ca3af', // gray-400
        fontStyle: 'italic',
        lineHeight: 22,
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
    socialProofAuthor: {
        color: '#6b7280', // gray-500
        fontSize: 14,
        marginTop: OnboardingTheme.Spacing.sm,
        fontWeight: '500',
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
});