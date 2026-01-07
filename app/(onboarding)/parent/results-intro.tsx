import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
    FadeIn,
    FadeInDown,
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
    withSequence
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { OnboardingTitle } from '../../../components/OnboardingTypography';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ResultsIntroScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [showContent, setShowContent] = useState(false);

    // Pulse animation for the analyzing icon
    const scale = useSharedValue(1);
    const buttonOpacity = useSharedValue(0);

    useEffect(() => {
        scale.value = withRepeat(
            withSequence(
                withTiming(1.1, { duration: 1000, easing: Easing.ease }),
                withTiming(1, { duration: 1000, easing: Easing.ease })
            ),
            -1,
            true
        );

        const timer = setTimeout(() => {
            setShowContent(true);
            buttonOpacity.value = withTiming(1, { duration: 400 });
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const animatedCircleStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const animatedButtonStyle = useAnimatedStyle(() => ({
        opacity: buttonOpacity.value,
    }));

    const handleNext = () => {
        router.push('/(onboarding)/parent/stat-reveal-1');
    };

    return (
        <View style={[styles.screen, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            {/* Main content area - centered */}
            <View style={styles.contentArea}>
                <Animated.View entering={FadeIn.delay(300)} style={styles.animationContainer}>
                    <View style={styles.iconWrapper}>
                        <Animated.View
                            style={[
                                styles.pulseCircle,
                                animatedCircleStyle
                            ]}
                        />
                        <View style={styles.iconCircle}>
                            <Ionicons name="scan" size={48} color={OnboardingTheme.Colors.Primary} />
                        </View>
                    </View>

                    <OnboardingTitle style={styles.title}>Analysis Complete</OnboardingTitle>
                    <Text style={styles.subtitle}>PROCESSING 14 DATA POINTS</Text>
                </Animated.View>

                {showContent && (
                    <Animated.View entering={FadeInDown.duration(600)} style={styles.warningContainer}>
                        <View style={styles.warningContent}>
                            <View style={styles.warningIconWrapper}>
                                <Ionicons name="warning" size={24} color="#ef4444" />
                            </View>
                            <View style={styles.warningTextWrapper}>
                                <Text style={styles.warningTitle}>Attention Needed</Text>
                                <Text style={styles.warningBody}>
                                    We've identified 2 critical areas that diverge from standard developmental benchmarks for this age group.
                                </Text>
                            </View>
                        </View>
                    </Animated.View>
                )}
            </View>

            {/* Fixed footer - always takes up space, but opacity animates */}
            <Animated.View style={[styles.footer, animatedButtonStyle]}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleNext}
                    activeOpacity={0.9}
                    disabled={!showContent}
                >
                    <Text style={styles.buttonText}>Reveal My Results</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: OnboardingTheme.Colors.Background,
    },
    contentArea: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: OnboardingTheme.Spacing.lg,
    },
    animationContainer: {
        alignItems: 'center',
        marginBottom: OnboardingTheme.Spacing.xl * 2,
    },
    iconWrapper: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: OnboardingTheme.Spacing.lg,
    },
    pulseCircle: {
        position: 'absolute',
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#f3e8ff',
    },
    iconCircle: {
        width: 112,
        height: 112,
        backgroundColor: 'white',
        borderRadius: 56,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: '#f3e8ff',
        zIndex: 10,
    },
    title: {
        textAlign: 'center',
        marginBottom: OnboardingTheme.Spacing.xs,
    },
    subtitle: {
        color: OnboardingTheme.Colors.TextSecondary,
        fontWeight: '500',
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        fontSize: 12,
    },
    warningContainer: {
        width: '100%',
        backgroundColor: '#fef2f2',
        borderColor: '#fee2e2',
        borderWidth: 1,
        borderRadius: OnboardingTheme.Radius.xl,
        padding: OnboardingTheme.Spacing.lg,
    },
    warningContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    warningIconWrapper: {
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 9999,
        marginRight: OnboardingTheme.Spacing.md,
    },
    warningTextWrapper: {
        flex: 1,
    },
    warningTitle: {
        color: '#7f1d1d',
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 4,
    },
    warningBody: {
        color: '#991b1b',
        opacity: 0.8,
        lineHeight: 20,
    },
    footer: {
        paddingHorizontal: OnboardingTheme.Spacing.lg,
        paddingTop: OnboardingTheme.Spacing.md,
        paddingBottom: OnboardingTheme.Spacing.md,
    },
    button: {
        backgroundColor: OnboardingTheme.Colors.Text,
        borderRadius: OnboardingTheme.Radius.lg,
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});