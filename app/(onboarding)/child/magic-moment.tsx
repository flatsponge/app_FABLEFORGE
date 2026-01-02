import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut, ZoomIn, SlideInUp } from 'react-native-reanimated';

export default function MagicMomentScreen() {
  const router = useRouter();
  const [phase, setPhase] = useState<'input' | 'generating' | 'preview'>('input');

  const startMagic = () => {
    setPhase('generating');
    setTimeout(() => {
      setPhase('preview');
    }, 2500); // Fake generation time
  };

  return (
    <View className="flex-1 bg-[#1a103c] items-center justify-center px-6">
      {/* PHASE 1: INPUT */}
      {phase === 'input' && (
        <Animated.View entering={FadeIn} exiting={FadeOut} className="items-center w-full">
          <View className="w-24 h-24 bg-primary-900 rounded-full items-center justify-center mb-8 border-2 border-primary-400">
            <Ionicons name="mic" size={48} color="#c084fc" />
          </View>
          <Text className="text-3xl text-white font-bold text-center mb-4">
            What did you do today?
          </Text>
          <Text className="text-white text-center mb-12 text-lg">
            Tell me something that happened, and I'll turn it into a story!
          </Text>

          <TouchableOpacity
            onPress={startMagic}
            className="w-full bg-primary-500 py-5 rounded-2xl items-center"
          >
            <Text className="text-white text-xl font-bold">"I played with my dog!"</Text>
            <Text className="text-white text-xs mt-1">(Tap to say this)</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* PHASE 2: GENERATING */}
      {phase === 'generating' && (
        <Animated.View entering={FadeIn} exiting={FadeOut} className="items-center">
          <ActivityIndicator size="large" color="#c084fc" />
          <Text className="text-white text-xl font-medium mt-6 text-center">
            Weaving magic from your day...
          </Text>
          <Text className="text-primary-300 mt-2">Adding dragons...</Text>
        </Animated.View>
      )}

      {/* PHASE 3: PREVIEW */}
      {phase === 'preview' && (
        <Animated.View entering={FadeIn.duration(600)} className="w-full h-full pt-12 pb-8 flex-col justify-between">
          <View>
            <View className="bg-gray-800 p-4 rounded-xl mb-6">
              <Text className="text-primary-300 font-bold tracking-widest text-xs uppercase mb-2">New Story Created!</Text>
              <Text className="text-3xl text-white font-bold leading-tight">
                The Space Explorer & The Dog's Big Adventure
              </Text>
            </View>

            {/* Book Cover Placeholder */}
            <View className="w-full aspect-[3/4] bg-gray-800 rounded-lg border border-white/10 items-center justify-center overflow-hidden mb-6 relative">
              <Ionicons name="book" size={80} color="#374151" />
              <View className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex justify-end p-6">
                <Text className="text-white font-serif italic text-lg text-center">
                  "Once upon a time, in a galaxy not so far away..."
                </Text>
              </View>
            </View>
          </View>

          <View>
            <Text className="text-white text-center mb-4 font-medium">
              Want to see what happens next?
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(onboarding)/parent/results-intro')}
              className="w-full bg-[#10b981] py-5 rounded-full items-center flex-row justify-center"
            >
              <Ionicons name="lock-closed" size={24} color="white" style={{ marginRight: 8 }} />
              <Text className="text-white text-xl font-bold">Ask Parent to Unlock!</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )
      }
    </View >
  );
}
