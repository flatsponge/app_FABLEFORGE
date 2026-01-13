import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeIn, FadeOut, FadeInUp, FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { StoryGenerationGrid } from './StoryGenerationGrid';

interface TeaserGenerationProgressProps {
  title?: string;
  subtitle?: string;
  progress?: number;
  onComplete?: () => void;
}

/**
 * A reusable UI-only loading component for teaser/story generation.
 * Wraps StoryGenerationGrid with styled title and subtitle.
 * Contains no Convex calls, navigation, or state management - purely presentational.
 */
export const TeaserGenerationProgress: React.FC<TeaserGenerationProgressProps> = ({
  title = 'Creating your magical story...',
  subtitle = '✨ This is going to be amazing! ✨',
  progress = 100,
  onComplete,
}) => {
  return (
    <LinearGradient
      colors={['#FEF7ED', '#FFF7ED', '#FFFBEB']}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
      }}
    >
      <Animated.View
        entering={FadeIn}
        exiting={FadeOut}
        style={{ alignItems: 'center', width: '100%' }}
      >
        <Animated.View
          style={{ marginBottom: 32 }}
          entering={FadeInDown.springify()}
        >
          <StoryGenerationGrid
            progress={progress}
            onComplete={onComplete}
          />
        </Animated.View>

        <Animated.Text
          entering={FadeInUp.delay(200)}
          style={{
            fontSize: 22,
            fontWeight: '800',
            color: '#1F2937',
            textAlign: 'center',
          }}
        >
          {title}
        </Animated.Text>

        <Animated.Text
          entering={FadeInUp.delay(400)}
          style={{
            fontSize: 16,
            color: '#7C3AED',
            fontWeight: '600',
            marginTop: 8,
            textAlign: 'center',
          }}
        >
          {subtitle}
        </Animated.Text>
      </Animated.View>
    </LinearGradient>
  );
};
