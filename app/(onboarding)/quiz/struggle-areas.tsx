import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import OnboardingOptionCard from '../../../components/OnboardingOptionCard';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const STRUGGLE_AREAS = [
    { id: 'sharing', label: 'Sharing toys & belongings', icon: 'gift-outline' },
    { id: 'honesty', label: 'Telling the truth', icon: 'chatbubble-outline' },
    { id: 'patience', label: 'Waiting their turn', icon: 'hourglass-outline' },
    { id: 'responsibility', label: 'Cleaning up after themselves', icon: 'home-outline' },
    { id: 'gratitude', label: 'Saying thank you', icon: 'hand-left-outline' },
    { id: 'teamwork', label: 'Playing nicely with others', icon: 'people-outline' },
    { id: 'bravery', label: 'Trying new things', icon: 'rocket-outline' },
    { id: 'problem_solving', label: 'Handling disappointment', icon: 'sad-outline' },
];

export default function StruggleAreasScreen() {
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
            router.push('/(onboarding)/quiz/struggle-frequency');
        }
    };

    return (
        <OnboardingLayout
            showProgressBar={false} progress={0.7}
            onNext={handleNext}
            nextLabel="Continue"
            isScrollable={true}
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>Where does your child struggle most?</OnboardingTitle>
                <OnboardingBody>
                    Select all that apply.
                </OnboardingBody>

                <View style={styles.optionsContainer}>
                    {STRUGGLE_AREAS.map((area) => (
                        <OnboardingOptionCard
                            key={area.id}
                            title={area.label}
                            selected={selected.includes(area.id)}
                            onPress={() => toggleSelection(area.id)}
                            icon={
                                <View style={styles.iconContainer}>
                                    <Ionicons name={area.icon as any} size={24} color={OnboardingTheme.Colors.IconColor} />
                                </View>
                            }
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
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: OnboardingTheme.Colors.IconBackground,
    },
});
