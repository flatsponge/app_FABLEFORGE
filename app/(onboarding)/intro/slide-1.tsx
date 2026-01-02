import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const { width } = Dimensions.get('window');

const PAIN_POINTS = [
    { id: 'tantrums', icon: 'flash', label: 'Tantrums & meltdowns', delay: 400 },
    { id: 'listening', icon: 'ear', label: 'Not listening to you', delay: 600 },
    { id: 'sharing', icon: 'heart-dislike', label: 'Trouble sharing', delay: 800 },
    { id: 'patience', icon: 'hourglass', label: 'No patience', delay: 1000 },
];

export default function IntroSlide1() {
    const router = useRouter();
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowButton(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    const handleNext = () => {
        router.push('/(onboarding)/intro/slide-2');
    };

    return (
        <OnboardingLayout
            onNext={handleNext}
            nextLabel="That's my child"
            showBack={false}
            showNextButton={showButton}
            showProgressBar={false}
        >
            <View style={styles.container}>
                <Animated.View entering={FadeIn.delay(100).duration(600)} style={styles.headerContainer}>
                    <View style={styles.emojiContainer}>
                        <Text style={styles.emoji}>😟</Text>
                    </View>
                    <Text style={styles.title}>Does your child struggle with...</Text>
                </Animated.View>

                <View style={styles.painPointsContainer}>
                    {PAIN_POINTS.map((point) => (
                        <Animated.View
                            key={point.id}
                            entering={FadeInDown.delay(point.delay).duration(500)}
                            style={styles.painPointCard}
                        >
                            <View style={styles.iconWrapper}>
                                <Ionicons name={point.icon as any} size={24} color={OnboardingTheme.Colors.Error} />
                            </View>
                            <Text style={styles.painPointLabel}>{point.label}</Text>
                        </Animated.View>
                    ))}
                </View>

                <Animated.Text
                    entering={FadeInUp.delay(1200).duration(500)}
                    style={styles.subtext}
                >
                    You're not alone. Most parents face these challenges.
                </Animated.Text>
            </View>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: OnboardingTheme.Spacing.xl,
    },
    emojiContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#fef2f2',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: OnboardingTheme.Spacing.lg,
    },
    emoji: {
        fontSize: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: OnboardingTheme.Colors.Text,
        textAlign: 'center',
        lineHeight: 36,
    },
    painPointsContainer: {
        width: '100%',
        gap: OnboardingTheme.Spacing.md,
    },
    painPointCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fef2f2',
        borderRadius: OnboardingTheme.Radius.xl,
        padding: OnboardingTheme.Spacing.md,
        borderWidth: 1,
        borderColor: '#fee2e2',
    },
    iconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: OnboardingTheme.Spacing.md,
    },
    painPointLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: OnboardingTheme.Colors.Text,
        flex: 1,
    },
    subtext: {
        marginTop: OnboardingTheme.Spacing.xl,
        fontSize: 16,
        color: OnboardingTheme.Colors.TextSecondary,
        textAlign: 'center',
    },
});
