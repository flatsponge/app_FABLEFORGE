import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    FadeInDown,
    useAnimatedStyle,
    withTiming,
    useSharedValue,
    Easing,
    useAnimatedProps,
    runOnJS,
    useAnimatedReaction,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TEXT_COLOR = '#111827'; // gray-900
const MUTED_COLOR = '#6B7280'; // gray-500
const PRIMARY_COLOR = OnboardingTheme.Colors.Primary;

const STEPS = [
    { text: "Analyzing behavioral patterns", duration: 2000 },
    { text: "Mapping developmental milestones", duration: 800 },
    { text: "Identifying key growth opportunities", duration: 1500 },
    { text: "Structuring personalized curriculum", duration: 1800 },
    { text: "Finalizing custom plan", duration: 1000 },
];

const CIRCLE_SIZE = 260; // Increased from 180
const STROKE_WIDTH = 12; // Slightly thicker for bigger size
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Animated Components
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function ProcessingStep({ item, index, activeIndex }: { item: typeof STEPS[0], index: number, activeIndex: number }) {
    const isActive = index === activeIndex;
    const isCompleted = index < activeIndex;

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(isActive || isCompleted ? 1 : 0.4, { duration: 300 }),
        };
    });

    return (
        <Animated.View
            entering={FadeInDown.delay(index * 150).springify()}
            style={[styles.stepContainer, animatedStyle]}
        >
            <View style={styles.statusIndicator}>
                {isCompleted ? (
                    <Ionicons name="checkmark-circle" size={24} color={OnboardingTheme.Colors.Success} />
                ) : isActive ? (
                    <View style={styles.activeDotOuter}>
                        <View style={styles.activeDotInner} />
                    </View>
                ) : (
                    <View style={styles.pendingDot} />
                )}
            </View>
            <Text style={[
                styles.stepText,
                (isActive || isCompleted) && styles.stepTextActive
            ]}>
                {item.text}
            </Text>
        </Animated.View>
    );
}

export default function ProcessingScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [activeIndex, setActiveIndex] = useState(0);
    const [percentage, setPercentage] = useState(0);
    const progress = useSharedValue(0);

    // Track total duration for percentage calculation
    const totalDuration = STEPS.reduce((acc, s) => acc + s.duration, 0) + 500;

    // Sync percentage with the shared value
    useAnimatedReaction(
        () => {
            return Math.round(progress.value * 100);
        },
        (currentValue, previousValue) => {
            if (currentValue !== previousValue) {
                runOnJS(setPercentage)(currentValue);
            }
        }
    );

    useEffect(() => {
        let isMounted = true;
        let cumulativeTime = 0;

        // Kick off step animations
        STEPS.forEach((step, index) => {
            setTimeout(() => {
                if (!isMounted) return;
                setActiveIndex(index);

                // Animate the circle progress based on step completion
                // This creates the "staggered" feel because durations vary per step
                const targetProgress = (index + 1) / STEPS.length;
                progress.value = withTiming(targetProgress, {
                    duration: step.duration,
                    easing: Easing.linear,
                });
            }, cumulativeTime);

            cumulativeTime += step.duration;
        });

        // Navigation
        const navTimer = setTimeout(() => {
            if (isMounted) router.push('/(onboarding)/parent/review');
        }, cumulativeTime + 800);

        return () => {
            isMounted = false;
            clearTimeout(navTimer);
        };
    }, []);

    const animatedCircleProps = useAnimatedProps(() => {
        const strokeDashoffset = CIRCUMFERENCE * (1 - progress.value);
        return {
            strokeDashoffset,
        };
    });

    return (
        <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
            <View style={styles.progressSection}>
                <View style={styles.circleContainer}>
                    <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
                        {/* Background Circle */}
                        <Circle
                            cx={CIRCLE_SIZE / 2}
                            cy={CIRCLE_SIZE / 2}
                            r={RADIUS}
                            stroke="#f3f4f6"
                            strokeWidth={STROKE_WIDTH}
                            fill="transparent"
                        />
                        {/* Foreground Circle */}
                        <AnimatedCircle
                            cx={CIRCLE_SIZE / 2}
                            cy={CIRCLE_SIZE / 2}
                            r={RADIUS}
                            stroke={PRIMARY_COLOR}
                            strokeWidth={STROKE_WIDTH}
                            fill="transparent"
                            strokeDasharray={CIRCUMFERENCE}
                            strokeLinecap="round"
                            rotation="-90"
                            origin={`${CIRCLE_SIZE / 2}, ${CIRCLE_SIZE / 2}`}
                            animatedProps={animatedCircleProps}
                        />
                    </Svg>
                    <View style={styles.absoluteCenter}>
                        <Text style={styles.percentageText}>
                            {percentage}%
                        </Text>
                        <Text style={styles.analyzingLabel}>
                            {percentage === 100 ? 'Complete' : 'Processing...'}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.stepsWrapper}>
                {STEPS.map((step, index) => (
                    <ProcessingStep
                        key={index}
                        item={step}
                        index={index}
                        activeIndex={activeIndex}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: OnboardingTheme.Colors.Background,
        paddingHorizontal: OnboardingTheme.Spacing.md,
    },
    progressSection: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: OnboardingTheme.Spacing.xl,
        marginBottom: OnboardingTheme.Spacing.xl * 2,
    },
    circleContainer: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    absoluteCenter: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    percentageText: {
        fontSize: 56, // Increased font size
        fontWeight: '700',
        color: TEXT_COLOR,
        textAlign: 'center',
        fontVariant: ['tabular-nums'],
    },
    analyzingLabel: {
        fontSize: 16,
        color: MUTED_COLOR,
        marginTop: 4,
        fontWeight: '500',
    },
    stepsWrapper: {
        flex: 1,
        paddingHorizontal: OnboardingTheme.Spacing.sm,
        maxWidth: 400,
        alignSelf: 'center',
        width: '100%',
    },
    stepContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    statusIndicator: {
        width: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    activeDotOuter: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: PRIMARY_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeDotInner: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: PRIMARY_COLOR,
    },
    pendingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#e5e7eb',
    },
    stepText: {
        fontSize: 16,
        color: TEXT_COLOR,
        fontWeight: '500',
        flex: 1,
    },
    stepTextActive: {
        fontWeight: '700',
        color: '#000000',
    },
});