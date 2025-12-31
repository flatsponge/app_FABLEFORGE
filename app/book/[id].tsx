import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Star, Play, Baby, Glasses, Clock, Heart, Zap, Sparkles } from 'lucide-react-native';
import { BOOKS } from '@/constants/data';
import { ReadingMode } from '@/types';

const getDifficultyStyle = (level: string) => {
  switch(level) {
    case 'Beginner': return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' };
    case 'Intermediate': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100' };
    case 'Advanced': return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100' };
    default: return { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-100' };
  }
};

export default function BookDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  
  const book = BOOKS.find(b => b.id === Number(id));
  
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
        <View className="relative h-[400px]">
          <Image 
            source={{ uri: book.coverImage }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/40" />
          
          <View className="absolute top-14 left-0 right-0 px-6 flex-row justify-between">
            <Pressable 
              onPress={handleBack}
              className="w-11 h-11 rounded-full bg-black/20 items-center justify-center active:scale-95"
            >
              <ChevronLeft size={24} color="white" />
            </Pressable>
            <Pressable 
              onPress={() => setIsLiked(!isLiked)}
              className={`w-11 h-11 rounded-full items-center justify-center active:scale-95 ${
                isLiked ? 'bg-white' : 'bg-black/20'
              }`}
            >
              <Heart 
                size={20} 
                color={isLiked ? '#f43f5e' : 'white'} 
                fill={isLiked ? '#f43f5e' : 'none'}
              />
            </Pressable>
          </View>
        </View>

        <View className="px-8 -mt-24 pb-12">
          <View className="items-center mb-10">
            <Text className="text-4xl font-extrabold text-slate-800 mb-2 text-center leading-tight">
              {book.title}
            </Text>
            <Text className="text-slate-500 font-bold text-lg mb-6">by {book.author}</Text>
            
            <View className="flex-row flex-wrap items-center justify-center gap-3">
              <View className="flex-row items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
                <Star size={16} color="#facc15" fill="#facc15" />
                <Text className="text-slate-700 font-bold text-sm">{book.rating}</Text>
              </View>
              <View className="flex-row items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
                <Clock size={16} color="#94a3b8" />
                <Text className="text-slate-700 font-bold text-sm">{book.duration}</Text>
              </View>
              <View className={`flex-row items-center gap-2 px-4 py-2 rounded-2xl border shadow-sm ${diffStyle.bg} ${diffStyle.border}`}>
                <Zap size={16} color={diffStyle.text.includes('emerald') ? '#047857' : diffStyle.text.includes('amber') ? '#b45309' : '#be123c'} />
                <Text className={`font-bold text-sm ${diffStyle.text}`}>{book.vocabularyLevel}</Text>
              </View>
            </View>
          </View>

          <View className="mb-10 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <View className="flex-row items-center gap-2 mb-3">
              <Sparkles size={12} color="#9333ea" />
              <Text className="text-xs font-black text-slate-900 uppercase tracking-widest">Story Synopsis</Text>
            </View>
            <Text className="text-slate-600 text-base leading-relaxed font-medium">
              {book.description}
            </Text>
          </View>

          <View className="gap-4">
            <Text className="text-xs font-black text-slate-400 uppercase tracking-widest text-center mb-4">
              Start Reading
            </Text>
            
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
