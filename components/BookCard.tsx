import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { Clock, ThumbsUp, Sparkles } from 'lucide-react-native';
import { Book } from '../types';

interface BookCardProps {
  book: Book;
  onClick?: (book: Book) => void;
  showNewBadge?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onClick, showNewBadge }) => {
  const [userRating, setUserRating] = useState<'up' | 'down' | null>(book.userRating);
  const coverCacheKey = book.coverImageStorageId ?? book.coverImage ?? book.id;

  const handleToggleRating = () => {
    setUserRating(userRating === 'up' ? null : 'up');
  };

  return (
    <Pressable
      className="flex-1"
      onPress={() => onClick && onClick(book)}
    >
      <View className="relative aspect-[4/5] rounded-3xl shadow-md overflow-hidden bg-slate-100">

        {showNewBadge && (
          <View className="absolute top-3 left-3 z-20">
            <View className="bg-blue-500 px-2.5 py-1 rounded-full flex-row items-center gap-1">
              <Sparkles size={10} color="white" />
              <Text className="text-white text-[10px] font-bold">NEW</Text>
            </View>
          </View>
        )}

        {book.coverImage ? (
          <ExpoImage
            source={{ uri: book.coverImage }}
            style={StyleSheet.absoluteFill}
            cachePolicy="disk"
            cacheKey={coverCacheKey}
            contentFit="cover"
          />
        ) : (
          <View
            className={`absolute inset-0 bg-gradient-to-br ${book.color || 'from-purple-400 to-indigo-500'} items-center justify-center`}
          >
            <Sparkles size={36} color="white" />
          </View>
        )}

        <View className="absolute inset-0 bg-black/40" />

        <View className="relative z-10 flex-row justify-end p-4">
          <Pressable
            onPress={handleToggleRating}
            className={`w-10 h-10 rounded-full items-center justify-center ${userRating === 'up' ? 'bg-white' : 'bg-black/20'
              }`}
          >
            <ThumbsUp
              size={18}
              color={userRating === 'up' ? '#22c55e' : 'white'}
              fill={userRating === 'up' ? '#22c55e' : 'none'}
            />
          </Pressable>
        </View>

        <View className="flex-1" />

        <View className="relative z-10 p-5">
          <Text className="font-bold text-xl text-white leading-tight mb-2" numberOfLines={2}>
            {book.title}
          </Text>

          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center gap-1.5 bg-white/20 px-2 py-1 rounded-lg">
              <Clock size={12} color="white" />
              <Text className="text-white text-xs font-bold">{book.duration}</Text>
            </View>
          </View>
        </View>

        {book.progress > 0 && (
          <View className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/40">
            <View
              className="h-full bg-white"
              style={{ width: `${book.progress}%` }}
            />
          </View>
        )}
      </View>
    </Pressable>
  );
};
