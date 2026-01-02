import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingScreen } from '../../components/OnboardingScreen';
import { SelectionCard } from '../../components/SelectionCard';
import { useOnboarding } from '../../contexts/OnboardingContext';

const GOALS = [
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
        setTimeout(() => {
            router.push('/(onboarding)/quiz/child-name');
        }, 300);
    };

    return (
        <OnboardingScreen
            title="What is your ultimate goal for your child?"
            subtitle="We'll tailor the stories to help them grow in this direction."
            currentStep={1}
            totalSteps={12}
            showBack={false}
        >
            <View className="pb-8">
                {GOALS.map((goal, index) => (
                    <SelectionCard
                        key={goal.id}
                        index={index}
                        title={goal.title}
                        description={goal.description}
                        icon={goal.icon as any}
                        selected={selected === goal.id}
                        onPress={() => handleSelect(goal.id)}
                    />
                ))}
            </View>
        </OnboardingScreen>
    );
}
