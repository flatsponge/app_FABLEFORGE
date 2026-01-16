import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
    FadeIn,
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import OnboardingLayout from '../../../components/OnboardingLayout';

// Wavy underline component for "more resistance" text
function WavyUnderline({ width, color = '#F87171' }: { width: number; color?: string }) {
    const waveHeight = 3;
    const waveLength = 8;
    const numWaves = Math.ceil(width / waveLength);

    // Generate a wavy path
    let pathD = `M 0 ${waveHeight}`;
    for (let i = 0; i < numWaves; i++) {
        const x1 = i * waveLength + waveLength / 4;
        const x2 = i * waveLength + waveLength / 2;
        const x3 = i * waveLength + (3 * waveLength) / 4;
        const x4 = (i + 1) * waveLength;
        pathD += ` Q ${x1} 0, ${x2} ${waveHeight} Q ${x3} ${waveHeight * 2}, ${x4} ${waveHeight}`;
    }

    return (
        <Svg width={width} height={waveHeight * 2 + 2} style={styles.wavyUnderline}>
            <Path d={pathD} stroke={color} strokeWidth={2} fill="none" />
        </Svg>
    );
}

// Frustration card data matching the inspiration design
const PARENT_FRUSTRATIONS = [
    {
        id: 'repeat',
        emoji: '🔁',
        title: 'Repeating Yourself',
        subtitle: '"How many times do I have to say it?"',
        rotation: -4,
        translateX: -5,
        delay: 200,
        backgroundColor: '#EFF6FF', // blue-50
    },
    {
        id: 'public',
        emoji: '🫣',
        title: 'Public Scenes',
        subtitle: 'The fear of a meltdown at the store.',
        rotation: 3,
        translateX: 5,
        delay: 500,
        backgroundColor: '#FFF7ED', // orange-50
    },
    {
        id: 'exhausted',
        emoji: '😮‍💨',
        title: 'Pure Exhaustion',
        subtitle: 'Ending the day feeling defeated.',
        rotation: -2,
        translateX: 0,
        delay: 800,
        backgroundColor: '#F8FAFC', // slate-100
    },
];

// Individual frustration card with drop animation
function FrustrationCard({
    item,
    index,
}: {
    item: typeof PARENT_FRUSTRATIONS[0];
    index: number;
}) {
    const translateY = useSharedValue(-400);
    const rotate = useSharedValue(item.rotation * 5);
    const opacity = useSharedValue(0);
    const translateX = useSharedValue(0);
    const targetY = index * 115;

    useEffect(() => {
        const easeConfig = { duration: 600, easing: Easing.out(Easing.cubic) };

        const timeout = setTimeout(() => {
            translateY.value = withTiming(targetY, easeConfig);
            rotate.value = withTiming(item.rotation, easeConfig);
            translateX.value = withTiming(item.translateX, easeConfig);
            opacity.value = withTiming(1, { duration: 300 });
        }, item.delay);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps -- animation values are stable refs, item props are static
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: translateY.value },
            { translateX: translateX.value },
            { rotate: `${rotate.value}deg` },
        ],
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                styles.cardWrapper,
                { zIndex: index + 1 },
                animatedStyle,
            ]}
        >
            <View style={[styles.frustrationCard, { backgroundColor: item.backgroundColor }]}>
                <View style={styles.emojiContainer}>
                    <Text style={styles.emoji}>{item.emoji}</Text>
                </View>
                <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                </View>
            </View>
        </Animated.View>
    );
}

export default function IntroSlide2() {
    const router = useRouter();
    const buttonOpacity = useSharedValue(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            buttonOpacity.value = withTiming(1, { duration: 300 });
        }, 1800);
        return () => clearTimeout(timer);
    }, [buttonOpacity]);

    const buttonStyle = useAnimatedStyle(() => ({
        opacity: buttonOpacity.value,
    }));

    const handleNext = () => {
        router.push('/(onboarding)/intro/slide-3');
    };

    return (
        <OnboardingLayout
            onNext={handleNext}
            nextLabel="I need a better way"
            showNextButton={true}
            showProgressBar={false}
            backgroundColor="#F8FAFC" // slate-50
            fadeInButton={false}
            buttonAnimatedStyle={buttonStyle}
        >
            <View style={styles.container}>
                {/* Header with highlighted "CONSTANT BATTLE" text */}
                <Animated.View
                    entering={FadeIn.delay(100).duration(600)}
                    style={styles.headerContainer}
                >
                    <Text style={styles.titleText}>
                        It feels like a
                    </Text>

                    {/* Highlighted banner text */}
                    <View style={styles.highlightWrapper}>
                        <View style={styles.highlightBackground} />
                        <Text style={styles.highlightText}>CONSTANT BATTLE</Text>
                    </View>

                    <Text style={styles.descriptionText}>
                        Traditional discipline often just creates{' '}
                    </Text>
                    <View style={styles.resistanceWrapper}>
                        <Text style={styles.resistanceText}>more resistance</Text>
                        <WavyUnderline width={130} color="#F87171" />
                    </View>
                    <Text style={styles.descriptionText}>.</Text>
                </Animated.View>

                {/* Stacked Frustration Cards */}
                <View style={styles.cardsContainer}>
                    {PARENT_FRUSTRATIONS.map((item, index) => (
                        <FrustrationCard key={item.id} item={item} index={index} />
                    ))}
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
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    titleText: {
        fontSize: 36,
        fontWeight: '900',
        color: '#1E293B', // slate-800
        textAlign: 'center',
        marginBottom: 4,
        letterSpacing: -1,
    },
    highlightWrapper: {
        position: 'relative',
        paddingHorizontal: 20,
        paddingVertical: 8,
        marginVertical: 4,
        transform: [{ rotate: '-1deg' }],
    },
    highlightBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#FDE047', // yellow-300
        borderWidth: 3,
        borderColor: '#000000',
        // Shadow for the "pressed" effect
        shadowColor: '#000000',
        shadowOffset: { width: 6, height: 6 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 6,
    },
    highlightText: {
        fontSize: 42,
        fontWeight: '900',
        color: '#000000',
        textAlign: 'center',
        letterSpacing: -1,
        zIndex: 1,
    },
    descriptionText: {
        fontSize: 17,
        color: '#64748B', // slate-500
        textAlign: 'center',
        lineHeight: 26,
        marginTop: 16,
        fontWeight: '500',
        maxWidth: '90%',
    },
    resistanceWrapper: {
        alignItems: 'center',
        marginTop: -4,
    },
    resistanceText: {
        fontSize: 17,
        fontWeight: '800',
        color: '#1E293B', // slate-800
    },
    wavyUnderline: {
        marginTop: -2,
    },
    cardsContainer: {
        width: '100%',
        height: 420,
        position: 'relative',
        alignItems: 'center',
    },
    cardWrapper: {
        position: 'absolute',
        top: 0,
        width: '100%',
        maxWidth: 340,
        alignSelf: 'center',
    },
    frustrationCard: {
        borderRadius: 24,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(15, 23, 42, 0.05)', // slate-900/5
        // Shadow matching the inspiration
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.15,
        shadowRadius: 40,
        elevation: 8,
    },
    emojiContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        borderWidth: 1,
        borderColor: '#F1F5F9', // slate-100
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    emoji: {
        fontSize: 28,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B', // slate-800
        marginBottom: 4,
        lineHeight: 22,
    },
    cardSubtitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B', // slate-500
        lineHeight: 20,
    },
});
