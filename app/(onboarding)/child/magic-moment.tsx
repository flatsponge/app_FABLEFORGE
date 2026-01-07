import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut, ZoomIn, SlideInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    <LinearGradient
      colors={['#FEF7ED', '#FFF7ED', '#FFFBEB']}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 items-center justify-center px-6">
        {/* PHASE 1: INPUT */}
        {phase === 'input' && (
          <Animated.View entering={FadeIn} exiting={FadeOut} className="items-center w-full">
            <View className="w-24 h-24 bg-purple-100 rounded-full items-center justify-center mb-8 border-4 border-purple-200">
              <Ionicons name="mic" size={48} color="#7C3AED" />
            </View>
            <Text className="text-3xl text-gray-900 font-extrabold text-center mb-4">
              What did you do today?
            </Text>
            <Text className="text-gray-600 text-center mb-12 text-lg px-4">
              Tell me something that happened, and I'll turn it into a story!
            </Text>

            <TouchableOpacity
              onPress={startMagic}
              className="w-full bg-blue-500 py-5 rounded-2xl items-center shadow-lg shadow-blue-200"
            >
              <Text className="text-white text-xl font-bold">"I played with my dog!"</Text>
              <Text className="text-blue-100 text-xs mt-1 font-medium">(Tap to say this)</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* PHASE 2: GENERATING */}
        {phase === 'generating' && (
          <Animated.View entering={FadeIn} exiting={FadeOut} className="items-center">
            <ActivityIndicator size="large" color="#7C3AED" />
            <Text className="text-gray-900 text-xl font-bold mt-6 text-center">
              Weaving magic from your day...
            </Text>
            <Text className="text-purple-600 mt-2 font-medium">Adding dragons... 🐉</Text>
          </Animated.View>
        )}

        {/* PHASE 3: PREVIEW */}
        {phase === 'preview' && (
          <Animated.View entering={FadeIn.duration(600)} className="w-full h-full pt-4 pb-8 flex-col justify-between">
            <View>
              <View className="bg-white p-6 rounded-3xl mb-6 shadow-sm border border-gray-100">
                <Text className="text-purple-600 font-bold tracking-widest text-xs uppercase mb-2">New Story Created!</Text>
                <Text className="text-3xl text-gray-900 font-extrabold leading-tight">
                  The Space Explorer & The Dog's Big Adventure
                </Text>
              </View>

              {/* Book Cover Placeholder */}
              <View className="w-full aspect-[3/4] bg-gray-100 rounded-2xl border-4 border-white shadow-xl items-center justify-center overflow-hidden mb-6 relative">
                <Ionicons name="book" size={80} color="#9CA3AF" />
                <View className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex justify-end p-6">
                  <Text className="text-white font-serif italic text-lg text-center font-medium opacity-90">
                    "Once upon a time, in a galaxy not so far away..."
                  </Text>
                </View>
              </View>
            </View>

            <View>
              <Text className="text-gray-600 text-center mb-4 font-medium">
                Want to see what happens next?
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/(onboarding)/quiz/processing')}
                className="w-full bg-[#10b981] py-5 rounded-full items-center flex-row justify-center shadow-lg shadow-emerald-200 border-b-4 border-emerald-600"
              >
                <Ionicons name="lock-closed" size={24} color="white" style={{ marginRight: 8 }} />
                <Text className="text-white text-xl font-bold">Ask Parent to Unlock!</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )
        }
      </SafeAreaView>
    </LinearGradient >
  );
}
