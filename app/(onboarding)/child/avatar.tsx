import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  withRepeat,
} from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import { LinearGradient } from 'expo-linear-gradient';
import { BASE_AVATARS } from '../../../constants/data';

// Types
type SelectionMode = 'select' | 'upload' | 'describe' | null;
type GenerationStep = 'input' | 'processing' | 'reveal';



const { width } = Dimensions.get('window');

export default function AvatarSelectionScreen() {
  const router = useRouter();
  const { updateData } = useOnboarding();

  // State
  const [mode, setMode] = useState<SelectionMode>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [generationStep, setGenerationStep] = useState<GenerationStep>('input');
  const [description, setDescription] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedAvatar, setGeneratedAvatar] = useState<any>(null); // Placeholder for generated result

  // Animations
  const shake = useSharedValue(0);

  // Shake animation for Magic Box
  const startMagic = () => {
    setGenerationStep('processing');
    shake.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(0, { duration: 50 })
      ),
      20, // repeats
      true,
      undefined,
      // Callback after animation? Hard to do with withRepeat
    );

    // Simulate API call
    setTimeout(() => {
      // Create a mock "generated" avatar
      const mockResult = {
        id: 'generated_custom',
        name: uploadedImage ? 'Your Toy!' : 'Magic Friend!',
        image: uploadedImage ? { uri: uploadedImage } : BASE_AVATARS[0].image, // Fallback to bear if description
      };
      setGeneratedAvatar(mockResult);
      setSelectedAvatar(mockResult.id);
      setGenerationStep('reveal');
      shake.value = 0;
    }, 3500);
  };

  const shakeStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shake.value }],
    };
  });

  const pickImage = async () => {
    // Request permissions first
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setUploadedImage(result.assets[0].uri);
      startMagic();
    } else {
      // User cancelled, go back to main menu
      setMode(null);
    }
  };

  const handleDescriptionSubmit = () => {
    if (description.trim().length > 0) {
      startMagic();
    }
  };

  const handleNext = () => {
    if (selectedAvatar) {
      updateData({ avatarId: selectedAvatar });
      router.push('/(onboarding)/child/magic-moment');
    }
  };

  const handleBack = () => {
    if (mode) {
      setMode(null);
      setGenerationStep('input');
      setUploadedImage(null);
      setDescription('');
      setSelectedAvatar(null);
    } else {
      router.back();
    }
  };

  // Render Functions
  const renderMainOptions = () => (
    <Animated.View entering={FadeInDown.delay(200)} className="flex-1 w-full px-4 gap-4">
      <TouchableOpacity
        onPress={() => setMode('select')}
        className="w-full bg-white p-6 rounded-3xl shadow-sm border border-orange-100 flex-row items-center gap-4"
      >
        <View className="bg-orange-100 p-4 rounded-full">
          <Ionicons name="grid" size={32} color="#f97316" />
        </View>
        <View className="flex-1">
          <Text className="text-xl font-bold text-gray-900">Pick a Hero</Text>
          <Text className="text-gray-500">Choose from our favorite friends</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#d1d5db" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => { setMode('upload'); pickImage(); }}
        className="w-full bg-white p-6 rounded-3xl shadow-sm border border-purple-100 flex-row items-center gap-4"
      >
        <View className="bg-purple-100 p-4 rounded-full">
          <Ionicons name="camera" size={32} color="#a855f7" />
        </View>
        <View className="flex-1">
          <Text className="text-xl font-bold text-gray-900">Upload a Photo</Text>
          <Text className="text-gray-500">Turn your toy into a character!</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#d1d5db" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setMode('describe')}
        className="w-full bg-white p-6 rounded-3xl shadow-sm border border-blue-100 flex-row items-center gap-4"
      >
        <View className="bg-blue-100 p-4 rounded-full">
          <Ionicons name="create" size={32} color="#3b82f6" />
        </View>
        <View className="flex-1">
          <Text className="text-xl font-bold text-gray-900">Describe It</Text>
          <Text className="text-gray-500">Write about your magical friend</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#d1d5db" />
      </TouchableOpacity>
    </Animated.View>
  );

  const renderBaseSelection = () => (
    <View className="flex-1 w-full px-2">
      <Text className="text-2xl font-bold text-center text-gray-800 mb-6">Who will join you?</Text>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="flex-row flex-wrap justify-center gap-4">
          {BASE_AVATARS.map((avatar) => (
            <TouchableOpacity
              key={avatar.id}
              onPress={() => setSelectedAvatar(avatar.id)}
              className={`p-2 rounded-3xl border-4 ${selectedAvatar === avatar.id ? 'border-orange-500 bg-orange-50' : 'border-transparent bg-white'
                }`}
              style={{ width: (width / 2) - 24 }}
            >
              <Image source={avatar.image} className="w-full h-32" resizeMode="contain" />
              <Text className={`text-center font-bold mt-2 ${selectedAvatar === avatar.id ? 'text-orange-700' : 'text-gray-400'}`}>
                {avatar.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      {/* Floating Action Button */}
      {selectedAvatar && (
        <Animated.View entering={FadeIn.duration(300)} className="absolute bottom-8 left-4 right-4">
          <TouchableOpacity
            onPress={handleNext}
            className="bg-orange-500 h-16 rounded-full items-center justify-center flex-row shadow-lg shadow-orange-200"
          >
            <Text className="text-white text-xl font-bold mr-2">Let&apos;s Go!</Text>
            <Ionicons name="arrow-forward" size={24} color="white" />
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );

  const renderMagicBox = () => (
    <View className="flex-1 items-center justify-center w-full px-6">
      <Animated.View style={shakeStyle}>
        <LinearGradient
          colors={['#8B5CF6', '#D946EF']}
          className="w-64 h-64 rounded-3xl items-center justify-center shadow-2xl shadow-purple-500/50"
        >
          <Text className="text-8xl">🎁</Text>
        </LinearGradient>
      </Animated.View>
      <Text className="text-xl font-bold text-purple-900 mt-8 text-center">Creating Magic...</Text>
      <Text className="text-gray-500 text-center mt-2">Sprinkling some glitter!</Text>
    </View>
  );

  const renderReveal = () => (
    <View className="flex-1 items-center justify-center w-full px-6">
      <Animated.View entering={FadeInDown.springify()} className="items-center">
        <Text className="text-3xl font-bold text-gray-900 mb-8">It&apos;s Alive! ✨</Text>

        <View className="w-64 h-64 bg-white rounded-full items-center justify-center shadow-xl shadow-orange-200 mb-8 border-4 border-orange-100">
          <Image
            source={generatedAvatar?.image}
            className="w-48 h-48 rounded-full"
            resizeMode="contain"
          />
        </View>

        <Text className="text-xl font-semibold text-gray-600 mb-12">
          {generatedAvatar?.name} is ready for adventure!
        </Text>

        <TouchableOpacity
          onPress={handleNext}
          className="bg-green-500 w-full h-16 rounded-full items-center justify-center flex-row shadow-lg shadow-green-200"
        >
          <Text className="text-white text-xl font-bold mr-2">Start Adventure</Text>
          <Ionicons name="star" size={24} color="white" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );

  const renderDescriptionInput = () => (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 w-full px-6">
      <View className="flex-1 justify-center">
        <Text className="text-2xl font-bold text-center text-gray-800 mb-2">Describe Your Friend</Text>
        <Text className="text-center text-gray-500 mb-8">What does it look like? Is it fluffy? Does it have wheels?</Text>

        <View className="bg-white p-4 rounded-3xl border-2 border-blue-100 shadow-sm mb-6">
          <TextInput
            className="text-lg text-gray-800 min-h-[120px]"
            placeholder="e.g., A happy blue robot with wings..."
            multiline
            value={description}
            onChangeText={setDescription}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          onPress={handleDescriptionSubmit}
          disabled={description.length === 0}
          className={`h-16 rounded-full items-center justify-center flex-row shadow-lg ${description.length > 0 ? 'bg-blue-500 shadow-blue-200' : 'bg-gray-300'
            }`}
        >
          <Text className="text-white text-xl font-bold mr-2">Create Magic</Text>
          <Ionicons name="color-wand" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );

  return (
    <View className="flex-1 bg-[#FDFBF7]">
      {/* Header Navigation */}
      <View className="pt-16 px-6 pb-4 flex-row items-center justify-between z-10">
        <TouchableOpacity onPress={handleBack} className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm">
          <Ionicons name="arrow-back" size={24} color="#4b5563" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} scrollEnabled={mode !== 'describe' && generationStep !== 'processing'}>
        <View className="flex-1 items-center pb-12">
          {/* Title Area - Hide during processing/result to focus */}
          {!mode && (
            <Animated.View entering={FadeInDown} className="mb-10 items-center">
              <Text className="text-3xl font-extrabold text-gray-900 text-center">Your Adventure Pal</Text>
              <Text className="text-lg text-gray-500 mt-2 text-center">How do you want to start?</Text>
            </Animated.View>
          )}

          {/* Conditional Rendering based on state */}
          {!mode && renderMainOptions()}

          {mode === 'select' && renderBaseSelection()}

          {(mode === 'upload' || mode === 'describe') && (
            <>
              {generationStep === 'input' && mode === 'describe' && renderDescriptionInput()}
              {generationStep === 'processing' && renderMagicBox()}
              {generationStep === 'reveal' && renderReveal()}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
