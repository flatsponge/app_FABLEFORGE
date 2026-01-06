import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody, OnboardingSubtitle } from '../../../components/OnboardingTypography';
import OnboardingOptionCard from '../../../components/OnboardingOptionCard';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

const ICON_COLOR = '#6b7280';

const LENGTHS = [
    { id: 'quick', label: '2-3 minutes', description: 'Quick and focused', icon: 'flash-outline' },
    { id: 'medium', label: '5-7 minutes', description: 'Perfect for bedtime', icon: 'book-outline' },
    { id: 'long', label: '10-15 minutes', description: 'Deep story experience', icon: 'library-outline' },
    { id: 'varies', label: 'Depends on the day', description: 'Flexibility is key', icon: 'options-outline' },
];

export default function StoryLengthScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
    };

    const handleNext = () => {
        if (selected) {
            router.push('/(onboarding)/quiz/story-themes');
        }
    };

    return (
        <OnboardingLayout
            progress={0.3}
            showNextButton={!!selected}
            onNext={handleNext}
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>How long should stories be?</OnboardingTitle>
                <OnboardingBody>
                    We'll adjust the story length to fit.
                </OnboardingBody>

                <View style={styles.optionsContainer}>
                    {LENGTHS.map((length) => (
                        <OnboardingOptionCard
                            key={length.id}
                            title={length.label}
                            description={length.description}
                            selected={selected === length.id}
                            onPress={() => handleSelect(length.id)}
                            icon={
                                <View style={styles.iconContainer}>
                                    <Ionicons name={length.icon as any} size={24} color={ICON_COLOR} />
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
        backgroundColor: '#f3f4f6',
    },
});
