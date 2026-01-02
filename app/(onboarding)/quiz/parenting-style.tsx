import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody, OnboardingSubtitle } from '../../../components/OnboardingTypography';
import OnboardingOptionCard from '../../../components/OnboardingOptionCard';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const STYLES = [
    { id: 'authoritative', label: 'Balanced', description: 'Clear rules with warmth and flexibility', emoji: '⚖️' },
    { id: 'permissive', label: 'Relaxed', description: 'Few rules, lots of freedom', emoji: '🌊' },
    { id: 'strict', label: 'Structured', description: 'Clear expectations and consequences', emoji: '📐' },
    { id: 'helicopter', label: 'Protective', description: 'Very involved in every decision', emoji: '🚁' },
    { id: 'unsure', label: 'Still figuring it out', description: 'Every day is different', emoji: '🤔' },
];

export default function ParentingStyleScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
        // updateData({ parentingStyle: id }); // Update context if available
        setTimeout(() => {
            router.push('/(onboarding)/quiz/child-personality');
        }, 300);
    };

    return (
        <OnboardingLayout
            progress={0.25}
            showNextButton={false}
        >
            <View style={styles.contentContainer}>
                <OnboardingSubtitle>Step 4</OnboardingSubtitle>
                <OnboardingTitle>How would you describe your parenting style?</OnboardingTitle>
                <OnboardingBody>
                    No judgment—just helps us tailor the approach.
                </OnboardingBody>

                <View style={styles.optionsContainer}>
                    {STYLES.map((style) => (
                        <OnboardingOptionCard
                            key={style.id}
                            title={style.label}
                            subtitle={style.description}
                            selected={selected === style.id}
                            onPress={() => handleSelect(style.id)}
                            icon={<View><OnboardingBody style={{ fontSize: 24 }}>{style.emoji}</OnboardingBody></View>}
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
});