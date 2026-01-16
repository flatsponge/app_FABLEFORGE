import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
    FadeIn,
    ZoomIn,
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import OnboardingLayout from '../../../components/OnboardingLayout';

const GlitchText = ({ text }: { text: string }) => {
    const redOffsetX = useSharedValue(0);
    const redOffsetY = useSharedValue(0);
    const blueOffsetX = useSharedValue(0);
    const blueOffsetY = useSharedValue(0);

    useEffect(() => {
        redOffsetX.value = withRepeat(
            withSequence(
                withTiming(-2, { duration: 100 }),
                withTiming(2, { duration: 100 }),
                withTiming(-1, { duration: 100 }),
                withTiming(0, { duration: 100 })
            ),
            -1,
            true
        );
        redOffsetY.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 150 }),
                withTiming(-1, { duration: 150 }),
                withTiming(0, { duration: 100 })
            ),
            -1,
            true
        );
        blueOffsetX.value = withRepeat(
            withSequence(
                withTiming(2, { duration: 120 }),
                withTiming(-2, { duration: 120 }),
                withTiming(1, { duration: 80 }),
                withTiming(0, { duration: 80 })
            ),
            -1,
            true
        );
        blueOffsetY.value = withRepeat(
            withSequence(
                withTiming(-1, { duration: 130 }),
                withTiming(1, { duration: 130 }),
                withTiming(0, { duration: 140 })
            ),
            -1,
            true
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps -- animation values are stable refs, run once on mount
    }, []);

    const redStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: redOffsetX.value },
            { translateY: redOffsetY.value }
        ],
    }));

    const blueStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: blueOffsetX.value },
            { translateY: blueOffsetY.value }
        ],
    }));

    return (
        <View style={styles.glitchContainer}>
            <Animated.Text style={[styles.glitchTextRed, redStyle]}>{text}</Animated.Text>
            <Animated.Text style={[styles.glitchTextBlue, blueStyle]}>{text}</Animated.Text>
            <Text style={styles.glitchTextMain}>{text}</Text>
        </View>
    );
};

const CHAOS_ELEMENTS = [
    { id: 'tantrums', icon: 'flash-outline' as const, color: '#f59e0b', label: 'TANTRUMS', rotate: -6 },
    { id: 'ignoring', icon: 'ear-outline' as const, color: '#3b82f6', label: 'IGNORING', rotate: 5 },
    { id: 'fighting', icon: 'heart-dislike-outline' as const, color: '#f43f5e', label: 'HITTING', rotate: 4 },
    { id: 'no', icon: 'close-circle-outline' as const, color: '#64748b', label: '"NO!"', rotate: -4 },
    { id: 'bedtime', icon: 'time-outline' as const, color: '#8b5cf6', label: 'BEDTIME', rotate: 5 },
    { id: 'picky', icon: 'restaurant-outline' as const, color: '#10b981', label: 'PICKY EATER', rotate: -5 },
    { id: 'screaming', icon: 'volume-high-outline' as const, color: '#ef4444', label: 'SCREAMING', rotate: 3 },
    { id: 'whining', icon: 'sad-outline' as const, color: '#6366f1', label: 'WHINING', rotate: -3 },
];

// Floating chaos card component - hooks are called at component level (not in a loop)
const FloatingChaosCard = ({
    item,
    index,
    enterDelay,
}: {
    item: typeof CHAOS_ELEMENTS[0];
    index: number;
    enterDelay: number;
}) => {
    const floatY = useSharedValue(0);
    const floatX = useSharedValue(0);

    useEffect(() => {
        floatY.value = withRepeat(
            withSequence(
                withTiming(-8, { duration: 1500 + index * 200 }),
                withTiming(0, { duration: 1500 + index * 200 })
            ),
            -1,
            true
        );
        floatX.value = withRepeat(
            withSequence(
                withTiming(3, { duration: 2000 + index * 300 }),
                withTiming(-3, { duration: 2000 + index * 300 })
            ),
            -1,
            true
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps -- animation values are stable refs
    }, []);

    const floatStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: floatY.value },
            { translateX: floatX.value }
        ],
    }));

    return (
        <View
            style={[
                styles.chaosCard,
                { transform: [{ rotate: `${item.rotate}deg` }] }
            ]}
        >
            <Animated.View
                entering={ZoomIn.delay(enterDelay).duration(400).springify()}
            >
                <Animated.View style={[styles.chaosCardInner, floatStyle]}>
                    <Ionicons name={item.icon} size={18} color={item.color} />
                    <Text style={styles.chaosLabel}>{item.label}</Text>
                </Animated.View>
            </Animated.View>
        </View>
    );
};

export default function IntroSlide1() {
    const router = useRouter();
    const buttonOpacity = useSharedValue(0);

    const emojiX = useSharedValue(0);
    const emojiRotate = useSharedValue(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            buttonOpacity.value = withTiming(1, { duration: 300 });
        }, 1200);

        emojiX.value = withRepeat(
            withSequence(
                withTiming(-3, { duration: 50 }),
                withTiming(3, { duration: 50 }),
                withTiming(-2, { duration: 50 }),
                withTiming(2, { duration: 50 }),
                withTiming(0, { duration: 50 })
            ),
            -1,
            true
        );
        emojiRotate.value = withRepeat(
            withSequence(
                withTiming(-2, { duration: 80 }),
                withTiming(2, { duration: 80 }),
                withTiming(-1, { duration: 80 }),
                withTiming(0, { duration: 80 })
            ),
            -1,
            true
        );

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps -- animation values are stable refs, run once on mount
    }, [buttonOpacity]);

    const emojiStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: emojiX.value },
            { rotate: `${emojiRotate.value}deg` }
        ],
    }));

    const buttonStyle = useAnimatedStyle(() => ({
        opacity: buttonOpacity.value,
    }));

    const handleNext = () => {
        router.push('/(onboarding)/intro/slide-2');
    };



    return (
        <OnboardingLayout
            onNext={handleNext}
            nextLabel="MAKE IT STOP"
            showBack={false}
            showNextButton={true}
            showProgressBar={false}
            backgroundColor="#fff0f0"
            fadeInButton={false}
            buttonAnimatedStyle={buttonStyle}
        >
            <View style={styles.container}>


                <View style={styles.contentArea}>
                    <Animated.View entering={FadeIn.delay(100).duration(400)}>
                        <Animated.Image
                            source={require('../../../assets/onbording/angrychild.png')}
                            style={[styles.emojiImage, emojiStyle]}
                            resizeMode="contain"
                        />
                    </Animated.View>

                    <Animated.View
                        entering={FadeIn.delay(200).duration(500)}
                        style={styles.titleContainer}
                    >
                        <Text style={styles.titleTop}>IS PARENTING ALWAYS</Text>
                        <GlitchText text="THIS HARD?" />
                        <Text style={styles.subtitle}>YOU AREN&apos;T FAILING. IT&apos;S RELENTLESS.</Text>
                    </Animated.View>

                    <View style={styles.chaosContainer}>
                        <View style={styles.chaosRow}>
                            {CHAOS_ELEMENTS.slice(0, 2).map((item, index) => (
                                <FloatingChaosCard
                                    key={item.id}
                                    item={item}
                                    index={index}
                                    enterDelay={400 + index * 80}
                                />
                            ))}
                        </View>
                        <View style={styles.chaosRow}>
                            {CHAOS_ELEMENTS.slice(2, 4).map((item, index) => (
                                <FloatingChaosCard
                                    key={item.id}
                                    item={item}
                                    index={index + 2}
                                    enterDelay={560 + index * 80}
                                />
                            ))}
                        </View>
                        <View style={styles.chaosRow}>
                            {CHAOS_ELEMENTS.slice(4, 6).map((item, index) => (
                                <FloatingChaosCard
                                    key={item.id}
                                    item={item}
                                    index={index + 4}
                                    enterDelay={720 + index * 80}
                                />
                            ))}
                        </View>
                        <View style={styles.chaosRow}>
                            {CHAOS_ELEMENTS.slice(6, 8).map((item, index) => (
                                <FloatingChaosCard
                                    key={item.id}
                                    item={item}
                                    index={index + 6}
                                    enterDelay={880 + index * 80}
                                />
                            ))}
                        </View>
                    </View>
                </View>
            </View>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
    },
    contentArea: {
        alignItems: 'center',
        zIndex: 10,
    },
    emojiImage: {
        width: 120,
        height: 120,
        marginBottom: 16,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    titleTop: {
        fontSize: 36,
        fontWeight: '900',
        color: '#0f172a',
        textAlign: 'center',
        letterSpacing: -1,
    },
    glitchContainer: {
        position: 'relative',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    glitchTextRed: {
        position: 'absolute',
        fontSize: 48,
        fontWeight: '900',
        color: '#ef4444',
        opacity: 0.7,
        letterSpacing: -2,
    },
    glitchTextBlue: {
        position: 'absolute',
        fontSize: 48,
        fontWeight: '900',
        color: '#3b82f6',
        opacity: 0.7,
        letterSpacing: -2,
    },
    glitchTextMain: {
        fontSize: 48,
        fontWeight: '900',
        color: '#dc2626',
        letterSpacing: -2,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#475569',
        textAlign: 'center',
        marginTop: 12,
        letterSpacing: 0.5,
    },
    chaosContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 28,
        gap: 16,
    },
    chaosRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 32,
    },
    chaosCard: {
        marginVertical: 4,
    },
    chaosCardInner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#ffffff',
        borderWidth: 2,
        borderColor: '#0f172a',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 14,
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 5,
    },
    chaosLabel: {
        fontSize: 14,
        fontWeight: '900',
        color: '#0f172a',
    },

});
