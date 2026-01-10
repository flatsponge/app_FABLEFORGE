import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, ScrollView, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  useAnimatedReaction,
} from 'react-native-reanimated';
import { Search, ThumbsUp, Clock, Sparkles, Loader2, Hourglass } from 'lucide-react-native';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { BookCard } from './BookCard';
import { Book } from '@/types';
import { useEffect } from 'react';

interface LibraryViewProps {
  onBookClick: (book: Book) => void;
  isHome?: boolean;
}

type FilterType = 'all' | 'favorites' | 'unfinished' | 'newest';

interface QueuedBook {
  id: string;
  title: string;
  task: string;
  progress: number;
}

const SpinningLoader = () => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Loader2 size={20} color="#a855f7" />
    </Animated.View>
  );
};

const QueuedBookCard = ({ book }: { book: QueuedBook }) => (
  <View
    className={`w-full aspect-[4/5] rounded-[32px] p-5 border-2 border-dashed border-purple-200/60 justify-between overflow-hidden ${book.progress > 0 ? 'bg-orange-50/30' : 'bg-purple-50/30'
      }`}
  >
    <View className="flex-row justify-between items-start">
      <View className="p-2 bg-white rounded-full border border-slate-100">
        {book.progress > 0 ? (
          <SpinningLoader />
        ) : (
          <Hourglass size={20} color="#94a3b8" />
        )}
      </View>
    </View>

    <View>
      <Text className="font-bold text-slate-700 text-lg leading-tight mb-2" numberOfLines={2}>
        {book.title}
      </Text>
      <View className="flex-row items-center gap-1.5">
        <View className="relative w-2 h-2">
          <View
            className={`w-2 h-2 rounded-full ${book.progress > 0 ? 'bg-purple-500' : 'bg-slate-300'
              }`}
          />
        </View>
        <Text className="text-xs font-bold text-purple-500 uppercase tracking-wide" numberOfLines={1}>
          {book.task}
        </Text>
      </View>
    </View>

    <View className="w-full bg-white h-2 rounded-full overflow-hidden mt-4 border border-purple-100">
      <View
        className={`h-full rounded-full ${book.progress > 0 ? 'bg-purple-400' : 'bg-slate-200'}`}
        style={{ width: `${Math.max(book.progress, 5)}%` }}
      />
    </View>
  </View>
);

const getRecencyScore = (dateStr: string) => {
  const lower = dateStr.toLowerCase();
  if (lower.includes('just now')) return 0;
  if (lower.includes('today')) return 1;
  if (lower.includes('yesterday')) return 2;
  if (lower.includes('day')) {
    const match = lower.match(/(\d+)/);
    return match ? parseInt(match[0]) + 2 : 3;
  }
  if (lower.includes('week')) return 14;
  if (lower.includes('month')) return 30;
  return 999;
};

const FILTERS: { id: FilterType; label: string; icon?: typeof Sparkles }[] = [
  { id: 'all', label: 'All Books' },
  { id: 'newest', label: 'Newest', icon: Sparkles },
  { id: 'favorites', label: 'Favorites', icon: ThumbsUp },
  { id: 'unfinished', label: 'Continue', icon: Clock },
];

export const LibraryView: React.FC<LibraryViewProps> = ({ onBookClick, isHome = false }) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch user's generated books from Convex
  const userBooks = useQuery(api.storyGeneration.getUserBooks, {});
  
  // Fetch active/generating jobs
  const activeJobs = useQuery(api.storyGeneration.getUserActiveJobs);

  // Convert active jobs to QueuedBook format
  const queuedBooks = useMemo<QueuedBook[]>(() => {
    if (!activeJobs) return [];
    
    return activeJobs.map(job => {
      let task = 'Queued';
      if (job.status === 'generating_story') task = 'Writing Story';
      else if (job.status === 'generating_images') task = 'Creating Art';
      
      // Truncate prompt for title
      const title = job.prompt.length > 40 
        ? job.prompt.substring(0, 40) + '...' 
        : job.prompt;
      
      return {
        id: job._id,
        title,
        task,
        progress: job.progress,
      };
    });
  }, [activeJobs]);

  // Map vibe to color gradient
  const getColorFromVibe = (vibe: string): string => {
    switch (vibe) {
      case 'energizing': return 'from-orange-400 to-rose-500';
      case 'soothing': return 'from-blue-400 to-indigo-500';
      case 'whimsical': return 'from-pink-400 to-purple-500';
      case 'thoughtful': return 'from-teal-400 to-cyan-500';
      default: return 'from-purple-400 to-indigo-500';
    }
  };

  // Map vocabulary level to display format
  const formatVocabularyLevel = (level: string): 'Beginner' | 'Intermediate' | 'Advanced' => {
    switch (level) {
      case 'beginner': return 'Beginner';
      case 'intermediate': return 'Intermediate';
      case 'advanced': return 'Advanced';
      default: return 'Beginner';
    }
  };

  // Format relative date from timestamp
  const formatRelativeDate = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 5) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 14) return 'Last week';
    return `${Math.floor(days / 7)} weeks ago`;
  };

  // Convert Convex books to Book type format
  const convexBooksAsBooks = useMemo<Book[]>(() => {
    if (!userBooks) return [];
    
    return userBooks.map((book) => ({
      id: book._id,
      title: book.title,
      author: '',
      progress: book.readingProgress,
      color: getColorFromVibe(book.storyVibe),
      coverImage: book.coverImageUrl || '',
      iconName: 'Sparkles',
      userRating: book.userRating,
      duration: `${book.durationMinutes} min`,
      description: book.description,
      vocabularyLevel: formatVocabularyLevel(book.vocabularyLevel),
      generatedDate: formatRelativeDate(book.createdAt),
    }));
  }, [userBooks]);

  const allBooks = convexBooksAsBooks;

  let filteredBooks = allBooks.filter(book => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'favorites') return book.userRating === 'up';
    if (filter === 'unfinished') return book.progress > 0 && book.progress < 100;
    return true;
  });

  if (filter === 'newest') {
    filteredBooks = [...filteredBooks].sort(
      (a, b) => getRecencyScore(a.generatedDate) - getRecencyScore(b.generatedDate)
    );
  }

  const hasActiveJobs = queuedBooks.length > 0;

  return (
    <View className={`bg-background ${isHome ? 'pb-24' : 'pb-32'}`}>
      <View className={`px-6 pt-4 pb-2 bg-background ${!isHome && 'pt-12 border-b border-slate-100/50'}`}>
        {!isHome && (
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-3xl font-extrabold text-slate-800 tracking-tight">My Library</Text>
              <Text className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
                {filteredBooks.length} {filteredBooks.length === 1 ? 'Adventure' : 'Adventures'} Collected
              </Text>
            </View>
            <View className="bg-purple-100 p-2.5 rounded-2xl">
              <Sparkles size={20} color="#9333ea" />
            </View>
          </View>
        )}

        <View className="relative mb-4">
          <View className="absolute left-4 top-0 bottom-0 justify-center z-10">
            <Search size={16} color="#94a3b8" />
          </View>
          <TextInput
            placeholder="Find a story..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="w-full bg-white border-2 border-slate-100 rounded-2xl py-3.5 pl-10 pr-4 text-sm font-bold text-slate-600"
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="-mx-6 px-6"
          contentContainerStyle={{ paddingRight: 24, gap: 8 }}
        >
          {FILTERS.map(f => {
            const isActive = filter === f.id;
            const Icon = f.icon;
            return (
              <Pressable
                key={f.id}
                onPress={() => setFilter(f.id)}
                className={`flex-row items-center gap-1.5 px-4 py-2.5 rounded-full border ${isActive
                    ? 'bg-slate-800 border-slate-800'
                    : 'bg-white border-slate-200'
                  } active:scale-95`}
              >
                {Icon && (
                  <Icon
                    size={14}
                    color={isActive ? 'white' : '#64748b'}
                  />
                )}
                <Text
                  className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-500'
                    }`}
                >
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View className="px-6 py-4">
        {filter === 'all' && !searchQuery && hasActiveJobs && (
          <View className="mb-8">
            <View className="flex-row items-center gap-2 mb-4 px-1">
              <View className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <Text className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                Generating Now
              </Text>
            </View>
            <View className="flex-row flex-wrap gap-5">
              {queuedBooks.map(qb => (
                <View key={qb.id} className="w-[47%]">
                  <QueuedBookCard book={qb} />
                </View>
              ))}
            </View>
          </View>
        )}

        {filter === 'all' && !searchQuery && (
          <Text className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 px-1">
            Your Collection
          </Text>
        )}

        <View className="flex-row flex-wrap gap-5">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book, index) => (
              <View key={book.id} className="w-[47%]">
                <BookCard
                  book={book}
                  onClick={onBookClick}
                  showNewBadge={filter === 'newest' && index < 3}
                />
              </View>
            ))
          ) : (
            <View className="w-full items-center justify-center py-20">
              <View className="w-20 h-20 bg-slate-100 rounded-full items-center justify-center mb-4">
                <Search size={32} color="#cbd5e1" />
              </View>
              <Text className="text-slate-600 font-bold mb-1">No stories found</Text>
              <Text className="text-slate-400 text-xs text-center max-w-[200px]">
                Try adjusting your search or create a new story!
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
