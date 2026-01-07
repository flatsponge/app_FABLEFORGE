import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
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
  useAnimatedScrollHandler,
  SharedValue,
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

const { width } = Dimensions.get('window');

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

  // Carousel state (must be at top level to respect Rules of Hooks)
  const scrollX = useSharedValue(0);
  const flatListRef = React.useRef<any>(null);

  const onCarouselScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const viewabilityConfig = React.useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const onViewableItemsChanged = React.useRef(({ viewableItems }: { viewableItems: any[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setCurrentIndex(viewableItems[0].index);
      setSelectedAvatar(BASE_AVATARS[viewableItems[0].index].id);
    }
  }).current;

  // Initial Selection for carousel
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

  // Carousel Constants
  const ITEM_WIDTH = width * 0.85; // Made wider for bigger impact
  const SPACER = (width - ITEM_WIDTH) / 2;

  // Carousel Item Component
  const CarouselItem = ({
    item,
    index,
    scrollX,
    onPress,
  }: {
    item: typeof BASE_AVATARS[0];
    index: number;
    scrollX: SharedValue<number>;
    onPress: () => void;
  }) => {
    const animatedStyle = useAnimatedStyle(() => {
      const inputRange = [
        (index - 1) * ITEM_WIDTH,
        index * ITEM_WIDTH,
        (index + 1) * ITEM_WIDTH,
      ];

      const scale = interpolate(
        scrollX.value,
        inputRange,
        [0.8, 1.15, 0.8], // Increased scale
        'clamp'
      );

      const opacity = interpolate(
        scrollX.value,
        inputRange,
        [0.4, 1, 0.4],
        'clamp'
      );

      const translateY = interpolate(
        scrollX.value,
        inputRange,
        [30, 0, 30],
        'clamp'
      );

      return {
        transform: [{ scale }, { translateY }],
        opacity,
        zIndex: interpolate(scrollX.value, inputRange, [0, 10, 0], 'clamp'), // Ensure center item is on top
      };
    });

    return (
      <Animated.View style={[{ width: ITEM_WIDTH, alignItems: 'center', justifyContent: 'center', overflow: 'visible' }, animatedStyle]}>
        <Pressable onPress={onPress} style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Image
            source={item.image}
            style={{ width: 340, height: 340, marginBottom: 20 }} // Bigger Image
            resizeMode="contain"
          />
          <Text style={{
            fontSize: 42, // Bigger Text
            fontWeight: '900',
            color: '#4B5563',
            textAlign: 'center',
            textShadowColor: 'rgba(0,0,0,0.1)',
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 4,
          }}>
            {item.name}
          </Text>
        </Pressable>
      </Animated.View>
    );
  };

  // Avatar selection scroll
  const renderBaseSelection = () => (
    <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>
      <Animated.View entering={FadeInDown} style={{ marginBottom: 20, alignItems: 'center' }}>
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
          Swipe to pick your friend!
        </Text>
      </Animated.View>

      <View style={{ height: 480 }}>
        <Animated.FlatList
          ref={flatListRef}
          data={BASE_AVATARS}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <CarouselItem
              item={item}
              index={index}
              scrollX={scrollX}
              onPress={() => {
                flatListRef.current?.scrollToIndex({ index, animated: true });
                setSelectedAvatar(item.id);
              }}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={ITEM_WIDTH}
          decelerationRate="fast"
          contentContainerStyle={{
            paddingHorizontal: SPACER,
            alignItems: 'center',
          }}
          onScroll={onCarouselScroll}
          scrollEventThrottle={16}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
        />
      </View>

      {/* Start Button */}
      <Animated.View
        entering={FadeInUp.springify().delay(300)}
        style={{
          width: '100%',
          paddingHorizontal: 20,
          marginTop: 10,
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
              Pick {BASE_AVATARS[currentIndex]?.name || 'Friend'}!
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
