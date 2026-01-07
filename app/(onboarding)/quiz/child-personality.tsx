import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody, OnboardingSubtitle } from '../../../components/OnboardingTypography';
import OnboardingOptionCard from '../../../components/OnboardingOptionCard';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const ICON_COLOR = '#6b7280';

const TRAITS = [
    { id: 'shy', label: 'Shy / Reserved', icon: 'eye-off-outline' },
    { id: 'outgoing', label: 'Outgoing / Social', icon: 'people-outline' },
    { id: 'sensitive', label: 'Sensitive / Emotional', icon: 'heart-outline' },
    { id: 'stubborn', label: 'Strong-willed', icon: 'shield-outline' },
    { id: 'curious', label: 'Curious / Explorer', icon: 'search-outline' },
    { id: 'anxious', label: 'Anxious / Worried', icon: 'cloud-outline' },
    { id: 'energetic', label: 'High Energy', icon: 'flash-outline' },
    { id: 'calm', label: 'Calm / Easy-going', icon: 'leaf-outline' },
];

export default function ChildPersonalityScreen() {
    const router = useRouter();
    const { data } = useOnboarding();
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
            showProgressBar={false} progress={0.2}
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
                    {TRAITS.map((trait) => (
                        <OnboardingOptionCard
                            key={trait.id}
                            title={trait.label}
                            selected={selected.includes(trait.id)}
                            onPress={() => toggleSelection(trait.id)}
                            icon={
                                <View style={styles.iconContainer}>
                                    <Ionicons name={trait.icon as any} size={24} color={ICON_COLOR} />
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
        marginTop: OnboardingTheme.Spacing.md,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
    },
});
