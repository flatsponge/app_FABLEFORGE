import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Play, Clock } from 'lucide-react-native';
import { Book } from '../types';
import { BOOKS } from '../constants/data';

interface FeaturedCardProps {
  onRead?: (book: Book) => void;
}

export const FeaturedCard: React.FC<FeaturedCardProps> = ({ onRead }) => {
  const featuredBook = BOOKS.find(b => b.id === 5) || BOOKS[0];

  return (
    <View className="px-6 mb-8">
      <View className="mb-4 px-1">
        <Text className="text-lg font-bold text-slate-700">Continue Reading</Text>
      </View>

      <Pressable
        onPress={() => onRead && onRead(featuredBook)}
        className="bg-white p-3 rounded-3xl border border-slate-100 shadow-sm flex-row gap-5 active:scale-[0.99]"
      >
        <View className="relative w-28 aspect-[3/4] rounded-2xl overflow-hidden">
          <Image
            source={{ uri: featuredBook.coverImage }}
            className="w-full h-full"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black/10" />

          <View className="absolute inset-0 items-center justify-center">
            <View className="w-12 h-12 bg-white/90 rounded-full items-center justify-center shadow-lg">
              <Play size={20} color="#9333ea" fill="#9333ea" />
            </View>
          </View>
        </View>

        <View className="flex-1 py-1 pr-2 justify-center">

          <View className="flex-row items-center gap-2 mb-2">
            <View className="bg-purple-50 px-2 py-1 rounded-lg border border-purple-100">
              <Text className="text-purple-600 text-[10px] font-black uppercase tracking-wide">
                Chapter 3
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Clock size={12} color="#94a3b8" />
              <Text className="text-[10px] font-bold text-slate-400">12m left</Text>
            </View>
          </View>

          <Text className="text-lg font-extrabold text-slate-800 leading-tight mb-1">
            {featuredBook.title}
          </Text>


          <View className="w-full">
            <View className="flex-row justify-between items-end mb-1.5">
              <Text className="text-[10px] font-bold text-slate-400">Progress</Text>
              <Text className="text-[11px] font-black text-slate-800">60%</Text>
            </View>
            <View className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-50">
              <View className="h-full bg-purple-500 rounded-full w-[60%]" />
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
};
