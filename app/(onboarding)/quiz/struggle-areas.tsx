import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody, OnboardingSubtitle } from '../../../components/OnboardingTypography';
import OnboardingOptionCard from '../../../components/OnboardingOptionCard';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const ICON_COLOR = '#6b7280';

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
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
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
                                    <Ionicons name={area.icon as any} size={24} color={ICON_COLOR} />
                                </View>
                            }
                        />
                    ))}
                </View>
            </ScrollView>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: OnboardingTheme.Spacing.xl,
    },
    optionsContainer: {
        marginTop: OnboardingTheme.Spacing.md,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
    },
});
