import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import OnboardingSingleSelect, { SelectOption } from '../../../components/OnboardingSingleSelect';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';
import { Ionicons } from '@expo/vector-icons';

const GOALS: SelectOption[] = [
    { id: 'resilience', title: 'Emotional Resilience', description: 'Help them handle big feelings better', icon: 'heart' },
    { id: 'moral', title: 'Strong Moral Compass', description: 'Teach honesty, sharing, and kindness', icon: 'compass' },
    { id: 'leadership', title: 'Leadership Skills', description: 'Build confidence and decision making', icon: 'ribbon' },
    { id: 'agency', title: 'Healthy Independence', description: 'Encourage responsibility and self-care', icon: 'bicycle' },
];

export default function OnboardingStart() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
        updateData({ primaryGoal: id });
    };

    const handleNext = () => {
        if (selected) {
            router.push('/(onboarding)/quiz/child-name');
        }
    };

    return (
        <OnboardingLayout
            showProgressBar={false}
            skipTopSafeArea
            progress={0.05}
            showNextButton={!!selected}
            onNext={handleNext}
            nextLabel="Continue"
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>What is your ultimate goal for your child?</OnboardingTitle>
                <OnboardingBody>
                    We'll tailor the stories to help them grow in this direction.
                </OnboardingBody>

                <OnboardingSingleSelect
                    options={GOALS}
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