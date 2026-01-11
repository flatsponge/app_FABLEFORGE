import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import OnboardingSingleSelect, { SelectOption } from '../../../components/OnboardingSingleSelect';

const SOURCES: SelectOption[] = [
    { id: 'friend', title: 'Friend', icon: 'people-outline' },
    { id: 'influencer', title: 'Influencer', icon: 'star-outline' },
    { id: 'youtube', title: 'YouTube', icon: 'logo-youtube' },
    { id: 'reddit', title: 'Reddit', icon: 'logo-reddit' },
    { id: 'twitter', title: 'Twitter', icon: 'logo-twitter' },
    { id: 'instagram', title: 'Instagram', icon: 'logo-instagram' },
    { id: 'other', title: 'Other', icon: 'ellipsis-horizontal-outline' },
];

export default function TrafficSourceScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
        updateData({ trafficSource: id });
    };

    const handleNext = () => {
        if (selected === 'friend' || selected === 'influencer') {
            router.push('/(onboarding)/quiz/referral-code');
        } else {
            router.push('/(onboarding)/quiz/child-name');
        }
    };

    return (
        <OnboardingLayout
            showProgressBar={false}
            skipTopSafeArea
            onNext={handleNext}
            nextLabel="Continue"
            showNextButton={!!selected}
            isScrollable={true}
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>How did you hear about us?</OnboardingTitle>
                <OnboardingBody>This helps us understand how to reach more families like yours.</OnboardingBody>

                <OnboardingSingleSelect
                    options={SOURCES}
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
