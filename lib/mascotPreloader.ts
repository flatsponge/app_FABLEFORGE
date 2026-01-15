import { Image as ExpoImage } from 'expo-image';
import { CACHE_KEYS, saveCache } from '@/lib/queryCache';
import { Id } from '@/convex/_generated/dataModel';

type MascotOutfitData = {
    originalMascotId: Id<'_storage'>;
    clothedMascotId: Id<'_storage'> | null;
    currentMascotId: Id<'_storage'>;
    currentMascotUrl: string | null;
    equippedClothes: string | null;
    equippedAccessory: string | null;
    equippedAccessoryType: 'hat' | 'toy' | null;
    generationHistory: Array<{
        itemType: string;
        itemId: string;
        storageId: Id<'_storage'>;
        generatedAt: number;
    }>;
};

/**
 * Preload mascot outfit data to async storage cache and prefetch image to disk.
 * Call this after mascot generation completes in onboarding or when prefetching on home screen.
 */
export async function preloadMascotOutfit(
    mascotOutfit: MascotOutfitData
): Promise<void> {
    // 1. Save to AsyncStorage cache
    await saveCache(CACHE_KEYS.mascotOutfit, mascotOutfit);

    // 2. Prefetch image to disk cache
    if (mascotOutfit.currentMascotUrl) {
        try {
            await ExpoImage.prefetch(mascotOutfit.currentMascotUrl, { cachePolicy: 'disk' });
        } catch {
            // Ignore prefetch errors - non-critical operation
        }
    }
}

/**
 * Prefetch just the mascot image URL without updating cache.
 * Useful when you have the URL but not full outfit data.
 */
export async function prefetchMascotImage(imageUrl: string): Promise<void> {
    try {
        await ExpoImage.prefetch(imageUrl, { cachePolicy: 'disk' });
    } catch {
        // Ignore prefetch errors - non-critical operation
    }
}
