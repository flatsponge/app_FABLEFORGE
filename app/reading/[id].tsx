import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Asset } from 'expo-asset';
import {
  X, ChevronLeft, ChevronRight, RotateCcw, Check, Sparkles, BookOpen,
  Pause, Play, Timer
} from 'lucide-react-native';
import { ReadingMode } from '@/types';
import { useOrientation } from '@/components/useOrientation';
import { useMutation, useQuery, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useCachedValue } from '@/hooks/useCachedValue';
import { CACHE_KEYS, saveCache } from '@/lib/queryCache';
import { clearPendingWardrobe, loadPendingWardrobe, PendingWardrobe, savePendingWardrobe } from '@/lib/wardrobePending';
import { BASE_AVATARS, HATS, OUTFITS, TOYS } from '@/constants/data';
import { useOnboardingLocalData } from '@/hooks/useOnboardingLocalData';

type PageData = {
  _id: string;
  pageIndex: number;
  text: string;
  imageUrl: string | null;
  imageStorageId?: string | null;
};

type PendingWardrobeResult = {
  success: boolean;
  storageId?: Id<"_storage">;
  imageUrl?: string;
  accessoryType?: "hat" | "toy";
  originalMascotId?: Id<"_storage">;
};

const PROCESSING_STALE_MS = 10 * 60 * 1000;

export default function ReadingScreen() {
  const { id, mode: modeParam, restart: restartParam } = useLocalSearchParams<{ id: string; mode?: string; restart?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { isLandscape, width, height } = useOrientation(true);
  
  const liveBook = useQuery(
    api.storyGeneration.getBook,
    id ? { bookId: id as Id<"books"> } : "skip"
  );
  const { data: convexBook } = useCachedValue(
    id ? CACHE_KEYS.book(id) : null,
    liveBook
  );
  const liveMascotOutfit = useQuery(api.onboarding.getMascotOutfit);
  const { data: mascotOutfit } = useCachedValue(CACHE_KEYS.mascotOutfit, liveMascotOutfit);
  const onboardingData = useOnboardingLocalData();
  const avatarId = onboardingData?.avatarId || 'bears';
  
  // Load current page
  const [page, setPage] = useState(0);
  const liveCurrentPageData = useQuery(
    api.storyGeneration.getBookPage,
    id ? { bookId: id as Id<"books">, pageIndex: page } : "skip"
  );
  const { data: currentPageData } = useCachedValue(
    id ? CACHE_KEYS.bookPage(id, page) : null,
    liveCurrentPageData
  );
  
  // Prefetch next page
  const nextPageData = useQuery(
    api.storyGeneration.getBookPage,
    id && convexBook && page < convexBook.pageCount - 1
      ? { bookId: id as Id<"books">, pageIndex: page + 1 }
      : "skip"
  );
  
  // Cache loaded pages - keyed by bookId-pageIndex to avoid cross-book issues
  const pagesCache = useRef<Map<string, PageData>>(new Map());
  const lastBookId = useRef<string | null>(null);
  
  // Clear cache when book changes
  useEffect(() => {
    if (id && id !== lastBookId.current) {
      pagesCache.current.clear();
      lastBookId.current = id;
    }
  }, [id]);
  
  const getCacheKey = (pageIndex: number) => `${id}-${pageIndex}`;
  
  // Update cache when pages load
  useEffect(() => {
    if (currentPageData && id) {
      pagesCache.current.set(getCacheKey(currentPageData.pageIndex), currentPageData as PageData);
    }
  }, [currentPageData, id]);
  
  useEffect(() => {
    if (nextPageData && id) {
      pagesCache.current.set(getCacheKey(nextPageData.pageIndex), nextPageData as PageData);
    }
  }, [nextPageData, id]);
  
  // Get page from cache or current query
  const getPage = useCallback((idx: number): PageData | null => {
    return pagesCache.current.get(getCacheKey(idx)) || (idx === page ? currentPageData as PageData : null);
  }, [page, currentPageData, id]);

  const updateProgress = useMutation(api.storyGeneration.updateBookProgress);
  const rateBookMutation = useMutation(api.storyGeneration.rateBook);
  const triggerTeaserBookGeneration = useAction(api.storyGenerationActions.triggerTeaserBookGeneration);
  const addClothesToMascot = useAction(api.imageGeneration.addClothesToMascot);
  const addAccessoryToMascot = useAction(api.imageGeneration.addAccessoryToMascot);
  const generateUploadUrl = useAction(api.imageGeneration.generateUploadUrl);
  
  // Track if we've triggered generation for this book
  const triggeredGeneration = useRef(false);
  
  // Trigger teaser book page generation on first open
  useEffect(() => {
    if (!convexBook || triggeredGeneration.current) return;
    
    if (convexBook.isTeaserBook && convexBook.teaserBookStatus === 'pending') {
      triggeredGeneration.current = true;
      triggerTeaserBookGeneration({ bookId: id as Id<"books"> }).catch((err) => {
        console.warn('Failed to trigger teaser book generation:', err);
      });
    }
  }, [convexBook, id, triggerTeaserBookGeneration]);
  
  const mode = (modeParam || 'autoplay') as ReadingMode;

  const [showCompletion, setShowCompletion] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(mode === 'autoplay');
  const [canAdvance, setCanAdvance] = useState(true);
  const [rating, setRating] = useState<'up' | 'down' | null>(null);
  const [hasRated, setHasRated] = useState(false);
  
  const pendingGenerationRef = useRef(false);
  const hasUpdatedSkillsRef = useRef(false);
  const hasInitializedPageRef = useRef(false);
  const hasInitializedRatingRef = useRef(false);
  const unlockWardrobe = useMutation(api.onboarding.unlockWardrobe);
  const completeBookAndUpdateSkills = useMutation(api.storyGeneration.completeBookAndUpdateSkills);

  useEffect(() => {
    if (
      convexBook?.lastReadPageIndex !== undefined &&
      convexBook.lastReadPageIndex > 0 &&
      !hasInitializedPageRef.current &&
      restartParam !== 'true'
    ) {
      hasInitializedPageRef.current = true;
      setPage(convexBook.lastReadPageIndex);
    }
  }, [convexBook?.lastReadPageIndex, restartParam]);

  useEffect(() => {
    if (convexBook?.userRating && !hasInitializedRatingRef.current) {
      hasInitializedRatingRef.current = true;
      setRating(convexBook.userRating);
      setHasRated(true);
    }
  }, [convexBook?.userRating]);

  const bookTitle = convexBook?.title || 'Story';
  const coverImage = convexBook?.coverImageUrl;
  const totalPages = convexBook?.pageCount ?? 0;
  
  // Get current page data
  const currentPage = getPage(page);
  const currentText = currentPage?.text ?? '';
  const currentImage = currentPage?.imageUrl ?? coverImage;
  const pageImageCacheKey =
    currentPage?.imageStorageId ??
    (id && currentPage?.imageUrl ? `${id}-page-${currentPage.pageIndex}` : undefined);
  const coverImageCacheKey =
    convexBook?.coverImageStorageId ?? (id && coverImage ? `${id}-cover` : undefined);
  const displayImageCacheKey = pageImageCacheKey ?? coverImageCacheKey;

  const isChildMode = mode === 'child';
  const isParentMode = mode === 'parent';
  const isAutoplayMode = mode === 'autoplay';
  
  const progress = totalPages > 0 ? ((page + 1) / totalPages) * 100 : 0;

  const uploadLocalImageToConvex = useCallback(async (imageSource: number): Promise<Id<"_storage">> => {
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
    return storageId as Id<"_storage">;
  }, [generateUploadUrl]);

  const applyPendingWardrobe = useCallback(async (pending: PendingWardrobe): Promise<PendingWardrobeResult> => {
    try {
      let mascotStorageId: Id<"_storage"> | undefined;
      if (!mascotOutfit?.originalMascotId) {
        const baseAvatar = BASE_AVATARS.find((avatar) => avatar.id === avatarId) ?? BASE_AVATARS[0];
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
  }, [
    addAccessoryToMascot,
    addClothesToMascot,
    avatarId,
    mascotOutfit?.originalMascotId,
    uploadLocalImageToConvex,
  ]);

  const persistMascotUpdate = useCallback(async (pending: PendingWardrobe, result: PendingWardrobeResult) => {
    if (!result.storageId || !result.imageUrl) {
      return;
    }

    type MascotOutfitCache = NonNullable<typeof liveMascotOutfit>;

    const now = Date.now();
    const accessoryType =
      pending.type === 'accessory'
        ? result.accessoryType ?? pending.accessoryType ?? null
        : null;

    const nextMascotOutfit: MascotOutfitCache = {
      originalMascotId: mascotOutfit?.originalMascotId ?? result.originalMascotId ?? result.storageId,
      clothedMascotId:
        pending.type === 'clothes'
          ? result.storageId
          : mascotOutfit?.clothedMascotId ?? null,
      currentMascotId: result.storageId,
      currentMascotUrl: result.imageUrl,
      equippedClothes:
        pending.type === 'clothes'
          ? pending.itemId
          : mascotOutfit?.equippedClothes ?? null,
      equippedAccessory:
        pending.type === 'accessory'
          ? pending.itemId
          : null,
      equippedAccessoryType:
        pending.type === 'accessory'
          ? accessoryType
          : null,
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
  }, [mascotOutfit]);

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

      if (pending.status === "processing") {
        const statusAt = pending.statusAt ?? pending.createdAt;
        if (Date.now() - statusAt <= PROCESSING_STALE_MS) {
          return;
        }
        pending = {
          ...pending,
          status: "queued",
          statusAt: Date.now(),
        };
        await savePendingWardrobe(pending);
      }

      pendingGenerationRef.current = true;
      const processing: PendingWardrobe = {
        ...pending,
        status: "processing",
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
          status: "queued",
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

  // Update child's skill scores when book is completed (100%)
  useEffect(() => {
    if (progress >= 100 && !hasUpdatedSkillsRef.current && id && totalPages > 0) {
      hasUpdatedSkillsRef.current = true;
      completeBookAndUpdateSkills({ bookId: id as Id<"books"> })
        .then((result) => {
          if (result.success && result.skillUpdated) {
            console.log(`Skill updated: ${result.skillUpdated} +${result.pointsAdded} points`);
          }
        })
        .catch((error) => {
          console.error('Failed to update skills:', error);
          hasUpdatedSkillsRef.current = false;
        });
    }
  }, [progress, id, totalPages, completeBookAndUpdateSkills]);

  useEffect(() => {
    if (id && totalPages > 0) {
      updateProgress({
        bookId: id as Id<"books">,
        readingProgress: progress,
        lastReadPageIndex: page,
      }).catch(console.error);
    }
  }, [page, progress, id, totalPages]);

  useEffect(() => {
    if (isChildMode && !showCompletion) {
      setCanAdvance(false);
      const timer = setTimeout(() => setCanAdvance(true), 2000);
      return () => clearTimeout(timer);
    } else {
      setCanAdvance(true);
    }
  }, [page, isChildMode, showCompletion]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isAutoPlaying && !showCompletion && currentText) {
      const readingTime = Math.max(4000, currentText.length * 60);
      timer = setTimeout(() => {
        if (page < totalPages - 1) {
          setPage(p => p + 1);
        } else {
          setIsAutoPlaying(false);
          setShowCompletion(true);
        }
      }, readingTime);
    }
    return () => clearTimeout(timer);
  }, [isAutoPlaying, page, currentText, totalPages, showCompletion]);

  const handleNext = () => {
    if (!canAdvance && isChildMode) return;
    if (page < totalPages - 1) {
      setPage(page + 1);
    } else {
      setShowCompletion(true);
      setIsAutoPlaying(false);
    }
  };

  const handleBack = () => {
    if (page > 0) {
      setPage(page - 1);
      setShowCompletion(false);
    }
  };

  const handleRestart = () => {
    setPage(0);
    setShowCompletion(false);
    setIsAutoPlaying(mode === 'autoplay');
  };

  const handleClose = () => {
    router.back();
  };

  const handleRate = async (newRating: 'up' | 'down') => {
    setRating(newRating);
    setHasRated(true);
    if (id) {
      try {
        await rateBookMutation({
          bookId: id as Id<"books">,
          rating: newRating,
        });
      } catch {
        Alert.alert('Oops!', 'Could not save your rating. Try again?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Retry', onPress: () => handleRate(newRating) },
        ]);
      }
    }
  };

  if (convexBook === undefined) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#a855f7" />
        <Text className="text-slate-500 mt-4">Loading story...</Text>
      </View>
    );
  }

  if (!convexBook) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-slate-500">Book not found</Text>
      </View>
    );
  }

  // Show loading only if current page not ready yet
  const isPageLoading = currentPageData === undefined;

  const coverSize = isLandscape ? { width: width * 0.35, height: height * 0.6 } : { width: 256, height: 192 };
  const contentMinHeight = isLandscape ? height : 380;
  const displayImage = currentImage;

  return (
    <View className="flex-1 bg-slate-900" style={isLandscape ? { flexDirection: 'row' } : undefined}>
      <View style={StyleSheet.absoluteFill}>
        {displayImage ? (
          <ExpoImage
            source={{ uri: displayImage, cacheKey: displayImageCacheKey }}
            style={StyleSheet.absoluteFill}
            cachePolicy="disk"
            contentFit="cover"
            blurRadius={20}
          />
        ) : (
          <View className="flex-1 bg-purple-900" />
        )}
        <View className="absolute inset-0 bg-black/50" />
      </View>

      <View
        className="absolute left-0 right-0 px-6 flex-row justify-between items-center z-50"
        style={{ top: insets.top + 8 }}
      >
        <Pressable
          onPress={handleClose}
          className="w-12 h-12 rounded-full bg-white/20 items-center justify-center active:scale-95"
          accessibilityLabel="Close story"
          accessibilityRole="button"
        >
          <X size={24} color="white" />
        </Pressable>

        {isParentMode && (
          <View className="flex-row items-center gap-1.5 bg-indigo-500/80 px-3 py-1.5 rounded-full">
            <BookOpen size={14} color="white" />
            <Text className="text-white text-xs font-bold">Parent Mode</Text>
          </View>
        )}

        {isAutoPlaying && (
          <View className="flex-row items-center gap-1.5 bg-green-500/80 px-3 py-1.5 rounded-full">
            <View className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <Text className="text-white text-xs font-bold">AUTOPLAY</Text>
          </View>
        )}
      </View>

      {isLandscape ? (
        <View
          className="items-center justify-center z-10"
          style={{ width: width * 0.4, paddingTop: insets.top + 60 }}
        >
          <View
            className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20"
            style={coverSize}
          >
            {displayImage ? (
              <ExpoImage
                source={{ uri: displayImage, cacheKey: displayImageCacheKey }}
                className="w-full h-full"
                cachePolicy="disk"
                contentFit="cover"
              />
            ) : (
              <View className="w-full h-full bg-purple-600 items-center justify-center">
                <BookOpen size={60} color="white" />
              </View>
            )}
          </View>
        </View>
      ) : (
        <View className="absolute top-1/4 left-0 right-0 px-6 items-center">
          <View className="w-64 h-48 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
            {displayImage ? (
              <ExpoImage
                source={{ uri: displayImage, cacheKey: displayImageCacheKey }}
                className="w-full h-full"
                cachePolicy="disk"
                contentFit="cover"
              />
            ) : (
              <View className="w-full h-full bg-purple-600 items-center justify-center">
                <BookOpen size={60} color="white" />
              </View>
            )}
          </View>
        </View>
      )}

      <View
        className={isLandscape ? "flex-1 bg-white" : "absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px]"}
        style={isLandscape
          ? { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16, paddingHorizontal: 24 }
          : { minHeight: contentMinHeight, paddingHorizontal: 24, paddingTop: 32, paddingBottom: insets.bottom + 24 }
        }
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {!showCompletion ? (
            <>
              <View className="flex-row justify-center gap-1.5 mb-6">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <View
                    key={idx}
                    className={`h-1.5 rounded-full ${idx === page ? 'w-6 bg-slate-800' : 'w-1.5 bg-slate-200'}`}
                  />
                ))}
              </View>

              {isPageLoading ? (
                <View className="items-center py-8">
                  <ActivityIndicator size="small" color="#a855f7" />
                </View>
              ) : (
                <Text className="text-2xl font-bold text-slate-800 text-center leading-relaxed mb-8 px-2">
                  {currentText}
                </Text>
              )}

              {isAutoplayMode && (
                <View className="flex-row items-center justify-center gap-4">
                  <Pressable
                    onPress={handleRestart}
                    className="w-14 h-14 rounded-full bg-slate-100 items-center justify-center active:scale-95"
                  >
                    <RotateCcw size={24} color="#64748b" />
                  </Pressable>

                  <View className="flex-1 max-w-[120px] h-2 bg-slate-100 rounded-full overflow-hidden">
                    <View className="h-full bg-indigo-500" style={{ width: `${progress}%` }} />
                  </View>

                  <Pressable
                    onPress={() => setIsAutoPlaying(!isAutoPlaying)}
                    className="w-20 h-20 rounded-3xl bg-indigo-500 items-center justify-center shadow-lg active:scale-95"
                  >
                    {isAutoPlaying ? (
                      <Pause size={32} color="white" fill="white" />
                    ) : (
                      <Play size={32} color="white" fill="white" />
                    )}
                  </Pressable>
                </View>
              )}

              {isChildMode && (
                <View className="flex-row gap-4 h-24">
                  <Pressable
                    onPress={handleBack}
                    disabled={page === 0}
                    className={`flex-1 rounded-3xl items-center justify-center flex-row gap-2 ${page === 0 ? 'bg-slate-100' : 'bg-amber-400'
                      }`}
                    accessibilityLabel="Go to previous page"
                    accessibilityRole="button"
                  >
                    <ChevronLeft size={28} color={page === 0 ? '#cbd5e1' : '#78350f'} strokeWidth={3} />
                    <Text className={`text-xl font-black ${page === 0 ? 'text-slate-300' : 'text-amber-900'}`}>Back</Text>
                  </Pressable>

                  <Pressable
                    onPress={handleNext}
                    disabled={!canAdvance}
                    className={`flex-[2] rounded-3xl items-center justify-center flex-row gap-2 ${!canAdvance ? 'bg-slate-200' : 'bg-emerald-400'
                      }`}
                    accessibilityLabel="Go to next page"
                    accessibilityRole="button"
                  >
                    {!canAdvance ? (
                      <>
                        <Timer size={28} color="#94a3b8" />
                        <Text className="text-xl font-black text-slate-400">Wait...</Text>
                      </>
                    ) : (
                      <>
                        <Text className="text-2xl font-black text-emerald-900">Next</Text>
                        <ChevronRight size={32} color="#064e3b" strokeWidth={3} />
                      </>
                    )}
                  </Pressable>
                </View>
              )}

              {isParentMode && (
                <View className="flex-row items-center justify-between gap-6">
                  <Pressable
                    onPress={handleBack}
                    disabled={page === 0}
                    className={`w-16 h-16 rounded-2xl items-center justify-center border-2 border-slate-100 ${page === 0 ? 'opacity-0' : ''
                      }`}
                    accessibilityLabel="Go to previous page"
                    accessibilityRole="button"
                  >
                    <ChevronLeft size={28} color="#94a3b8" />
                  </Pressable>

                  <View className="flex-1 max-w-[150px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <View className="h-full bg-indigo-500" style={{ width: `${progress}%` }} />
                  </View>

                  <Pressable
                    onPress={handleNext}
                    className="w-20 h-20 rounded-3xl bg-slate-900 items-center justify-center shadow-lg active:scale-95"
                    accessibilityLabel={page === totalPages - 1 ? "Finish story" : "Go to next page"}
                    accessibilityRole="button"
                  >
                    {page === totalPages - 1 ? (
                      <Check size={32} color="white" strokeWidth={3} />
                    ) : (
                      <ChevronRight size={36} color="white" />
                    )}
                  </Pressable>
                </View>
              )}
            </>
          ) : (
            <View className="items-center">
              <View className="w-24 h-24 bg-yellow-100 rounded-full items-center justify-center mb-4">
                <Sparkles size={48} color="#eab308" fill="#eab308" />
              </View>
              <Text className="text-4xl font-black text-slate-800 mb-2">The End!</Text>
              <Text className="text-slate-500 text-lg font-medium mb-8">What a wonderful adventure!</Text>

              {!hasRated ? (
                <View className="w-full mb-8">
                  <Text className="text-center text-slate-600 font-bold text-xl mb-6">
                    Did you like this story?
                  </Text>
                  <View className="flex-row justify-center gap-8">
                    <Pressable
                      onPress={() => handleRate('up')}
                      className="items-center active:scale-95"
                      accessibilityLabel="I liked this story"
                      accessibilityRole="button"
                    >
                      <View className="w-28 h-28 rounded-full bg-green-100 border-8 border-green-300 items-center justify-center mb-3">
                        <Text className="text-6xl">👍</Text>
                      </View>
                      <Text className="text-green-600 font-black text-lg">Yes!</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleRate('down')}
                      className="items-center active:scale-95"
                      accessibilityLabel="I did not like this story"
                      accessibilityRole="button"
                    >
                      <View className="w-28 h-28 rounded-full bg-orange-100 border-8 border-orange-300 items-center justify-center mb-3">
                        <Text className="text-6xl">👎</Text>
                      </View>
                      <Text className="text-orange-600 font-black text-lg">No</Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <View className="w-full mb-8 items-center">
                  <View className="bg-purple-50 px-6 py-4 rounded-2xl border-2 border-purple-200 items-center">
                    <Text className="text-2xl mb-1">
                      {rating === 'up' ? '⭐' : '💜'}
                    </Text>
                    <Text className="text-purple-700 font-bold text-center">
                      {rating === 'up' ? 'Thanks for your feedback!' : 'Thanks! We\'ll find better stories for you!'}
                    </Text>
                  </View>
                </View>
              )}

              <View className="flex-row gap-4 w-full">
                <Pressable
                  onPress={handleRestart}
                  className="flex-1 py-5 rounded-3xl bg-amber-100 border-2 border-amber-300 flex-row items-center justify-center gap-2 active:scale-95"
                  accessibilityLabel="Read the story again"
                  accessibilityRole="button"
                >
                  <RotateCcw size={22} color="#b45309" />
                  <Text className="font-bold text-amber-800 text-base">Read Again</Text>
                </Pressable>
                <Pressable
                  onPress={handleClose}
                  className="flex-1 py-5 rounded-3xl bg-slate-800 items-center justify-center active:scale-95"
                  accessibilityLabel="Finish reading and go back"
                  accessibilityRole="button"
                >
                  <Text className="font-bold text-white text-base">All Done!</Text>
                </Pressable>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
