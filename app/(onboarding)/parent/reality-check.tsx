import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Svg, Path, Circle, Line, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const { width } = Dimensions.get('window');

// Skills data matching the stats page - showing concerning levels
const SKILLS_ANALYSIS = [
    { id: 'patience', name: 'Patience', score: 22, benchmark: 70, icon: '⏳', color: OnboardingTheme.Colors.Error, status: 'critical' },
    { id: 'responsibility', name: 'Responsibility', score: 18, benchmark: 65, icon: '📋', color: OnboardingTheme.Colors.Error, status: 'critical' },
    { id: 'honesty', name: 'Honesty', score: 31, benchmark: 75, icon: '💬', color: '#f97316', status: 'needs_work' },
    { id: 'empathy', name: 'Empathy', score: 45, benchmark: 80, icon: '❤️', color: '#f97316', status: 'needs_work' },
    { id: 'teamwork', name: 'Teamwork', score: 52, benchmark: 72, icon: '👫', color: '#eab308', status: 'developing' },
];

// Alarming research statistics
const ALARMING_STATS = [
    { stat: '73%', description: 'of behavioral patterns are set by age 7', source: 'Harvard Child Development' },
    { stat: '4x', description: 'harder to change habits after age 8', source: 'Journal of Pediatric Psychology' },
    { stat: '89%', description: 'of parents wish they started earlier', source: 'Parent Survey 2024' },
];

const AnimatedProgressBar = ({ score, benchmark, color, delay }: { score: number; benchmark: number; color: string; delay: number }) => {
    const [animatedWidth, setAnimatedWidth] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setAnimatedWidth(score), delay);
        return () => clearTimeout(timer);
    }, []);

    const gap = benchmark - score;

    return (
        <View>
            <View style={styles.barBackground}>
                <View
                    style={[styles.barFill, { width: `${animatedWidth}%`, backgroundColor: color }]} 
                />
                {/* Benchmark marker */}
                <View
                    style={[styles.benchmarkMarker, { left: `${benchmark}%` }]} 
                />
            </View>
            <View style={styles.barLabels}>
                <Text style={styles.barLabelText}>Your child: {score}%</Text>
                <Text style={styles.benchmarkLabelText}>Target: {benchmark}%</Text>
            </View>
            {gap > 30 && (
                <View style={styles.gapWarning}>
                    <Text style={styles.gapWarningText}>⚠️ {gap}% below age benchmark</Text>
                </View>
            )}
        </View>
    );
};

export default function RealityCheckScreen() {
    const router = useRouter();
    const [showWarning, setShowWarning] = useState(false);
    const [showStats, setShowStats] = useState(false);

    useEffect(() => {
        const timer1 = setTimeout(() => setShowWarning(true), 1500);
        const timer2 = setTimeout(() => setShowStats(true), 2500);
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    // Graph paths
    const graphWidth = width - 80;
    const graphHeight = 160;

    // Without intervention (declining sharply)
    const pathWithout = `M 0 40 Q ${graphWidth * 0.25} 55, ${graphWidth * 0.4} 75 Q ${graphWidth * 0.6} 100, ${graphWidth * 0.8} 130 L ${graphWidth} 145`;
    // With intervention (improving steadily)
    const pathWith = `M 0 40 Q ${graphWidth * 0.25} 30, ${graphWidth * 0.5} 20 Q ${graphWidth * 0.75} 12, ${graphWidth} 8`;

    const criticalCount = SKILLS_ANALYSIS.filter(s => s.status === 'critical').length;
    const needsWorkCount = SKILLS_ANALYSIS.filter(s => s.status === 'needs_work').length;

    const handleNext = () => {
        router.push('/(onboarding)/paywall');
    };

    return (
        <OnboardingLayout
            progress={1.0}
            onNext={handleNext}
            nextLabel="Start My Child's Transformation"
            isScrollable={true}
        >
            <View style={styles.container}>
                {/* Critical Header */}
                <Animated.View entering={FadeIn.delay(200)} style={styles.headerCard}>
                    <View style={styles.headerIconWrapper}>
                        <Ionicons name="alert-circle" size={48} color={OnboardingTheme.Colors.Error} />
                    </View>
                    <Text style={styles.headerTitle}>Important Discovery</Text>
                    <Text style={styles.headerSubtitle}>
                        Your assessment revealed {criticalCount} critical areas
                    </Text>
                </Animated.View>

                {/* Summary Card */}
                <Animated.View entering={FadeIn.delay(300).duration(600)} style={styles.summaryCard}>
                    <View style={styles.summaryStatsRow}>
                        <View style={styles.summaryStatItem}>
                            <Text style={styles.summaryStatValueCritical}>{criticalCount}</Text>
                            <Text style={styles.summaryStatLabel}>Critical{'
'}Areas</Text>
                        </View>
                        <View style={styles.summaryDivider} />
                        <View style={styles.summaryStatItem}>
                            <Text style={styles.summaryStatValueWarning}>{needsWorkCount}</Text>
                            <Text style={styles.summaryStatLabel}>Needs{'
'}Attention</Text>
                        </View>
                        <View style={styles.summaryDivider} />
                        <View style={styles.summaryStatItem}>
                            <Text style={styles.summaryStatValueGray}>32%</Text>
                            <Text style={styles.summaryStatLabel}>Overall{'
'}Score</Text>
                        </View>
                    </View>
                    <View style={styles.summaryBadge}>
                        <Text style={styles.summaryBadgeText}>
                            Below average for age group. Early intervention recommended.
                        </Text>
                    </View>
                </Animated.View>

                {/* Skills Assessment */}
                <Animated.View entering={FadeIn.delay(500).duration(600)} style={styles.section}>
                    <Text style={styles.sectionTitle}>Detailed Skill Assessment</Text>

                    {SKILLS_ANALYSIS.map((skill, index) => (
                        <Animated.View
                            key={skill.id}
                            entering={FadeInDown.delay(600 + index * 100)}
                            style={styles.skillItem}
                        >
                            <View style={styles.skillHeader}>
                                <View style={styles.skillTitleWrapper}>
                                    <Text style={styles.skillIcon}>{skill.icon}</Text>
                                    <Text style={styles.skillName}>{skill.name}</Text>
                                </View>
                                {skill.status === 'critical' && (
                                    <View style={styles.criticalBadge}>
                                        <Text style={styles.criticalBadgeText}>CRITICAL</Text>
                                    </View>
                                )}
                                {skill.status === 'needs_work' && (
                                    <View style={styles.warningBadge}>
                                        <Text style={styles.warningBadgeText}>AT RISK</Text>
                                    </View>
                                )}
                            </View>
                            <AnimatedProgressBar
                                score={skill.score}
                                benchmark={skill.benchmark}
                                color={skill.color}
                                delay={700 + index * 100}
                            />
                        </Animated.View>
                    ))}
                </Animated.View>

                {/* Trajectory Graph */}
                <Animated.View entering={FadeIn.delay(1000).duration(600)} style={styles.graphCard}>
                    <Text style={styles.graphTitle}>Behavioral Trajectory</Text>
                    <Text style={styles.graphSubtitle}>Projected development over next 12 months</Text>

                    <View style={styles.graphWrapper}>
                        <Svg height={graphHeight} width={graphWidth}>
                            <Defs>
                                <LinearGradient id="gradRed" x1="0" y1="0" x2="0" y2="1">
                                    <Stop offset="0%" stopColor={OnboardingTheme.Colors.Error} stopOpacity={0.4} />
                                    <Stop offset="100%" stopColor={OnboardingTheme.Colors.Error} stopOpacity={0} />
                                </LinearGradient>
                                <LinearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
                                    <Stop offset="0%" stopColor={OnboardingTheme.Colors.Success} stopOpacity={0.4} />
                                    <Stop offset="100%" stopColor={OnboardingTheme.Colors.Success} stopOpacity={0} />
                                </LinearGradient>
                            </Defs>

                            {/* Grid lines */}
                            <Line x1="0" y1="40" x2={graphWidth} y2="40" stroke="#374151" strokeWidth="1" strokeDasharray="4,4" />
                            <Line x1="0" y1="80" x2={graphWidth} y2="80" stroke="#374151" strokeWidth="1" strokeDasharray="4,4" />
                            <Line x1="0" y1="120" x2={graphWidth} y2="120" stroke="#374151" strokeWidth="1" strokeDasharray="4,4" />

                            {/* Area fills */}
                            <Path d={`${pathWithout} L ${graphWidth} ${graphHeight} L 0 ${graphHeight} Z`} fill="url(#gradRed)" />
                            <Path d={`${pathWith} L ${graphWidth} ${graphHeight} L 0 ${graphHeight} Z`} fill="url(#gradGreen)" />

                            {/* Without intervention (red, declining) */}
                            <Path d={pathWithout} stroke={OnboardingTheme.Colors.Error} strokeWidth="3" fill="none" strokeLinecap="round" />
                            <Circle cx={graphWidth} cy="145" r="8" fill={OnboardingTheme.Colors.Error} />

                            {/* With intervention (green, improving) */}
                            <Path d={pathWith} stroke={OnboardingTheme.Colors.Success} strokeWidth="3" fill="none" strokeLinecap="round" />
                            <Circle cx={graphWidth} cy="8" r="8" fill={OnboardingTheme.Colors.Success} />
                        </Svg>

                        {/* Labels */}
                        <View style={styles.graphLabelGreen}>
                            <Text style={styles.graphLabelText}>With Storytime</Text>
                        </View>
                        <View style={styles.graphLabelRed}>
                            <Text style={styles.graphLabelText}>Status Quo</Text>
                        </View>
                    </View>

                    <View style={styles.graphTimeLabels}>
                        <Text style={styles.timeLabel}>Today</Text>
                        <Text style={styles.timeLabel}>3 Mo</Text>
                        <Text style={styles.timeLabel}>6 Mo</Text>
                        <Text style={styles.timeLabel}>12 Mo</Text>
                    </View>
                </Animated.View>

                {/* Alarming Research Stats */}
                {showStats && (
                    <Animated.View entering={FadeIn} style={styles.section}>
                        <Text style={styles.sectionTitle}>Research Says...</Text>
                        {ALARMING_STATS.map((item, index) => (
                            <View key={index} style={styles.researchCard}>
                                <View style={styles.researchContent}>
                                    <Text style={styles.researchStat}>{item.stat}</Text>
                                    <View style={styles.researchTextWrapper}>
                                        <Text style={styles.researchDescription}>{item.description}</Text>
                                        <Text style={styles.researchSource}>{item.source}</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </Animated.View>
                )}

                {/* Urgent Warning Box */}
                {showWarning && (
                    <Animated.View entering={FadeIn} style={styles.urgentWarningCard}>
                        <View style={styles.urgentWarningHeader}>
                            <View style={styles.urgentWarningIconWrapper}>
                                <Ionicons name="warning" size={24} color="#dc2626" />
                            </View>
                            <View style={styles.urgentWarningContent}>
                                <Text style={styles.urgentWarningTitle}>Time-Sensitive Window</Text>
                                <Text style={styles.urgentWarningBody}>
                                    Your child's <Text style={styles.boldWhite}>Patience</Text> score of 22% and <Text style={styles.boldWhite}>Responsibility</Text> score of 18% are in the critical range.
                                </Text>
                                <Text style={styles.urgentWarningBody}>
                                    Research from Harvard's Center on the Developing Child shows that the neural pathways for these skills are <Text style={styles.underlinedWhite}>75% formed by age 7</Text>. After this window closes, behavioral change requires 4x more effort.
                                </Text>
                            </View>
                        </View>
                    </Animated.View>
                )}

                {/* Success Stories */}
                <Animated.View entering={FadeIn.delay(1500).duration(600)} style={styles.successCard}>
                    <View style={styles.successHeader}>
                        <Ionicons name="star" size={24} color="#16a34a" />
                        <Text style={styles.successTitle}>Parent Success Stories</Text>
                    </View>
                    <Text style={styles.successQuote}>
                        "After just 2 weeks of bedtime stories, my son started sharing toys without being asked. His teacher noticed the change too."
                    </Text>
                    <Text style={styles.successAuthor}>— Sarah M., mom of 5-year-old</Text>

                    <View style={styles.successDivider} />

                    <View style={styles.successStatsRow}>
                        <View style={styles.successStatItem}>
                            <Text style={styles.successStatValue}>94%</Text>
                            <Text style={styles.successStatLabel}>See improvement</Text>
                        </View>
                        <View style={styles.successStatItem}>
                            <Text style={styles.successStatValue}>14 days</Text>
                            <Text style={styles.successStatLabel}>Avg. time to results</Text>
                        </View>
                        <View style={styles.successStatItem}>
                            <Text style={styles.successStatValue}>50K+</Text>
                            <Text style={styles.successStatLabel}>Happy families</Text>
                        </View>
                    </View>
                </Animated.View>

                <Text style={styles.trialText}>7-day free trial • Cancel anytime</Text>
            </View>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingVertical: OnboardingTheme.Spacing.lg,
    },
    headerCard: {
        alignItems: 'center',
        backgroundColor: '#fef2f2', // red-50
        borderRadius: OnboardingTheme.Radius.xl,
        padding: OnboardingTheme.Spacing.xl,
        marginBottom: OnboardingTheme.Spacing.lg,
        borderWidth: 1,
        borderColor: '#fee2e2', // red-100
    },
    headerIconWrapper: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 9999,
        marginBottom: OnboardingTheme.Spacing.md,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: OnboardingTheme.Colors.Error,
        textAlign: 'center',
        fontFamily: OnboardingTheme.Typography.Title.fontFamily,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#991b1b', // red-800
        textAlign: 'center',
        opacity: 0.8,
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
    summaryCard: {
        backgroundColor: 'white',
        borderRadius: OnboardingTheme.Radius.xl,
        padding: OnboardingTheme.Spacing.lg,
        borderWidth: 1,
        borderColor: OnboardingTheme.Colors.Border,
        marginBottom: OnboardingTheme.Spacing.lg,
    },
    summaryStatsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: OnboardingTheme.Spacing.lg,
    },
    summaryStatItem: {
        alignItems: 'center',
        flex: 1,
    },
    summaryStatValueCritical: {
        fontSize: 32,
        fontWeight: '900',
        color: OnboardingTheme.Colors.Error,
        fontFamily: OnboardingTheme.Typography.Title.fontFamily,
    },
    summaryStatValueWarning: {
        fontSize: 32,
        fontWeight: '900',
        color: '#f97316', // orange-500
        fontFamily: OnboardingTheme.Typography.Title.fontFamily,
    },
    summaryStatValueGray: {
        fontSize: 32,
        fontWeight: '900',
        color: OnboardingTheme.Colors.TextSecondary,
        fontFamily: OnboardingTheme.Typography.Title.fontFamily,
    },
    summaryStatLabel: {
        fontSize: 10,
        color: OnboardingTheme.Colors.TextSecondary,
        textAlign: 'center',
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
    summaryDivider: {
        width: 1,
        backgroundColor: OnboardingTheme.Colors.Border,
    },
    summaryBadge: {
        backgroundColor: '#fef2f2',
        padding: 12,
        borderRadius: OnboardingTheme.Radius.md,
    },
    summaryBadgeText: {
        color: '#991b1b',
        fontSize: 12,
        textAlign: 'center',
        fontWeight: '500',
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
    section: {
        marginBottom: OnboardingTheme.Spacing.xl,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: OnboardingTheme.Colors.TextSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        marginBottom: OnboardingTheme.Spacing.md,
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
    skillItem: {
        backgroundColor: '#f9fafb', // gray-50
        padding: OnboardingTheme.Spacing.md,
        borderRadius: OnboardingTheme.Radius.lg,
        marginBottom: OnboardingTheme.Spacing.md,
    },
    skillHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: OnboardingTheme.Spacing.sm,
    },
    skillTitleWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    skillIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    skillName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: OnboardingTheme.Colors.Text,
        fontFamily: OnboardingTheme.Typography.Title.fontFamily,
    },
    criticalBadge: {
        backgroundColor: OnboardingTheme.Colors.Error,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 9999,
    },
    criticalBadgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    warningBadge: {
        backgroundColor: '#f97316',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 9999,
    },
    warningBadgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    barBackground: {
        height: 12,
        backgroundColor: '#e5e7eb',
        borderRadius: 9999,
        position: 'relative',
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        borderRadius: 9999,
    },
    benchmarkMarker: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: 2,
        backgroundColor: OnboardingTheme.Colors.Success,
        zIndex: 10,
    },
    barLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    barLabelText: {
        fontSize: 10,
        color: OnboardingTheme.Colors.TextSecondary,
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
    benchmarkLabelText: {
        fontSize: 10,
        color: OnboardingTheme.Colors.Success,
        fontWeight: '500',
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
    gapWarning: {
        backgroundColor: '#fef2f2',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginTop: 8,
        alignSelf: 'flex-start',
    },
    gapWarningText: {
        color: OnboardingTheme.Colors.Error,
        fontSize: 10,
        fontWeight: '500',
    },
    graphCard: {
        backgroundColor: '#111827', // gray-900
        borderRadius: OnboardingTheme.Radius.xl,
        padding: OnboardingTheme.Spacing.lg,
        marginBottom: OnboardingTheme.Spacing.xl,
    },
    graphTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 4,
        fontFamily: OnboardingTheme.Typography.Title.fontFamily,
    },
    graphSubtitle: {
        fontSize: 14,
        color: '#9ca3af', // gray-400
        marginBottom: OnboardingTheme.Spacing.lg,
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
    graphWrapper: {
        position: 'relative',
    },
    graphLabelGreen: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: OnboardingTheme.Colors.Success,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    graphLabelRed: {
        position: 'absolute',
        bottom: 16,
        right: 0,
        backgroundColor: OnboardingTheme.Colors.Error,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    graphLabelText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    graphTimeLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
        paddingHorizontal: 4,
    },
    timeLabel: {
        fontSize: 10,
        color: '#6b7280', // gray-500
    },
    researchCard: {
        backgroundColor: '#fffbeb', // amber-50
        borderColor: '#fef3c7', // amber-100
        borderWidth: 1,
        borderRadius: OnboardingTheme.Radius.lg,
        padding: OnboardingTheme.Spacing.md,
        marginBottom: OnboardingTheme.Spacing.sm,
    },
    researchContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    researchStat: {
        fontSize: 32,
        fontWeight: '900',
        color: '#d97706', // amber-600
        marginRight: 16,
        width: 80,
    },
    researchTextWrapper: {
        flex: 1,
    },
    researchDescription: {
        color: '#374151', // gray-800
        fontWeight: '500',
        fontSize: 14,
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
    researchSource: {
        color: '#6b7280', // gray-500
        fontSize: 10,
        marginTop: 4,
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
    urgentWarningCard: {
        backgroundColor: OnboardingTheme.Colors.Error,
        borderRadius: OnboardingTheme.Radius.xl,
        padding: OnboardingTheme.Spacing.lg,
        marginBottom: OnboardingTheme.Spacing.xl,
    },
    urgentWarningHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    urgentWarningIconWrapper: {
        backgroundColor: 'white',
        borderRadius: 9999,
        padding: 8,
        marginRight: OnboardingTheme.Spacing.md,
    },
    urgentWarningContent: {
        flex: 1,
    },
    urgentWarningTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
        fontFamily: OnboardingTheme.Typography.Title.fontFamily,
    },
    urgentWarningBody: {
        color: 'rgba(255, 255, 255, 0.9)',
        lineHeight: 22,
        marginBottom: 12,
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
    boldWhite: {
        fontWeight: 'bold',
        color: 'white',
    },
    underlinedWhite: {
        fontWeight: 'bold',
        color: 'white',
        textDecorationLine: 'underline',
    },
    successCard: {
        backgroundColor: '#f0fdf4', // green-50
        borderColor: '#dcfce7', // green-100
        borderWidth: 1,
        borderRadius: OnboardingTheme.Radius.xl,
        padding: OnboardingTheme.Spacing.lg,
        marginBottom: OnboardingTheme.Spacing.lg,
    },
    successHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: OnboardingTheme.Spacing.md,
    },
    successTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#166534', // green-800
        marginLeft: 8,
        fontFamily: OnboardingTheme.Typography.Title.fontFamily,
    },
    successQuote: {
        color: '#166534',
        fontStyle: 'italic',
        lineHeight: 24,
        fontSize: 16,
        marginBottom: 8,
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
    successAuthor: {
        color: '#16a34a',
        fontSize: 14,
        fontWeight: '500',
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
    successDivider: {
        height: 1,
        backgroundColor: '#dcfce7',
        marginVertical: 16,
    },
    successStatsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    successStatItem: {
        alignItems: 'center',
        flex: 1,
    },
    successStatValue: {
        fontSize: 24,
        fontWeight: '900',
        color: '#16a34a',
        fontFamily: OnboardingTheme.Typography.Title.fontFamily,
    },
    successStatLabel: {
        fontSize: 10,
        color: '#15803d',
        textAlign: 'center',
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
    trialText: {
        textAlign: 'center',
        color: OnboardingTheme.Colors.TextSecondary,
        fontSize: 14,
        marginBottom: OnboardingTheme.Spacing.lg,
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
});