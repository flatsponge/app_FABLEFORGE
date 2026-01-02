import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const { width } = Dimensions.get('window');

const PARENT_FRUSTRATIONS = [
    {
        id: 'repeat',
        emoji: '🔁',
        title: 'Repeating yourself 10x',
        subtitle: 'And still being ignored',
        delay: 300,
    },
    {
        id: 'meltdowns',
        emoji: '😤',
        title: 'Public meltdowns',
        subtitle: 'Over the smallest things',
        delay: 700,
    },
    {
        id: 'exhausted',
        emoji: '😴',
        title: 'Ending the day exhausted',
        subtitle: 'From constant negotiations',
        delay: 1100,
    },
];

export default function IntroSlide2() {
    const router = useRouter();
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowButton(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    const handleNext = () => {
        router.push('/(onboarding)/intro/slide-3');
    };

    return (
        <OnboardingLayout
            onNext={handleNext}
            nextLabel="There has to be a better way"
            showNextButton={showButton}
            showProgressBar={false}
        >
            <View style={styles.container}>
                <Animated.View entering={FadeIn.delay(100).duration(500)} style={styles.headerContainer}>
                    <Text style={styles.title}>Sound familiar?</Text>
                    <Text style={styles.subtitle}>These struggles are exhausting</Text>
                </Animated.View>

                <View style={styles.frustrationContainer}>
                    {PARENT_FRUSTRATIONS.map((item) => (
                        <Animated.View
                            key={item.id}
                            entering={FadeInUp.delay(item.delay).duration(500)}
                            style={styles.frustrationCard}
                        >
                            <Animated.Text
                                entering={ZoomIn.delay(item.delay + 150).duration(300)}
                                style={styles.emoji}
                            >
                                {item.emoji}
                            </Animated.Text>
                            <View style={styles.frustrationTextWrapper}>
                                <Text style={styles.frustrationTitle}>{item.title}</Text>
                                <Text style={styles.frustrationSubtitle}>{item.subtitle}</Text>
                            </View>
                        </Animated.View>
                    ))}
                </View>

                <Animated.View
                    entering={FadeIn.delay(1600).duration(500)}
                    style={styles.reassurance}
                >
                    <Text style={styles.reassuranceText}>
                        It's not your fault. Traditional approaches don't work for every child.
                    </Text>
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
    headerContainer: {
        alignItems: 'center',
        marginBottom: OnboardingTheme.Spacing.xl,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: OnboardingTheme.Colors.Text,
        textAlign: 'center',
        marginBottom: OnboardingTheme.Spacing.xs,
    },
    subtitle: {
        fontSize: 16,
        color: OnboardingTheme.Colors.TextSecondary,
        textAlign: 'center',
    },
    frustrationContainer: {
        width: '100%',
        gap: OnboardingTheme.Spacing.md,
    },
    frustrationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        borderRadius: OnboardingTheme.Radius.xl,
        padding: OnboardingTheme.Spacing.md,
        borderWidth: 1,
        borderColor: OnboardingTheme.Colors.Border,
    },
    emoji: {
        fontSize: 36,
        marginRight: OnboardingTheme.Spacing.md,
    },
    frustrationTextWrapper: {
        flex: 1,
    },
    frustrationTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: OnboardingTheme.Colors.Text,
        marginBottom: 2,
    },
    frustrationSubtitle: {
        fontSize: 14,
        color: OnboardingTheme.Colors.TextSecondary,
    },
    reassurance: {
        marginTop: OnboardingTheme.Spacing.xl,
        paddingHorizontal: OnboardingTheme.Spacing.md,
    },
    reassuranceText: {
        fontSize: 15,
        color: OnboardingTheme.Colors.TextSecondary,
        textAlign: 'center',
        lineHeight: 22,
        fontStyle: 'italic',
    },
});
