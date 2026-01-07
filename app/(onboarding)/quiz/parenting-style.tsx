import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import OnboardingSingleSelect, { SelectOption } from '../../../components/OnboardingSingleSelect';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const STYLES: SelectOption[] = [
    { id: 'authoritative', title: 'Balanced', description: 'Clear rules with warmth and flexibility', icon: 'scale-outline' },
    { id: 'permissive', title: 'Relaxed', description: 'Few rules, lots of freedom', icon: 'water-outline' },
    { id: 'strict', title: 'Structured', description: 'Clear expectations and consequences', icon: 'grid-outline' },
    { id: 'helicopter', title: 'Protective', description: 'Very involved in every decision', icon: 'shield-outline' },
    { id: 'unsure', title: 'Still figuring it out', description: 'Every day is different', icon: 'help-circle-outline' },
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

                <OnboardingSingleSelect
                    options={STYLES}
                    selectedId={selected}
                    onSelect={handleSelect}
                    showCheckbox={false}
                />
            </View>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        width: '100%',
    },
});
