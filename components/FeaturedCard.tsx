import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Play, Clock, BookOpen } from 'lucide-react-native';
import { Book } from '../types';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface FeaturedCardProps {
  onRead?: (book: Book) => void;
}

export const FeaturedCard: React.FC<FeaturedCardProps> = ({ onRead }) => {
  const userBooks = useQuery(api.storyGeneration.getUserBooks, {});

  const featuredBook = React.useMemo(() => {
    if (!userBooks || userBooks.length === 0) return null;

    const inProgress = userBooks.find(b => b.readingProgress > 0 && b.readingProgress < 100);
    if (inProgress) return inProgress;

    return userBooks[0];
  }, [userBooks]);

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

  return (
    <View className="px-6 mb-8">
      <View className="mb-4 px-1">
        <Text className="text-lg font-bold text-slate-700">Continue Reading</Text>
      </View>

      <Pressable
        onPress={() => onRead && onRead(book)}
        className="bg-white p-3 rounded-3xl border border-slate-100 shadow-sm flex-row gap-5 active:scale-[0.99]"
      >
        <View className="relative w-28 aspect-[3/4] rounded-2xl overflow-hidden">
          {featuredBook.coverImageUrl ? (
            <Image
              source={{ uri: featuredBook.coverImageUrl }}
              className="w-full h-full"
              resizeMode="cover"
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
    </View>
  );
};
