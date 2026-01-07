import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

export default function ParentLayout() {
    // Full-screen results experience - no header, no back button, no progress bar
    return (
        <View style={[styles.container, { backgroundColor: OnboardingTheme.Colors.Background }]}>
            <Stack
                screenOptions={{
                    headerShown: false,
                    animation: 'fade',
                    animationDuration: 280,
                    contentStyle: { backgroundColor: 'transparent' },
                    gestureEnabled: false, // Disable swipe back gesture for full-screen impact
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
