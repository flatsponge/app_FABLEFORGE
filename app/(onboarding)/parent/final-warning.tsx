import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

export default function FinalWarningScreen() {
    const router = useRouter();
    const [showCards, setShowCards] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowCards(true), 600);
        return () => clearTimeout(timer);
    }, []);

    const handleNext = () => {
        router.push('/(onboarding)/parent/positive-outlook');
    };

    return (
        <OnboardingLayout
            showProgressBar={false} progress={1.0}
            onNext={handleNext}
            nextLabel="See The Solution"
            isScrollable={true}
        >
            <View style={styles.container}>
                {/* Header */}
                <Animated.View entering={FadeIn.delay(200)} style={styles.header}>
                    <View style={styles.iconWrapper}>
                        <Ionicons name="hourglass-outline" size={40} color={OnboardingTheme.Colors.Error} />
                    </View>
                    <OnboardingTitle style={styles.title}>The Cost of Waiting</OnboardingTitle>
                    <OnboardingBody style={styles.subtitle}>
                        Every month of delay makes behavioral change harder.
                    </OnboardingBody>
                </Animated.View>

                {/* Cards */}
                {showCards && (
                    <View style={styles.cardsContainer}>
                        <Animated.View entering={FadeInDown.delay(100)} style={styles.card}>
                            <Text style={styles.cardLabel}>Parent Regret</Text>
                            <View style={styles.cardContent}>
                                <Text style={styles.cardValue}>89%</Text>
                                <Text style={styles.cardText}>of parents wish they had started earlier.</Text>
                            </View>
                        </Animated.View>

                        <Animated.View entering={FadeInDown.delay(300)} style={styles.card}>
                            <Text style={styles.cardLabel}>Avg Therapy Costs</Text>
                            <View style={styles.cardContent}>
                                <Text style={styles.cardValue}>$2.4k</Text>
                                <Text style={styles.cardText}>per year for traditional child therapy.</Text>
                            </View>
                        </Animated.View>

                        <Animated.View entering={FadeInDown.delay(500)} style={styles.cardCritical}>
                            <Text style={styles.cardLabelCritical}>Escalation Risk</Text>
                            <View style={styles.cardContent}>
                                <Text style={styles.cardValueCritical}>67%</Text>
                                <Text style={styles.cardTextCritical}>escalation rate without intervention.</Text>
                            </View>
                        </Animated.View>
                    </View>
                )}
            </View>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingVertical: OnboardingTheme.Spacing.lg,
    },
    header: {
        alignItems: 'center',
        marginBottom: OnboardingTheme.Spacing.xl,
    },
    iconWrapper: {
        backgroundColor: '#fef2f2', // red-50
        padding: 20,
        borderRadius: 9999,
        marginBottom: OnboardingTheme.Spacing.md,
        borderWidth: 1,
        borderColor: '#fee2e2', // red-100
    },
    title: {
        textAlign: 'center',
        marginBottom: OnboardingTheme.Spacing.xs,
    },
    subtitle: {
        textAlign: 'center',
        color: OnboardingTheme.Colors.TextSecondary,
    },
    cardsContainer: {
        width: '100%',
        gap: OnboardingTheme.Spacing.md,
    },
    card: {
        backgroundColor: 'white',
        padding: OnboardingTheme.Spacing.lg,
        borderRadius: OnboardingTheme.Radius.xl,
        borderWidth: 1,
        borderColor: OnboardingTheme.Colors.Border,
    },
    cardLabel: {
        color: OnboardingTheme.Colors.TextSecondary,
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        marginBottom: 4,
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    cardValue: {
        fontSize: 32,
        fontWeight: '900',
        color: OnboardingTheme.Colors.Text,
        marginRight: 12,
        fontFamily: OnboardingTheme.Typography.Title.fontFamily,
    },
    cardText: {
        color: OnboardingTheme.Colors.TextSecondary,
        fontSize: 14,
        flex: 1,
        paddingBottom: 4,
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
    cardCritical: {
        backgroundColor: '#fef2f2', // red-50
        padding: OnboardingTheme.Spacing.lg,
        borderRadius: OnboardingTheme.Radius.xl,
        borderWidth: 1,
        borderColor: '#fee2e2', // red-100
    },
    cardLabelCritical: {
        color: OnboardingTheme.Colors.Error,
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        marginBottom: 4,
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
    cardValueCritical: {
        fontSize: 32,
        fontWeight: '900',
        color: OnboardingTheme.Colors.Error,
        marginRight: 12,
        fontFamily: OnboardingTheme.Typography.Title.fontFamily,
    },
    cardTextCritical: {
        color: '#991b1b', // red-800
        opacity: 0.6,
        fontSize: 14,
        flex: 1,
        paddingBottom: 4,
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
});