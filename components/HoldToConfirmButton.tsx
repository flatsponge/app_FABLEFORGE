import React, { useRef, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, Pressable, Dimensions } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    Easing,
    useAnimatedProps,
    interpolate,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { OnboardingTheme } from '../constants/OnboardingTheme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface HoldToConfirmButtonProps {
    onConfirm: () => void;
    title?: string;
    subtitle?: string;
    holdDuration?: number; // milliseconds
    disabled?: boolean;
}

const CIRCLE_SIZE = 180;
const STROKE_WIDTH = 8;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function HoldToConfirmButton({
    onConfirm,
    title = "I'm Ready",
    subtitle = 'Hold to confirm',
    holdDuration = 2000,
    disabled = false,
}: HoldToConfirmButtonProps) {
    const progress = useSharedValue(0);
    const isHolding = useSharedValue(false);
    const hasCompleted = useRef(false);
    const holdTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (holdTimeoutRef.current) {
                clearTimeout(holdTimeoutRef.current);
            }
        };
    }, []);

    const handleComplete = useCallback(() => {
        if (!hasCompleted.current) {
            hasCompleted.current = true;
            onConfirm();
        }
    }, [onConfirm]);

    const handlePressIn = useCallback(() => {
        if (disabled || hasCompleted.current) return;

        isHolding.value = true;
        progress.value = withTiming(1, {
            duration: holdDuration,
            easing: Easing.linear,
        });

        // Set timeout to trigger completion
        holdTimeoutRef.current = setTimeout(() => {
            if (isHolding.value) {
                handleComplete();
            }
        }, holdDuration);
    }, [disabled, holdDuration, handleComplete, isHolding, progress]);

    const handlePressOut = useCallback(() => {
        if (hasCompleted.current) return;

        // Clear the timeout if released early
        if (holdTimeoutRef.current) {
            clearTimeout(holdTimeoutRef.current);
            holdTimeoutRef.current = null;
        }

        isHolding.value = false;
        progress.value = withTiming(0, { duration: 200 });
    }, [isHolding, progress]);

    // Animated props for the circle stroke
    const animatedCircleProps = useAnimatedProps(() => {
        const strokeDashoffset = CIRCUMFERENCE * (1 - progress.value);
        return {
            strokeDashoffset,
        };
    });

    // Inner circle scale animation
    const innerCircleStyle = useAnimatedStyle(() => {
        const scale = interpolate(progress.value, [0, 1], [1, 1.05]);
        return {
            transform: [{ scale }],
        };
    });

    // Glow effect when holding
    const glowStyle = useAnimatedStyle(() => {
        return {
            opacity: isHolding.value ? 0.6 : 0,
            transform: [{ scale: interpolate(progress.value, [0, 1], [0.9, 1.1]) }],
        };
    });

    // Checkmark opacity for completion feedback
    const checkmarkOpacity = useAnimatedStyle(() => {
        return {
            opacity: progress.value >= 0.99 ? 1 : 0,
        };
    });

    return (
        <View style={styles.container}>
            <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={disabled}
                style={styles.pressable}
            >
                {/* Glow effect behind */}
                <Animated.View style={[styles.glowCircle, glowStyle]} />

                {/* Main circle container */}
                <View style={styles.circleContainer}>
                    {/* Background circle */}
                    <View style={styles.backgroundCircle} />

                    {/* Progress ring */}
                    <Svg
                        width={CIRCLE_SIZE}
                        height={CIRCLE_SIZE}
                        style={styles.svgContainer}
                    >
                        {/* Track circle */}
                        <Circle
                            cx={CIRCLE_SIZE / 2}
                            cy={CIRCLE_SIZE / 2}
                            r={RADIUS}
                            stroke="rgba(255, 255, 255, 0.2)"
                            strokeWidth={STROKE_WIDTH}
                            fill="transparent"
                        />
                        {/* Progress circle */}
                        <AnimatedCircle
                            cx={CIRCLE_SIZE / 2}
                            cy={CIRCLE_SIZE / 2}
                            r={RADIUS}
                            stroke="#FFFFFF"
                            strokeWidth={STROKE_WIDTH}
                            fill="transparent"
                            strokeDasharray={CIRCUMFERENCE}
                            animatedProps={animatedCircleProps}
                            strokeLinecap="round"
                            rotation="-90"
                            origin={`${CIRCLE_SIZE / 2}, ${CIRCLE_SIZE / 2}`}
                        />
                    </Svg>

                    {/* Inner content */}
                    <Animated.View style={[styles.innerContent, innerCircleStyle]}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.subtitle}>{subtitle}</Text>
                    </Animated.View>
                </View>
            </Pressable>

            {/* Contract text below */}
            <Text style={styles.contractText}>
                By holding, I commit to my child
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    pressable: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    glowCircle: {
        position: 'absolute',
        width: CIRCLE_SIZE + 40,
        height: CIRCLE_SIZE + 40,
        borderRadius: (CIRCLE_SIZE + 40) / 2,
        backgroundColor: OnboardingTheme.Colors.Primary,
    },
    circleContainer: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backgroundCircle: {
        position: 'absolute',
        width: CIRCLE_SIZE - STROKE_WIDTH * 2,
        height: CIRCLE_SIZE - STROKE_WIDTH * 2,
        borderRadius: (CIRCLE_SIZE - STROKE_WIDTH * 2) / 2,
        backgroundColor: OnboardingTheme.Colors.Primary,
    },
    svgContainer: {
        position: 'absolute',
    },
    innerContent: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.85)',
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
        textAlign: 'center',
    },
    contractText: {
        marginTop: 20,
        fontSize: 14,
        color: OnboardingTheme.Colors.TextSecondary,
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
        textAlign: 'center',
    },
});
