import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

export default function CommitmentScreen() {
    const router = useRouter();

    const handleNext = () => {
        router.push('/(onboarding)/quiz/softening');
    };

    return (
        <OnboardingLayout
            showProgressBar={false} progress={0.85}
            onNext={handleNext}
            nextLabel="Yes, I'm Ready!"
        >
            <View style={styles.contentContainer}>
                <View style={styles.iconContainer}>
                    <Ionicons name="heart" size={48} color={OnboardingTheme.Colors.Primary} />
                </View>

                <OnboardingTitle style={styles.centerText}>One last thing...</OnboardingTitle>

                <OnboardingBody style={[styles.centerText, styles.descriptionText]}>
                    Are you ready to commit <Text style={styles.boldText}>5 minutes a day</Text> to your child's character growth?
                </OnboardingBody>

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
        marginBottom: OnboardingTheme.Spacing.xl,
    },
    boldText: {
        fontWeight: 'bold',
        color: OnboardingTheme.Colors.Primary,
    },
    benefitsContainer: {
        backgroundColor: 'white',
        padding: OnboardingTheme.Spacing.lg,
        borderRadius: OnboardingTheme.Radius.lg,
        borderWidth: 1,
        borderColor: OnboardingTheme.Colors.Border,
        width: '100%',
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
});