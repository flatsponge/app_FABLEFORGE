import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    FadeInDown,
    useAnimatedStyle,
    withTiming,
    useSharedValue,
    Easing,
    useAnimatedProps,
    withDelay
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const TEXT_COLOR = '#111827'; // gray-900 (High contrast)
const MUTED_COLOR = '#6B7280'; // gray-500
const PRIMARY_COLOR = OnboardingTheme.Colors.Primary;

const STEPS = [
    { text: "Analyzing behavioral patterns" },
    { text: "Mapping developmental milestones" },
    { text: "Identifying key growth opportunities" },
    { text: "Structuring personalized curriculum" },
    { text: "Finalizing custom plan" },
];

const STEP_DURATION = 1200;
const TOTAL_DURATION = STEPS.length * STEP_DURATION + 1000;
const CIRCLE_SIZE = 180;
const STROKE_WIDTH = 8;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Animated Components
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function ProcessingStep({ item, index, activeIndex }: { item: typeof STEPS[0], index: number, activeIndex: number }) {
    const isActive = index === activeIndex;
    const isCompleted = index < activeIndex;

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(isActive || isCompleted ? 1 : 0.5, { duration: 300 }),
        };
    });

    return (
        <Animated.View
            entering={FadeInDown.delay(index * 150).springify()}
            style={[styles.stepContainer, animatedStyle]}
        >
            <View style={styles.statusIndicator}>
                {isCompleted ? (
                    <Ionicons name="checkmark-circle" size={20} color={OnboardingTheme.Colors.Success} />
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
    const [activeIndex, setActiveIndex] = useState(0);
    const [percentage, setPercentage] = useState(0);
    const progress = useSharedValue(0);

    useEffect(() => {
        // Step timer
        const interval = setInterval(() => {
            setActiveIndex(current => {
                if (current < STEPS.length) return current + 1;
                return current;
            });
        }, STEP_DURATION);

        // Circular progress animation
        progress.value = withTiming(1, {
            duration: TOTAL_DURATION,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });

        // Percentage text animation (JS driven for stability)
        const startTime = Date.now();
        const textInterval = setInterval(() => {
            const now = Date.now();
            const elapsed = now - startTime;
            const p = Math.min(1, elapsed / TOTAL_DURATION);
            
            // Cubic ease out approximation
            const eased = 1 - Math.pow(1 - p, 3);
            
            setPercentage(Math.round(eased * 100));

            if (p >= 1) clearInterval(textInterval);
        }, 32);

        // Navigation
        const navigationTimer = setTimeout(() => {
            router.push('/(onboarding)/parent/results-intro');
        }, TOTAL_DURATION + 500);

        return () => {
            clearInterval(interval);
            clearInterval(textInterval);
            clearTimeout(navigationTimer);
        };
    }, []);

    const animatedCircleProps = useAnimatedProps(() => {
        const strokeDashoffset = CIRCUMFERENCE * (1 - progress.value);
        return {
            strokeDashoffset,
        };
    });

    return (
        <OnboardingLayout
            showProgressBar={false} skipTopSafeArea
            showNextButton={false}
            showBack={false}
        >
            <View style={styles.container}>
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
                            <Text style={styles.analyzingLabel}>Complete</Text>
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
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        fontSize: 48,
        fontWeight: '700',
        color: TEXT_COLOR,
        textAlign: 'center',
        fontVariant: ['tabular-nums'], // Prevents jitter
    },
    analyzingLabel: {
        fontSize: 14,
        color: MUTED_COLOR,
        marginTop: 4,
        fontWeight: '500',
    },
    stepsWrapper: {
        flex: 1,
        paddingHorizontal: OnboardingTheme.Spacing.sm,
    },
    stepContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        height: 24,
    },
    statusIndicator: {
        width: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    activeDotOuter: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: PRIMARY_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeDotInner: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: PRIMARY_COLOR,
    },
    pendingDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#e5e7eb', // gray-200
    },
    stepText: {
        fontSize: 16,
        color: TEXT_COLOR,
        fontWeight: '500',
        flex: 1, // Ensure text takes available width
    },
    stepTextActive: {
        fontWeight: '700',
        color: '#000000',
    },
});