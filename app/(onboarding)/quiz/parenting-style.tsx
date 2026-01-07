import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import OnboardingOptionCard from '../../../components/OnboardingOptionCard';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const STYLES = [
    { id: 'authoritative', label: 'Balanced', description: 'Clear rules with warmth and flexibility', icon: 'scale-outline' },
    { id: 'permissive', label: 'Relaxed', description: 'Few rules, lots of freedom', icon: 'water-outline' },
    { id: 'strict', label: 'Structured', description: 'Clear expectations and consequences', icon: 'grid-outline' },
    { id: 'helicopter', label: 'Protective', description: 'Very involved in every decision', icon: 'shield-outline' },
    { id: 'unsure', label: 'Still figuring it out', description: 'Every day is different', icon: 'help-circle-outline' },
];

export default function ParentingStyleScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
    };

    const handleNext = () => {
        if (selected) {
            router.push('/(onboarding)/quiz/child-personality');
        }
    };

    return (
        <OnboardingLayout
            showProgressBar={false} skipTopSafeArea progress={0.25}
            showNextButton={!!selected}
            onNext={handleNext}
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>How would you describe your parenting style?</OnboardingTitle>
                <OnboardingBody>
                    No judgment—just helps us tailor the approach.
                </OnboardingBody>

                <View style={styles.optionsContainer}>
                    {STYLES.map((style) => (
                        <OnboardingOptionCard
                            key={style.id}
                            title={style.label}
                            description={style.description}
                            selected={selected === style.id}
                            showCheckbox={false}
                            onPress={() => handleSelect(style.id)}
                            icon={
                                <View style={styles.iconContainer}>
                                    <Ionicons name={style.icon as any} size={24} color={OnboardingTheme.Colors.IconColor} />
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
