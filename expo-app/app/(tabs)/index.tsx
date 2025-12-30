import React from 'react';
import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

import { Header } from '@/components/Header';
import { FeaturedCard } from '@/components/FeaturedCard';
import { FulfillmentTracker } from '@/components/FulfillmentTracker';
import { LibraryView } from '@/components/LibraryView';
import { Book } from '@/types';

export default function HomeScreen() {
  const router = useRouter();

  const handleBookClick = (book: Book) => {
    router.push(`/book/${book.id}`);
  };

  const handleRead = (book: Book) => {
    router.push(`/reading/${book.id}`);
  };

  const handleFulfillmentPress = () => {
    router.push('/stats');
  };

  return (
    <ScrollView 
      className="flex-1 bg-background"
      showsVerticalScrollIndicator={false}
    >
      <Header />
      <FeaturedCard onRead={handleRead} />
      <FulfillmentTracker onPress={handleFulfillmentPress} />
      <LibraryView onBookClick={handleBookClick} isHome={true} />
    </ScrollView>
  );
}
