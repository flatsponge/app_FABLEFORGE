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
import { Zap, Ear, HeartCrack, XCircle, Clock, Utensils, Volume2, Frown } from 'lucide-react-native';
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
    { id: 'tantrums', Icon: Zap, color: '#f59e0b', label: 'TANTRUMS', rotate: -6 },
    { id: 'ignoring', Icon: Ear, color: '#3b82f6', label: 'IGNORING', rotate: 5 },
    { id: 'fighting', Icon: HeartCrack, color: '#f43f5e', label: 'HITTING', rotate: 4 },
    { id: 'no', Icon: XCircle, color: '#64748b', label: '"NO!"', rotate: -4 },
    { id: 'bedtime', Icon: Clock, color: '#8b5cf6', label: 'BEDTIME', rotate: 5 },
    { id: 'picky', Icon: Utensils, color: '#10b981', label: 'PICKY EATER', rotate: -5 },
    { id: 'screaming', Icon: Volume2, color: '#ef4444', label: 'SCREAMING', rotate: 3 },
    { id: 'whining', Icon: Frown, color: '#6366f1', label: 'WHINING', rotate: -3 },
];

export default function IntroSlide1() {
    const router = useRouter();
    const [showButton, setShowButton] = useState(false);

    const emojiX = useSharedValue(0);
    const emojiRotate = useSharedValue(0);

    useEffect(() => {
        const timer = setTimeout(() => setShowButton(true), 1200);

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
    }, []);

    const emojiStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: emojiX.value },
            { rotate: `${emojiRotate.value}deg` }
        ],
    }));

    const createFloatStyle = (index: number) => {
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
        }, []);

        return useAnimatedStyle(() => ({
            transform: [
                { translateY: floatY.value },
                { translateX: floatX.value }
            ],
        }));
    };

    const handleNext = () => {
        router.push('/(onboarding)/intro/slide-2');
    };



    return (
        <OnboardingLayout
            onNext={handleNext}
            nextLabel="MAKE IT STOP"
            showBack={false}
            showNextButton={showButton}
            showProgressBar={false}
            backgroundColor="#fff0f0"
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
                        <Text style={styles.subtitle}>YOU AREN'T FAILING. IT'S RELENTLESS.</Text>
                    </Animated.View>

                    <View style={styles.chaosContainer}>
                        <View style={styles.chaosRow}>
                            {CHAOS_ELEMENTS.slice(0, 2).map((item, index) => {
                                const floatStyle = createFloatStyle(index);
                                return (
                                    <Animated.View
                                        key={item.id}
                                        entering={ZoomIn.delay(400 + index * 80).duration(400).springify()}
                                        style={[
                                            styles.chaosCard,
                                            { transform: [{ rotate: `${item.rotate}deg` }] }
                                        ]}
                                    >
                                        <Animated.View style={[styles.chaosCardInner, floatStyle]}>
                                            <item.Icon size={18} color={item.color} strokeWidth={2.5} />
                                            <Text style={styles.chaosLabel}>{item.label}</Text>
                                        </Animated.View>
                                    </Animated.View>
                                );
                            })}
                        </View>
                        <View style={styles.chaosRow}>
                            {CHAOS_ELEMENTS.slice(2, 4).map((item, index) => {
                                const floatStyle = createFloatStyle(index + 2);
                                return (
                                    <Animated.View
                                        key={item.id}
                                        entering={ZoomIn.delay(560 + index * 80).duration(400).springify()}
                                        style={[
                                            styles.chaosCard,
                                            { transform: [{ rotate: `${item.rotate}deg` }] }
                                        ]}
                                    >
                                        <Animated.View style={[styles.chaosCardInner, floatStyle]}>
                                            <item.Icon size={18} color={item.color} strokeWidth={2.5} />
                                            <Text style={styles.chaosLabel}>{item.label}</Text>
                                        </Animated.View>
                                    </Animated.View>
                                );
                            })}
                        </View>
                        <View style={styles.chaosRow}>
                            {CHAOS_ELEMENTS.slice(4, 6).map((item, index) => {
                                const floatStyle = createFloatStyle(index + 4);
                                return (
                                    <Animated.View
                                        key={item.id}
                                        entering={ZoomIn.delay(720 + index * 80).duration(400).springify()}
                                        style={[
                                            styles.chaosCard,
                                            { transform: [{ rotate: `${item.rotate}deg` }] }
                                        ]}
                                    >
                                        <Animated.View style={[styles.chaosCardInner, floatStyle]}>
                                            <item.Icon size={18} color={item.color} strokeWidth={2.5} />
                                            <Text style={styles.chaosLabel}>{item.label}</Text>
                                        </Animated.View>
                                    </Animated.View>
                                );
                            })}
                        </View>
                        <View style={styles.chaosRow}>
                            {CHAOS_ELEMENTS.slice(6, 8).map((item, index) => {
                                const floatStyle = createFloatStyle(index + 6);
                                return (
                                    <Animated.View
                                        key={item.id}
                                        entering={ZoomIn.delay(880 + index * 80).duration(400).springify()}
                                        style={[
                                            styles.chaosCard,
                                            { transform: [{ rotate: `${item.rotate}deg` }] }
                                        ]}
                                    >
                                        <Animated.View style={[styles.chaosCardInner, floatStyle]}>
                                            <item.Icon size={18} color={item.color} strokeWidth={2.5} />
                                            <Text style={styles.chaosLabel}>{item.label}</Text>
                                        </Animated.View>
                                    </Animated.View>
                                );
                            })}
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
