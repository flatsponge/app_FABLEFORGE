import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import OnboardingOptionCard from '../../../components/OnboardingOptionCard';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const TARGETS = [
    { id: 'sibling', title: 'Siblings', icon: 'people' },
    { id: 'parent', title: 'Parents', icon: 'home' },
    { id: 'peer', title: 'Friends / Peers', icon: 'school' },
    { id: 'objects', title: 'Toys / Objects', icon: 'cube' },
];

export default function AggressionDetailsScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
        updateData({ aggressionTarget: id });
    };

    const handleNext = () => {
        if (selected) {
            router.push('/(onboarding)/quiz/aggression-frequency');
        }
    };

    return (
        <OnboardingLayout
            showProgressBar={false} skipTopSafeArea progress={0.55}
            showNextButton={!!selected}
            onNext={handleNext}
            nextLabel="Continue"
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>Who is this aggression usually directed toward?</OnboardingTitle>
                <OnboardingBody>
                    Understanding the trigger helps us script the solution.
                </OnboardingBody>

                <View style={styles.optionsContainer}>
                    {TARGETS.map((target) => (
                        <OnboardingOptionCard
                            key={target.id}
                            title={target.title}
                            selected={selected === target.id}
                            onPress={() => handleSelect(target.id)}
                            icon={
                                <View style={[styles.iconContainer, selected === target.id && styles.iconContainerSelected]}>
                                    <Ionicons
                                        name={target.icon as any}
                                        size={24}
                                        color={selected === target.id ? OnboardingTheme.Colors.Primary : OnboardingTheme.Colors.IconColor}
                                    />
                                </View>
                            }
                        />
                    ))}
                </View>
            </View>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        width: '100%',
    },
    optionsContainer: {
        marginTop: OnboardingTheme.Spacing.xl,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: OnboardingTheme.Colors.IconBackground,
    },
    iconContainerSelected: {
        backgroundColor: '#f3e8ff', // primary-100 (approx)
    },
});