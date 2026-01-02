import React from 'react';
import { Stack } from 'expo-router';

export default function OnboardingLayout() {
    // OnboardingProvider is now in the root _layout.tsx to prevent
    // navigation context issues when state updates cause re-renders.
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                gestureEnabled: false,
            }}
        />
    );
}
