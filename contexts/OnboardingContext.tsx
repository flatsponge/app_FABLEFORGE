import React, { createContext, useContext, useState, ReactNode } from 'react';

type OnboardingData = {
    // Goal
    primaryGoal: string;
    // Assessment
    struggleBehavior: string; // 'arguing', 'aggression', 'shut_down', 'tantrums'
    aggressionTarget?: string;
    aggressionFrequency?: string;
    // Moral Baseline
    moralScore: number;
    // Child
    childName: string;
    childAge: string;
    gender: 'boy' | 'girl';
    avatarId: string;
    lockedCosmeticClicked: boolean;
};

type OnboardingContextType = {
    data: OnboardingData;
    updateData: (updates: Partial<OnboardingData>) => void;
    nextStep: () => void; // Placeholder for navigation logic if needed here
};

const defaultData: OnboardingData = {
    primaryGoal: '',
    struggleBehavior: '',
    moralScore: 50,
    childName: '',
    childAge: '4-5',
    gender: 'boy',
    avatarId: 'hero_1',
    lockedCosmeticClicked: false,
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<OnboardingData>(defaultData);

    const updateData = (updates: Partial<OnboardingData>) => {
        setData((prev) => ({ ...prev, ...updates }));
    };

    const nextStep = () => {
        // Logic to be handled by router, but exposure here helps
    };

    return (
        <OnboardingContext.Provider value={{ data, updateData, nextStep }}>
            {children}
        </OnboardingContext.Provider>
    );
}

export function useOnboarding() {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error('useOnboarding must be used within an OnboardingProvider');
    }
    return context;
}
