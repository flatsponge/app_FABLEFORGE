import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import OnboardingMultiSelect, { SelectOption } from '../../../components/OnboardingMultiSelect';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';
import { Ionicons } from '@expo/vector-icons';

const GOALS: SelectOption[] = [
    { id: 'resilience', title: 'Emotional Resilience', description: 'Help them handle big feelings better', icon: 'heart' },
    { id: 'moral', title: 'Strong Moral Compass', description: 'Teach honesty, sharing, and kindness', icon: 'compass' },
    { id: 'leadership', title: 'Leadership Skills', description: 'Build confidence and decision making', icon: 'ribbon' },
    { id: 'agency', title: 'Healthy Independence', description: 'Encourage responsibility and self-care', icon: 'bicycle' },
    { id: 'social', title: 'Social Skills', description: 'Improve friendship and communication', icon: 'people' },
    { id: 'creativity', title: 'Creativity', description: 'Foster imagination and innovation', icon: 'color-palette' },
    { id: 'academic', title: 'Academic Success', description: 'Support learning and focus', icon: 'school' },
    { id: 'focus', title: 'Focus & Discipline', description: 'Develop concentration and self-control', icon: 'glasses' },
];

export default function OnboardingStart() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const [selected, setSelected] = useState<string[]>([]);

    const handleToggle = (id: string) => {
        const newSelection = selected.includes(id)
            ? selected.filter(item => item !== id)
            : [...selected, id];
        setSelected(newSelection);
        updateData({ primaryGoal: newSelection });
    };

    const handleNext = () => {
        if (selected.length > 0) {
            router.push('/(onboarding)/quiz/child-name');
        }
    };

    return (
        <OnboardingLayout
            showProgressBar={false}
            skipTopSafeArea
            progress={0.05}
            showNextButton={selected.length > 0}
            onNext={handleNext}
            nextLabel="Continue"
            isScrollable={true}
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>What is your ultimate goal for your child?</OnboardingTitle>
                <OnboardingBody>
                    We'll tailor the stories to help them grow in this direction.
                    Select all that apply.
                </OnboardingBody>

                <OnboardingMultiSelect
                    options={GOALS}
                    selectedValues={selected}
                    onToggle={handleToggle}
                    showCheckbox={true}
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