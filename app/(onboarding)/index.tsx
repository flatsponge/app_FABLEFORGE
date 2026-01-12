import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useConvexAuth } from 'convex/react';

export default function OnboardingIndex() {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useConvexAuth();

    useEffect(() => {
        if (isLoading) return;
        router.replace(isAuthenticated ? '/(tabs)' : '/(onboarding)/splash');
    }, [isAuthenticated, isLoading, router]);

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
