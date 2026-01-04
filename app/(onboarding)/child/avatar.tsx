import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, SlideInRight, ZoomIn } from 'react-native-reanimated';
import { useOnboarding } from '../../../contexts/OnboardingContext';

const AVATARS = [
  { id: 'hero', name: 'Space Explorer', image: require('../../../assets/child_avatar_hero.png') },
  { id: 'fantasy', name: 'Magic Knight', image: require('../../../assets/child_avatar_fantasy.png') },
];

const COSMETICS = [
  { id: 'cape', name: 'Golden Cape', icon: 'shirt', locked: true },
  { id: 'boots', name: 'Sparkle Boots', icon: 'flash', locked: true },
  { id: 'helmet', name: 'Hyper Helmet', icon: 'hardware-chip', locked: true },
];

export default function AvatarSelectionScreen() {
  const router = useRouter();
  const { updateData } = useOnboarding();
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0].id);

  const handleCosmeticPress = () => {
    Alert.alert(
      "It's a Legendary Item!",
      "Ooh! You can unlock this by reading 3 stories about Sharing.",
      [{ text: "Awesome!", onPress: () => console.log('Cosmetic Hook Triggered') }]
    );
  };

  const handleNext = () => {
    updateData({ avatarId: selectedAvatar });
    router.push('/(onboarding)/child/magic-moment');
  };

  return (
    <View className="flex-1 bg-[#FDFBF7]">
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        <Animated.View entering={FadeIn.delay(200)}>
          <Text className="text-3xl font-bold text-center text-primary-900 mb-2">Build Your Hero</Text>
          <Text className="text-lg text-center text-gray-500 mb-8">Choose who you want to be!</Text>
        </Animated.View>

        {/* Avatar Swipe Area (Simplified as two huge cards) */}
        <View className="flex-row justify-center mb-8 gap-4">
          {AVATARS.map((avatar, index) => (
            <TouchableOpacity
              key={avatar.id}
              onPress={() => setSelectedAvatar(avatar.id)}
              className={`items-center p-4 rounded-3xl border-4 ${selectedAvatar === avatar.id
                ? 'border-primary-500 bg-primary-50 scale-105'
                : 'border-transparent bg-white'
                }`}
            >
              <Image source={avatar.image} style={{ width: 120, height: 120, resizeMode: 'contain' }} />
              <Text className={`font-bold mt-2 ${selectedAvatar === avatar.id ? 'text-primary-700' : 'text-gray-400'}`}>
                {avatar.name}
              </Text>
              {selectedAvatar === avatar.id && (
                <View className="absolute top-2 right-2 bg-primary-500 rounded-full p-1">
                  <Ionicons name="checkmark" size={16} color="white" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Cosmetics Shelf (The Hook) */}
        <Animated.View entering={FadeIn.delay(400).duration(600)} className="bg-white p-6 rounded-3xl border border-gray-100 mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-800">Hero Gear</Text>
            <View className="flex-row items-center bg-yellow-100 px-2 py-1 rounded-full">
              <Ionicons name="lock-closed" size={12} color="#854d0e" />
              <Text className="text-xs font-bold text-yellow-800 ml-1">LOCKED</Text>
            </View>
          </View>
          <View className="flex-row justify-between">
            {COSMETICS.map((item, idx) => (
              <TouchableOpacity
                key={item.id}
                onPress={handleCosmeticPress}
                className="items-center w-[30%]"
              >
                <View className="w-16 h-16 bg-gray-100 rounded-2xl items-center justify-center mb-2 border-2 border-dashed border-gray-300">
                  <Ionicons name={item.icon as any} size={32} color="#9ca3af" />
                </View>
                <Text className="text-xs text-center text-gray-500 font-medium">{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Floating Action Button */}
      <Animated.View entering={ZoomIn.delay(600)} className="absolute bottom-10 left-6 right-6">
        <TouchableOpacity
          onPress={handleNext}
          className="bg-primary-600 h-16 rounded-full items-center justify-center flex-row"
        >
          <Text className="text-white text-xl font-bold mr-2">I'm Ready!</Text>
          <Ionicons name="arrow-forward" size={24} color="white" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
