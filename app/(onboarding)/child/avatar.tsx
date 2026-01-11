import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Alert,
  BackHandler,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Animated, {
  FadeIn, // Add FadeIn
  FadeInDown,
  FadeInUp,
  ZoomIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  withRepeat,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import { Asset } from 'expo-asset';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import { LinearGradient } from 'expo-linear-gradient';
import { BASE_AVATARS } from '../../../constants/data';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAction, useMutation, useConvexAuth } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { useFocusEffect } from '@react-navigation/native';

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
      {/* Fixed-height wrapper to prevent layout shifts during animation */}
      <View style={{ paddingBottom: s.borderBottom }}>
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
              // Negative margin to offset the paddingBottom of the wrapper
              marginBottom: -s.borderBottom,
            },
          ]}
        >
          {children}
        </Animated.View>
      </View>
    </Pressable>
  );
};

// Animated Avatar Grid Item with bubble-up effect
const AnimatedAvatarItem = ({
  avatar,
  isSelected,
  onSelect,
  index,
}: {
  avatar: { id: string; name: string; image: any };
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  // React to selection state changes for smooth, stable animation
  useEffect(() => {
    if (isSelected) {
      scale.value = withSpring(1.05, { damping: 30, stiffness: 300 }); // Stable lift
      translateY.value = withSpring(-2, { damping: 30, stiffness: 300 });
    } else {
      scale.value = withSpring(1, { damping: 30, stiffness: 300 }); // Return to start
      translateY.value = withSpring(0, { damping: 30, stiffness: 300 });
    }
  }, [isSelected]);

  const handlePress = () => {
    onSelect();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50)}
      style={animatedStyle}
    >
      <Pressable
        onPress={handlePress}
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
};

export default function AvatarSelectionScreen() {
  const router = useRouter();
  const { updateData, data } = useOnboarding();
  const { isAuthenticated } = useConvexAuth();
  const scrollViewRef = useRef<ScrollView>(null);
  const isMountedRef = useRef(true);
  const hasNavigatedRef = useRef(false);

  // Convex actions
  const generateUploadUrl = useAction(api.imageGeneration.generateUploadUrl);
  const queueMascotJob = useMutation(api.mascotGeneration.queueMascotJob);
  const saveGeneratedMascot = useMutation(api.onboarding.saveGeneratedMascot);

  // State
  const [mode, setMode] = useState<SelectionMode>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [generationStep, setGenerationStep] = useState<GenerationStep>('input');
  const [description, setDescription] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedAvatar, setGeneratedAvatar] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Animations
  const shake = useSharedValue(0);

  // Reset scroll position when mode changes
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: false });
    }
  }, [mode, generationStep]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => true);
      return () => subscription.remove();
    }, [])
  );

  // Initial selection - set first avatar as default
  useEffect(() => {
    if (!selectedAvatar && BASE_AVATARS.length > 0) {
      setSelectedAvatar(BASE_AVATARS[0].id);
    }
  }, []);

  // Start shake animation
  const startShakeAnimation = () => {
    shake.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(0, { duration: 50 })
      ),
      -1, // Infinite repeat until stopped
      true
    );
  };


  const stopShakeAnimation = () => {
    shake.value = withTiming(0, { duration: 100 });
  };

  // Simple UUID generator fallback
  const generateUUID = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const setIfMounted = useCallback((update: () => void) => {
    if (isMountedRef.current) {
      update();
    }
  }, []);

  const navigateToMagicMoment = useCallback(() => {
    if (hasNavigatedRef.current) return;
    hasNavigatedRef.current = true;
    router.push('/(onboarding)/child/magic-moment');
  }, [router]);

  const returnToAvatar = useCallback(() => {
    if (!hasNavigatedRef.current) return;
    router.replace('/(onboarding)/child/avatar');
  }, [router]);

  const generateFromText = async (text: string) => {
    setIfMounted(() => {
      setIsGenerating(true);
      setGenerationError(null);
    });

    if (!isAuthenticated) {
      setIfMounted(() => {
        setGenerationError("Not authenticated");
        setIsGenerating(false);
      });
      Alert.alert("Authentication Error", "You need to be logged in to generate a mascot. Please try restarting the app.");
      return;
    }

    navigateToMagicMoment();

    try {
      const result = await queueMascotJob({
        generationType: "text",
        description: text,
      });

      if (result.success && result.jobId) {
        updateData({ mascotJobId: result.jobId });
      } else if (result.existingJobId) {
        updateData({ mascotJobId: result.existingJobId });
      } else {
        setIfMounted(() => {
          setGenerationError(result.error || 'Failed to queue mascot generation');
        });
        Alert.alert('Oops!', result.error || 'Something went wrong. Try again!');
        returnToAvatar();
      }
    } catch (error) {
      console.error('Generation error:', error);
      setIfMounted(() => {
        setGenerationError(error instanceof Error ? error.message : 'Unknown error');
      });
      Alert.alert('Oops!', 'Something went wrong. Try again!');
      returnToAvatar();
    } finally {
      setIfMounted(() => setIsGenerating(false));
    }
  };

  // Upload image to Convex and generate mascot
  const uploadAndGenerate = async (imageUri: string) => {
    setIfMounted(() => {
      setIsGenerating(true);
      setGenerationError(null);
    });

    if (!isAuthenticated) {
      setIfMounted(() => setIsGenerating(false));
      Alert.alert("Authentication Error", "You need to be logged in. Please try restarting the app.");
      return;
    }

    navigateToMagicMoment();

    try {
      const uploadUrl = await generateUploadUrl({});
      const response = await fetch(imageUri);
      const blob = await response.blob();

      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Content-Type': blob.type || 'image/jpeg',
        },
        body: blob,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }

      const { storageId } = await uploadResponse.json();

      const result = await queueMascotJob({
        generationType: "image",
        sourceImageId: storageId as Id<"_storage">,
      });

      if (result.success && result.jobId) {
        updateData({ mascotJobId: result.jobId });
      } else if (result.existingJobId) {
        updateData({ mascotJobId: result.existingJobId });
      } else {
        setIfMounted(() => {
          setGenerationError(result.error || 'Failed to queue mascot generation');
        });
        Alert.alert('Oops!', result.error || 'Something went wrong. Try again!');
        setIfMounted(() => setMode(null));
        returnToAvatar();
      }
    } catch (error) {
      console.error('Upload/generation error:', error);
      setIfMounted(() => {
        setGenerationError(error instanceof Error ? error.message : 'Unknown error');
      });
      Alert.alert('Oops!', 'Something went wrong. Try again!');
      setIfMounted(() => setMode(null));
      returnToAvatar();
    } finally {
      setIfMounted(() => setIsGenerating(false));
    }
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
      const uri = result.assets[0].uri;
      setUploadedImage(uri);
      // Start the upload and generation process
      uploadAndGenerate(uri);
    } else {
      setMode(null);
    }
  };

  const handleDescriptionSubmit = () => {
    if (description.trim().length > 0 && !isGenerating) {
      generateFromText(description.trim());
    }
  };

  const handleNext = async () => {
    if (!selectedAvatar || isGenerating) return;

    setIsGenerating(true);

    try {
      // If user selected a base avatar (not AI-generated), upload it to storage
      if (!generatedAvatar) {
        const avatarData = BASE_AVATARS.find(a => a.id === selectedAvatar);
        if (avatarData?.image) {
          // Load and upload the local asset
          const asset = Asset.fromModule(avatarData.image);
          await asset.downloadAsync();

          if (asset.localUri) {
            const uploadUrl = await generateUploadUrl({});
            const response = await fetch(asset.localUri);
            const blob = await response.blob();

            const uploadResponse = await fetch(uploadUrl, {
              method: 'POST',
              headers: { 'Content-Type': blob.type || 'image/png' },
              body: blob,
            });

            if (!uploadResponse.ok) {
              throw new Error('Upload failed');
            }

            const { storageId } = await uploadResponse.json();
            updateData({
              avatarId: selectedAvatar,
              generatedMascotId: storageId,
            });
            
            // Persist the mascot to the database so it shows in "My Room"
            try {
              await saveGeneratedMascot({ storageId });
            } catch (error) {
              console.warn("Failed to persist base avatar to database:", error);
            }
          } else {
            throw new Error('Failed to load asset');
          }
        } else {
          throw new Error('Avatar data not found');
        }
      } else {
        updateData({ avatarId: selectedAvatar });
      }

      // Only navigate on success
      router.push('/(onboarding)/child/magic-moment');
    } catch (error) {
      console.error('Failed to upload base avatar:', error);
      Alert.alert('Oops!', 'Failed to save your avatar. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBack = () => {
    if (mode) {
      setMode(null);
      setGenerationStep('input');
      setUploadedImage(null);
      setDescription('');
      setGeneratedAvatar(null);
      setGenerationError(null);
      // Reset to first base avatar when going back to main options
      if (BASE_AVATARS.length > 0) {
        setSelectedAvatar(BASE_AVATARS[0].id);
      }
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
            <Ionicons name="grid" size={32} color="#92400E" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#92400E' }}>
              Choose {data.mascotName || 'your buddy'}! 🎉
            </Text>
            <Text style={{ fontSize: 14, color: '#B45309', marginTop: 2 }}>
              Pick what {data.mascotName || 'they'} look like
            </Text>
          </View>
          <Ionicons name="arrow-forward" size={24} color="#92400E" />
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
            <Ionicons name="camera" size={32} color="#5B21B6" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#5B21B6' }}>Magic Photo! 📸</Text>
            <Text style={{ fontSize: 14, color: '#7C3AED', marginTop: 2 }}>Turn your toy into a hero</Text>
          </View>
          <Ionicons name="arrow-forward" size={24} color="#5B21B6" />
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
            <Ionicons name="pencil" size={32} color="#1E40AF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#1E40AF' }}>Dream It Up! ✨</Text>
            <Text style={{ fontSize: 14, color: '#2563EB', marginTop: 2 }}>
              Describe {data.mascotName || 'your friend'}
            </Text>
          </View>
          <Ionicons name="arrow-forward" size={24} color="#1E40AF" />
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
          Pick who {data.mascotName || 'your buddy'} is!
        </Text>
        <Text
          style={{
            fontSize: 18,
            textAlign: 'center',
            color: '#6B7280',
          }}
        >
          Tap to choose {data.mascotName || 'your friend'}!
        </Text>
      </Animated.View>

      <Animated.View
        // Key changes trigger the animation!

        key={selectedAvatar}
        // Smooth fade for a polished feel
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(200)}
        style={{
          alignItems: 'center',
          marginBottom: 20,
          backgroundColor: 'rgba(255,255,255,0.5)',
          padding: 24,
          borderRadius: 40,
          borderWidth: 4,
          borderColor: 'rgba(255,255,255,0.8)',
          // Ensure it stays centered during transition
        }}
      >
        <Image
          source={selectedAvatarData.image}
          style={{ width: 200, height: 200 }}
          resizeMode="contain"
        />
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
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 4, alignItems: 'center' }}
        >
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {BASE_AVATARS.map((avatar, index) => (
              <AnimatedAvatarItem
                key={avatar.id}
                avatar={avatar}
                isSelected={selectedAvatar === avatar.id}
                onSelect={() => {
                  setSelectedAvatar(avatar.id);
                  setCurrentIndex(index);
                }}
                index={index}
              />
            ))}
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
              Pick {data.mascotName || 'your buddy'}!
            </Text>
            <Ionicons name="arrow-forward" size={28} color="white" />
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
        {mode === 'upload'
          ? 'Transforming your photo into a magical friend!'
          : 'Bringing your imagination to life!'}
      </Text>
      <Text style={{ fontSize: 12, color: '#D1D5DB', textAlign: 'center', marginTop: 16 }}>
        This may take a moment...
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

        <Text style={{ fontSize: 18, fontWeight: '600', color: '#6B7280', marginBottom: 16, textAlign: 'center' }}>
          {generatedAvatar?.name} is ready for adventure!
        </Text>

        <Text style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 32, textAlign: 'center', paddingHorizontal: 20 }}>
          Don&apos;t worry - you can create more mascots later in your profile settings!
        </Text>

        <ChunkyButton onPress={handleNext} bgColor="#22C55E" borderColor="#15803D" size="large" style={{ width: '100%' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 18, gap: 12 }}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: 'white' }}>Start Adventure!</Text>
            <Ionicons name="star" size={24} color="white" />
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
          disabled={description.length === 0 || isGenerating}
          bgColor={description.length > 0 && !isGenerating ? '#3B82F6' : '#D1D5DB'}
          borderColor={description.length > 0 && !isGenerating ? '#1D4ED8' : '#9CA3AF'}
          size="large"
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 18, gap: 12 }}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: 'white' }}>
              {isGenerating ? 'Creating...' : 'Create Magic!'}
            </Text>
            <Ionicons name="sparkles" size={24} color="white" />
          </View>
        </ChunkyButton>
      </View>
    </View>
  );

  const insets = useSafeAreaInsets();

  return (
    <>
      <Stack.Screen options={{ gestureEnabled: false }} />
      <LinearGradient
        colors={['#FEF7ED', '#FFF7ED', '#FFFBEB']}
        style={{ flex: 1 }}
      >
        {/* Header - internal back only (no route back) */}
        {generationStep !== 'reveal' && (
          <View style={{ paddingTop: insets.top + 20, paddingHorizontal: 20, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
            {mode ? (
              <ChunkyButton onPress={handleBack} bgColor="#FFFFFF" borderColor="#E5E7EB" size="small" disabled={isGenerating}>
                <View style={{ padding: 10 }}>
                  <Ionicons name="arrow-back" size={24} color="#4B5563" />
                </View>
              </ChunkyButton>
            ) : (
              <View style={{ width: 44, height: 44 }} />
            )}
          </View>
        )}
        {/* Spacer when back button is hidden (reveal screen) */}
        {generationStep === 'reveal' && (
          <View style={{ paddingTop: insets.top + 20, paddingBottom: 16 }} />
        )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={insets.top + 20}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ flexGrow: 1 }}
          scrollEnabled={mode !== 'describe' && generationStep !== 'processing'}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ flex: 1, alignItems: 'center', paddingBottom: 24 }}>
            {/* Title Area */}
            {!mode && (
              <Animated.View entering={FadeInDown} style={{ marginBottom: 32, alignItems: 'center', paddingHorizontal: 20 }}>
                <Text style={{ fontSize: 32, fontWeight: '800', color: '#1F2937', textAlign: 'center' }}>
                  {data.mascotName || 'Your Adventure Pal'}! 🦸
                </Text>
                <Text style={{ fontSize: 18, color: '#6B7280', marginTop: 8, textAlign: 'center' }}>
                  How do you want to create {data.mascotName || 'them'}?
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
    </>
  );
}
