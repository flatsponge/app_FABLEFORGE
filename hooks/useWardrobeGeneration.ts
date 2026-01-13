import { useEffect, useRef, useCallback } from 'react';
import { useAction, useMutation, useQuery } from 'convex/react';
import { Asset } from 'expo-asset';
import { Image as ExpoImage } from 'expo-image';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useCachedValue } from '@/hooks/useCachedValue';
import { CACHE_KEYS, saveCache } from '@/lib/queryCache';
import {
    clearPendingWardrobe,
    loadPendingWardrobe,
    PendingWardrobe,
    savePendingWardrobe,
} from '@/lib/wardrobePending';
import { BASE_AVATARS, HATS, OUTFITS, TOYS } from '@/constants/data';
import { useOnboardingLocalData } from '@/hooks/useOnboardingLocalData';

const PROCESSING_STALE_MS = 10 * 60 * 1000;

type PendingWardrobeResult = {
    success: boolean;
    storageId?: Id<'_storage'>;
    imageUrl?: string;
    accessoryType?: 'hat' | 'toy';
    originalMascotId?: Id<'_storage'>;
};

export interface UseWardrobeGenerationOptions {
    /** Reading progress percentage (0-100) */
    progress: number;
    /** Total number of pages */
    totalPages: number;
}

/**
 * Hook that triggers wardrobe generation when reading progress reaches 90%.
 * This runs the mascot outfit generation as a side effect.
 */
export function useWardrobeGeneration({
    progress,
    totalPages,
}: UseWardrobeGenerationOptions): void {
    const pendingGenerationRef = useRef(false);

    const liveMascotOutfit = useQuery(api.onboarding.getMascotOutfit);
    const { data: mascotOutfit } = useCachedValue(CACHE_KEYS.mascotOutfit, liveMascotOutfit);
    const onboardingData = useOnboardingLocalData();
    const avatarId = onboardingData?.avatarId || 'bears';

    const addClothesToMascot = useAction(api.imageGeneration.addClothesToMascot);
    const addAccessoryToMascot = useAction(api.imageGeneration.addAccessoryToMascot);
    const generateUploadUrl = useAction(api.imageGeneration.generateUploadUrl);
    const unlockWardrobe = useMutation(api.onboarding.unlockWardrobe);

    const uploadLocalImageToConvex = useCallback(
        async (imageSource: number): Promise<Id<'_storage'>> => {
            const asset = Asset.fromModule(imageSource);
            await asset.downloadAsync();

            if (!asset.localUri) {
                throw new Error('Failed to get local URI for asset');
            }

            const uploadUrl = await generateUploadUrl();
            const response = await fetch(asset.localUri);
            const blob = await response.blob();

            const uploadResponse = await fetch(uploadUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': blob.type || 'image/png',
                },
                body: blob,
            });

            if (!uploadResponse.ok) {
                throw new Error('Failed to upload image to Convex');
            }

            const { storageId } = await uploadResponse.json();
            return storageId as Id<'_storage'>;
        },
        [generateUploadUrl]
    );

    const applyPendingWardrobe = useCallback(
        async (pending: PendingWardrobe): Promise<PendingWardrobeResult> => {
            try {
                let mascotStorageId: Id<'_storage'> | undefined;
                if (!mascotOutfit?.originalMascotId) {
                    const baseAvatar =
                        BASE_AVATARS.find((avatar) => avatar.id === avatarId) ?? BASE_AVATARS[0];
                    if (baseAvatar?.image) {
                        mascotStorageId = await uploadLocalImageToConvex(baseAvatar.image);
                    }
                }

                const resolvedOriginalId = mascotOutfit?.originalMascotId ?? mascotStorageId;

                if (pending.type === 'clothes') {
                    const item = OUTFITS.find((outfit) => outfit.id === pending.itemId);
                    if (!item?.image) {
                        console.error('Clothes image not found:', pending.itemId);
                        return { success: false };
                    }

                    const clothesImageStorageId = await uploadLocalImageToConvex(item.image);
                    const result = await addClothesToMascot({
                        clothesId: pending.itemId,
                        clothesDescription: item.aiDescription ?? `a ${pending.itemId}`,
                        clothesImageStorageId,
                        mascotStorageId,
                    });
                    return {
                        success: result.success,
                        storageId: result.storageId,
                        imageUrl: result.imageUrl,
                        originalMascotId: resolvedOriginalId,
                    };
                }

                const hatItem = HATS.find((hat) => hat.id === pending.itemId);
                const toyItem = TOYS.find((toy) => toy.id === pending.itemId);
                const accessoryItem = hatItem ?? toyItem;
                const resolvedType = pending.accessoryType ?? (hatItem ? 'hat' : 'toy');

                if (!accessoryItem?.image) {
                    console.error('Accessory image not found:', pending.itemId);
                    return { success: false };
                }

                const accessoryImageStorageId = await uploadLocalImageToConvex(accessoryItem.image);
                const result = await addAccessoryToMascot({
                    accessoryId: pending.itemId,
                    accessoryType: resolvedType,
                    accessoryDescription: accessoryItem.aiDescription ?? `a ${pending.itemId}`,
                    accessoryImageStorageId,
                    mascotStorageId,
                });
                return {
                    success: result.success,
                    storageId: result.storageId,
                    imageUrl: result.imageUrl,
                    accessoryType: resolvedType,
                    originalMascotId: resolvedOriginalId,
                };
            } catch (error) {
                console.error('Failed to apply pending wardrobe:', error);
                return { success: false };
            }
        },
        [addAccessoryToMascot, addClothesToMascot, avatarId, mascotOutfit?.originalMascotId, uploadLocalImageToConvex]
    );

    const persistMascotUpdate = useCallback(
        async (pending: PendingWardrobe, result: PendingWardrobeResult) => {
            if (!result.storageId || !result.imageUrl) {
                return;
            }

            type MascotOutfitCache = NonNullable<typeof mascotOutfit>;

            const now = Date.now();
            const accessoryType =
                pending.type === 'accessory'
                    ? result.accessoryType ?? pending.accessoryType ?? null
                    : null;

            const nextMascotOutfit: MascotOutfitCache = {
                originalMascotId:
                    mascotOutfit?.originalMascotId ?? result.originalMascotId ?? result.storageId,
                clothedMascotId:
                    pending.type === 'clothes' ? result.storageId : mascotOutfit?.clothedMascotId ?? null,
                currentMascotId: result.storageId,
                currentMascotUrl: result.imageUrl,
                equippedClothes: pending.type === 'clothes' ? pending.itemId : mascotOutfit?.equippedClothes ?? null,
                equippedAccessory: pending.type === 'accessory' ? pending.itemId : null,
                equippedAccessoryType: pending.type === 'accessory' ? accessoryType : null,
                generationHistory: [
                    ...(mascotOutfit?.generationHistory ?? []),
                    {
                        itemType: pending.type === 'clothes' ? 'clothes' : accessoryType ?? 'accessory',
                        itemId: pending.itemId,
                        storageId: result.storageId,
                        generatedAt: now,
                    },
                ],
            };

            await saveCache(CACHE_KEYS.mascotOutfit, nextMascotOutfit);
            ExpoImage.prefetch(result.imageUrl, { cachePolicy: 'disk' }).catch(() => {
                // Ignore prefetch errors.
            });
        },
        [mascotOutfit]
    );

    useEffect(() => {
        if (progress < 90 || totalPages <= 0 || pendingGenerationRef.current) {
            return;
        }

        let isActive = true;

        const runPendingGeneration = async () => {
            let pending = await loadPendingWardrobe();
            if (!isActive || !pending) {
                return;
            }

            const alreadyApplied =
                (pending.type === 'clothes' && mascotOutfit?.equippedClothes === pending.itemId) ||
                (pending.type === 'accessory' && mascotOutfit?.equippedAccessory === pending.itemId);

            if (alreadyApplied) {
                await clearPendingWardrobe();
                return;
            }

            if (pending.status === 'processing') {
                const statusAt = pending.statusAt ?? pending.createdAt;
                if (Date.now() - statusAt <= PROCESSING_STALE_MS) {
                    return;
                }
                pending = {
                    ...pending,
                    status: 'queued',
                    statusAt: Date.now(),
                };
                await savePendingWardrobe(pending);
            }

            pendingGenerationRef.current = true;
            const processing: PendingWardrobe = {
                ...pending,
                status: 'processing',
                statusAt: Date.now(),
            };
            await savePendingWardrobe(processing);

            const result = await applyPendingWardrobe(processing);
            if (!isActive) {
                return;
            }

            if (result.success) {
                await persistMascotUpdate(processing, result);
                await clearPendingWardrobe();
                unlockWardrobe()
                    .then(() => {
                        console.log('Wardrobe unlocked!');
                    })
                    .catch((error) => {
                        console.error('Failed to unlock wardrobe:', error);
                    });
            } else {
                await savePendingWardrobe({
                    ...processing,
                    status: 'queued',
                    statusAt: Date.now(),
                });
            }
        };

        runPendingGeneration()
            .catch((error) => {
                console.error('Failed to generate pending wardrobe:', error);
            })
            .finally(() => {
                pendingGenerationRef.current = false;
            });

        return () => {
            isActive = false;
        };
    }, [progress, totalPages, applyPendingWardrobe, unlockWardrobe, mascotOutfit, persistMascotUpdate]);
}
