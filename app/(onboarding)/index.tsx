import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useConvexAuth } from 'convex/react';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { getResumeStep, hasOnboardingProgress, SPLASH_PATH } from '../../lib/onboardingFlow';

export default function OnboardingIndex() {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useConvexAuth();
    const { data, isLoaded, hasPersistedData } = useOnboarding();

    useEffect(() => {
        if (isLoading || !isLoaded) return;
        
        if (isAuthenticated) {
            router.replace('/(tabs)');
            return;
        }
        
        if (hasPersistedData && hasOnboardingProgress(data)) {
            router.replace(getResumeStep(data) as typeof SPLASH_PATH);
        } else {
            router.replace('/(onboarding)/splash');
        }
    }, [isAuthenticated, isLoading, isLoaded, hasPersistedData, data, router]);

    return (
        <View style={styles.container}>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FDFBF7',
    },
});
