import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Path, Svg, Line, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import Animated, { FadeIn, FadeInUp, useSharedValue, withTiming, useAnimatedProps, withDelay } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const { width } = Dimensions.get('window');
const GRAPH_HEIGHT = 220;
const GRAPH_WIDTH = width - 48;

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function TrajectoryScreen() {
    const router = useRouter();
    const [showLabels, setShowLabels] = useState(false);
    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withDelay(500, withTiming(1, { duration: 2000 }));
        const timer = setTimeout(() => setShowLabels(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    const pathWithout = `M 0 ${GRAPH_HEIGHT * 0.4} C ${GRAPH_WIDTH * 0.3} ${GRAPH_HEIGHT * 0.5}, ${GRAPH_WIDTH * 0.6} ${GRAPH_HEIGHT * 0.7}, ${GRAPH_WIDTH} ${GRAPH_HEIGHT * 0.9}`;
    const pathWith = `M 0 ${GRAPH_HEIGHT * 0.4} C ${GRAPH_WIDTH * 0.3} ${GRAPH_HEIGHT * 0.3}, ${GRAPH_WIDTH * 0.6} ${GRAPH_HEIGHT * 0.1}, ${GRAPH_WIDTH} 10`;

    const animatedProps = useAnimatedProps(() => ({
        strokeDashoffset: 1000 * (1 - progress.value),
    }));

    const handleNext = () => {
        router.push('/(onboarding)/parent/final-warning');
    };

    return (
        <OnboardingLayout
            showProgressBar={false} progress={1.0}
            showNextButton={showLabels}
            onNext={handleNext}
            nextLabel="Change The Future"
            isScrollable={true}
        >
            <View style={styles.container}>
                <Animated.View entering={FadeIn.delay(200)} style={styles.header}>
                    <Text style={styles.badgeText}>Projected Future</Text>
                    <OnboardingTitle style={styles.title}>
                        Two Possible <Text style={styles.titleItalic}>Futures</Text>
                    </OnboardingTitle>
                </Animated.View>

                <View style={styles.graphContainer}>
                    <Svg width={GRAPH_WIDTH} height={GRAPH_HEIGHT}>
                        <Defs>
                            <LinearGradient id="gradRed" x1="0" y1="0" x2="0" y2="1">
                                <Stop offset="0%" stopColor={OnboardingTheme.Colors.Error} stopOpacity={0.1} />
                                <Stop offset="100%" stopColor={OnboardingTheme.Colors.Error} stopOpacity={0} />
                            </LinearGradient>
                            <LinearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
                                <Stop offset="0%" stopColor={OnboardingTheme.Colors.Success} stopOpacity={0.1} />
                                <Stop offset="100%" stopColor={OnboardingTheme.Colors.Success} stopOpacity={0} />
                            </LinearGradient>
                        </Defs>

                        {/* Grid Lines */}
                        <Line x1="0" y1={GRAPH_HEIGHT / 2} x2={GRAPH_WIDTH} y2={GRAPH_HEIGHT / 2} stroke="#e5e7eb" strokeDasharray="5, 5" />
                        <Line x1="0" y1={GRAPH_HEIGHT} x2={GRAPH_WIDTH} y2={GRAPH_HEIGHT} stroke="#e5e7eb" strokeDasharray="5, 5" />

                        {/* Paths */}
                        <AnimatedPath
                            d={pathWithout}
                            stroke={OnboardingTheme.Colors.Error}
                            strokeWidth={4}
                            fill="none"
                            strokeDasharray={1000}
                            animatedProps={animatedProps}
                        />
                        <AnimatedPath
                            d={pathWith}
                            stroke={OnboardingTheme.Colors.Success}
                            strokeWidth={4}
                            fill="none"
                            strokeDasharray={1000}
                            animatedProps={animatedProps}
                        />

                        {/* End Dots */}
                        {showLabels && (
                            <>
                                <Circle cx={GRAPH_WIDTH} cy={GRAPH_HEIGHT * 0.9} r={6} fill={OnboardingTheme.Colors.Error} />
                                <Circle cx={GRAPH_WIDTH} cy={10} r={6} fill={OnboardingTheme.Colors.Success} />
                            </>
                        )}
                    </Svg>

                    {/* Axis Labels */}
                    <View style={styles.axisLabels}>
                        <Text style={styles.axisText}>TODAY</Text>
                        <Text style={styles.axisText}>12 MONTHS</Text>
                    </View>
                </View>

                {showLabels && (
                    <Animated.View entering={FadeInUp.duration(600)} style={styles.optionsSection}>
                        <View style={styles.outcomeCardRed}>
                            <View style={styles.outcomeIconWrapperRed}>
                                <Ionicons name="trending-down" size={20} color={OnboardingTheme.Colors.Error} />
                            </View>
                            <View style={styles.outcomeTextWrapper}>
                                <Text style={styles.outcomeTitleRed}>Without Intervention</Text>
                                <Text style={styles.outcomeSubtitleRed}>Skills decline, gap widens</Text>
                            </View>
                        </View>

                        <View style={styles.outcomeCardGreen}>
                            <View style={styles.outcomeIconWrapperGreen}>
                                <Ionicons name="trending-up" size={20} color={OnboardingTheme.Colors.Success} />
                            </View>
                            <View style={styles.outcomeTextWrapper}>
                                <Text style={styles.outcomeTitleGreen}>With FableTales</Text>
                                <Text style={styles.outcomeSubtitleGreen}>Steady mastery within 3 months</Text>
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
        width: '100%',
    },
    header: {
        marginBottom: OnboardingTheme.Spacing.lg,
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
        textAlign: 'left',
    },
    titleItalic: {
        color: OnboardingTheme.Colors.Primary,
        fontStyle: 'italic',
    },
    graphContainer: {
        height: 260,
        marginBottom: OnboardingTheme.Spacing.xl,
        position: 'relative',
    },
    axisLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    axisText: {
        color: OnboardingTheme.Colors.TextSecondary,
        fontSize: 10,
        fontWeight: 'bold',
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
    optionsSection: {
        width: '100%',
    },
    outcomeCardRed: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#fee2e2',
        padding: OnboardingTheme.Spacing.md,
        borderRadius: OnboardingTheme.Radius.lg,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: OnboardingTheme.Spacing.sm,
    },
    outcomeIconWrapperRed: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fef2f2',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: OnboardingTheme.Spacing.md,
    },
    outcomeCardGreen: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#dcfce7',
        padding: OnboardingTheme.Spacing.md,
        borderRadius: OnboardingTheme.Radius.lg,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: OnboardingTheme.Spacing.lg,
    },
    outcomeIconWrapperGreen: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0fdf4',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: OnboardingTheme.Spacing.md,
    },
    outcomeTextWrapper: {
        flex: 1,
    },
    outcomeTitleRed: {
        color: '#7f1d1d',
        fontWeight: 'bold',
        fontSize: 18,
        fontFamily: OnboardingTheme.Typography.Title.fontFamily,
    },
    outcomeSubtitleRed: {
        color: '#991b1b',
        opacity: 0.6,
        fontSize: 14,
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
    outcomeTitleGreen: {
        color: '#064e3b',
        fontWeight: 'bold',
        fontSize: 18,
        fontFamily: OnboardingTheme.Typography.Title.fontFamily,
    },
    outcomeSubtitleGreen: {
        color: '#047857',
        opacity: 0.6,
        fontSize: 14,
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
});