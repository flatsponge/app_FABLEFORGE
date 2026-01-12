import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import OnboardingSingleSelect, { SelectOption } from '../../../components/OnboardingSingleSelect';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const REACTIONS: SelectOption[] = [
    { id: 'calm', title: 'I try to stay calm', icon: 'happy-outline' },
    { id: 'explain', title: 'I explain why it\'s wrong', icon: 'chatbox-ellipses-outline' },
    { id: 'comfort', title: 'I offer a hug or comfort', icon: 'heart-outline' },
    { id: 'yell', title: 'I sometimes raise my voice', icon: 'megaphone-outline' },
    { id: 'give_in', title: 'I give in to keep the peace', icon: 'flag-outline' },
    { id: 'negotiate', title: 'I negotiate or offer a deal', icon: 'shuffle-outline' },
    { id: 'time_out', title: 'I use time-outs', icon: 'timer-outline' },
    { id: 'hide_frustration', title: 'I get frustrated but try to hide it', icon: 'eye-off-outline' },
    { id: 'distract', title: 'I suggest a different activity', icon: 'phone-portrait-outline' },
];

export default function ParentGuiltScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
    };

    const handleNext = () => {
        if (selected) {
            updateData({ parentReaction: selected });
            router.push('/(onboarding)/quiz/commitment');
        }
    };

    return (
        <OnboardingLayout
            showProgressBar={false} skipTopSafeArea progress={0.8}
            showNextButton={!!selected}
            isScrollable={true}
            onNext={handleNext}
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>Be honest: how do you usually react?</OnboardingTitle>
                <OnboardingBody>
                    There's no judgment here—this is a safe space.
                </OnboardingBody>

                <OnboardingSingleSelect
                    options={REACTIONS}
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
