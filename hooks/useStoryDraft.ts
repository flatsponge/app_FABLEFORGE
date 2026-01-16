import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Friend, PresetLocation, StoryLength, VoicePreset } from '@/types';
import { FocusValue } from '@/app/(tabs)/create';

// Re-defining these types locally to avoid circular dependencies if they aren't exported shared types
// ideally these should be imported from a shared types file
type StudioMode = 'creative' | 'situation' | 'auto';
type StoryVibe = 'energizing' | 'soothing' | 'whimsical' | 'thoughtful';

const STORAGE_KEY = 'story_draft_v1';

interface StoryDraftState {
    prompt: string;
    studioMode: StudioMode;
    storyLength: StoryLength;
    storyVibe: StoryVibe;
    overrideLocation: PresetLocation | null;
    overrideCharacter: Friend | null;
    overrideValue: FocusValue | null;
    overrideVoice: VoicePreset | null;
    showElements: boolean;
    showRemix: boolean;
}

const DEFAULT_STATE: StoryDraftState = {
    prompt: '',
    studioMode: 'creative',
    storyLength: 'medium',
    storyVibe: 'soothing',
    overrideLocation: null,
    overrideCharacter: null,
    overrideValue: null,
    overrideVoice: null,
    showElements: false,
    showRemix: false,
};

export const useStoryDraft = (userDefaultStoryLength?: StoryLength) => {
    const [isLoaded, setIsLoaded] = useState(false);

    // Determine the effective default story length (prefer user's onboarding preference)
    const effectiveDefaultLength = userDefaultStoryLength ?? DEFAULT_STATE.storyLength;

    // State variables
    const [prompt, setPrompt] = useState(DEFAULT_STATE.prompt);
    const [studioMode, setStudioMode] = useState<StudioMode>(DEFAULT_STATE.studioMode);
    const [storyLength, setStoryLength] = useState<StoryLength>(effectiveDefaultLength);
    const [storyVibe, setStoryVibe] = useState<StoryVibe>(DEFAULT_STATE.storyVibe);
    const [overrideLocation, setOverrideLocation] = useState<PresetLocation | null>(DEFAULT_STATE.overrideLocation);
    const [overrideCharacter, setOverrideCharacter] = useState<Friend | null>(DEFAULT_STATE.overrideCharacter);
    const [overrideValue, setOverrideValue] = useState<FocusValue | null>(DEFAULT_STATE.overrideValue);
    const [overrideVoice, setOverrideVoice] = useState<VoicePreset | null>(DEFAULT_STATE.overrideVoice);
    const [showElements, setShowElements] = useState(DEFAULT_STATE.showElements);
    const [showRemix, setShowRemix] = useState(DEFAULT_STATE.showRemix);

    // Load from storage on mount
    useEffect(() => {
        const loadDraft = async () => {
            try {
                const json = await AsyncStorage.getItem(STORAGE_KEY);
                if (json) {
                    const savedState = JSON.parse(json) as StoryDraftState;

                    setPrompt(savedState.prompt ?? DEFAULT_STATE.prompt);
                    setStudioMode(savedState.studioMode ?? DEFAULT_STATE.studioMode);
                    // For story length, only use saved value if it exists; otherwise use effective default
                    setStoryLength(savedState.storyLength ?? effectiveDefaultLength);
                    setStoryVibe(savedState.storyVibe ?? DEFAULT_STATE.storyVibe);
                    setOverrideLocation(savedState.overrideLocation ?? DEFAULT_STATE.overrideLocation);
                    setOverrideCharacter(savedState.overrideCharacter ?? DEFAULT_STATE.overrideCharacter);
                    setOverrideValue(savedState.overrideValue ?? DEFAULT_STATE.overrideValue);
                    setOverrideVoice(savedState.overrideVoice ?? DEFAULT_STATE.overrideVoice);
                    setShowElements(savedState.showElements ?? DEFAULT_STATE.showElements);
                    setShowRemix(savedState.showRemix ?? DEFAULT_STATE.showRemix);
                } else {
                    // No saved draft - ensure story length uses onboarding preference
                    setStoryLength(effectiveDefaultLength);
                }
            } catch (e) {
                console.error('Failed to load story draft', e);
            } finally {
                setIsLoaded(true);
            }
        };

        loadDraft();
    }, [effectiveDefaultLength]);

    // Save to storage whenever state changes
    // Using a ref to prevent saving internal initial renders or before load
    const isMounted = useRef(false);

    useEffect(() => {
        if (!isLoaded) return;

        const saveState = async () => {
            const stateToSave: StoryDraftState = {
                prompt,
                studioMode,
                storyLength,
                storyVibe,
                overrideLocation,
                overrideCharacter,
                overrideValue,
                overrideVoice,
                showElements,
                showRemix,
            };

            try {
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
            } catch (e) {
                console.error('Failed to save story draft', e);
            }
        };

        // Debounce saving slightly could be good, but for now simple effect is fine 
        // given this is local only and infrequent high-frequency typing might ideally be debounced
        // but AsyncStorage is async anyway.
        const timeoutId = setTimeout(saveState, 500);
        return () => clearTimeout(timeoutId);
    }, [
        isLoaded,
        prompt,
        studioMode,
        storyLength,
        storyVibe,
        overrideLocation,
        overrideCharacter,
        overrideValue,
        overrideVoice,
        showElements,
        showRemix
    ]);

    const clearDraft = useCallback(async () => {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
            // Reset local state to defaults
            setPrompt(DEFAULT_STATE.prompt);
            setStudioMode(DEFAULT_STATE.studioMode);
            setStoryLength(DEFAULT_STATE.storyLength);
            setStoryVibe(DEFAULT_STATE.storyVibe);
            setOverrideLocation(DEFAULT_STATE.overrideLocation);
            setOverrideCharacter(DEFAULT_STATE.overrideCharacter);
            setOverrideValue(DEFAULT_STATE.overrideValue);
            setOverrideVoice(DEFAULT_STATE.overrideVoice);
            setShowElements(DEFAULT_STATE.showElements);
            setShowRemix(DEFAULT_STATE.showRemix);
        } catch (e) {
            console.error('Failed to clear story draft', e);
        }
    }, []);

    return {
        isLoaded,
        prompt, setPrompt,
        studioMode, setStudioMode,
        storyLength, setStoryLength,
        storyVibe, setStoryVibe,
        overrideLocation, setOverrideLocation,
        overrideCharacter, setOverrideCharacter,
        overrideValue, setOverrideValue,
        overrideVoice, setOverrideVoice,
        showElements, setShowElements,
        showRemix, setShowRemix,
        clearDraft,
    };
};
