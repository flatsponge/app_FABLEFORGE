import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import OnboardingOptionCard from '../../../components/OnboardingOptionCard';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const PERSONALITIES = [
    { id: 'sensitive', label: 'Sensitive & Empathetic', icon: 'heart-outline' },
    { id: 'energetic', label: 'High Energy & Active', icon: 'flash-outline' },
    { id: 'strong_willed', label: 'Strong-willed & Determined', icon: 'flower-outline' },
    { id: 'curious', label: 'Curious & Analytical', icon: 'search-outline' },
    { id: 'social', label: 'Social & Outgoing', icon: 'people-outline' },
    { id: 'cautious', label: 'Cautious & Observant', icon: 'eye-outline' },
    { id: 'imaginative', label: 'Creative & Imaginative', icon: 'color-palette-outline' },
];

export default function ChildPersonalityScreen() {
    const router = useRouter();
    const { data, updateData } = useOnboarding();
    const [selected, setSelected] = useState<string[]>([]);

    const toggleSelection = (id: string) => {
        setSelected(prev =>
            prev.includes(id)
                ? prev.filter(x => x !== id)
                : [...prev, id]
        );
    };

    const canProceed = selected.length >= 1;

    const handleNext = () => {
        if (canProceed) {
            router.push('/(onboarding)/quiz/daily-routine');
        }
    };

    return (
        <OnboardingLayout
            showProgressBar={false} progress={0.15}
            onNext={handleNext}
            nextLabel="Continue"
            isScrollable={true}
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>Describe {data.childName || 'your child'}</OnboardingTitle>
                <OnboardingBody>
                    Select all that apply.
                </OnboardingBody>

                <View style={styles.optionsContainer}>
                    {PERSONALITIES.map((trait) => (
                        <OnboardingOptionCard
                            key={trait.id}
                            title={trait.label}
                            selected={selected.includes(trait.id)}
                            onPress={() => toggleSelection(trait.id)}
                            icon={
                                <View style={styles.iconContainer}>
                                    <Ionicons name={trait.icon as any} size={24} color={OnboardingTheme.Colors.IconColor} />
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
});
