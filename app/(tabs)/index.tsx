import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

import { UnifiedHeader } from '@/components/UnifiedHeader';
import { FeaturedCard } from '@/components/FeaturedCard';
import { FulfillmentTracker } from '@/components/FulfillmentTracker';
import { LibraryView } from '@/components/LibraryView';
import { Book } from '@/types';

export default function HomeScreen() {
  const router = useRouter();
  const scrollY = useSharedValue(0);
  const dbSkills = useQuery(api.onboarding.getUserSkills);
  // Derive overall score from main scores (which are derived from sub-scores)
  const growthScore = dbSkills 
    ? (() => {
        const skillKeys = ['empathy', 'bravery', 'honesty', 'teamwork', 'creativity', 'gratitude', 'problemSolving', 'responsibility', 'patience', 'curiosity'] as const;
        let total = 0;
        for (const key of skillKeys) {
          const skill = dbSkills[key];
          const mainScore = skill.subSkills.length > 0
            ? Math.round(skill.subSkills.reduce((sum, sub) => sum + sub.value, 0) / skill.subSkills.length)
            : skill.progress;
          total += mainScore;
        }
        return Math.round(total / skillKeys.length);
      })()
    : 84;

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

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
      <View className="absolute top-0 left-0 right-0 z-10">
        <UnifiedHeader variant="default" title="FableTales" scrollY={scrollY} />
      </View>

      <Animated.ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <View className="pt-28 px-4 pb-2">
          <Text className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            FableTales
          </Text>
        </View>

        <FeaturedCard onRead={handleRead} />
        <FulfillmentTracker score={growthScore} onPress={handleFulfillmentPress} />
        <LibraryView onBookClick={handleBookClick} isHome={true} />
      </Animated.ScrollView>
    </View>
  );
}
