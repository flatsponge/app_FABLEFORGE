import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingScreen } from '../../../components/OnboardingScreen';
import { SelectionCard } from '../../../components/SelectionCard';
import { useOnboarding } from '../../../contexts/OnboardingContext';

const TARGETS = [
    { id: 'sibling', title: 'Siblings', icon: 'people' },
    { id: 'parent', title: 'Parents', icon: 'home' },
    { id: 'peer', title: 'Friends / Peers', icon: 'school' },
    { id: 'objects', title: 'Toys / Objects', icon: 'cube' },
];

export default function AggressionDetailsScreen() {
    const router = useRouter();
    const { updateData } = useOnboarding();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
        updateData({ aggressionTarget: id });
        setTimeout(() => {
            router.push('/(onboarding)/quiz/aggression-frequency');
        }, 300);
    };

    return (
        <OnboardingScreen
            title="Who is this aggression usually directed toward?"
            subtitle="Understanding the trigger helps us script the solution."
            currentStep={4}
            totalSteps={12}
        >
            <View className="pb-8">
                {TARGETS.map((target, index) => (
                    <SelectionCard
                        key={target.id}
                        index={index}
                        title={target.title}
                        icon={target.icon as any}
                        selected={selected === target.id}
                        onPress={() => handleSelect(target.id)}
                    />
                ))}
            </View>
        </OnboardingScreen>
    );
}
