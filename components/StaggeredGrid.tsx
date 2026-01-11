import React, { useCallback, useMemo } from 'react';
import { FlatList, View, ListRenderItem } from 'react-native';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';

// 1. Configuration Constants
const TOTAL_DOTS = 100;
const NUM_COLUMNS = 5;
const DOT_SIZE = 40;
const STAGGER_DELAY = 50; // ms between each dot starting

// 2. The Data Item Interface
interface DotItem {
  id: string;
  index: number;
}

// 3. Generate Data
const data: DotItem[] = Array.from({ length: TOTAL_DOTS }).map((_, i) => ({
  id: `dot-${i}`,
  index: i,
}));

// 4. Individual Animated Dot Component
// Memoized to prevent re-renders when parent updates
const AnimatedDot = React.memo(({ index }: { index: number }) => {
  return (
    <View className="flex-1 aspect-square items-center justify-center p-2">
      <MotiView
        from={{
          opacity: 0,
          scale: 0.5,
          shadowOpacity: 0,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          shadowOpacity: 0.8,
        }}
        // The "Glow" / Pulse effect using a separate loop
        transition={{
          type: 'timing',
          duration: 1000,
          // 3. Custom Easing
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          // 1. Staggered timing based on index
          delay: index * STAGGER_DELAY,
          // 4. Loop for pulse effect (optional - removing loop for entrance-only stagger, 
          // or add loop: true to a separate animate prop state for continuous)
        }}
        className="w-full h-full rounded-full bg-purple-500 shadow-purple-500/50"
      />
    </View>
  );
});

export const StaggeredGrid = () => {
  // 5. Efficient Rendering
  const renderItem: ListRenderItem<DotItem> = useCallback(({ item }) => {
    return <AnimatedDot index={item.index} />;
  }, []);

  const keyExtractor = useCallback((item: DotItem) => item.id, []);

  return (
    <View className="flex-1 bg-white pt-10">
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={NUM_COLUMNS}
        contentContainerClassName="p-4 gap-4"
        columnWrapperClassName="gap-4"
        // Performance Props
        initialNumToRender={20}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
