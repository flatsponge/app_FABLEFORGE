import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { BookOpen, Search } from 'lucide-react-native';

export const Header: React.FC = () => (
  <View className="flex-row justify-between items-center px-6 pt-14 pb-6 bg-background">
    <View className="flex-row items-center gap-3">
      <View className="bg-yellow-400 p-2 rounded-2xl rotate-3">
        <BookOpen className="text-white" size={24} strokeWidth={2} />
      </View>
      <View>
        <Text className="text-2xl font-extrabold text-slate-800 tracking-tight">
          Story<Text className="text-yellow-500">Time</Text>
        </Text>
        <Text className="text-xs text-slate-400 font-medium">Good Morning, Leo!</Text>
      </View>
    </View>
    <Pressable className="bg-white p-2.5 rounded-full shadow-md border border-slate-100 active:scale-95">
      <Search size={20} color="#94a3b8" strokeWidth={2} />
    </Pressable>
  </View>
);
