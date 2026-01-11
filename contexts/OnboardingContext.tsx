import React, { createContext, useContext, useState, ReactNode, useEffect, useRef, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';

const STORAGE_KEY = 'onboarding_progress';

type OnboardingData = {
    // Child info
    childName: string;
    childAge: string;
    childBirthMonth?: number;
    childBirthYear?: number;
    gender: 'boy' | 'girl' | '';
    childPersonality: string[];
    // Goals & timeline
    primaryGoal: string[];
    goalsTimeline: string;
    // Parenting
    parentingStyle: string;
    parentChallenges: string[];
    parentReaction: string;
    previousAttempts: string;
    // Daily routine & reading
    dailyRoutine: string;
    readingTime: string;
    storyLength: string;
    storyThemes: string[];
    // Behavior & struggles
    struggleBehavior: string;
    aggressionTarget?: string;
    aggressionFrequency?: string;
    triggerSituations: string[];
    struggleAreas: string[];
    struggleFrequency: string;
    // Moral baseline ratings (1-5 scale)
    moralSharing: string;
    moralHonesty: string;
    moralPatience: string;
    moralKindness: string;
    moralScore: number; // Calculated average * 20
    // Avatar (existing)
    avatarId: string;
    lockedCosmeticClicked: boolean;
    audioEnabled: boolean;
    // Mascot Name
    mascotName?: string;
    // Generated mascot (AI-generated character)
    generatedMascotId?: string;
    generatedMascotUrl?: string;
    // Email (for teaser lookup after auth)
    email?: string;
    // User acquisition tracking
    trafficSource?: string;
    referralCode?: string;
};

type OnboardingContextType = {
    data: OnboardingData;
    updateData: (updates: Partial<OnboardingData>) => void;
    nextStep: () => void;
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
    parentReaction: '',
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
    email: undefined,
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<OnboardingData>(defaultData);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasPersistedData, setHasPersistedData] = useState(false);
    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Load persisted data on mount
    useEffect(() => {
        const loadPersistedData = async () => {
            try {
                const stored = await SecureStore.getItemAsync(STORAGE_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored) as Partial<OnboardingData>;
                    // Merge with defaults to handle any new fields
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

    // Debounced save to SecureStore
    const saveToStorage = useCallback((dataToSave: OnboardingData) => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
        saveTimeoutRef.current = setTimeout(async () => {
            try {
                await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(dataToSave));
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
    }, [saveToStorage]);

    const clearOnboardingData = useCallback(async () => {
        try {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
            await SecureStore.deleteItemAsync(STORAGE_KEY);
            setData(defaultData);
            setHasPersistedData(false);
        } catch (error) {
            console.warn('Failed to clear onboarding progress:', error);
        }
    }, []);

    const nextStep = () => { };

    return (
        <OnboardingContext.Provider value={{ data, updateData, nextStep, clearOnboardingData, isLoaded, hasPersistedData }}>
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

