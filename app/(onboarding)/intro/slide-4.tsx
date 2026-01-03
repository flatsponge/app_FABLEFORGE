import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const { width } = Dimensions.get('window');
const GRAPH_WIDTH = width - 80;
const GRAPH_HEIGHT = 100;

const MetricsCard = ({ value, label, index }: { value: string, label: string, index: number }) => (
    <Animated.View
        entering={FadeInUp.delay(1200 + index * 200).duration(600)}
        style={styles.metricCard}
    >
        <Text style={styles.metricValue}>{value}</Text>
        <Text style={styles.metricLabel}>{label}</Text>
    </Animated.View>
);

export default function IntroSlide4() {
    const router = useRouter();
    const [showButton, setShowButton] = useState(false);

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
                    <Text style={styles.title}>Results in 14 days</Text>
                    <Text style={styles.subtitle}>
                        Most parents see significant behavior shifts within two weeks.
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
        fontSize: 32,
        fontWeight: '800',
        color: OnboardingTheme.Colors.Text,
        marginBottom: 8,
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
    }
});
