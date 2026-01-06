import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

// Try to import expo-store-review (not available in Expo Go)
let StoreReview: typeof import('expo-store-review') | null = null;
try {
    StoreReview = require('expo-store-review');
} catch {
    // Module not available in Expo Go - review prompt will be skipped
    console.warn('expo-store-review not available - review prompt disabled');
}

export default function ReviewScreen() {
    const router = useRouter();
    const [rating, setRating] = useState(0);
    const [hasRated, setHasRated] = useState(false);

    const handleRating = async (selectedRating: number) => {
        setRating(selectedRating);
        setHasRated(true);

        if (selectedRating >= 4) {
            // Delay slightly for UX, then request review
            setTimeout(async () => {
                if (StoreReview && await StoreReview.hasAction()) {
                    try {
                        await StoreReview.requestReview();
                    } catch (e) {
                        console.log('Error requesting review', e);
                    }
                }
                // Navigate after attempt
                setTimeout(() => {
                    router.push('/(onboarding)/paywall');
                }, 1000);
            }, 800);
        } else {
            // If low rating, just move on (or could ask for feedback form)
            setTimeout(() => {
                router.push('/(onboarding)/paywall');
            }, 800);
        }
    };

    return (
        <OnboardingLayout
            showProgressBar={false}
            progress={1.0}
            showNextButton={false} // We handle nav automatically or via "Not now"
        >
            <View style={styles.container}>
                <Animated.View entering={FadeInDown.delay(200)} style={styles.content}>
                    {/* Social Proof Badge */}
                    <View style={styles.socialProofBadge}>
                        <View style={styles.avatarsRow}>
                            {/* Placeholder avatars - using colors/icons if no images available */}
                            {[1, 2, 3].map((i) => (
                                <View key={i} style={[styles.avatarPlaceholder, { backgroundColor: i === 1 ? '#fca5a5' : i === 2 ? '#86efac' : '#93c5fd' }]}>
                                    <Text style={styles.avatarText}>{i === 1 ? 'S' : i === 2 ? 'M' : 'J'}</Text>
                                </View>
                            ))}
                        </View>
                        <Text style={styles.socialProofText}>Join 50,000+ Happy Parents</Text>
                    </View>

                    <OnboardingTitle style={styles.title}>How is your experience so far?</OnboardingTitle>
                    <OnboardingBody style={styles.subtitle}>
                        We're helping thousands of families build better habits.
                    </OnboardingBody>

                    {/* Stars */}
                    <View style={styles.starsContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity
                                key={star}
                                onPress={() => handleRating(star)}
                                activeOpacity={0.7}
                            >
                                <Animated.View entering={ZoomIn.delay(300 + (star * 100))}>
                                    <Ionicons
                                        name={star <= rating ? "star" : "star-outline"}
                                        size={48}
                                        color="#fbbf24" // amber-400
                                        style={styles.starIcon}
                                    />
                                </Animated.View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Testimonial */}
                    <Animated.View entering={FadeIn.delay(800)} style={styles.testimonialCard}>
                        <Text style={styles.testimonialText}>
                            "This app completely changed our bedtime routine. No more tantrums!"
                        </Text>
                        <View style={styles.testimonialAuthor}>
                            <Ionicons name="star" size={14} color="#fbbf24" />
                            <Ionicons name="star" size={14} color="#fbbf24" />
                            <Ionicons name="star" size={14} color="#fbbf24" />
                            <Ionicons name="star" size={14} color="#fbbf24" />
                            <Ionicons name="star" size={14} color="#fbbf24" />
                            <Text style={styles.authorName}>— Emily R.</Text>
                        </View>
                    </Animated.View>

                </Animated.View>

                <TouchableOpacity
                    onPress={() => router.push('/(onboarding)/paywall')}
                    style={styles.skipButton}
                >
                    <Text style={styles.skipText}>Not now</Text>
                </TouchableOpacity>

            </View>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingTop: OnboardingTheme.Spacing.xl,
    },
    content: {
        alignItems: 'center',
        width: '100%',
    },
    socialProofBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3e8ff', // primary-50
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 9999,
        marginBottom: OnboardingTheme.Spacing.lg,
    },
    avatarsRow: {
        flexDirection: 'row',
        marginRight: 12,
    },
    avatarPlaceholder: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'white',
        marginLeft: -8,
        // First one shouldn't have negative margin ideally, but this stacks them
    },
    avatarText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: 'white',
    },
    socialProofText: {
        color: OnboardingTheme.Colors.Primary,
        fontWeight: 'bold',
        fontSize: 12,
    },
    title: {
        textAlign: 'center',
        marginBottom: OnboardingTheme.Spacing.sm,
    },
    subtitle: {
        textAlign: 'center',
        color: OnboardingTheme.Colors.TextSecondary,
        marginBottom: OnboardingTheme.Spacing.xl * 1.5,
    },
    starsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: OnboardingTheme.Spacing.xl * 2,
    },
    starIcon: {
        shadowColor: '#fbbf24',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },
    testimonialCard: {
        backgroundColor: '#f9fafb', // gray-50
        padding: OnboardingTheme.Spacing.lg,
        borderRadius: OnboardingTheme.Radius.lg,
        width: '100%',
        alignItems: 'center',
    },
    testimonialText: {
        textAlign: 'center',
        fontStyle: 'italic',
        color: '#4b5563', // gray-600
        marginBottom: OnboardingTheme.Spacing.md,
        fontSize: 14,
        lineHeight: 20,
    },
    testimonialAuthor: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    authorName: {
        marginLeft: 8,
        fontWeight: 'bold',
        color: '#374151', // gray-700
        fontSize: 12,
    },
    skipButton: {
        marginTop: 'auto',
        padding: 16,
    },
    skipText: {
        color: OnboardingTheme.Colors.TextSecondary,
        fontWeight: '500',
    },
});
