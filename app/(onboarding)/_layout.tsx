import React from 'react';
import { Stack } from 'expo-router';
import { OnboardingProvider } from '../../contexts/OnboardingContext';

export default function OnboardingLayout() {
    return (
        <OnboardingProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                    animation: 'fade',
                    animationDuration: 280,
                    gestureEnabled: false,
                }}
            />
        </OnboardingProvider>
    );
}
