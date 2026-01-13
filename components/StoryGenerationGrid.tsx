import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
  withSequence,
  interpolateColor,
  Easing,
} from 'react-native-reanimated';

interface StoryGenerationGridProps {
  progress: number;
  onComplete?: () => void;
}

const GRID_SIZE = 10;
const TOTAL_DOTS = 100;
const CONTAINER_SIZE = 320;
const GAP = 4;
const DOT_SIZE = (CONTAINER_SIZE - (GRID_SIZE - 1) * GAP) / GRID_SIZE;

const COLOR_PURPLE = '#7C3AED';
const COLOR_PINK = '#EC4899';
const COLOR_BLUE = '#3B82F6';
const COLOR_GREEN = '#10B981';
const COLOR_INACTIVE = '#E5E7EB';

const getDotColor = (index: number) => {
  const row = Math.floor(index / GRID_SIZE);
  if (row <= 2) return COLOR_PURPLE;
  if (row <= 4) return COLOR_PINK;
  if (row <= 6) return COLOR_BLUE;
  return COLOR_GREEN;
};

// Optimized for 25-30 second total duration
const getInterval = (index: number): number => {
  if (index < 40) {
    // First 40 dots: fast (~3-4 seconds total)
    return 80 + Math.random() * 30;
  } else if (index < 80) {
    // Middle 40 dots: moderate pace (~10-12 seconds total)
    const progress = (index - 40) / 40;
    return 150 + progress * 200 + Math.random() * 50;
  } else if (index < 95) {
    // Dots 80-95: slower (~8-10 seconds total)
    const progress = (index - 80) / 15;
    return 400 + progress * 300 + Math.random() * 100;
  } else {
    // Last 5 dots: final stretch (~3-4 seconds total)
    return 500 + Math.random() * 300;
  }
};

const Dot = React.memo(({ index, active, color }: { index: number; active: boolean; color: string }) => {
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0.3);
  const activeValue = useSharedValue(0);

  useEffect(() => {
    if (active) {
      activeValue.value = withTiming(1, { duration: 400 });
      
      scale.value = withSequence(
        withTiming(1.2, { duration: 200, easing: Easing.out(Easing.ease) }),
        withSpring(1, { damping: 12, stiffness: 100 })
      );
      
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      activeValue.value = withTiming(0, { duration: 300 });
      scale.value = withTiming(0.8, { duration: 300 });
      opacity.value = withTiming(0.3, { duration: 300 });
    }
  }, [active]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      activeValue.value,
      [0, 1],
      [COLOR_INACTIVE, color]
    );

    return {
      backgroundColor,
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
      shadowColor: color,
      shadowOpacity: activeValue.value * 0.4,
      shadowRadius: activeValue.value * 6,
      shadowOffset: { width: 0, height: 0 },
      elevation: activeValue.value * 2,
    };
  });

  return (
    <Animated.View
      style={[
        styles.dot,
        animatedStyle,
      ]}
    />
  );
});

export const StoryGenerationGrid: React.FC<StoryGenerationGridProps> = ({ progress, onComplete }) => {
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    
    if (activeCount < Math.min(progress, TOTAL_DOTS)) {
      const interval = getInterval(activeCount);
      
      timeoutId = setTimeout(() => {
        setActiveCount((prev) => {
          const next = prev + 1;
          if (next === TOTAL_DOTS && onComplete) {
            onComplete();
          }
          return next;
        });
      }, interval);
    }

    return () => clearTimeout(timeoutId);
  }, [activeCount, progress, onComplete]);

  const dots = useMemo(() => {
    return Array.from({ length: TOTAL_DOTS }).map((_, i) => (
      <Dot
        key={i}
        index={i}
        active={i < activeCount}
        color={getDotColor(i)}
      />
    ));
  }, [activeCount]);

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {dots}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CONTAINER_SIZE,
    height: CONTAINER_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: CONTAINER_SIZE,
    gap: GAP,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: 4,
  },
});
