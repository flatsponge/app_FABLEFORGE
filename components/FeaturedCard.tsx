import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { Play, Clock, BookOpen, Baby, Glasses, X, RotateCcw } from 'lucide-react-native';
import { Book, ReadingMode } from '../types';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useCachedValue } from '@/hooks/useCachedValue';
import { CACHE_KEYS } from '@/lib/queryCache';

interface FeaturedCardProps {
  onRead?: (book: Book, mode: ReadingMode, restart?: boolean) => void;
}

export const FeaturedCard: React.FC<FeaturedCardProps> = ({ onRead }) => {
  const [showModeModal, setShowModeModal] = useState(false);
  const liveUserBooks = useQuery(api.storyGeneration.getUserBooks, {});
  const { data: userBooks, cacheLoaded: booksCacheLoaded } = useCachedValue(
    CACHE_KEYS.userBooks,
    liveUserBooks
  );
  const isBooksLoading = liveUserBooks === undefined && !booksCacheLoaded;

  const featuredBook = React.useMemo(() => {
    if (!userBooks || userBooks.length === 0) return null;

    const inProgressBooks = userBooks.filter(b => b.readingProgress > 0 && b.readingProgress < 100);
    
    if (inProgressBooks.length > 0) {
      return inProgressBooks.sort((a, b) => (b.lastReadAt ?? 0) - (a.lastReadAt ?? 0))[0];
    }

    return userBooks.sort((a, b) => (b.lastReadAt ?? b.createdAt) - (a.lastReadAt ?? a.createdAt))[0];
  }, [userBooks]);

  if (isBooksLoading) {
    return (
      <View className="px-6 mb-8">
        <View className="mb-4 px-1">
          <Text className="text-lg font-bold text-slate-700">Continue Reading</Text>
        </View>
        <View className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <View className="flex-row gap-5">
            <View className="w-28 aspect-[3/4] rounded-2xl bg-slate-100" />
            <View className="flex-1 justify-center gap-3">
              <View className="h-4 bg-slate-100 rounded-full w-3/4" />
              <View className="h-3 bg-slate-100 rounded-full w-1/2" />
              <View className="h-2 bg-slate-100 rounded-full w-full" />
            </View>
          </View>
        </View>
      </View>
    );
  }

  if (!featuredBook) {
    return (
      <View className="px-6 mb-8">
        <View className="mb-4 px-1">
          <Text className="text-lg font-bold text-slate-700">Continue Reading</Text>
        </View>
        <View className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm items-center justify-center">
          <View className="w-16 h-16 bg-purple-50 rounded-full items-center justify-center mb-3">
            <BookOpen size={28} color="#9333ea" />
          </View>
          <Text className="text-slate-600 font-bold text-center mb-1">No stories yet</Text>
          <Text className="text-slate-400 text-xs text-center">Create your first story to start reading!</Text>
        </View>
      </View>
    );
  }

  const book: Book = {
    id: featuredBook._id,
    title: featuredBook.title,
    author: '',
    progress: featuredBook.readingProgress,
    color: 'from-purple-400 to-indigo-500',
    coverImage: featuredBook.coverImageUrl || '',
    coverImageStorageId: featuredBook.coverImageStorageId ?? null,
    iconName: 'Sparkles',
    userRating: null,
    duration: `${featuredBook.durationMinutes} min`,
    description: featuredBook.description,
    vocabularyLevel: featuredBook.vocabularyLevel.charAt(0).toUpperCase() + featuredBook.vocabularyLevel.slice(1) as 'Beginner' | 'Intermediate' | 'Advanced',
    generatedDate: 'Recently',
  };

  const progressPercent = Math.round(featuredBook.readingProgress);
  const totalPages = featuredBook.pageCount || 5;
  const currentPage = Math.ceil((progressPercent / 100) * totalPages);
  const pagesLeft = totalPages - currentPage;
  const estimatedTimeLeft = Math.max(1, Math.round(pagesLeft * 2));

  const handleSelectMode = (mode: ReadingMode, restart?: boolean) => {
    setShowModeModal(false);
    if (onRead) {
      onRead(book, mode, restart);
    }
  };

  const hasProgress = progressPercent > 0 && progressPercent < 100;

  return (
    <View className="px-6 mb-8">
      <View className="mb-4 px-1">
        <Text className="text-lg font-bold text-slate-700">Continue Reading</Text>
      </View>

      <Pressable
        onPress={() => setShowModeModal(true)}
        className="bg-white p-3 rounded-3xl border border-slate-100 shadow-sm flex-row gap-5 active:scale-[0.99]"
      >
        <View className="relative w-28 aspect-[3/4] rounded-2xl overflow-hidden">
          {featuredBook.coverImageUrl ? (
            <ExpoImage
              source={{
                uri: featuredBook.coverImageUrl,
                cacheKey:
                  featuredBook.coverImageStorageId ??
                  featuredBook.coverImageUrl ??
                  featuredBook._id
              }}
              style={StyleSheet.absoluteFill}
              cachePolicy="disk"
              contentFit="cover"
            />
          ) : (
            <View className="w-full h-full bg-purple-100 items-center justify-center">
              <BookOpen size={32} color="#9333ea" />
            </View>
          )}
          <View className="absolute inset-0 bg-black/10" />

          <View className="absolute inset-0 items-center justify-center">
            <View className="w-12 h-12 bg-white/90 rounded-full items-center justify-center shadow-lg">
              <Play size={20} color="#9333ea" fill="#9333ea" />
            </View>
          </View>
        </View>

        <View className="flex-1 py-1 pr-2 justify-center">

          <View className="flex-row items-center gap-2 mb-2">
            {progressPercent > 0 && (
              <View className="bg-purple-50 px-2 py-1 rounded-lg border border-purple-100">
                <Text className="text-purple-600 text-[10px] font-black uppercase tracking-wide">
                  Page {currentPage}
                </Text>
              </View>
            )}
            <View className="flex-row items-center gap-1">
              <Clock size={12} color="#94a3b8" />
              <Text className="text-[10px] font-bold text-slate-400">{estimatedTimeLeft}m left</Text>
            </View>
          </View>

          <Text className="text-lg font-extrabold text-slate-800 leading-tight mb-1">
            {featuredBook.title}
          </Text>


          <View className="w-full">
            <View className="flex-row justify-between items-end mb-1.5">
              <Text className="text-[10px] font-bold text-slate-400">Progress</Text>
              <Text className="text-[11px] font-black text-slate-800">{progressPercent}%</Text>
            </View>
            <View className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-50">
              <View className="h-full bg-purple-500 rounded-full" style={{ width: `${progressPercent}%` }} />
            </View>
          </View>
        </View>
      </Pressable>

      <Modal
        visible={showModeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModeModal(false)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-end"
          onPress={() => setShowModeModal(false)}
        >
          <Pressable
            className="bg-white rounded-t-[32px] px-6 pt-6 pb-10"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-extrabold text-slate-900">How would you like to read?</Text>
              <Pressable
                onPress={() => setShowModeModal(false)}
                className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center"
              >
                <X size={20} color="#64748b" />
              </Pressable>
            </View>

            <View className="gap-3">
              <Pressable
                onPress={() => handleSelectMode('autoplay')}
                className="p-1 rounded-3xl bg-slate-900 active:scale-[0.98]"
              >
                <View className="bg-slate-800 rounded-[22px] p-5 flex-row items-center gap-5 border border-white/10">
                  <View className="w-14 h-14 rounded-full bg-white items-center justify-center shadow-lg">
                    <Play size={24} color="#1e293b" fill="#1e293b" />
                  </View>
                  <View>
                    <Text className="font-extrabold text-xl text-white tracking-tight">Auto-Play</Text>
                    <Text className="text-slate-400 text-sm font-medium">Listen & Watch</Text>
                  </View>
                </View>
              </Pressable>

              <View className="flex-row gap-4">
                <Pressable
                  onPress={() => handleSelectMode('child')}
                  className="flex-1 p-5 rounded-3xl bg-white border border-slate-200 items-center justify-center gap-3 active:scale-95 shadow-sm"
                >
                  <View className="w-12 h-12 rounded-full bg-orange-50 items-center justify-center">
                    <Baby size={28} color="#f97316" />
                  </View>
                  <Text className="font-bold text-slate-800 text-sm">Read Myself</Text>
                </Pressable>

                <Pressable
                  onPress={() => handleSelectMode('parent')}
                  className="flex-1 p-5 rounded-3xl bg-white border border-slate-200 items-center justify-center gap-3 active:scale-95 shadow-sm"
                >
                  <View className="w-12 h-12 rounded-full bg-indigo-50 items-center justify-center">
                    <Glasses size={28} color="#6366f1" />
                  </View>
                  <Text className="font-bold text-slate-800 text-sm">Read Together</Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};
