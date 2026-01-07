import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import OnboardingMultiSelect, { SelectOption } from '../../../components/OnboardingMultiSelect';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const CHALLENGES: SelectOption[] = [
    { id: 'time', title: 'Not enough time', icon: 'time-outline' },
    { id: 'consistency', title: 'Staying consistent', icon: 'calendar-outline' },
    { id: 'engagement', title: 'Keeping them engaged', icon: 'bulb-outline' },
    { id: 'tantrums', title: 'Managing tantrums', icon: 'thunderstorm-outline' },
    { id: 'communication', title: 'Getting them to talk', icon: 'chatbubbles-outline' },
    { id: 'patience', title: 'My own patience', icon: 'leaf-outline' },
    { id: 'partner', title: 'Co-parenting alignment', icon: 'people-outline' },
    { id: 'screen', title: 'Screen time battles', icon: 'phone-portrait-outline' },
];

export default function ParentChallengesScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
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
            router.push('/(onboarding)/quiz/diagnosis');
        }
    };

    return (
        <OnboardingLayout
            showProgressBar={false} skipTopSafeArea progress={0.45}
            onNext={handleNext}
            nextLabel="Continue"
            isScrollable={true}
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>What's your biggest parenting challenge right now?</OnboardingTitle>
                <OnboardingBody>
                    Select all that apply.
                </OnboardingBody>

                <OnboardingMultiSelect
                    options={CHALLENGES}
                    selectedValues={selected}
                    onToggle={toggleSelection}
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
