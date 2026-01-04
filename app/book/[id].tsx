import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Play, Baby, Glasses, Clock, Zap, Sparkles, ThumbsUp, ThumbsDown } from 'lucide-react-native';
import { BOOKS } from '@/constants/data';
import { ReadingMode } from '@/types';

const getDifficultyStyle = (level: string) => {
  switch (level) {
    case 'Beginner': return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' };
    case 'Intermediate': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100' };
    case 'Advanced': return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100' };
    default: return { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-100' };
  }
};

export default function BookDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const book = BOOKS.find(b => b.id === Number(id));
  const [userRating, setUserRating] = useState<'up' | 'down' | null>(book?.userRating || null);

  const handleRating = (rating: 'up' | 'down') => {
    if (userRating === rating) {
      setUserRating(null);
    } else {
      setUserRating(rating);
    }
  };

  if (!book) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-slate-500">Book not found</Text>
      </View>
    );
  }

  const handleBack = () => {
    router.back();
  };

  const handleSelectMode = (mode: ReadingMode) => {
    router.push(`/reading/${book.id}?mode=${mode}`);
  };

  const diffStyle = getDifficultyStyle(book.vocabularyLevel);

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Section with integrated title and metadata */}
        <View className="relative h-[420px]">
          <Image
            source={{ uri: book.coverImage }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
          {/* Gradient overlay for text readability */}
          <View className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />

          {/* Back button */}
          <View className="absolute top-14 left-0 right-0 px-6">
            <Pressable
              onPress={handleBack}
              className="w-11 h-11 rounded-full bg-black/30 items-center justify-center active:scale-95"
            >
              <ChevronLeft size={24} color="white" />
            </Pressable>
          </View>

          {/* Title and metadata overlaid on hero */}
          <View className="absolute bottom-0 left-0 right-0 px-6 pb-6">
            <Text className="text-3xl font-extrabold text-white mb-3 leading-tight">
              {book.title}
            </Text>
            <View className="flex-row items-center gap-2">
              <View className="flex-row items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full">
                <Clock size={14} color="white" />
                <Text className="text-white font-bold text-xs">{book.duration}</Text>
              </View>
              <View className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-full ${book.vocabularyLevel === 'Beginner' ? 'bg-emerald-500/80' :
                book.vocabularyLevel === 'Intermediate' ? 'bg-amber-500/80' : 'bg-rose-500/80'
                }`}>
                <Zap size={14} color="white" />
                <Text className="text-white font-bold text-xs">{book.vocabularyLevel}</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="px-6 py-5">
          {/* Rating Control - smaller and more subtle */}
          <View className="flex-row items-center justify-center gap-3 mb-5">
            <Pressable
              onPress={() => handleRating('up')}
              className={`flex-row items-center gap-2 px-5 py-2.5 rounded-full border active:scale-95 ${userRating === 'up'
                ? 'bg-green-50 border-green-400'
                : 'bg-slate-50 border-slate-200'
                }`}
            >
              <ThumbsUp
                size={16}
                color={userRating === 'up' ? '#22c55e' : '#94a3b8'}
                fill={userRating === 'up' ? '#22c55e' : 'none'}
              />
              <Text className={`font-semibold text-sm ${userRating === 'up' ? 'text-green-600' : 'text-slate-500'}`}>
                I like it
              </Text>
            </Pressable>

            <Pressable
              onPress={() => handleRating('down')}
              className={`flex-row items-center gap-2 px-5 py-2.5 rounded-full border active:scale-95 ${userRating === 'down'
                ? 'bg-red-50 border-red-400'
                : 'bg-slate-50 border-slate-200'
                }`}
            >
              <ThumbsDown
                size={16}
                color={userRating === 'down' ? '#ef4444' : '#94a3b8'}
                fill={userRating === 'down' ? '#ef4444' : 'none'}
              />
              <Text className={`font-semibold text-sm ${userRating === 'down' ? 'text-red-600' : 'text-slate-500'}`}>
                Not for me
              </Text>
            </Pressable>
          </View>

          <View className="mb-6 bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
            <View className="flex-row items-center gap-2 mb-2">
              <Sparkles size={12} color="#9333ea" />
              <Text className="text-xs font-black text-slate-900 uppercase tracking-widest">Story Synopsis</Text>
            </View>
            <Text className="text-slate-600 text-base leading-relaxed font-medium">
              {book.description}
            </Text>
          </View>

          <View className="gap-3">


            <Pressable
              onPress={() => handleSelectMode('autoplay')}
              className="p-1 rounded-3xl bg-slate-900 shadow-xl active:scale-[0.98]"
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

          <View className="h-20" />
        </View>
      </ScrollView>
    </View>
  );
}
