import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import { ArrowLeft } from 'lucide-react-native';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const PROGRESS_MAP: Record<string, number> = {
    'child-name': 0.05,
    'child-age': 0.10,
    'child-gender': 0.12,
    'goals-timeline': 0.15,
    'parenting-style': 0.20,
    'child-personality': 0.25,
    'daily-routine': 0.30,
    'reading-time': 0.35,
    'story-length': 0.40,
    'story-themes': 0.45,
    'previous-attempts': 0.50,
    'parent-challenges': 0.55,
    'diagnosis': 0.60,
    'aggression-details': 0.65,
    'aggression-frequency': 0.70,
    'trigger-situations': 0.65,
    'struggle-areas': 0.75,
    'struggle-frequency': 0.80,
    'moral-baseline': 0.85,
    'parent-guilt': 0.90,
    'commitment': 0.95,
    'softening': 1.0,
};

export default function QuizLayout() {
    const router = useRouter();
    const segments = useSegments();
    const insets = useSafeAreaInsets();

    const currentRoute = segments[segments.length - 1] || 'child-name';

    const progress = PROGRESS_MAP[currentRoute] || 0.1;

    const progressWidth = useSharedValue(progress * 100);

    React.useEffect(() => {
        progressWidth.value = withTiming(progress * 100, { duration: 300 });
    }, [progress]);

    const progressStyle = useAnimatedStyle(() => {
        return {
            width: `${progressWidth.value}%`,
            backgroundColor: OnboardingTheme.Colors.Primary,
        };
    });

    return (
        <View style={[styles.container, { backgroundColor: OnboardingTheme.Colors.Background }]}>
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <ArrowLeft size={24} color={OnboardingTheme.Colors.Text} />
                </TouchableOpacity>

                <View style={styles.progressContainer}>
                    <View style={[styles.progressBarBackground, { backgroundColor: '#E5E7EB' }]}>
                        <Animated.View style={[styles.progressBarFill, progressStyle]} />
                    </View>
                </View>
                <View style={{ width: 24 + OnboardingTheme.Spacing.md }} />
            </View>

            <Stack
                screenOptions={{
                    headerShown: false,
                    animation: 'fade',
                    animationDuration: 280,
                    contentStyle: { backgroundColor: 'transparent' },
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: OnboardingTheme.Spacing.lg,
        paddingBottom: OnboardingTheme.Spacing.md,
    },
    backButton: {
        marginRight: OnboardingTheme.Spacing.md,
    },
    progressContainer: {
        flex: 1,
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarBackground: {
        flex: 1,
        borderRadius: 3,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 3,
    },
});
