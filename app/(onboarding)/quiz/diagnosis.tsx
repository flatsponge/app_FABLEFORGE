import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import OnboardingSingleSelect, { SelectOption } from '../../../components/OnboardingSingleSelect';


const BEHAVIORS: (SelectOption & { severity: string })[] = [
    { id: 'arguing', title: 'Verbal Defiance', description: 'Argues back or refuses to listen', icon: 'chatbox-ellipses', severity: 'common' },
    { id: 'aggression', title: 'Physical Aggression', description: 'Hitting, throwing, or biting', icon: 'hand-left', severity: 'urgent' },
    { id: 'shut_down', title: 'Shuts Down', description: 'Goes silent or ignores you', icon: 'moon', severity: 'moderate' },
    { id: 'tantrums', title: 'Big Tantrums', description: 'Crying, screaming, emotional meltdowns', icon: 'thunderstorm', severity: 'urgent' },
];

export default function DiagnosisScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
        updateData({ struggleBehavior: id });
    };

    const handleNext = () => {
        if (selected) {
            if (selected === 'aggression') {
                router.push('/(onboarding)/quiz/aggression-details');
            } else {
                router.push('/(onboarding)/quiz/trigger-situations');
            }
        }
    };


    return (
        <OnboardingLayout
            showProgressBar={false} skipTopSafeArea progress={0.5}
            showNextButton={!!selected}
            onNext={handleNext}
            nextLabel="Continue"
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>How does your child typically handle frustration?</OnboardingTitle>
                <OnboardingBody>
                    This helps us identify their primary coping mechanism.
                </OnboardingBody>

                <OnboardingSingleSelect
                    options={BEHAVIORS}
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