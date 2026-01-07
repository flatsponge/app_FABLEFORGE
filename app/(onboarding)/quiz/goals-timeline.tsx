import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import OnboardingSingleSelect, { SelectOption } from '../../../components/OnboardingSingleSelect';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const TIMELINES: SelectOption[] = [
    { id: 'immediate', title: 'Right away', description: 'We need help now', icon: 'flame-outline' },
    { id: 'month', title: 'Within a month', description: 'Noticeable progress soon', icon: 'calendar-number-outline' },
    { id: 'gradual', title: 'Gradual improvement', description: 'Long-term development', icon: 'leaf-outline' },
    { id: 'unsure', title: 'Not sure yet', description: 'Just exploring options', icon: 'help-circle-outline' },
];

export default function GoalsTimelineScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
    };

    const handleNext = () => {
        if (selected) {
            router.push('/(onboarding)/quiz/parenting-style');
        }
    };

    return (
        <OnboardingLayout
            showProgressBar={false} skipTopSafeArea progress={0.2}
            showNextButton={!!selected}
            onNext={handleNext}
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>How quickly do you want to see changes?</OnboardingTitle>
                <OnboardingBody>
                    This helps us set realistic milestones.
                </OnboardingBody>

                <OnboardingSingleSelect
                    options={TIMELINES}
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
