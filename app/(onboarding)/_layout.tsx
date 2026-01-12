import React from 'react';
import { Stack } from 'expo-router';
import { useOnboardingResume } from '../../hooks/useOnboardingResume';

function OnboardingResumeTracker() {
    useOnboardingResume();
    return null;
}

export default function OnboardingLayout() {
    return (
        <>
            <OnboardingResumeTracker />
            <Stack
                screenOptions={{
                    headerShown: false,
                    animation: 'fade',
                    animationDuration: 280,
                    gestureEnabled: false,
                }}
            />
        </>
    );
}
