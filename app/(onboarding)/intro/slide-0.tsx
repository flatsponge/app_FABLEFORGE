import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
    FadeInUp,
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import OnboardingLayout from '../../../components/OnboardingLayout';

// Fan Card Component using Images
const FanCard = ({
    index,
    imageSource,
    triggerAnimation,
    customRotationOffset = 0 // Allow fine-tuning rotation per card if needed
}: any) => {
    const rotate = useSharedValue(0);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const scale = useSharedValue(0.8);
    const opacity = useSharedValue(0);

    useEffect(() => {
        if (triggerAnimation) {
            // Fan configuration
            // Center card (index 1) should be 0 deg
            // Left card (index 0) should be -10 deg
            // Right card (index 2) should be +10 deg
            const rotations = [-12, 0, 12];
            const xOffsets = [-40, 0, 40];
            const yOffsets = [10, -10, 10]; // Center card slightly higher

            const finalRotation = rotations[index];
            const finalX = xOffsets[index];
            const finalY = yOffsets[index];

            const delay = index * 120;
            const CONFIG = { duration: 800, easing: Easing.out(Easing.exp) };

            opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
            scale.value = withDelay(delay, withTiming(1, CONFIG));

            rotate.value = withDelay(delay + 200, withTiming(finalRotation, CONFIG));
            translateX.value = withDelay(delay + 200, withTiming(finalX, CONFIG));
            translateY.value = withDelay(delay + 200, withTiming(finalY, CONFIG));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- animation values are stable refs, triggerAnimation is the only real dependency
    }, [triggerAnimation]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { rotate: `${rotate.value}deg` },
            { scale: scale.value }
        ],
        opacity: opacity.value,
        // Ensure proper stacking order if needed, but handled by array order usually
    }));

    return (
        <Animated.View style={[styles.cardContainer, animatedStyle]}>
            <Image
                source={imageSource}
                style={styles.cardImage}
                resizeMode="contain"
            />
        </Animated.View>
    );
};

export default function IntroSlide0() {
    const router = useRouter();
    const [showButton, setShowButton] = useState(false);
    const [triggerFan, setTriggerFan] = useState(false);

    useEffect(() => {
        const fanTimer = setTimeout(() => setTriggerFan(true), 100);
        const buttonTimer = setTimeout(() => setShowButton(true), 1200);

        return () => {
            clearTimeout(fanTimer);
            clearTimeout(buttonTimer);
        };
    }, []);

    const handleNext = () => {
        router.push('/(onboarding)/intro/slide-1');
    };

    // Card Assets - Order Matters for Stacking
    // 1. Left Card (Bottom)
    // 2. Right Card (Bottom)
    // 3. Center Card (Top - Asset 6)
    // We can render them in order: Left, Right, Center so Center is z-index highest by default in React Native view flattening
    const CARDS = [
        { id: 'left', source: require('../../../assets/onbording/intro-card-left.png') },   // Was 4.png
        { id: 'right', source: require('../../../assets/onbording/intro-card-right.png') }, // Was 5.png
        { id: 'center', source: require('../../../assets/onbording/intro-card-center.png') } // Was 6.png (Top focus)
    ];

    // Rearrange for rendering loop to ensure correct visual stacking
    // We want the Center card to be last (on top)
    // BUT we want the fan logic to handle positions correctly based on logical index.
    // Let's pass logical index explicitly.
    // Logical Indices: 0 (Left), 1 (Center), 2 (Right)

    // Render Order:
    // 1. Left (Index 0)
    // 2. Right (Index 2)
    // 3. Center (Index 1) - Rendered last to be visually on top

    const RENDER_ORDER = [
        { ...CARDS[0], logicalIndex: 0 },
        { ...CARDS[1], logicalIndex: 2 },
        { ...CARDS[2], logicalIndex: 1 },
    ];

    return (
        <OnboardingLayout
            onNext={handleNext}
            nextLabel="START STORY"
            showBack={true}
            showNextButton={showButton}
            showProgressBar={false}
            backgroundColor="#F8FAFC"
            fadeInButton={true}
        >
            <View style={StyleSheet.absoluteFill} pointerEvents="none">
                <LinearGradient
                    colors={['rgba(241, 245, 249, 1)', 'rgba(255, 255, 255, 1)']}
                    style={{ flex: 1 }}
                />
            </View>

            <View style={styles.container}>

                {/* Fan Section */}
                <View style={styles.fanWrapper}>
                    {RENDER_ORDER.map((card) => (
                        <View key={card.id} style={StyleSheet.absoluteFill} pointerEvents="none">
                            <View style={styles.cardCentering}>
                                <FanCard
                                    index={card.logicalIndex}
                                    imageSource={card.source}
                                    triggerAnimation={triggerFan}
                                />
                            </View>
                        </View>
                    ))}
                    {/* Spacer */}
                    <View style={{ height: 280, width: 200 }} />
                </View>

                {/* Typography */}
                <View style={styles.textWrapper}>
                    <Animated.View entering={FadeInUp.delay(600).duration(600)}>
                        <Text style={styles.welcomeLabel}>WELCOME TO</Text>
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(800).duration(600)}>
                        <Text style={styles.mainTitle}>FableTales</Text>
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(1000).duration(600)}>
                        <Text style={styles.subtitle}>
                            A new chapter in parenting.{'\n'}Less chaos. More connection.
                        </Text>
                    </Animated.View>
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
        paddingBottom: 40,
    },
    fanWrapper: {
        width: '100%',
        height: 330,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        marginTop: 10,
        position: 'relative',
    },
    cardCentering: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardContainer: {
        position: 'absolute',
        // Shadow for the image itself
        shadowColor: '#1E293B',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    cardImage: {
        width: 200,
        height: 290,
        borderRadius: 20, // Slightly more rounded for larger size
    },
    textWrapper: {
        alignItems: 'center',
        paddingHorizontal: 24,
        zIndex: 10,
    },
    welcomeLabel: {
        fontSize: 11,
        fontWeight: '800',
        color: '#6366F1', // Indigo 500
        letterSpacing: 2,
        marginBottom: 12,
    },
    mainTitle: {
        fontSize: 40,
        fontWeight: '900',
        color: '#0F172A',
        letterSpacing: -1,
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 16,
        lineHeight: 24,
        color: '#64748B',
        textAlign: 'center',
        fontWeight: '500',
    },
});
