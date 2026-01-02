import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

export default function SofteningScreen() {
    const router = useRouter();

    const handleNext = () => {
        router.push('/(onboarding)/quiz/processing');
    };

    return (
        <OnboardingLayout
            progress={0.9}
            onNext={handleNext}
            nextLabel="Build My Personalized Plan"
        >
            <View style={styles.contentContainer}>
                <View style={styles.iconContainer}>
                    <Ionicons name="heart" size={56} color={OnboardingTheme.Colors.Primary} />
                </View>

                <OnboardingTitle style={styles.centerText}>You're not alone in this.</OnboardingTitle>

                <OnboardingBody style={styles.centerText}>
                    <Text style={styles.boldText}>8 out of 10 parents</Text> struggle with the same behavioral challenges you mentioned.
                </OnboardingBody>

                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>65%</Text>
                        <Text style={styles.statLabel}>Lose patience{"\n"}weekly</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>78%</Text>
                        <Text style={styles.statLabel}>Feel guilty{"\n"}about yelling</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>91%</Text>
                        <Text style={styles.statLabel}>Want a{"\n"}better way</Text>
                    </View>
                </View>

                <View style={styles.messageContainer}>
                    <Text style={styles.messageText}>
                        The fact that you're here means you <Text style={styles.messageBold}>care deeply</Text> about your child's development.
                        {"\n\n"}
                        Our AI creates <Text style={styles.messageBold}>personalized stories</Text> that address exactly the behaviors you mentioned—<Text style={styles.messageBold}>without lectures, timeouts, or guilt</Text>.
                    </Text>
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
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 9999,
        marginBottom: OnboardingTheme.Spacing.lg,
    },
    centerText: {
        textAlign: 'center',
        marginBottom: OnboardingTheme.Spacing.md,
    },
    boldText: {
        fontWeight: 'bold',
        color: '#6b21a8', // primary-700
    },
    statsContainer: {
        width: '100%',
        backgroundColor: 'white',
        padding: OnboardingTheme.Spacing.lg,
        borderRadius: OnboardingTheme.Radius.xl,
        borderWidth: 1,
        borderColor: '#e9d5ff', // primary-100
        marginBottom: OnboardingTheme.Spacing.lg,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        fontSize: 24, // Was 3xl (approx 30)
        fontWeight: '900', // black
        color: OnboardingTheme.Colors.Primary,
    },
    statLabel: {
        fontSize: 12,
        color: OnboardingTheme.Colors.TextSecondary,
        textAlign: 'center',
    },
    divider: {
        width: 1,
        backgroundColor: OnboardingTheme.Colors.Border,
    },
    messageContainer: {
        backgroundColor: '#f0fdf4', // green-50
        padding: OnboardingTheme.Spacing.lg,
        borderRadius: OnboardingTheme.Radius.lg,
        borderWidth: 1,
        borderColor: '#dcfce7', // green-100
        width: '100%',
    },
    messageText: {
        textAlign: 'center',
        color: '#374151', // gray-700
        fontSize: 14,
        fontFamily: OnboardingTheme.Typography.Body.fontFamily,
        lineHeight: 20,
    },
    messageBold: {
        fontWeight: 'bold',
        color: '#15803d', // green-700
    },
});