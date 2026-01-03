import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
    FadeIn,
    FadeInUp,
    FadeInDown,
    withTiming,
    withDelay,
    useAnimatedStyle,
    useSharedValue,
    Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import ConfettiCannon from 'react-native-confetti-cannon';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const { width, height } = Dimensions.get('window');
const GRAPH_WIDTH = width - 80;
const GRAPH_HEIGHT = 100;

// Avatar URLs using DiceBear API
const AVATAR_SEEDS = [11, 12, 13, 14];

const MetricsCard = ({ value, label, index }: { value: string, label: string, index: number }) => (
    <Animated.View
        entering={FadeInUp.delay(1200 + index * 200).duration(600)}
        style={styles.metricCard}
    >
        <Text style={styles.metricValue}>{value}</Text>
        <Text style={styles.metricLabel}>{label}</Text>
    </Animated.View>
);

// Individual avatar with staggered spring animation
const AnimatedAvatar = ({ seed, index }: { seed: number, index: number }) => {
    const scale = useSharedValue(0);
    const translateX = useSharedValue(-10);
    const rotate = useSharedValue(-20);

    useEffect(() => {
        const delay = 1600 + (index * 100);
        const config = { duration: 400, easing: Easing.out(Easing.cubic) };
        scale.value = withDelay(delay, withTiming(1, config));
        translateX.value = withDelay(delay, withTiming(0, config));
        rotate.value = withDelay(delay, withTiming(0, config));
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value },
            { translateX: translateX.value },
            { rotate: `${rotate.value}deg` },
        ],
    }));

    return (
        <Animated.View style={[styles.avatarContainer, animatedStyle, { zIndex: AVATAR_SEEDS.length - index }]}>
            <Image
                source={{ uri: `https://api.dicebear.com/7.x/avataaars/png?seed=${seed}` }}
                style={styles.avatarImage}
            />
        </Animated.View>
    );
};

export default function IntroSlide4() {
    const router = useRouter();
    const [showButton, setShowButton] = useState(false);
    const confettiRef = useRef<ConfettiCannon>(null);

    useEffect(() => {
        const timer = setTimeout(() => setShowButton(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    const handleNext = () => {
        router.replace('/(onboarding)/goals');
    };

    return (
        <OnboardingLayout
            onNext={handleNext}
            nextLabel="Start my 14-day journey"
            showNextButton={showButton}
            showProgressBar={false}
        >
            {/* Confetti Explosion - fires on mount */}
            <ConfettiCannon
                ref={confettiRef}
                count={80}
                origin={{ x: width / 2, y: -20 }}
                autoStart={true}
                fadeOut={true}
                fallSpeed={2500}
                explosionSpeed={350}
                colors={['#f87171', '#60a5fa', '#4ade80', '#facc15', '#a78bfa']}
            />

            <View style={styles.container}>
                <Animated.View entering={FadeIn.delay(100).duration(600)} style={styles.header}>
                    <LinearGradient
                        colors={['#dcfce7', '#f0fdf4']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.badge}
                    >
                        <Text style={styles.badgeText}>QUICK WINS</Text>
                    </LinearGradient>
                    <Text style={styles.title}>
                        Real change in{'\n'}
                        <Text style={styles.titleHighlight}>just 2 weeks.</Text>
                    </Text>
                    {/* SVG Underline decoration */}
                    <Svg
                        width={140}
                        height={12}
                        viewBox="0 0 100 10"
                        style={styles.underlineSvg}
                    >
                        <Path
                            d="M0 5 Q 50 10 100 5"
                            stroke="#a7f3d0"
                            strokeWidth="8"
                            fill="none"
                        />
                    </Svg>
                    <Text style={styles.subtitle}>
                        Consistent storytelling rewires behavior faster than constant correction.
                    </Text>
                </Animated.View>

                {/* Graph Viz */}
                <Animated.View
                    entering={FadeIn.delay(500).duration(1000)}
                    style={styles.graphContainer}
                >
                    <Svg width={GRAPH_WIDTH} height={GRAPH_HEIGHT}>
                        <Defs>
                            <SvgGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                                <Stop offset="0" stopColor="#22c55e" stopOpacity="0.2" />
                                <Stop offset="1" stopColor="#22c55e" stopOpacity="0" />
                            </SvgGradient>
                        </Defs>
                        {/* Area */}
                        <Path
                            d={`M0,${GRAPH_HEIGHT} Q${GRAPH_WIDTH * 0.4},${GRAPH_HEIGHT} ${GRAPH_WIDTH * 0.6},${GRAPH_HEIGHT * 0.4} T${GRAPH_WIDTH},0 V${GRAPH_HEIGHT} Z`}
                            fill="url(#grad)"
                        />
                        {/* Line */}
                        <Path
                            d={`M0,${GRAPH_HEIGHT} Q${GRAPH_WIDTH * 0.4},${GRAPH_HEIGHT} ${GRAPH_WIDTH * 0.6},${GRAPH_HEIGHT * 0.4} T${GRAPH_WIDTH},0`}
                            fill="none"
                            stroke="#22c55e"
                            strokeWidth="4"
                            strokeLinecap="round"
                        />
                    </Svg>

                    {/* Graph Labels */}
                    <View style={styles.graphLabels}>
                        <Text style={styles.axisLabel}>Day 1</Text>
                        <Text style={styles.axisLabel}>Day 7</Text>
                        <Text style={styles.axisLabelBold}>Day 14</Text>
                    </View>
                </Animated.View>

                {/* Metrics */}
                <View style={styles.metricsRow}>
                    <MetricsCard value="94%" label="Improvement" index={0} />
                    <MetricsCard value="4.9★" label="Parent Rating" index={1} />
                </View>

                <Animated.View
                    entering={FadeIn.delay(1800).duration(600)}
                    style={styles.guarantee}
                >
                    <Ionicons name="shield-checkmark-outline" size={16} color="#15803d" />
                    <Text style={styles.guaranteeText}>Happiness Guarantee Included</Text>
                </Animated.View>

                {/* Social Proof */}
                <Animated.View
                    entering={FadeInDown.delay(1500).duration(500)}
                    style={styles.socialProof}
                >
                    <View style={styles.avatarsStack}>
                        {AVATAR_SEEDS.map((seed, index) => (
                            <AnimatedAvatar key={seed} seed={seed} index={index} />
                        ))}
                    </View>
                    <Text style={styles.socialProofText}>Trusted by 50k+ parents</Text>
                </Animated.View>
            </View>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#bbf7d0',
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#15803d',
        letterSpacing: 1,
    },
    title: {
        fontSize: 36,
        fontWeight: '900',
        color: OnboardingTheme.Colors.Text,
        marginBottom: 2,
        textAlign: 'center',
        lineHeight: 42,
        letterSpacing: -1,
    },
    titleHighlight: {
        fontSize: 48,
        color: '#059669', // emerald-600
        lineHeight: 56,
    },
    underlineSvg: {
        marginTop: -8,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: OnboardingTheme.Colors.TextSecondary,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    graphContainer: {
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    graphLabels: {
        flexDirection: 'row',
        width: GRAPH_WIDTH,
        justifyContent: 'space-between',
        marginTop: 8,
    },
    axisLabel: {
        fontSize: 12,
        color: '#94a3b8',
    },
    axisLabelBold: {
        fontSize: 12,
        color: '#22c55e',
        fontWeight: 'bold',
    },
    metricsRow: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 32,
        width: '100%',
        paddingHorizontal: 20,
    },
    metricCard: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f0fdf4',
    },
    metricValue: {
        fontSize: 28,
        fontWeight: '900',
        color: '#1f2937',
        marginBottom: 4,
    },
    metricLabel: {
        fontSize: 13,
        color: '#6b7280',
        fontWeight: '600',
    },
    guarantee: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 24,
        opacity: 0.8,
    },
    guaranteeText: {
        fontSize: 13,
        color: '#15803d',
        fontWeight: '500',
    },
    // Social Proof Styles
    socialProof: {
        marginTop: 32,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: 'rgba(241, 245, 249, 0.5)',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 9999,
    },
    avatarsStack: {
        flexDirection: 'row',
    },
    avatarContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#e2e8f0',
        borderWidth: 2,
        borderColor: '#fff',
        marginLeft: -8,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    socialProofText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#64748b',
    },
});
