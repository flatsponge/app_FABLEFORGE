import React from 'react';
import { Stack } from 'expo-router';
import { useOnboardingResume } from '../../hooks/useOnboardingResume';
import { OnboardingProvider } from '../../contexts/OnboardingContext';

function OnboardingResumeTracker() {
    useOnboardingResume();
    return null;
}

export default function OnboardingLayout() {
    return (
        <OnboardingProvider>
            <OnboardingResumeTracker />
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
