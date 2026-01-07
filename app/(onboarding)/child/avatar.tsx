import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  FadeInDown,
  FadeInUp,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  withRepeat,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import { LinearGradient } from 'expo-linear-gradient';
import { BASE_AVATARS } from '../../../constants/data';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Sparkles, ArrowLeft, Camera, Pencil, Grid3X3, ArrowRight, Star } from 'lucide-react-native';

// Types
type SelectionMode = 'select' | 'upload' | 'describe' | null;
type GenerationStep = 'input' | 'processing' | 'reveal';

// Chunky 3D button component matching child-hub style
const ChunkyButton = ({
  onPress,
  children,
  bgColor = '#ffffff',
  borderColor = '#e2e8f0',
  size = 'medium',
  disabled = false,
  style,
}: {
  onPress?: () => void;
  children: React.ReactNode;
  bgColor?: string;
  borderColor?: string;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: any;
}) => {
  const pressed = useSharedValue(0);

  const sizeStyles = {
    small: { borderBottom: 4, borderSide: 2, borderTop: 2 },
    medium: { borderBottom: 6, borderSide: 3, borderTop: 3 },
    large: { borderBottom: 10, borderSide: 4, borderTop: 4 },
  };

  const s = sizeStyles[size];

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(pressed.value, [0, 1], [0, s.borderBottom - 3]);
    return {
      transform: [{ translateY }],
    };
  });

  const animatedBorderStyle = useAnimatedStyle(() => {
    const borderBottomWidth = interpolate(pressed.value, [0, 1], [s.borderBottom, 3]);
    return {
      borderBottomWidth,
    };
  });

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={() => {
        if (!disabled) {
          pressed.value = withSpring(1, { damping: 25, stiffness: 600 });
        }
      }}
      onPressOut={() => {
        if (!disabled) {
          pressed.value = withSpring(0, { damping: 25, stiffness: 600 });
        }
      }}
      style={style}
    >
      <Animated.View
        style={[
          animatedStyle,
          animatedBorderStyle,
          {
            borderTopWidth: s.borderTop,
            borderLeftWidth: s.borderSide,
            borderRightWidth: s.borderSide,
            borderColor: borderColor,
            backgroundColor: bgColor,
            borderRadius: 20,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
};

export default function AvatarSelectionScreen() {
  const router = useRouter();
  const { updateData } = useOnboarding();

  // State
  const [mode, setMode] = useState<SelectionMode>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [generationStep, setGenerationStep] = useState<GenerationStep>('input');
  const [description, setDescription] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedAvatar, setGeneratedAvatar] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Animations
  const shake = useSharedValue(0);

  // Initial selection - set first avatar as default
  useEffect(() => {
    if (!selectedAvatar && BASE_AVATARS.length > 0) {
      setSelectedAvatar(BASE_AVATARS[0].id);
    }
  }, []);

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
      20,
      true
    );

    setTimeout(() => {
      const mockResult = {
        id: 'generated_custom',
        name: uploadedImage ? 'Your Toy!' : 'Magic Friend!',
        image: uploadedImage ? { uri: uploadedImage } : BASE_AVATARS[0].image,
      };
      setGeneratedAvatar(mockResult);
      setSelectedAvatar(mockResult.id);
      setGenerationStep('reveal');
      shake.value = 0;
    }, 3500);
  };

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
  }));

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setUploadedImage(result.assets[0].uri);
      startMagic();
    } else {
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

  // Main options screen - playful cards
  const renderMainOptions = () => (
    <Animated.View entering={FadeInDown.delay(200)} style={{ flex: 1, width: '100%', paddingHorizontal: 20, gap: 16 }}>
      {/* Pick a Hero */}
      <ChunkyButton
        onPress={() => setMode('select')}
        bgColor="#FEF3C7"
        borderColor="#F59E0B"
        size="large"
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, gap: 16 }}>
          <View style={{ backgroundColor: '#FCD34D', padding: 16, borderRadius: 20 }}>
            <Grid3X3 size={32} color="#92400E" strokeWidth={2.5} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#92400E' }}>Pick a Friend! 🎉</Text>
            <Text style={{ fontSize: 14, color: '#B45309', marginTop: 2 }}>Choose your adventure buddy</Text>
          </View>
          <ArrowRight size={24} color="#92400E" />
        </View>
      </ChunkyButton>

      {/* Upload Photo */}
      <ChunkyButton
        onPress={() => { setMode('upload'); pickImage(); }}
        bgColor="#EDE9FE"
        borderColor="#8B5CF6"
        size="large"
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, gap: 16 }}>
          <View style={{ backgroundColor: '#C4B5FD', padding: 16, borderRadius: 20 }}>
            <Camera size={32} color="#5B21B6" strokeWidth={2.5} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#5B21B6' }}>Magic Photo! 📸</Text>
            <Text style={{ fontSize: 14, color: '#7C3AED', marginTop: 2 }}>Turn your toy into a hero</Text>
          </View>
          <ArrowRight size={24} color="#5B21B6" />
        </View>
      </ChunkyButton>

      {/* Describe It */}
      <ChunkyButton
        onPress={() => setMode('describe')}
        bgColor="#DBEAFE"
        borderColor="#3B82F6"
        size="large"
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, gap: 16 }}>
          <View style={{ backgroundColor: '#93C5FD', padding: 16, borderRadius: 20 }}>
            <Pencil size={32} color="#1E40AF" strokeWidth={2.5} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#1E40AF' }}>Dream It Up! ✨</Text>
            <Text style={{ fontSize: 14, color: '#2563EB', marginTop: 2 }}>Describe your magical friend</Text>
          </View>
          <ArrowRight size={24} color="#1E40AF" />
        </View>
      </ChunkyButton>
    </Animated.View>
  );

  // Get the currently selected avatar data
  const selectedAvatarData = BASE_AVATARS.find(a => a.id === selectedAvatar) || BASE_AVATARS[0];

  // Avatar selection with grid selector (no swiping - matches child-hub pattern)
  const renderBaseSelection = () => (
    <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>
      <Animated.View entering={FadeInDown} style={{ marginBottom: 16, alignItems: 'center' }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: '800',
            textAlign: 'center',
            color: '#1F2937',
            marginBottom: 8,
          }}
        >
          Who will join you? 🌟
        </Text>
        <Text
          style={{
            fontSize: 18,
            textAlign: 'center',
            color: '#6B7280',
          }}
        >
          Tap to pick your friend!
        </Text>
      </Animated.View>

      {/* Selected Avatar Display */}
      <Animated.View
        entering={ZoomIn.springify()}
        style={{
          alignItems: 'center',
          marginBottom: 20,
          backgroundColor: 'rgba(255,255,255,0.5)',
          padding: 24,
          borderRadius: 40,
          borderWidth: 4,
          borderColor: 'rgba(255,255,255,0.8)',
        }}
      >
        <Image
          source={selectedAvatarData.image}
          style={{ width: 200, height: 200 }}
          resizeMode="contain"
        />
        <Text style={{
          fontSize: 32,
          fontWeight: '900',
          color: '#4B5563',
          textAlign: 'center',
          marginTop: 12,
          textShadowColor: 'rgba(0,0,0,0.1)',
          textShadowOffset: { width: 0, height: 2 },
          textShadowRadius: 4,
        }}>
          {selectedAvatarData.name}
        </Text>
      </Animated.View>

      {/* Avatar Grid Selector */}
      <View style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 16,
        marginHorizontal: 20,
        borderWidth: 4,
        borderColor: '#E5E7EB',
        width: '100%',
        maxWidth: 400,
      }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {BASE_AVATARS.map((avatar, index) => {
              const isSelected = selectedAvatar === avatar.id;
              return (
                <Animated.View
                  key={avatar.id}
                  entering={FadeInDown.delay(index * 50)}
                >
                  <Pressable
                    onPress={() => {
                      setSelectedAvatar(avatar.id);
                      setCurrentIndex(index);
                    }}
                    style={[
                      {
                        width: 80,
                        height: 80,
                        borderRadius: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isSelected ? '#FEF3C7' : '#F3F4F6',
                        borderWidth: 4,
                        borderColor: isSelected ? '#F59E0B' : '#E5E7EB',
                      },
                      isSelected && {
                        shadowColor: '#F59E0B',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 6,
                      },
                    ]}
                  >
                    <Image
                      source={avatar.image}
                      style={{ width: 60, height: 60 }}
                      resizeMode="contain"
                    />
                  </Pressable>
                </Animated.View>
              );
            })}
          </View>
        </ScrollView>

        {/* Swipe hint */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 12,
          gap: 6,
        }}>
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: '#9CA3AF',
            letterSpacing: 0.5,
          }}>
            Swipe for more
          </Text>
          <Text style={{ fontSize: 16 }}>👉</Text>
        </View>
      </View>

      {/* Start Button */}
      <Animated.View
        entering={FadeInUp.springify().delay(300)}
        style={{
          width: '100%',
          paddingHorizontal: 20,
          marginTop: 24,
        }}
      >
        <ChunkyButton
          onPress={handleNext}
          bgColor="#22C55E"
          borderColor="#15803D"
          size="large"
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 18, gap: 12 }}>
            <Text style={{ fontSize: 24, fontWeight: '800', color: 'white' }}>
              Pick {selectedAvatarData.name}!
            </Text>
            <ArrowRight size={28} color="white" strokeWidth={3} />
          </View>
        </ChunkyButton>
      </Animated.View>
    </View>
  );


  // Magic processing box
  const renderMagicBox = () => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%', paddingHorizontal: 24 }}>
      <Animated.View style={shakeStyle}>
        <LinearGradient
          colors={['#8B5CF6', '#D946EF', '#EC4899']}
          style={{
            width: 200,
            height: 200,
            borderRadius: 40,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#8B5CF6',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.5,
            shadowRadius: 20,
          }}
        >
          <Text style={{ fontSize: 80 }}>🎁</Text>
        </LinearGradient>
      </Animated.View>
      <Text style={{ fontSize: 24, fontWeight: '800', color: '#7C3AED', marginTop: 32, textAlign: 'center' }}>
        Creating Magic... ✨
      </Text>
      <Text style={{ fontSize: 16, color: '#9CA3AF', textAlign: 'center', marginTop: 8 }}>
        Sprinkling some sparkle dust!
      </Text>
    </View>
  );

  // Reveal screen
  const renderReveal = () => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%', paddingHorizontal: 24 }}>
      <Animated.View entering={FadeInDown.springify()} style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 32, fontWeight: '800', color: '#1F2937', marginBottom: 24 }}>
          It&apos;s Alive! 🎉
        </Text>

        <View
          style={{
            width: 200,
            height: 200,
            backgroundColor: '#FFFFFF',
            borderRadius: 100,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#FB923C',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            borderWidth: 6,
            borderColor: '#FED7AA',
            marginBottom: 24,
          }}
        >
          <Image
            source={generatedAvatar?.image}
            style={{ width: 140, height: 140, borderRadius: 70 }}
            resizeMode="contain"
          />
        </View>

        <Text style={{ fontSize: 18, fontWeight: '600', color: '#6B7280', marginBottom: 32, textAlign: 'center' }}>
          {generatedAvatar?.name} is ready for adventure!
        </Text>

        <ChunkyButton onPress={handleNext} bgColor="#22C55E" borderColor="#15803D" size="large" style={{ width: '100%' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 18, gap: 12 }}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: 'white' }}>Start Adventure!</Text>
            <Star size={24} color="white" fill="white" />
          </View>
        </ChunkyButton>
      </Animated.View>
    </View>
  );

  const renderDescriptionInput = () => (
    <View style={{ flex: 1, width: '100%', paddingHorizontal: 24 }}>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={{ fontSize: 28, fontWeight: '800', textAlign: 'center', color: '#1F2937', marginBottom: 8 }}>
          Dream It Up! ✨
        </Text>
        <Text style={{ textAlign: 'center', color: '#6B7280', marginBottom: 32, fontSize: 16 }}>
          What does your magical friend look like?
        </Text>

        <View
          style={{
            backgroundColor: '#FFFFFF',
            padding: 20,
            borderRadius: 24,
            borderWidth: 3,
            borderColor: '#DBEAFE',
            shadowColor: '#3B82F6',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            marginBottom: 24,
          }}
        >
          <TextInput
            style={{
              fontSize: 18,
              color: '#1F2937',
              minHeight: 120,
            }}
            placeholder="A happy blue robot with sparkly wings..."
            placeholderTextColor="#9CA3AF"
            multiline
            value={description}
            onChangeText={setDescription}
            textAlignVertical="top"
          />
        </View>

        <ChunkyButton
          onPress={handleDescriptionSubmit}
          disabled={description.length === 0}
          bgColor={description.length > 0 ? '#3B82F6' : '#D1D5DB'}
          borderColor={description.length > 0 ? '#1D4ED8' : '#9CA3AF'}
          size="large"
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 18, gap: 12 }}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: 'white' }}>Create Magic!</Text>
            <Sparkles size={24} color="white" />
          </View>
        </ChunkyButton>
      </View>
    </View>
  );

  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={['#FEF7ED', '#FFF7ED', '#FFFBEB']}
      style={{ flex: 1 }}
    >
      {/* Header */}
      <View style={{ paddingTop: insets.top + 20, paddingHorizontal: 20, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
        <ChunkyButton onPress={handleBack} bgColor="#FFFFFF" borderColor="#E5E7EB" size="small">
          <View style={{ padding: 10 }}>
            <ArrowLeft size={24} color="#4B5563" />
          </View>
        </ChunkyButton>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={insets.top + 20}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          scrollEnabled={mode !== 'describe' && generationStep !== 'processing'}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ flex: 1, alignItems: 'center', paddingBottom: 24 }}>
            {/* Title Area */}
            {!mode && (
              <Animated.View entering={FadeInDown} style={{ marginBottom: 32, alignItems: 'center', paddingHorizontal: 20 }}>
                <Text style={{ fontSize: 32, fontWeight: '800', color: '#1F2937', textAlign: 'center' }}>
                  Your Adventure Pal! 🦸
                </Text>
                <Text style={{ fontSize: 18, color: '#6B7280', marginTop: 8, textAlign: 'center' }}>
                  How do you want to start?
                </Text>
              </Animated.View>
            )}

            {/* Conditional Rendering */}
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
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
