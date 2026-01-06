import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Image, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  X, ChevronLeft, ChevronRight, RotateCcw, Check, Sparkles, BookOpen,
  Pause, Play, Timer, ThumbsUp, ThumbsDown
} from 'lucide-react-native';
import { BOOKS, STORY_DATA } from '@/constants/data';
import { ReadingMode } from '@/types';
import { useOrientation } from '@/components/useOrientation';

export default function ReadingScreen() {
  const { id, mode: modeParam } = useLocalSearchParams<{ id: string; mode?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Enable rotation for this screen
  const { isLandscape, width, height } = useOrientation(true);

  const book = BOOKS.find(b => b.id === Number(id));
  const mode = (modeParam || 'autoplay') as ReadingMode;

  const [page, setPage] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(mode === 'autoplay');
  const [canAdvance, setCanAdvance] = useState(true);
  const [rating, setRating] = useState<'up' | 'down' | null>(null);

  const stories = book ? (STORY_DATA[book.id] || ["Once upon a time... (Story content missing)"]) : [];

  const isChildMode = mode === 'child';
  const isParentMode = mode === 'parent';
  const isAutoplayMode = mode === 'autoplay';

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
    if (isAutoPlaying && !showCompletion && stories.length > 0) {
      const readingTime = Math.max(4000, stories[page].length * 60);
      timer = setTimeout(() => {
        if (page < stories.length - 1) {
          setPage(p => p + 1);
        } else {
          setIsAutoPlaying(false);
          setShowCompletion(true);
        }
      }, readingTime);
    }
    return () => clearTimeout(timer);
  }, [isAutoPlaying, page, stories, showCompletion]);

  const handleNext = () => {
    if (!canAdvance && isChildMode) return;
    if (page < stories.length - 1) {
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
    setRating(null);
  };

  const handleClose = () => {
    router.back();
  };

  const progress = stories.length > 0 ? ((page + 1) / stories.length) * 100 : 0;

  if (!book) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-slate-500">Book not found</Text>
      </View>
    );
  }

  // Dynamic sizing based on orientation
  const coverSize = isLandscape ? { width: width * 0.35, height: height * 0.6 } : { width: 256, height: 192 };
  const contentMinHeight = isLandscape ? height : 380;

  return (
    <View className="flex-1 bg-slate-900" style={isLandscape ? { flexDirection: 'row' } : undefined}>
      {/* Background blur */}
      <View style={StyleSheet.absoluteFill}>
        <Image
          source={{ uri: book.coverImage }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          blurRadius={20}
        />
        <View className="absolute inset-0 bg-black/50" />
      </View>

      {/* Header controls - adapt position for landscape */}
      <View
        className="absolute left-0 right-0 px-6 flex-row justify-between items-center z-50"
        style={{ top: insets.top + 8 }}
      >
        <Pressable
          onPress={handleClose}
          className="w-12 h-12 rounded-full bg-white/20 items-center justify-center active:scale-95"
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

      {/* Cover image - positioned differently in landscape vs portrait */}
      {isLandscape ? (
        <View
          className="items-center justify-center z-10"
          style={{ width: width * 0.4, paddingTop: insets.top + 60 }}
        >
          <View
            className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20"
            style={coverSize}
          >
            <Image
              source={{ uri: book.coverImage }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        </View>
      ) : (
        <View className="absolute top-1/4 left-0 right-0 px-6 items-center">
          <View className="w-64 h-48 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
            <Image
              source={{ uri: book.coverImage }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        </View>
      )}

      {/* Content area - side panel in landscape, bottom sheet in portrait */}
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
                {stories.map((_, idx) => (
                  <View
                    key={idx}
                    className={`h-1.5 rounded-full ${idx === page ? 'w-6 bg-slate-800' : 'w-1.5 bg-slate-200'}`}
                  />
                ))}
              </View>

              <Text className="text-2xl font-bold text-slate-800 text-center leading-relaxed mb-8 px-2">
                {stories[page]}
              </Text>

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
                  >
                    <ChevronLeft size={28} color={page === 0 ? '#cbd5e1' : '#78350f'} strokeWidth={3} />
                    <Text className={`text-xl font-black ${page === 0 ? 'text-slate-300' : 'text-amber-900'}`}>Back</Text>
                  </Pressable>

                  <Pressable
                    onPress={handleNext}
                    disabled={!canAdvance}
                    className={`flex-[2] rounded-3xl items-center justify-center flex-row gap-2 ${!canAdvance ? 'bg-slate-200' : 'bg-emerald-400'
                      }`}
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
                  >
                    <ChevronLeft size={28} color="#94a3b8" />
                  </Pressable>

                  <View className="flex-1 max-w-[150px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <View className="h-full bg-indigo-500" style={{ width: `${progress}%` }} />
                  </View>

                  <Pressable
                    onPress={handleNext}
                    className="w-20 h-20 rounded-3xl bg-slate-900 items-center justify-center shadow-lg active:scale-95"
                  >
                    {page === stories.length - 1 ? (
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
              <View className="w-20 h-20 bg-yellow-100 rounded-full items-center justify-center mb-4">
                <Sparkles size={40} color="#eab308" fill="#eab308" />
              </View>
              <Text className="text-3xl font-black text-slate-800 mb-2">The End!</Text>
              <Text className="text-slate-500 text-lg font-medium mb-6">What a wonderful adventure.</Text>

              <View className="flex-row justify-center gap-4 mb-6">
                <Pressable
                  onPress={() => setRating('up')}
                  className={`w-16 h-16 rounded-2xl items-center justify-center ${rating === 'up' ? 'bg-green-500' : 'bg-slate-100'
                    }`}
                >
                  <ThumbsUp size={28} color={rating === 'up' ? 'white' : '#94a3b8'} fill={rating === 'up' ? 'white' : 'none'} />
                </Pressable>
                <Pressable
                  onPress={() => setRating('down')}
                  className={`w-16 h-16 rounded-2xl items-center justify-center ${rating === 'down' ? 'bg-red-500' : 'bg-slate-100'
                    }`}
                >
                  <ThumbsDown size={28} color={rating === 'down' ? 'white' : '#94a3b8'} fill={rating === 'down' ? 'white' : 'none'} />
                </Pressable>
              </View>

              <View className="flex-row gap-4 w-full">
                <Pressable
                  onPress={handleRestart}
                  className="flex-1 py-4 rounded-2xl bg-slate-100 flex-row items-center justify-center gap-2"
                >
                  <RotateCcw size={20} color="#64748b" />
                  <Text className="font-bold text-slate-600">Read Again</Text>
                </Pressable>
                <Pressable
                  onPress={handleClose}
                  className="flex-1 py-4 rounded-2xl bg-slate-900 items-center justify-center"
                >
                  <Text className="font-bold text-white">Close Book</Text>
                </Pressable>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
