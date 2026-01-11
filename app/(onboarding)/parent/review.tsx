import React from 'react';
import { View, StyleSheet, Text, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const TESTIMONIALS = [
    {
        id: 1,
        name: "Sarah J.",
        role: "Mom of 2",
        text: "It used to take 45 mins to put him to bed. Now he asks for StoryTime and is asleep in 10 minutes!",
        stars: 5,
        color: "#dcfce7", // green-100
        iconColor: "#16a34a" // green-600
    },
    {
        id: 2,
        name: "Michael T.",
        role: "Dad of 5-year-old",
        text: "The personalized stories are magic. He actually listens to the lessons about sharing because the hero is HIM.",
        stars: 5,
        color: "#dbeafe", // blue-100
        iconColor: "#2563eb" // blue-600
    },
    {
        id: 3,
        name: "Jessica L.",
        role: "Mom of 3",
        text: "Finally, screen time I don't feel guilty about. It's calming, educational, and brings us closer together.",
        stars: 5,
        color: "#f3e8ff", // purple-100
        iconColor: "#9333ea" // purple-600
    }
];

export default function ReviewScreen() {
    const router = useRouter();

    const handleNext = () => {
        router.push('/(onboarding)/parent/results-intro');
    };

    return (
        <OnboardingLayout
            showProgressBar={false}
            progress={1.0}
            onNext={handleNext}
            nextLabel="View My Analysis"
            isScrollable={true}
        >
            <View style={styles.container}>
                {/* Header Section */}
                <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
                    <View style={styles.ratingBadge}>
                        <Ionicons name="star" size={16} color="#b45309" />
                        <Text style={styles.ratingText}>4.9/5 Average Rating</Text>
                    </View>
                    
                    <OnboardingTitle style={styles.title}>
                        Join 50,000+ Happy Parents
                    </OnboardingTitle>
                    
                    <OnboardingBody style={styles.subtitle}>
                        You're in good company. Families everywhere are finding peace and connection with StoryTime.
                    </OnboardingBody>

                    {/* Big Stars Visual */}
                    <View style={styles.bigStarsContainer}>
                        {[1, 2, 3, 4, 5].map((star, index) => (
                            <Animated.View 
                                key={star} 
                                entering={FadeInUp.delay(400 + (index * 100))}
                            >
                                <Ionicons name="star" size={32} color="#fbbf24" style={styles.starShadow} />
                            </Animated.View>
                        ))}
                    </View>
                </Animated.View>

                {/* Testimonials List */}
                <View style={styles.testimonialsContainer}>
                    {TESTIMONIALS.map((item, index) => (
                        <Animated.View 
                            key={item.id}
                            entering={FadeInDown.delay(800 + (index * 200))}
                            style={styles.card}
                        >
                            <View style={[styles.quoteIcon, { backgroundColor: item.color }]}>
                                <Ionicons name="chatbox-ellipses" size={16} color={item.iconColor} />
                            </View>
                            <View style={styles.cardContent}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.authorName}>{item.name}</Text>
                                    <View style={styles.cardStars}>
                                        {[...Array(item.stars)].map((_, i) => (
                                            <Ionicons key={i} name="star" size={12} color="#fbbf24" />
                                        ))}
                                    </View>
                                </View>
                                <Text style={styles.authorRole}>{item.role}</Text>
                                <Text style={styles.cardText}>"{item.text}"</Text>
                            </View>
                        </Animated.View>
                    ))}
                </View>

                {/* Bottom Trust Badge */}
                <Animated.View entering={FadeInDown.delay(1400)} style={styles.trustBadge}>
                    <Ionicons name="shield-checkmark" size={16} color={OnboardingTheme.Colors.TextSecondary} />
                    <Text style={styles.trustText}>Verified Reviews from App Store</Text>
                </Animated.View>

            </View>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingTop: OnboardingTheme.Spacing.md,
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: OnboardingTheme.Spacing.xl,
        width: '100%',
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fef3c7', // amber-100
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 9999,
        marginBottom: OnboardingTheme.Spacing.md,
        gap: 6,
    },
    ratingText: {
        color: '#b45309', // amber-700
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
        maxWidth: '90%',
    },
    bigStarsContainer: {
        flexDirection: 'row',
        gap: 8,
        marginTop: OnboardingTheme.Spacing.lg,
    },
    starShadow: {
        shadowColor: '#fbbf24',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    testimonialsContainer: {
        width: '100%',
        gap: 16,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: OnboardingTheme.Radius.lg,
        padding: 16,
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: OnboardingTheme.Colors.Border,
    },
    quoteIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    cardContent: {
        flex: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
    },
    authorName: {
        fontWeight: 'bold',
        fontSize: 14,
        color: OnboardingTheme.Colors.Text,
    },
    authorRole: {
        fontSize: 12,
        color: OnboardingTheme.Colors.TextSecondary,
        marginBottom: 8,
    },
    cardStars: {
        flexDirection: 'row',
        gap: 2,
    },
    cardText: {
        fontSize: 14,
        color: '#4b5563', // gray-600
        lineHeight: 20,
        fontStyle: 'italic',
    },
    trustBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 12,
        gap: 6,
        opacity: 0.7,
    },
    trustText: {
        fontSize: 12,
        color: OnboardingTheme.Colors.TextSecondary,
    },
});
