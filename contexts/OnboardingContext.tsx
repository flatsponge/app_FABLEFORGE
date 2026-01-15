import React, { createContext, useContext, useState, ReactNode, useEffect, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    ONBOARDING_STORAGE_KEY,
    clearPersistedOnboardingData,
    loadPersistedOnboardingData,
} from '../lib/onboardingStorage';

type OnboardingData = {
    childName: string;
    childAge: string;
    childBirthMonth?: number;
    childBirthYear?: number;
    gender: 'boy' | 'girl' | '';
    childPersonality: string[];
    primaryGoal: string[];
    goalsTimeline: string;
    parentingStyle: string;
    parentChallenges: string[];
    parentReaction: string[];
    previousAttempts: string;
    dailyRoutine: string;
    readingTime: string;
    storyLength: string;
    storyThemes: string[];
    struggleBehavior: string;
    aggressionTarget?: string;
    aggressionFrequency?: string;
    triggerSituations: string[];
    struggleAreas: string[];
    struggleFrequency: string;
    moralSharing: string;
    moralHonesty: string;
    moralPatience: string;
    moralKindness: string;
    moralScore: number;
    avatarId: string;
    lockedCosmeticClicked: boolean;
    audioEnabled: boolean;
    mascotName?: string;
    generatedMascotId?: string;
    generatedMascotUrl?: string;
    mascotJobId?: string;
    email?: string;
    trafficSource?: string;
    referralCode?: string;
    vocabularyPreference?: 'behind' | 'average' | 'advanced';
};

type OnboardingContextType = {
    data: OnboardingData;
    updateData: (updates: Partial<OnboardingData>) => void;
    clearOnboardingData: () => Promise<void>;
    isLoaded: boolean;
    hasPersistedData: boolean;
};

const defaultData: OnboardingData = {
    childName: '',
    childAge: '',
    gender: '',
    childPersonality: [],
    primaryGoal: [],
    goalsTimeline: '',
    parentingStyle: '',
    parentChallenges: [],
    parentReaction: [],
    previousAttempts: '',
    dailyRoutine: '',
    readingTime: '',
    storyLength: '',
    storyThemes: [],
    struggleBehavior: '',
    triggerSituations: [],
    struggleAreas: [],
    struggleFrequency: '',
    moralSharing: '',
    moralHonesty: '',
    moralPatience: '',
    moralKindness: '',
    moralScore: 50,
    avatarId: 'bears',
    lockedCosmeticClicked: false,
    audioEnabled: false,
    mascotName: '',
    generatedMascotId: undefined,
    generatedMascotUrl: undefined,
    mascotJobId: undefined,
    email: undefined,
    vocabularyPreference: undefined,
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<OnboardingData>(defaultData);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasPersistedData, setHasPersistedData] = useState(false);
    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const loadPersistedData = async () => {
            try {
                const stored = await loadPersistedOnboardingData();
                if (stored) {
                    const parsed = JSON.parse(stored) as Partial<OnboardingData>;
                    setData({ ...defaultData, ...parsed });
                    setHasPersistedData(true);
                }
            } catch (error) {
                console.warn('Failed to load onboarding progress:', error);
            } finally {
                setIsLoaded(true);
            }
        };
        loadPersistedData();
    }, []);

    const saveToStorage = useCallback((dataToSave: OnboardingData) => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
        saveTimeoutRef.current = setTimeout(async () => {
            try {
                await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(dataToSave));
            } catch (error) {
                console.warn('Failed to save onboarding progress:', error);
            }
        }, 300);
    }, []);

    const updateData = useCallback((updates: Partial<OnboardingData>) => {
        setData((prev) => {
            const newData = { ...prev, ...updates };
            saveToStorage(newData);
            return newData;
        });
        setHasPersistedData(true);
    }, [saveToStorage]);

    const clearOnboardingData = useCallback(async () => {
        try {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
            await clearPersistedOnboardingData();
            setData(defaultData);
            setHasPersistedData(false);
        } catch (error) {
            console.warn('Failed to clear onboarding progress:', error);
        }
    }, []);

    return (
        <OnboardingContext.Provider value={{ data, updateData, clearOnboardingData, isLoaded, hasPersistedData }}>
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
