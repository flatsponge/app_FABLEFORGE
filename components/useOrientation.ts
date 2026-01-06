import { useState, useEffect, useCallback } from 'react';
import { Dimensions } from 'react-native';

// Try to import expo-screen-orientation (not available in Expo Go)
let ScreenOrientation: typeof import('expo-screen-orientation') | null = null;
try {
    ScreenOrientation = require('expo-screen-orientation');
} catch {
    // Module not available in Expo Go - rotation features will be disabled
    console.warn('expo-screen-orientation not available - rotation disabled');
}

export type OrientationType = 'portrait' | 'landscape';

export interface OrientationState {
    orientation: OrientationType;
    width: number;
    height: number;
    isLandscape: boolean;
    isPortrait: boolean;
}

/**
 * Hook for managing screen orientation with rotation support.
 * 
 * @param allowRotation - If true, unlocks rotation on mount and locks back to portrait on unmount.
 *                        If false (default), keeps current orientation behavior.
 * @returns Orientation state with current dimensions and helpers
 * 
 * Note: In Expo Go, rotation control is disabled but dimension tracking still works.
 */
export function useOrientation(allowRotation = false): OrientationState {
    const [dimensions, setDimensions] = useState(() => {
        const { width, height } = Dimensions.get('window');
        return { width, height };
    });

    const getOrientation = useCallback((width: number, height: number): OrientationType => {
        return width > height ? 'landscape' : 'portrait';
    }, []);

    const [orientation, setOrientation] = useState<OrientationType>(() =>
        getOrientation(dimensions.width, dimensions.height)
    );

    useEffect(() => {
        const handleOrientationChange = async () => {
            if (allowRotation && ScreenOrientation) {
                // Unlock all orientations when this screen is active
                await ScreenOrientation.unlockAsync();
            }
        };

        handleOrientationChange();

        // Subscribe to dimension changes
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setDimensions({ width: window.width, height: window.height });
            setOrientation(getOrientation(window.width, window.height));
        });

        // Cleanup: lock back to portrait when leaving this screen
        return () => {
            subscription.remove();
            if (allowRotation && ScreenOrientation) {
                ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(() => {
                    // Silently ignore if lock fails
                });
            }
        };
    }, [allowRotation, getOrientation]);

    return {
        orientation,
        width: dimensions.width,
        height: dimensions.height,
        isLandscape: orientation === 'landscape',
        isPortrait: orientation === 'portrait',
    };
}

/**
 * Locks the screen to portrait orientation.
 * Use this on app startup or for screens that should never rotate.
 * 
 * Note: No-op in Expo Go.
 */
export async function lockToPortrait(): Promise<void> {
    if (ScreenOrientation) {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    }
}

/**
 * Unlocks screen rotation to allow all orientations.
 * 
 * Note: No-op in Expo Go.
 */
export async function unlockRotation(): Promise<void> {
    if (ScreenOrientation) {
        await ScreenOrientation.unlockAsync();
    }
}
