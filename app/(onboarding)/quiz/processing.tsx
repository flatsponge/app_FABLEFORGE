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
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const TEXT_COLOR = '#111827'; // gray-900 (High contrast)
const MUTED_COLOR = '#6B7280'; // gray-500
const PRIMARY_COLOR = OnboardingTheme.Colors.Primary;

const STEPS = [
    { text: "Analyzing behavioral patterns", duration: 2000 },
    { text: "Mapping developmental milestones", duration: 800 },
    { text: "Identifying key growth opportunities", duration: 1500 },
    { text: "Structuring personalized curriculum", duration: 1800 },
    { text: "Finalizing custom plan", duration: 1000 },
];

const TOTAL_POSSIBLE_DURATION = STEPS.reduce((acc, step) => acc + step.duration, 0) + 1000;
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
    const progressTarget = useRef(0);

    useEffect(() => {
        let isMounted = true;
        let timeouts: ReturnType<typeof setTimeout>[] = [];

        // Calculate cumulative durations
        let currentDelay = 0;

        STEPS.forEach((step, index) => {
            // Helper to add timeout
            const addTimeout = (fn: () => void, delay: number) => {
                const t = setTimeout(fn, delay);
                timeouts.push(t);
            };

            // Start of step
            addTimeout(() => {
                if (!isMounted) return;
                setActiveIndex(index);

                // Target progress for this step (not fully 100% until the very end)
                const stepProgress = (index + 1) / STEPS.length;
                progressTarget.current = stepProgress;

                // Animate progress to this step's target
                progress.value = withTiming(stepProgress, {
                    duration: step.duration,
                    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                });
            }, currentDelay);

            currentDelay += step.duration;
        });

        // Navigation after all steps
        const finalDelay = currentDelay + 500;
        const navTimer = setTimeout(() => {
            if (isMounted) router.push('/(onboarding)/parent/review');
        }, finalDelay);
        timeouts.push(navTimer);

        // Percentage ticker logic
        // We want the percentage to feel like it's counting up to the current progress target
        const startTime = Date.now();
        const textInterval = setInterval(() => {
            if (!isMounted) return;

            // Current progress value from reanimated (we can't read it directly easily on JS thread without listeners,
            // but we can approximate or use a secondary interpolation source).
            // Simpler: Just map percentage to time elapsed relative to total expected duration, 
            // but warped by the current step speed.

            const now = Date.now();
            const elapsed = now - startTime;
            // Approximate progress based on time
            let timeProgress = 0;
            let timeAccum = 0;
            for (let i = 0; i < STEPS.length; i++) {
                if (elapsed < timeAccum + STEPS[i].duration) {
                    // We are in this step
                    const stepElapsed = elapsed - timeAccum;
                    const stepFraction = stepElapsed / STEPS[i].duration;
                    const baseProgress = i / STEPS.length;
                    const stepSize = 1 / STEPS.length;
                    timeProgress = baseProgress + (stepFraction * stepSize);
                    break;
                }
                timeAccum += STEPS[i].duration;
            }

            if (elapsed >= timeAccum) {
                timeProgress = 1;
            }

            // clamp
            timeProgress = Math.min(1, Math.max(0, timeProgress));
            const targetP = Math.round(timeProgress * 100);

            setPercentage(prev => {
                if (targetP > prev) return targetP;
                return prev;
            });

            if (timeProgress >= 1) clearInterval(textInterval);

        }, 50);

        return () => {
            isMounted = false;
            timeouts.forEach(clearTimeout);
            clearInterval(textInterval);
        };
    }, []);

    const animatedCircleProps = useAnimatedProps(() => {
        const strokeDashoffset = CIRCUMFERENCE * (1 - progress.value);
        return {
            strokeDashoffset,
        };
    });

    return (
        // @ts-ignore - explicitly passing extra prop
        <OnboardingLayout
            showProgressBar={false}
            skipTopSafeArea
            showNextButton={false}
            showBack={false}
            hideFooter={true}
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