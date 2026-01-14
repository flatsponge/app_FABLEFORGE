import React, { useState, useEffect, useRef } from 'react';
import { View, Alert } from 'react-native';
import { MotiView } from 'moti';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMutation, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { ReadingMode } from '@/types';
import { useOrientation } from '@/components/useOrientation';
import { TeaserGenerationProgress } from '@/components/TeaserGenerationProgress';
import {
  ReadingLoadingState,
  ReadingBackgroundLayer,
  ReadingCloseButton,
  ReadingImageDisplay,
  StoryTextDisplay,
  ReadingNavigationControls,
  ReadingCompletionScreen,
} from '@/components/reading';
import { useReadingState } from '@/hooks/useReadingState';
import { useWardrobeGeneration } from '@/hooks/useWardrobeGeneration';

export default function ReadingScreen() {
  const { id, mode: modeParam, restart: restartParam } = useLocalSearchParams<{
    id: string;
    mode?: string;
    restart?: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isLandscape, width, height } = useOrientation(true);

  const mode = (modeParam || 'autoplay') as ReadingMode;
  const isChildMode = mode === 'child';

  // Reading state hook
  const {
    page,
    setPage,
    currentText,
    currentImage,
    displayImageCacheKey,
    progress,
    totalPages,
    isPageLoading,
    book,
    isTeaserGenerating,
  } = useReadingState({
    bookId: id,
    isRestart: restartParam === 'true',
  });

  // Wardrobe generation hook (triggers at 90% progress)
  useWardrobeGeneration({ progress, totalPages });

  // UI state
  const [showCompletion, setShowCompletion] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(mode === 'autoplay');
  const [canAdvance, setCanAdvance] = useState(true);
  const [rating, setRating] = useState<'up' | 'down' | null>(null);

  const [hasRated, setHasRated] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Refs for one-time operations
  const triggeredGeneration = useRef(false);
  const hasUpdatedSkillsRef = useRef(false);
  const hasInitializedRatingRef = useRef(false);

  // Convex mutations/actions
  const updateProgress = useMutation(api.storyGeneration.updateBookProgress);
  const rateBookMutation = useMutation(api.storyGeneration.rateBook);
  const triggerTeaserBookGeneration = useAction(api.storyGenerationActions.triggerTeaserBookGeneration);
  const completeBookAndUpdateSkills = useMutation(api.storyGeneration.completeBookAndUpdateSkills);

  // Trigger teaser book generation on first open
  useEffect(() => {
    if (!book || triggeredGeneration.current) return;

    if (book.isTeaserBook && book.teaserBookStatus === 'pending') {
      triggeredGeneration.current = true;
      triggerTeaserBookGeneration({ bookId: id as Id<'books'> }).catch((err) => {
        console.warn('Failed to trigger teaser book generation:', err);
      });
    }
  }, [book, id, triggerTeaserBookGeneration]);

  // Initialize rating from book data
  useEffect(() => {
    if (book?.userRating && !hasInitializedRatingRef.current) {
      hasInitializedRatingRef.current = true;
      setRating(book.userRating);
      setHasRated(true);
    }
  }, [book?.userRating]);

  // Update skills when book is completed (100%)
  useEffect(() => {
    if (progress >= 100 && !hasUpdatedSkillsRef.current && id && totalPages > 0) {
      hasUpdatedSkillsRef.current = true;
      completeBookAndUpdateSkills({ bookId: id as Id<'books'> })
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

  // Save progress to server
  useEffect(() => {
    if (id && totalPages > 0) {
      updateProgress({
        bookId: id as Id<'books'>,
        readingProgress: progress,
        lastReadPageIndex: page,
      }).catch(console.error);
    }
  }, [page, progress, id, totalPages, updateProgress]);

  // Child mode: delay before advancing
  useEffect(() => {
    if (isChildMode && !showCompletion) {
      setCanAdvance(false);
      const timer = setTimeout(() => setCanAdvance(true), 2000);
      return () => clearTimeout(timer);
    } else {
      setCanAdvance(true);
    }
  }, [page, isChildMode, showCompletion]);

  // Autoplay timer
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isAutoPlaying && !showCompletion && currentText) {
      const readingTime = Math.max(4000, currentText.length * 60);
      timer = setTimeout(() => {
        if (page < totalPages - 1) {
          setPage((p) => p + 1);
        } else {
          setIsAutoPlaying(false);
          setShowCompletion(true);
        }
      }, readingTime);
    }
    return () => clearTimeout(timer);
  }, [isAutoPlaying, page, currentText, totalPages, showCompletion, setPage]);

  // Handlers
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
    // Start transition
    setIsTransitioning(true);
    setShowCompletion(false);

    // Wait for animation to finish before showing content
    setTimeout(() => {
      setPage(0);
      setIsAutoPlaying(mode === 'autoplay');
      setIsTransitioning(false);
    }, 450); // slightly longer than animation duration (400ms) to ensure smoothness
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
          bookId: id as Id<'books'>,
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

  // Loading states
  const loadingState = (
    <ReadingLoadingState
      isLoading={book === undefined}
      notFound={book === null}
    />
  );
  if (loadingState.props.isLoading || loadingState.props.notFound) {
    return loadingState;
  }

  if (isTeaserGenerating) {
    return (
      <TeaserGenerationProgress
        title="Finishing your story..."
        subtitle="Adding magical illustrations just for you!"
      />
    );
  }

  return (
    <View className="flex-1 bg-slate-900" style={isLandscape ? { flexDirection: 'row' } : undefined}>
      <ReadingBackgroundLayer imageUrl={currentImage} cacheKey={displayImageCacheKey} />

      <ReadingCloseButton onClose={handleClose} insets={insets} />

      <MotiView
        animate={{
          opacity: showCompletion ? 0 : 1,
          scale: showCompletion ? 0.9 : 1,
          width: isLandscape ? (showCompletion ? 0 : '50%') : '100%',
        }}
        transition={{
          type: 'timing',
          duration: 500,
        }}
        style={isLandscape ? { overflow: 'hidden' } : { width: '100%', height: width, zIndex: 20 }}
      >
        <ReadingImageDisplay
          imageUrl={currentImage}
          cacheKey={displayImageCacheKey}
          isLandscape={isLandscape}
          dimensions={{ width, height }}
          insets={insets}
        />
      </MotiView>

      <MotiView
        className={isLandscape ? 'bg-white' : 'absolute bottom-0 left-0 right-0 bg-white'}
        animate={{
          height: isLandscape ? '100%' : (showCompletion ? '100%' : height * 0.62),
          width: isLandscape ? (showCompletion ? '100%' : '50%') : '100%',
          borderTopLeftRadius: showCompletion ? 0 : 32,
          borderTopRightRadius: showCompletion ? 0 : (isLandscape ? 0 : 32),
          borderBottomLeftRadius: showCompletion ? 0 : (isLandscape ? 32 : 0),
          paddingTop: showCompletion ? insets.top + 20 : (isLandscape ? 20 : 90),
          paddingBottom: showCompletion ? 0 : (isLandscape ? 20 : insets.bottom + 12),
        }}
        transition={{
          type: 'timing',
          duration: 400,
        }}
        style={
          isLandscape
            ? {
              // flex: 1, // Moti handles dimensions via animate
              height: '100%',
              paddingLeft: 28,
              paddingRight: Math.max(80, insets.right + 48),
            }
            : {
              // height handled by animate
              paddingHorizontal: 24,
            }
        }
      >
        {!showCompletion ? (
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: isTransitioning ? 0 : 1 }}
            transition={{ type: 'timing', duration: isTransitioning ? 0 : 300 }}
            className="flex-1 flex-col"
            style={{ overflow: 'visible' }}
          >
            <StoryTextDisplay
              text={currentText}
              isLoading={isPageLoading}
              isLandscape={isLandscape}
            />

            <View style={{ paddingTop: 20, paddingBottom: isLandscape ? 0 : 30 }}>
              <ReadingNavigationControls
                mode={mode}
                page={page}
                totalPages={totalPages}
                progress={progress}
                canAdvance={canAdvance}
                isAutoPlaying={isAutoPlaying}
                onNext={handleNext}
                onBack={handleBack}
                onRestart={handleRestart}
                onToggleAutoplay={() => setIsAutoPlaying(!isAutoPlaying)}
              />
            </View>
          </MotiView>
        ) : (
          <ReadingCompletionScreen
            rating={rating}
            hasRated={hasRated}
            onRate={handleRate}
            onRestart={handleRestart}
            onClose={handleClose}
          />
        )}
      </MotiView>
    </View>
  );
}