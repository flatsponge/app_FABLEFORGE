import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInUp, ZoomIn, SlideInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const { width } = Dimensions.get('window');

const BENEFITS = [
    { id: 'personalized', icon: 'sparkles', label: 'Personalized stories for your child' },
    { id: 'values', icon: 'heart', label: 'Teaches real values through adventure' },
    { id: 'bedtime', icon: 'moon', label: 'Perfect for bedtime routine' },
];

export default function IntroSlide3() {
    const router = useRouter();
    const [showContent, setShowContent] = useState(false);
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const timer1 = setTimeout(() => setShowContent(true), 800);
        const timer2 = setTimeout(() => setShowButton(true), 2000);
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    const handleNext = () => {
        router.push('/(onboarding)/intro/slide-4');
    };

    return (
        <OnboardingLayout
            onNext={handleNext}
            nextLabel="Show me"
            showNextButton={showButton}
            showProgressBar={false}
        >
            <View style={styles.container}>
                {/* Transition text */}
                <Animated.View entering={FadeIn.delay(100).duration(600)} style={styles.transitionContainer}>
                    <Text style={styles.transitionText}>But here's the good news...</Text>
                </Animated.View>

                {/* Logo/App reveal */}
                <Animated.View
                    entering={ZoomIn.delay(600).duration(800)}
                    style={styles.logoContainer}
                >
                    <View style={styles.logoGlow}>
                        <View style={styles.logo}>
                            <Text style={styles.logoEmoji}>📖</Text>
                        </View>
                    </View>
                </Animated.View>

                <Animated.Text
                    entering={FadeIn.delay(1000).duration(500)}
                    style={styles.appName}
                >
                    Storytime
                </Animated.Text>

                <Animated.Text
                    entering={FadeIn.delay(1200).duration(500)}
                    style={styles.tagline}
                >
                    Stories that shape character
                </Animated.Text>

                {/* Benefits */}
                {showContent && (
                    <View style={styles.benefitsContainer}>
                        {BENEFITS.map((benefit, index) => (
                            <Animated.View
                                key={benefit.id}
                                entering={FadeInUp.delay(1400 + index * 150).duration(400)}
                                style={styles.benefitRow}
                            >
                                <View style={styles.checkCircle}>
                                    <Ionicons name="checkmark" size={16} color="white" />
                                </View>
                                <Text style={styles.benefitText}>{benefit.label}</Text>
                            </Animated.View>
                        ))}
                    </View>
                )}

                {/* Social proof */}
                {showContent && (
                    <Animated.View
                        entering={SlideInDown.delay(2000).duration(500)}
                        style={styles.socialProof}
                    >
                        <View style={styles.avatarStack}>
                            {['👩', '👨', '👩‍🦰', '👨‍🦱'].map((emoji, i) => (
                                <View key={i} style={[styles.avatar, { left: i * 20 }]}>
                                    <Text style={styles.avatarEmoji}>{emoji}</Text>
                                </View>
                            ))}
                        </View>
                        <Text style={styles.socialProofText}>
                            <Text style={styles.socialProofBold}>50,000+</Text> happy families
                        </Text>
                    </Animated.View>
                )}
            </View>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
    },
    transitionContainer: {
        marginBottom: OnboardingTheme.Spacing.lg,
    },
    transitionText: {
        fontSize: 18,
        color: OnboardingTheme.Colors.TextSecondary,
        textAlign: 'center',
        fontWeight: '500',
    },
    logoContainer: {
        marginBottom: OnboardingTheme.Spacing.md,
    },
    logoGlow: {
        padding: 8,
        borderRadius: 100,
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: OnboardingTheme.Colors.Success,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: OnboardingTheme.Colors.Success,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 10,
    },
    logoEmoji: {
        fontSize: 48,
    },
    appName: {
        fontSize: 32,
        fontWeight: '900',
        color: OnboardingTheme.Colors.Text,
        marginBottom: 4,
    },
    tagline: {
        fontSize: 16,
        color: OnboardingTheme.Colors.TextSecondary,
        marginBottom: OnboardingTheme.Spacing.xl,
    },
    benefitsContainer: {
        width: '100%',
        gap: OnboardingTheme.Spacing.sm,
        marginBottom: OnboardingTheme.Spacing.xl,
    },
    benefitRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: OnboardingTheme.Spacing.md,
    },
    checkCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: OnboardingTheme.Colors.Success,
        alignItems: 'center',
        justifyContent: 'center',
    },
    benefitText: {
        fontSize: 16,
        color: OnboardingTheme.Colors.Text,
        fontWeight: '500',
    },
    socialProof: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        paddingHorizontal: OnboardingTheme.Spacing.lg,
        paddingVertical: OnboardingTheme.Spacing.md,
        borderRadius: OnboardingTheme.Radius.xl,
        gap: OnboardingTheme.Spacing.md,
    },
    avatarStack: {
        flexDirection: 'row',
        width: 90,
        height: 32,
        position: 'relative',
    },
    avatar: {
        position: 'absolute',
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#e5e7eb',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
    avatarEmoji: {
        fontSize: 16,
    },
    socialProofText: {
        fontSize: 14,
        color: OnboardingTheme.Colors.TextSecondary,
    },
    socialProofBold: {
        fontWeight: 'bold',
        color: OnboardingTheme.Colors.Text,
    },
});
