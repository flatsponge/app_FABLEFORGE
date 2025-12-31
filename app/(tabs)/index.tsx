import React from 'react';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';

import { UnifiedHeader } from '@/components/UnifiedHeader';
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
    <View className="flex-1 bg-background">
      <UnifiedHeader variant="default" title="StoryTime" />
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <FeaturedCard onRead={handleRead} />
        <FulfillmentTracker onPress={handleFulfillmentPress} />
        <LibraryView onBookClick={handleBookClick} isHome={true} />
      </ScrollView>
    </View>
  );
}
