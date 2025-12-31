import React from 'react';
import { View, Text } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { BOOKS } from '../constants/data';
import { BookCard } from './BookCard';
import { Book } from '../types';

interface NewArrivalsProps {
  onBookClick?: (book: Book) => void;
}

export const NewArrivals: React.FC<NewArrivalsProps> = ({ onBookClick }) => (
  <View className="px-6 pb-28">
    <View className="flex-row justify-between items-end mb-4">
      <Text className="text-lg font-bold text-slate-700">New Adventures</Text>
      <ChevronRight size={20} color="#94a3b8" />
    </View>
    <View className="flex-row flex-wrap gap-5">
      {BOOKS.map((book) => (
        <View key={book.id} className="w-[47%]">
          <BookCard book={book} onClick={onBookClick} />
        </View>
      ))}
    </View>
  </View>
);
