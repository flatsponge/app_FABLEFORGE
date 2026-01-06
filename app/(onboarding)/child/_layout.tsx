import React from 'react';
import { Stack } from 'expo-router';

export default function ChildLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'fade',
                animationDuration: 280,
                gestureEnabled: true,
            }}
        />
    );
}
