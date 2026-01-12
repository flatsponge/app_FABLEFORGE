import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function OnboardingIndex() {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#7c3aed" />
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
