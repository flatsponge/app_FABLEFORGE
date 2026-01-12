import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useConvexAuth } from 'convex/react';
import { useOnboarding } from '../../contexts/OnboardingContext';

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
        
        if (hasPersistedData && data.resumePath && data.resumePath !== '/(onboarding)' && data.resumePath !== '/(onboarding)/index') {
            router.replace(data.resumePath as any);
        } else {
            router.replace('/(onboarding)/splash');
        }
    }, [isAuthenticated, isLoading, isLoaded, hasPersistedData, data.resumePath, router]);

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
