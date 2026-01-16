import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';
import HoldToConfirmButton from '../../../components/HoldToConfirmButton';
import { useQuizFooter } from '../../../contexts/QuizFooterContext';

export default function CommitmentScreen() {
    const router = useRouter();
    const { setFooter } = useQuizFooter();

    const handleConfirm = () => {
        router.push('/(onboarding)/quiz/softening');
    };

    useEffect(() => {
        setFooter({
            onNext: handleConfirm,
            nextLabel: "Yes, I'm Ready!",
            showNextButton: true
        });
    }, [setFooter]);

    return (
        <OnboardingLayout
            showProgressBar={false} skipTopSafeArea progress={0.85}
            isScrollable={true}
            hideFooter={true}
        >
            <View style={styles.contentContainer}>
                <View style={styles.iconContainer}>
                    <Ionicons name="heart" size={48} color={OnboardingTheme.Colors.Primary} />
                </View>

                <OnboardingTitle style={styles.centerText}>One last thing...</OnboardingTitle>

                <OnboardingBody style={[styles.centerText, styles.descriptionText]}>
                    Are you ready to commit <Text style={styles.boldText}>5 minutes a day</Text> to your child's character growth?
                </OnboardingBody>

                <View style={styles.supportText}>
                    <Text style={styles.supportMessage}>You're not alone in this.</Text>
                </View>

                <View style={styles.benefitsContainer}>
                    <View style={styles.benefitRow}>
                        <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
                        <Text style={styles.benefitText}>Just one story per day</Text>
                    </View>
                    <View style={styles.benefitRow}>
                        <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
                        <Text style={styles.benefitText}>See results in 7-14 days</Text>
                    </View>
                    <View style={styles.benefitRow}>
                        <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
                        <Text style={styles.benefitText}>Cancel anytime, no pressure</Text>
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <HoldToConfirmButton
                        onConfirm={handleConfirm}
                        title="Yes, I'm Ready!"
                        subtitle="Hold to confirm"
                        holdDuration={2000}
                    />
                </View>
            </View>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        alignItems: 'center',
        width: '100%',
    },
    iconContainer: {
        backgroundColor: '#f3e8ff', // primary-100
        padding: 24,
        borderRadius: 9999,
        marginBottom: OnboardingTheme.Spacing.lg,
    },
    centerText: {
        textAlign: 'center',
    },
    descriptionText: {
        marginBottom: OnboardingTheme.Spacing.md,
    },
    boldText: {
        fontWeight: 'bold',
        color: OnboardingTheme.Colors.Primary,
    },
    supportText: {
        marginBottom: OnboardingTheme.Spacing.lg,
    },
    supportMessage: {
        fontSize: 16,
        fontWeight: '600',
        color: OnboardingTheme.Colors.Primary,
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
        textAlign: 'center',
    },
    benefitsContainer: {
        backgroundColor: 'white',
        padding: OnboardingTheme.Spacing.lg,
        borderRadius: OnboardingTheme.Radius.lg,
        borderWidth: 1,
        borderColor: OnboardingTheme.Colors.Border,
        width: '100%',
        marginBottom: OnboardingTheme.Spacing.xl,
    },
    benefitRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: OnboardingTheme.Spacing.sm,
    },
    benefitText: {
        marginLeft: OnboardingTheme.Spacing.sm,
        fontSize: 16,
        color: OnboardingTheme.Colors.Text,
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
    },
});