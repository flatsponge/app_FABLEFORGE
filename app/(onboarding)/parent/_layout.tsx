import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import { ArrowLeft } from 'lucide-react-native';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const PROGRESS = 1.0;

export default function ParentLayout() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    
    const progressWidth = useSharedValue(PROGRESS * 100);

    React.useEffect(() => {
        progressWidth.value = withTiming(PROGRESS * 100, { duration: 300 });
    }, []);

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
