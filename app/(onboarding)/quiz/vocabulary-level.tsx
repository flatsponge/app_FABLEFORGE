import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import { useQuizFooter } from '../../../contexts/QuizFooterContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import OnboardingSingleSelect, { SelectOption } from '../../../components/OnboardingSingleSelect';

type VocabularyPreferenceId = 'behind' | 'average' | 'advanced';

const VOCABULARY_OPTIONS: SelectOption[] = [
    { 
        id: 'behind', 
        title: 'Learning new words every day',
        description: 'We\'ll use simpler words to build confidence',
        icon: 'leaf-outline',
    },
    { 
        id: 'average', 
        title: 'Right on track for their age',
        description: 'We\'ll match vocabulary to their age group',
        icon: 'checkmark-circle-outline',
    },
    { 
        id: 'advanced', 
        title: 'Loves big words and stories',
        description: 'We\'ll include richer vocabulary to challenge them',
        icon: 'star-outline',
    },
];

export default function VocabularyLevelScreen() {
    const router = useRouter();
    const { data, updateData } = useOnboarding();
    const { setFooter } = useQuizFooter();
    const [selectedLevel, setSelectedLevel] = useState<VocabularyPreferenceId | null>(
        data.vocabularyPreference || null
    );

    const canProceed = selectedLevel !== null;

    const handleNext = () => {
        if (canProceed) {
            updateData({ vocabularyPreference: selectedLevel });
            router.push('/(onboarding)/quiz/parenting-style');
        }
    };

    useEffect(() => {
        setFooter({ onNext: handleNext, nextLabel: 'Continue', showNextButton: canProceed });
    }, [canProceed, selectedLevel]);

    return (
        <OnboardingLayout
            showProgressBar={false}
            skipTopSafeArea
            hideFooter
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>
                    How would you describe {data.childName || 'your child'}'s vocabulary?
                </OnboardingTitle>
                <OnboardingBody>
                    This helps us choose the right words for their stories.
                </OnboardingBody>

                <OnboardingSingleSelect
                    options={VOCABULARY_OPTIONS}
                    selectedId={selectedLevel}
                    onSelect={(id) => setSelectedLevel(id as VocabularyPreferenceId)}
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
