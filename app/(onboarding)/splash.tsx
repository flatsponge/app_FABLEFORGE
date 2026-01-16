
import React, { useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
    FadeInDown,
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
    withDelay,
} from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OnboardingTheme } from '../../constants/OnboardingTheme';
import OnboardingButton from '../../components/OnboardingButton';

export default function SplashScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const scale = useSharedValue(1);
    const buttonsOpacity = useSharedValue(0);

    useEffect(() => {
        scale.value = withRepeat(
            withSequence(
                withTiming(1.05, { duration: 2000 }),
                withTiming(1, { duration: 2000 })
            ),
            -1,
            true
        );
        // Fade in buttons with opacity instead of entering animation
        buttonsOpacity.value = withDelay(600, withTiming(1, { duration: 600 }));
    }, [buttonsOpacity]);

    const animatedIconStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const buttonsStyle = useAnimatedStyle(() => ({
        opacity: buttonsOpacity.value,
    }));

    const handleGetStarted = () => {
        router.push('/(onboarding)/intro/slide-0');
    };

    const handleLogin = () => {
        router.push('/(onboarding)/auth/login-email');
    };

    const handleSkip = () => {
        router.replace('/(tabs)');
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <StatusBar style="dark" />

            {/* Header / Skip */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleSkip} style={styles.skipButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.logoContainer}>
                    <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
                        <Image
                            source={require('../../assets/appiconnew.png')}
                            style={styles.appIcon}
                            resizeMode="contain"
                        />
                    </Animated.View>
                    <Text style={styles.appName}>FableTales</Text>
                    <Text style={styles.tagline}>Where imagination comes to life.</Text>
                </Animated.View>
            </View>

            {/* Footer Actions */}
            <View style={styles.footer}>
                <Animated.View style={[styles.buttonContainer, buttonsStyle]}>
                    <OnboardingButton
                        title="Get Started"
                        onPress={handleGetStarted}
                        variant="primary"
                    />
                    <OnboardingButton
                        title="I already have an account"
                        onPress={handleLogin}
                        variant="secondary"
                        textStyle={{ fontSize: 16 }}
                    />
                </Animated.View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: OnboardingTheme.Colors.Background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: OnboardingTheme.Spacing.lg,
        paddingVertical: OnboardingTheme.Spacing.md,
    },
    skipButton: {
        padding: 4,
    },
    skipText: {
        color: OnboardingTheme.Colors.TextSecondary,
        fontSize: 14,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: OnboardingTheme.Spacing.lg,
    },
    logoContainer: {
        alignItems: 'center',
        gap: OnboardingTheme.Spacing.md,
    },
    iconContainer: {
        marginBottom: OnboardingTheme.Spacing.sm,
    },
    appIcon: {
        width: 180,
        height: 180,
    },
    appName: {
        ...OnboardingTheme.Typography.Title,
        fontSize: 40,
        color: OnboardingTheme.Colors.Primary,
    },
    tagline: {
        ...OnboardingTheme.Typography.Body,
        textAlign: 'center',
        color: OnboardingTheme.Colors.TextSecondary,
        fontSize: 18,
    },
    footer: {
        paddingHorizontal: OnboardingTheme.Spacing.lg,
        paddingBottom: OnboardingTheme.Spacing.xl,
    },
    buttonContainer: {
        gap: OnboardingTheme.Spacing.md,
        width: '100%',
    },
});
