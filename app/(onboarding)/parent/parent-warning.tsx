import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInUp, ZoomIn, Easing } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

export default function ParentWarningScreen() {
    const router = useRouter();
    const [showStat, setShowStat] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowStat(true), 1200);
        return () => clearTimeout(timer);
    }, []);

    const handleNext = () => {
        router.push('/(onboarding)/parent/radar-bad');
    };

    return (
        <OnboardingLayout
            showProgressBar={false} progress={1.0}
            showNextButton={showStat}
            onNext={handleNext}
            nextLabel="See The Path Forward"
            isScrollable={true}
            fadeInButton={true}
        >
            <View style={styles.container}>
                <Animated.View entering={FadeIn.delay(200)} style={styles.header}>
                    <View style={styles.iconWrapper}>
                        <Ionicons name="heart-half" size={40} color="#ea580c" />
                    </View>

                    <Text style={styles.badgeText}>Parental Well-being</Text>
                    <OnboardingTitle style={styles.title}>The Hidden Cost</OnboardingTitle>
                </Animated.View>

                <Animated.View entering={ZoomIn.delay(400).duration(600)} style={styles.statCard}>
                    <Text style={styles.statDescription}>
                        Chronic parenting stress increases the risk of cardiovascular issues by
                    </Text>

                    <Text style={styles.statValue}>40%</Text>

                    <View style={styles.divider} />

                    <Text style={styles.quote}>
                        "You cannot pour from an empty cup."
                    </Text>
                </Animated.View>

                {showStat && (
                    <Animated.View entering={FadeInUp.duration(600)} style={styles.contextWrapper}>
                        <Text style={styles.contextText}>
                            Addressing your child's behavior isn't just about them—it's about reclaiming your <Text style={styles.contextBold}>peace of mind</Text>.
                        </Text>
                    </Animated.View>
                )}
            </View>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: OnboardingTheme.Spacing.lg,
    },
    iconWrapper: {
        backgroundColor: '#fff7ed', // orange-50
        padding: 16,
        borderRadius: 9999,
        marginBottom: OnboardingTheme.Spacing.md,
    },
    badgeText: {
        color: OnboardingTheme.Colors.TextSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
    title: {
        textAlign: 'center',
    },
    statCard: {
        width: '100%',
        backgroundColor: '#fff7ed', // orange-50
        borderColor: '#ffedd5', // orange-100
        borderWidth: 1,
        borderRadius: OnboardingTheme.Radius.xl,
        padding: OnboardingTheme.Spacing.xl,
        alignItems: 'center',
        marginBottom: OnboardingTheme.Spacing.lg,
    },
    statDescription: {
        textAlign: 'center',
        color: '#9a3412', // orange-800
        fontSize: 18,
        fontWeight: '500',
        lineHeight: 26,
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
    statValue: {
        fontSize: 64,
        fontWeight: '900',
        color: '#ea580c', // orange-600
        marginVertical: OnboardingTheme.Spacing.md,
        fontFamily: OnboardingTheme.Typography.Title.fontFamily,
    },
    divider: {
        height: 1,
        width: '100%',
        backgroundColor: '#fed7aa', // orange-200
        marginVertical: 8,
    },
    quote: {
        textAlign: 'center',
        color: '#9a3412',
        opacity: 0.6,
        fontSize: 14,
        marginTop: 16,
        fontStyle: 'italic',
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
    contextWrapper: {
        width: '100%',
        paddingHorizontal: OnboardingTheme.Spacing.md,
    },
    contextText: {
        color: OnboardingTheme.Colors.TextSecondary,
        textAlign: 'center',
        lineHeight: 22,
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
    contextBold: {
        fontWeight: 'bold',
        color: OnboardingTheme.Colors.Text,
    },
});