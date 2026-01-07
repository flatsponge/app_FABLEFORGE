import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import OnboardingSingleSelect, { SelectOption } from '../../../components/OnboardingSingleSelect';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const LENGTHS: SelectOption[] = [
    { id: 'quick', title: '2-3 minutes', description: 'Quick and focused', icon: 'flash-outline' },
    { id: 'medium', title: '5-7 minutes', description: 'Perfect for bedtime', icon: 'book-outline' },
    { id: 'long', title: '10-15 minutes', description: 'Deep story experience', icon: 'library-outline' },
    { id: 'varies', title: 'Depends on the day', description: 'Flexibility is key', icon: 'options-outline' },
];

export default function StoryLengthScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
    };

    const handleNext = () => {
        if (selected) {
            router.push('/(onboarding)/quiz/story-themes');
        }
    };

    return (
        <OnboardingLayout
            showProgressBar={false} skipTopSafeArea progress={0.3}
            showNextButton={!!selected}
            onNext={handleNext}
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>How long should stories be?</OnboardingTitle>
                <OnboardingBody>
                    We'll adjust the story length to fit.
                </OnboardingBody>

                <OnboardingSingleSelect
                    options={LENGTHS}
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
