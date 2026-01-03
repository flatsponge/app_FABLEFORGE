import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, findNodeHandle } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    withRepeat,
    withSequence,
    withDelay,
    FadeInDown,
    ZoomIn,
    Easing,
    interpolateColor,
    withSpring,
} from 'react-native-reanimated';
import { ScanFace, Sparkles, Sprout, BookOpen } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import OnboardingLayout from '../../../components/OnboardingLayout';

// Constants for the icon box
const ICON_BOX_SIZE = 56;
const LENS_PADDING = 4; // Extra padding around the icon box
const LENS_SIZE = ICON_BOX_SIZE + (LENS_PADDING * 2);

const PROCESS_STEPS = [
    {
        id: 'identify',
        icon: ScanFace,
        title: 'Identify',
        desc: 'Pinpoint the behavior.',
        activeColor: '#2563eb', // blue-600
    },
    {
        id: 'create',
        icon: Sparkles,
        title: 'Create',
        desc: 'AI weaves the story.',
        activeColor: '#7c3aed', // violet-600
    },
    {
        id: 'grow',
        icon: Sprout,
        title: 'Grow',
        desc: 'Child learns naturally.',
        activeColor: '#059669', // emerald-600
    },
];

interface IconPosition {
    x: number;
    y: number;
}

export default function Slide3() {
    const router = useRouter();
    const [showButton, setShowButton] = useState(false);
    const [activeStep, setActiveStep] = useState(-1);
    const [layoutReady, setLayoutReady] = useState(false);

    // Ref for the timeline container (where the lens is positioned)
    const containerRef = useRef<View>(null);

    // Refs for each icon box
    const iconRefs = useRef<(View | null)[]>([]);

    // Store measured positions using ref for immediate access
    const iconPositionsRef = useRef<IconPosition[]>([]);
    const measuredCount = useRef(0);

    // Hero Animations
    const heroFloat = useSharedValue(0);

    // Timeline Animation
    const timelineHeight = useSharedValue(0);

    // Lens position animation
    const lensX = useSharedValue(0);
    const lensY = useSharedValue(0);
    const lensOpacity = useSharedValue(0);
    const lensColorIndex = useSharedValue(0);

    // Function to animate lens to a specific step
    const animateLensToStep = useCallback((stepIndex: number) => {
        const position = iconPositionsRef.current[stepIndex];
        if (!position) return;

        lensX.value = withSpring(position.x - LENS_PADDING, {
            damping: 18,
            stiffness: 100,
        });
        lensY.value = withSpring(position.y - LENS_PADDING, {
            damping: 18,
            stiffness: 100,
        });
        lensColorIndex.value = withTiming(stepIndex, { duration: 300 });

        if (stepIndex === 0) {
            lensOpacity.value = withTiming(1, { duration: 250 });
        }
    }, [lensX, lensY, lensColorIndex, lensOpacity]);

    // Measure all icon positions relative to the container
    const measurePositions = useCallback(() => {
        if (!containerRef.current) return;

        const containerNode = findNodeHandle(containerRef.current);
        if (!containerNode) return;

        measuredCount.current = 0;

        iconRefs.current.forEach((iconRef, index) => {
            if (iconRef) {
                iconRef.measureLayout(
                    containerRef.current as any,
                    (x, y) => {
                        iconPositionsRef.current[index] = { x, y };
                        measuredCount.current++;

                        if (measuredCount.current === PROCESS_STEPS.length) {
                            setLayoutReady(true);
                        }
                    },
                    () => {
                        // Fallback: use estimated positions if measureLayout fails
                        console.warn(`Failed to measure icon ${index}`);
                    }
                );
            }
        });
    }, []);

    // Set icon ref
    const setIconRef = useCallback((index: number, ref: View | null) => {
        iconRefs.current[index] = ref;
    }, []);

    // Start hero and timeline animations immediately
    useEffect(() => {
        heroFloat.value = withRepeat(
            withSequence(
                withTiming(-4, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
                withTiming(4, { duration: 2000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );

        timelineHeight.value = withDelay(800, withTiming(100, { duration: 2400, easing: Easing.linear }));
    }, [heroFloat, timelineHeight]);

    // Start step animations ONLY after layout is ready
    useEffect(() => {
        if (!layoutReady) return;

        // Start step timers now that we have positions
        const stepTimers = PROCESS_STEPS.map((_, i) =>
            setTimeout(() => {
                setActiveStep(i);
                animateLensToStep(i);
            }, 800 + (i * 800))
        );

        // Reveal button
        const btnTimer = setTimeout(() => setShowButton(true), 3000);

        return () => {
            stepTimers.forEach(clearTimeout);
            clearTimeout(btnTimer);
        };
    }, [layoutReady, animateLensToStep]);

    const animatedHeroStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: heroFloat.value }]
    }));

    const animatedTimelineStyle = useAnimatedStyle(() => ({
        height: `${timelineHeight.value}%`
    }));

    // Lens style - position based on measured coordinates
    const animatedLensStyle = useAnimatedStyle(() => {
        const borderColor = interpolateColor(
            lensColorIndex.value,
            [0, 1, 2],
            ['#2563eb', '#7c3aed', '#059669']
        );

        return {
            transform: [
                { translateX: lensX.value },
                { translateY: lensY.value },
            ],
            opacity: lensOpacity.value,
            borderColor,
        };
    });

    const handleNext = () => {
        router.push('/(onboarding)/intro/slide-4');
    };

    return (
        <OnboardingLayout
            onNext={handleNext}
            nextLabel="Show me the magic"
            showNextButton={showButton}
            showProgressBar={false}
        >
            {/* Ambient Background Light */}
            <View className="absolute top-[-20%] left-[-20%] w-[140%] h-[60%] pointer-events-none">
                <LinearGradient
                    colors={['rgba(238, 242, 255, 0.8)', 'rgba(255, 255, 255, 1)', 'transparent']}
                    className="w-full h-full"
                />
            </View>

            <View className="flex-1 items-center w-full relative z-10 pt-4 px-4">

                {/* Hero: Floating Core */}
                <View className="relative mb-12 mt-4 items-center justify-center">
                    {/* Back Glow */}
                    <View className="absolute w-32 h-32 bg-violet-400/20 rounded-full blur-[40px]" />

                    <Animated.View
                        entering={ZoomIn.duration(800)}
                        className="relative items-center justify-center"
                    >
                        {/* Main Icon Container - Floating Animation */}
                        <Animated.View
                            style={[animatedHeroStyle]}
                            className="w-24 h-24 bg-slate-800 rounded-[28px] items-center justify-center shadow-xl border border-slate-700/50 overflow-hidden"
                        >
                            <LinearGradient
                                colors={['#0f172a', '#1e293b']}
                                start={{ x: 0, y: 1 }}
                                end={{ x: 1, y: 0 }}
                                className="absolute inset-0"
                            />

                            {/* Inner Gradient Border Effect */}
                            <View className="absolute inset-[1px] rounded-[27px] border border-white/10 pointer-events-none" />

                            <BookOpen size={40} color="white" strokeWidth={1.5} style={{ opacity: 0.9 }} />
                        </Animated.View>
                    </Animated.View>
                </View>

                {/* Header Text */}
                <Animated.View
                    entering={FadeInDown.delay(300).duration(500)}
                    className="items-center mb-12 px-6"
                >
                    <Text className="text-3xl font-bold text-slate-900 mb-2 text-center tracking-tight">
                        Magic in <Text className="text-violet-600">Three Steps</Text>
                    </Text>
                    <Text className="text-slate-500 text-[15px] font-medium leading-relaxed text-center">
                        Complex psychology, simplified into a bedtime story.
                    </Text>
                </Animated.View>

                {/* Timeline Container */}
                <View
                    ref={containerRef}
                    className="w-full max-w-[320px] relative pl-4"
                    onLayout={measurePositions}
                >

                    {/* The Line */}
                    <View className="absolute left-[39px] top-4 bottom-8 w-[2px] bg-slate-100 rounded-full overflow-hidden">
                        <Animated.View
                            style={[animatedTimelineStyle]}
                            className="w-full"
                        >
                            <LinearGradient
                                colors={['#3b82f6', '#8b5cf6', '#10b981']}
                                className="w-full h-full"
                            />
                        </Animated.View>
                    </View>

                    {/* Moving Lens - positioned absolutely, animated to icon positions */}
                    <Animated.View
                        style={[
                            animatedLensStyle,
                            {
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                width: LENS_SIZE,
                                height: LENS_SIZE,
                                borderRadius: 20,
                                borderWidth: 2.5,
                                backgroundColor: 'transparent',
                                zIndex: 10,
                                pointerEvents: 'none',
                            },
                        ]}
                    />

                    <View className="gap-y-6">
                        {PROCESS_STEPS.map((step, index) => (
                            <StepItem
                                key={step.id}
                                step={step}
                                index={index}
                                isActive={index <= activeStep}
                                setIconRef={setIconRef}
                            />
                        ))}
                    </View>
                </View>
            </View>
        </OnboardingLayout>
    );
}

interface StepItemProps {
    step: typeof PROCESS_STEPS[0];
    index: number;
    isActive: boolean;
    setIconRef: (index: number, ref: View | null) => void;
}

function StepItem({ step, index, isActive, setIconRef }: StepItemProps) {
    const Icon = step.icon;

    return (
        <Animated.View
            entering={FadeInDown.delay(200 + (index * 200)).duration(500)}
            className="relative flex-row items-center"
            style={{ zIndex: 1 }}
        >
            {/* Icon Box - ref used for measuring position */}
            <View
                ref={(ref) => setIconRef(index, ref)}
                className="relative z-10 mr-5"
            >
                <View
                    style={{
                        width: ICON_BOX_SIZE,
                        height: ICON_BOX_SIZE,
                        borderRadius: 16,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        backgroundColor: isActive ? '#ffffff' : '#f1f5f9',
                        borderColor: isActive ? '#e2e8f0' : '#f1f5f9',
                        transform: [{ scale: isActive ? 1 : 0.9 }],
                    }}
                >
                    <Icon
                        size={22}
                        strokeWidth={2}
                        color={isActive ? step.activeColor : '#94a3b8'}
                    />
                </View>
            </View>

            {/* Text Content */}
            <View
                style={{
                    flex: 1,
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 12,
                    opacity: isActive ? 1 : 0.5,
                }}
            >
                <Text
                    style={{
                        fontSize: 17,
                        fontWeight: '700',
                        color: isActive ? '#0f172a' : '#94a3b8',
                        marginBottom: 2,
                    }}
                >
                    {step.title}
                </Text>
                <Text
                    style={{
                        fontSize: 13,
                        fontWeight: '500',
                        color: '#64748b',
                        lineHeight: 18,
                    }}
                >
                    {step.desc}
                </Text>
            </View>
        </Animated.View>
    );
}
