import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, Image, ScrollView, TextInput, KeyboardAvoidingView, Platform, BackHandler } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeOut,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
  interpolateColor,
  SharedValue,
  ZoomIn,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAction, useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import { BASE_AVATARS } from '../../../constants/data';
import { StoryGenerationGrid } from '@/components/StoryGenerationGrid';
import { Id } from '@/convex/_generated/dataModel';
import { useFocusEffect } from '@react-navigation/native';

// Feature flag for voice input - set to true to enable voice recording
const ENABLE_VOICE_INPUT = false;

// Premium Recording Bubble Component
const RecordingBubble = ({
  isRecording,
  avatarImage,
  onPress,
}: {
  isRecording: boolean;
  avatarImage: any;
  onPress: () => void;
}) => {
  // Animation shared values
  const pulse = useSharedValue(1);
  const ringScale1 = useSharedValue(1);
  const ringScale2 = useSharedValue(1);
  const ringScale3 = useSharedValue(1);
  const ringOpacity1 = useSharedValue(0);
  const ringOpacity2 = useSharedValue(0);
  const ringOpacity3 = useSharedValue(0);
  const borderColorProgress = useSharedValue(0);
  const glowIntensity = useSharedValue(0);

  useEffect(() => {
    if (isRecording) {
      // Animate to recording state
      borderColorProgress.value = withTiming(1, { duration: 300 });
      glowIntensity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.5, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );

      // Avatar pulse
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming(1.0, { duration: 600, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );

      // Concentric rings - staggered wave animation
      const animateRing = (scaleValue: SharedValue<number>, opacityValue: SharedValue<number>, delay: number) => {
        scaleValue.value = withDelay(
          delay,
          withRepeat(
            withSequence(
              withTiming(1, { duration: 0 }),
              withTiming(1.8, { duration: 1200, easing: Easing.out(Easing.ease) })
            ),
            -1,
            false
          )
        );
        opacityValue.value = withDelay(
          delay,
          withRepeat(
            withSequence(
              withTiming(0.6, { duration: 0 }),
              withTiming(0, { duration: 1200, easing: Easing.out(Easing.ease) })
            ),
            -1,
            false
          )
        );
      };

      animateRing(ringScale1, ringOpacity1, 0);
      animateRing(ringScale2, ringOpacity2, 400);
      animateRing(ringScale3, ringOpacity3, 800);
    } else {
      // Reset to idle state
      borderColorProgress.value = withTiming(0, { duration: 300 });
      glowIntensity.value = withTiming(0, { duration: 300 });
      pulse.value = withSpring(1);
      ringScale1.value = withTiming(1, { duration: 200 });
      ringScale2.value = withTiming(1, { duration: 200 });
      ringScale3.value = withTiming(1, { duration: 200 });
      ringOpacity1.value = withTiming(0, { duration: 200 });
      ringOpacity2.value = withTiming(0, { duration: 200 });
      ringOpacity3.value = withTiming(0, { duration: 200 });
    }
  }, [isRecording]);

  // Animated styles
  const avatarContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    borderColor: interpolateColor(
      borderColorProgress.value,
      [0, 1],
      ['#DDD6FE', '#EC4899']
    ),
    shadowOpacity: interpolate(glowIntensity.value, [0, 1], [0.15, 0.5]),
    shadowRadius: interpolate(glowIntensity.value, [0, 1], [8, 24]),
  }));

  const createRingStyle = (scaleValue: SharedValue<number>, opacityValue: SharedValue<number>) =>
    useAnimatedStyle(() => ({
      transform: [{ scale: scaleValue.value }],
      opacity: opacityValue.value,
    }));

  const ring1Style = createRingStyle(ringScale1, ringOpacity1);
  const ring2Style = createRingStyle(ringScale2, ringOpacity2);
  const ring3Style = createRingStyle(ringScale3, ringOpacity3);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glowIntensity.value, [0, 1], [0, 0.4]),
    transform: [{ scale: interpolate(glowIntensity.value, [0, 1], [1, 1.15]) }],
  }));

  const BUBBLE_SIZE = 180;
  const RING_SIZE = BUBBLE_SIZE;

  return (
    <Pressable onPress={onPress} style={{ alignItems: 'center', justifyContent: 'center' }}>
      {/* Outer glow layer */}
      <Animated.View
        style={[
          glowStyle,
          {
            position: 'absolute',
            width: BUBBLE_SIZE + 40,
            height: BUBBLE_SIZE + 40,
            borderRadius: (BUBBLE_SIZE + 40) / 2,
            backgroundColor: '#F472B6',
          }
        ]}
      />

      {/* Concentric animated rings */}
      {isRecording && (
        <>
          <Animated.View
            style={[
              ring1Style,
              {
                position: 'absolute',
                width: RING_SIZE,
                height: RING_SIZE,
                borderRadius: RING_SIZE / 2,
                borderWidth: 3,
                borderColor: '#EC4899',
              }
            ]}
          />
          <Animated.View
            style={[
              ring2Style,
              {
                position: 'absolute',
                width: RING_SIZE,
                height: RING_SIZE,
                borderRadius: RING_SIZE / 2,
                borderWidth: 2.5,
                borderColor: '#F472B6',
              }
            ]}
          />
          <Animated.View
            style={[
              ring3Style,
              {
                position: 'absolute',
                width: RING_SIZE,
                height: RING_SIZE,
                borderRadius: RING_SIZE / 2,
                borderWidth: 2,
                borderColor: '#FBCFE8',
              }
            ]}
          />
        </>
      )}

      {/* Main avatar container */}
      <Animated.View
        style={[
          avatarContainerStyle,
          {
            width: BUBBLE_SIZE,
            height: BUBBLE_SIZE,
            borderRadius: BUBBLE_SIZE / 2,
            backgroundColor: isRecording ? '#FDF2F8' : '#EDE9FE',
            borderWidth: 5,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            shadowColor: isRecording ? '#EC4899' : '#7C3AED',
            shadowOffset: { width: 0, height: 4 },
            elevation: 8,
          }
        ]}
      >
        {/* Inner gradient overlay for depth */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: BUBBLE_SIZE / 2,
            backgroundColor: isRecording ? 'rgba(236, 72, 153, 0.05)' : 'rgba(124, 58, 237, 0.03)',
          }}
        />

        {/* Avatar image */}
        <Image
          source={avatarImage}
          style={{ width: BUBBLE_SIZE - 40, height: BUBBLE_SIZE - 40 }}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Recording indicator badge */}
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 8,
          right: 8,
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: isRecording ? '#EF4444' : '#7C3AED',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 3,
          borderColor: 'white',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 4,
        }}
      >
        {isRecording ? (
          <View style={{ width: 16, height: 16, borderRadius: 3, backgroundColor: 'white' }} />
        ) : (
          <Ionicons name="mic" size={22} color="white" />
        )}
      </Animated.View>
    </Pressable>
  );
};

// Chunky 3D button matching the child flow style
const ChunkyButton = ({
  onPress,
  children,
  bgColor = '#ffffff',
  borderColor = '#e2e8f0',
  size = 'large',
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

const MascotRevealOverlay = ({
  mascotImage,
  mascotName,
  onDismiss,
}: {
  mascotImage: any;
  mascotName: string;
  onDismiss: () => void;
}) => {
  const scale = useSharedValue(0);
  const sparkleOpacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSequence(
      withTiming(1.2, { duration: 400, easing: Easing.out(Easing.back(2)) }),
      withSpring(1, { damping: 12, stiffness: 100 })
    );
    sparkleOpacity.value = withTiming(1, { duration: 600 });
  }, []);

  const mascotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const sparkleStyle = useAnimatedStyle(() => ({
    opacity: sparkleOpacity.value,
  }));

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(254, 247, 237, 0.98)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        paddingHorizontal: 24,
      }}
    >
      {/* Mascot with improved styling */}
      <Animated.View style={mascotStyle}>
        <View
          style={{
            width: 220,
            height: 220,
            borderRadius: 110,
            backgroundColor: '#FFFFFF',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#7C3AED',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 20,
            elevation: 8,
            borderWidth: 4,
            borderColor: '#F3E8FF',
          }}
        >
          <Image
            source={mascotImage}
            style={{ width: 160, height: 160 }}
            resizeMode="contain"
          />
        </View>
      </Animated.View>

      {/* Improved text layout */}
      <View style={{ alignItems: 'center', marginTop: 40, maxWidth: '90%' }}>
        <Animated.Text
          entering={FadeInUp.delay(400).springify()}
          style={{
            fontSize: 32,
            fontWeight: '900',
            color: '#1F2937',
            textAlign: 'center',
            marginBottom: 8,
          }}
        >
          Meet {mascotName}!
        </Animated.Text>
        
        <Animated.Text
          entering={FadeInUp.delay(600).springify()}
          style={{
            fontSize: 18,
            fontWeight: '600',
            color: '#6B7280',
            textAlign: 'center',
            lineHeight: 24,
            marginBottom: 32,
          }}
        >
          Your story companion is here!
        </Animated.Text>

        <Animated.View
          entering={FadeInUp.delay(1500).springify()}
        >
          <ChunkyButton
            onPress={onDismiss}
            bgColor="#10B981"
            borderColor="#059669"
            size="large"
          >
            <View style={{ paddingHorizontal: 32, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <Text style={{ fontSize: 20, fontWeight: '800', color: 'white' }}>
                Let's Go!
              </Text>
            </View>
          </ChunkyButton>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

export default function MagicMomentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data, updateData } = useOnboarding();
  const [phase, setPhase] = useState<'input' | 'recording' | 'generating' | 'preview'>('input');
  const [showMascotReveal, setShowMascotReveal] = useState(false);
  const [mascotRevealed, setMascotRevealed] = useState(false);

  const [promptText, setPromptText] = useState('');

  const [generatedTeaser, setGeneratedTeaser] = useState<{ title: string; teaserText: string } | null>(null);
  const [teaserId, setTeaserId] = useState<Id<"onboardingTeasers"> | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const generateTeaser = useAction(api.storyGenerationActions.generateOnboardingTeaser);
  const retryMascotJob = useMutation(api.mascotGeneration.retryMascotJob);
  const queueTeaserImage = useMutation(api.storyGeneration.queueOnboardingTeaserImage);
  const saveGeneratedMascot = useMutation(api.onboarding.saveGeneratedMascot);

  const mascotJob = useQuery(
    api.mascotGeneration.getMascotJob,
    data.mascotJobId ? { jobId: data.mascotJobId as Id<"mascotJobs"> } : "skip"
  );
  const teaserRecord = useQuery(
    api.storyGeneration.getOnboardingTeaser,
    teaserId ? { teaserId } : "skip"
  );

  const [mascotJobError, setMascotJobError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isRetryingTeaserImage, setIsRetryingTeaserImage] = useState(false);
  const [isQueuingTeaserImage, setIsQueuingTeaserImage] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => true);
      return () => subscription.remove();
    }, [])
  );

  useEffect(() => {
    if (mascotJob?.status === "complete" && mascotJob.resultImageUrl && mascotJob.resultStorageId && !mascotRevealed) {
      updateData({
        generatedMascotId: mascotJob.resultStorageId,
        generatedMascotUrl: mascotJob.resultImageUrl,
      });
      
      // Persist the generated mascot to the database (onboardingResponses table)
      // This ensures the mascot shows up in "My Room" even after app restart
      saveGeneratedMascot({ storageId: mascotJob.resultStorageId })
        .catch((error) => {
          // Don't block the flow if this fails - the mascot is still in local state
          console.warn("Failed to persist mascot to database:", error);
        });
      
      setMascotJobError(null);
      setMascotRevealed(true);
    } else if (mascotJob?.status === "failed") {
      setMascotJobError(mascotJob.error || "Mascot generation failed");
    }
  }, [mascotJob?.status, mascotJob?.resultImageUrl, mascotJob?.resultStorageId, mascotJob?.error, mascotRevealed, updateData, saveGeneratedMascot]);

  const teaserImageStatus = teaserRecord?.teaserImageStatus ?? null;
  const teaserImageUrl = teaserRecord?.teaserImageUrl ?? null;
  const teaserImageError = teaserRecord?.teaserImageStatus === "failed"
    ? teaserRecord.teaserImageError || "Cover image generation failed"
    : null;
  const teaserDisplay = generatedTeaser ?? (teaserRecord ? {
    title: teaserRecord.title,
    teaserText: teaserRecord.teaserText,
  } : null);

  const mascotReady = !!data.generatedMascotId;
  const teaserTextReady = !!teaserDisplay;
  const teaserImageReady = teaserImageStatus === "complete" && !!teaserImageUrl;
  const allAssetsReady = mascotReady && teaserTextReady && teaserImageReady;

  useEffect(() => {
    if (!teaserId || !data.generatedMascotId || isQueuingTeaserImage) return;
    if (teaserImageStatus && teaserImageStatus !== "failed") return;

    const queueImage = async () => {
      setIsQueuingTeaserImage(true);
      try {
        const result = await queueTeaserImage({
          teaserId,
          mascotStorageId: data.generatedMascotId as Id<"_storage">,
        });
        if (!result.success && result.error) {
          console.error("Failed to queue teaser image:", result.error);
        }
      } catch (error) {
        console.error("Failed to queue teaser image:", error);
      } finally {
        setIsQueuingTeaserImage(false);
      }
    };

    queueImage();
  }, [teaserId, data.generatedMascotId, teaserImageStatus, isQueuingTeaserImage, queueTeaserImage]);

  useEffect(() => {
    if (phase !== 'generating') return;
    if (!allAssetsReady || showMascotReveal) return;
    setShowMascotReveal(true);
  }, [phase, allAssetsReady, showMascotReveal]);

  const handleRetryMascotJob = async () => {
    if (!data.mascotJobId || isRetrying) return;
    setIsRetrying(true);
    setMascotJobError(null);
    try {
      const result = await retryMascotJob({ jobId: data.mascotJobId as Id<"mascotJobs"> });
      if (!result.success) {
        setMascotJobError(result.error || "Retry failed");
      }
    } catch (error) {
      setMascotJobError("Failed to retry. Please try again.");
    } finally {
      setIsRetrying(false);
    }
  };

  const handleRetryTeaserImage = async () => {
    if (!teaserId || !data.generatedMascotId || isRetryingTeaserImage) return;
    setIsRetryingTeaserImage(true);
    try {
      const result = await queueTeaserImage({
        teaserId,
        mascotStorageId: data.generatedMascotId as Id<"_storage">,
      });
      if (!result.success) {
        console.error("Failed to retry teaser image:", result.error);
      }
    } catch (error) {
      console.error("Failed to retry teaser image:", error);
    } finally {
      setIsRetryingTeaserImage(false);
    }
  };

  const selectedAvatarData = BASE_AVATARS.find(a => a.id === data.avatarId) || BASE_AVATARS[0];

  const mascotImage = data.generatedMascotUrl
    ? { uri: data.generatedMascotUrl }
    : selectedAvatarData.image ?? require('@/assets/images/friendly-star.png');

  const mascotName = data.mascotName || selectedAvatarData.name || 'Your Friend';
  const activeGenerationError = mascotJobError ?? teaserImageError;
  const isMascotGenerationError = !!mascotJobError;
  const isRetryingActive = isMascotGenerationError ? isRetrying : isRetryingTeaserImage;
  const retryHandler = isMascotGenerationError ? handleRetryMascotJob : handleRetryTeaserImage;

  const handleMascotRevealDismiss = useCallback(() => {
    setShowMascotReveal(false);
    if (allAssetsReady) {
      setPhase('preview');
    }
  }, [allAssetsReady]);

  const handleAvatarPress = () => {
    if (!ENABLE_VOICE_INPUT) return;
    if (phase === 'input') {
      setPhase('recording');
    } else if (phase === 'recording') {
      finishRecording();
    }
  };

  const finishRecording = () => {
    if (!ENABLE_VOICE_INPUT) return;
    setPhase('generating');
  };

  const handleSubmitPrompt = async () => {
    if (!promptText.trim() || promptText.length < 3) return;

    setPhase('generating');
    setGenerationError(null);
    setGeneratedTeaser(null);
    setTeaserId(null);

    try {
      const tempTeaserEmail = `teaser-${data.childName || 'child'}-${Date.now()}@temp.local`;
      const mascotStorageId = data.generatedMascotId ?? mascotJob?.resultStorageId;

      const result = await generateTeaser({
        prompt: promptText.trim(),
        childName: data.childName || 'Little One',
        childAge: data.childAge || '5',
        gender: data.gender || 'child',
        email: tempTeaserEmail,
        mascotName: data.mascotName || undefined,
        mascotStorageId: mascotStorageId ? (mascotStorageId as Id<"_storage">) : undefined,
      });

      if (result.success && result.teaser) {
        setGeneratedTeaser(result.teaser);
        if (result.teaserId) {
          setTeaserId(result.teaserId);
        }
      } else {
        setGenerationError(result.error || 'Something went wrong');
        setPhase('input');
      }
    } catch (error) {
      console.error('Teaser generation error:', error);
      setGenerationError('Failed to create your story. Please try again!');
      setPhase('input');
    }
  };

  return (
    <>
      <Stack.Screen options={{ gestureEnabled: false }} />
      <LinearGradient
        colors={['#FEF7ED', '#FFF7ED', '#FFFBEB']}
        style={{ flex: 1 }}
      >
        {/* Header spacer */}
        <View style={{
          paddingTop: insets.top + 20,
          paddingBottom: 16,
        }} />

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>

        {/* PHASE 1 & 2: INPUT & RECORDING */}
        {(phase === 'input' || phase === 'recording') && (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={{ alignItems: 'center', width: '100%' }}>

            {/* Star Display */}
            <View style={{ marginBottom: 24 }}>
              <View style={{
                width: 180,
                height: 180,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Image
                  source={require('@/assets/images/friendly-star.png')}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="contain"
                />
              </View>
            </View>

            <Animated.Text
              entering={FadeInDown.delay(100)}
              style={{
                fontSize: 28,
                fontWeight: '800',
                color: '#1F2937',
                textAlign: 'center',
                marginBottom: 12,
              }}
            >
              What did you do today?
            </Animated.Text>

            <Animated.Text
              entering={FadeInDown.delay(200)}
              style={{
                fontSize: 16,
                color: '#6B7280',
                textAlign: 'center',
                marginBottom: 24,
                fontWeight: '600',
                lineHeight: 24,
                paddingHorizontal: 16,
              }}
            >
              Tell us about your day and we'll create a magical story just for you!
            </Animated.Text>

            {/* Error Message */}
            {generationError && (
              <Animated.View entering={FadeInDown} style={{
                backgroundColor: '#FEE2E2',
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 12,
                marginBottom: 16,
              }}>
                <Text style={{ color: '#DC2626', fontWeight: '600', textAlign: 'center' }}>
                  {generationError}
                </Text>
              </Animated.View>
            )}

            {/* Text Input */}
            <Animated.View entering={FadeInUp.delay(300)} style={{ width: '100%', marginBottom: 20 }}>
              <View style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 20,
                borderWidth: 3,
                borderColor: promptText.length > 0 ? '#A78BFA' : '#E5E7EB',
                padding: 4,
                shadowColor: '#7C3AED',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              }}>
                <TextInput
                  value={promptText}
                  onChangeText={setPromptText}
                  placeholder="I played with my dog and we found a rainbow!"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  style={{
                    fontSize: 18,
                    color: '#1F2937',
                    fontWeight: '600',
                    padding: 16,
                    minHeight: 100,
                    textAlignVertical: 'top',
                  }}
                />
              </View>
            </Animated.View>

            {/* Submit Button */}
            <Animated.View entering={FadeInUp.delay(400)} style={{ width: '100%' }}>
              <ChunkyButton
                onPress={handleSubmitPrompt}
                bgColor={promptText.length >= 3 ? '#10B981' : '#9CA3AF'}
                borderColor={promptText.length >= 3 ? '#059669' : '#6B7280'}
                size="large"
                disabled={promptText.length < 3}
              >
                <View style={{ padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                  <Ionicons name="sparkles" size={24} color="white" />
                  <Text style={{ fontSize: 20, fontWeight: '800', color: 'white' }}>
                    Create My Story!
                  </Text>
                </View>
              </ChunkyButton>
            </Animated.View>

            {/* Quick Suggestions */}
            <Animated.View entering={FadeInUp.delay(500)} style={{ marginTop: 20, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
              {['I played outside! 🌳', 'I made art! 🎨', 'I read a book! 📚'].map((suggestion) => (
                <Pressable
                  key={suggestion}
                  onPress={() => setPromptText(suggestion.replace(/[🌳🎨📚]/g, '').trim())}
                  style={{
                    backgroundColor: '#F3E8FF',
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: '#DDD6FE',
                  }}
                >
                  <Text style={{ color: '#7C3AED', fontWeight: '600', fontSize: 14 }}>
                    {suggestion}
                  </Text>
                </Pressable>
              ))}
            </Animated.View>
          </Animated.View>
        )}

        {phase === 'generating' && (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={{ alignItems: 'center', width: '100%' }}>
            {activeGenerationError ? (
              <Animated.View entering={FadeIn} style={{ alignItems: 'center', width: '100%', paddingHorizontal: 20 }}>
                <View style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: '#FEE2E2',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 24,
                }}>
                  <Ionicons name="alert-circle" size={48} color="#EF4444" />
                </View>

                <Text style={{
                  fontSize: 22,
                  fontWeight: '800',
                  color: '#1F2937',
                  textAlign: 'center',
                  marginBottom: 8,
                }}>
                  Oops! Something went wrong
                </Text>

                <Text style={{
                  fontSize: 16,
                  color: '#6B7280',
                  textAlign: 'center',
                  marginBottom: 24,
                  lineHeight: 24,
                }}>
                  {activeGenerationError}
                </Text>

                <ChunkyButton
                  onPress={retryHandler}
                  bgColor="#7C3AED"
                  borderColor="#5B21B6"
                  size="large"
                  disabled={isRetryingActive}
                  style={{ width: '100%' }}
                >
                  <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <Ionicons name="refresh" size={22} color="white" />
                    <Text style={{ fontSize: 18, fontWeight: '700', color: 'white' }}>
                      {isRetryingActive ? 'Retrying...' : 'Try Again'}
                    </Text>
                  </View>
                </ChunkyButton>

                <Pressable onPress={() => setPhase('input')} style={{ marginTop: 16, padding: 12 }}>
                  <Text style={{ fontSize: 16, color: '#7C3AED', fontWeight: '600' }}>
                    Go Back
                  </Text>
                </Pressable>
              </Animated.View>
            ) : (
              <>
                <Animated.View
                  style={{ marginBottom: 32 }}
                  entering={FadeInDown.springify()}
                >
                  <StoryGenerationGrid
                    progress={100}
                    onComplete={() => { }}
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
                  Creating your magical story...
                </Animated.Text>
                <Animated.Text
                  entering={FadeInUp.delay(400)}
                  style={{
                    fontSize: 16,
                    color: '#7C3AED',
                    fontWeight: '600',
                    marginTop: 8,
                  }}
                >
                  ✨ This is going to be amazing! ✨
                </Animated.Text>
              </>
            )}
          </Animated.View>
        )}

        {phase === 'preview' && (
          <Animated.View
            entering={FadeIn.duration(600)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            {/* Scrollable Content Area */}
            <View style={{ flex: 1, paddingHorizontal: 20 }}>

              {/* Simple Header */}
              <Animated.View
                entering={FadeInDown.delay(100).springify()}
                style={{ alignItems: 'center', marginBottom: 20, marginTop: 10 }}
              >
                <Text style={{
                  fontSize: 28,
                  fontWeight: '900',
                  color: '#1F2937',
                  textAlign: 'center',
                }}>
                  Your Story is Ready!
                </Text>
              </Animated.View>

              {/* Large Storybook Teaser Card */}
              <Animated.View
                entering={FadeInUp.delay(200).springify()}
                style={{
                  flex: 1, // Take up available space
                  backgroundColor: '#FFFFFF',
                  borderRadius: 24,
                  overflow: 'hidden',
                  shadowColor: '#7C3AED',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.1,
                  shadowRadius: 24,
                  elevation: 8,
                  marginBottom: 16,
                  borderWidth: 1,
                  borderColor: '#F3F4F6',
                }}
              >
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ flexGrow: 1 }}
                  bounces={false}
                >
                  {/* Large Cover Image Area */}
                  <View style={{
                    width: '100%',
                    aspectRatio: 1.5, // Wider landscape aspect ratio for the "hero" image feel
                    backgroundColor: '#F8F5FF',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottomWidth: 1,
                    borderBottomColor: '#EDE9FE',
                  }}>
                    {teaserImageUrl ? (
                      <Image
                        source={{ uri: teaserImageUrl }}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                      />
                    ) : (
                      <>
                        <Text style={{ fontSize: 80 }}>📖</Text>

                        {/* Simple decorative sparkles */}
                        <View style={{ position: 'absolute', top: 20, right: 30 }}>
                          <Ionicons name="sparkles" size={24} color="#C4B5FD" />
                        </View>
                        <View style={{ position: 'absolute', bottom: 30, left: 30 }}>
                          <Ionicons name="sparkles" size={20} color="#DDD6FE" />
                        </View>
                      </>
                    )}
                  </View>

                  {/* Story Content Teaser */}
                  <View style={{ padding: 24, flex: 1 }}>
                    {/* Title */}
                    <Text style={{
                      fontSize: 28,
                      fontWeight: '900',
                      color: '#1F2937',
                      lineHeight: 34,
                      marginBottom: 16,
                      textAlign: 'center',
                    }}>
                      {teaserDisplay?.title || 'Your Magical Story'}
                    </Text>

                    {/* Divider */}
                    <View style={{
                      height: 2,
                      backgroundColor: '#F3F4F6',
                      width: 60,
                      alignSelf: 'center',
                      marginBottom: 20
                    }} />

                    {/* Story Text Teaser */}
                    <Text style={{
                      fontSize: 18,
                      color: '#4B5563',
                      lineHeight: 28,
                      fontFamily: 'System',
                    }}>
                      <Text style={{ fontSize: 24, color: '#7C3AED', fontWeight: 'bold' }}>
                        {teaserDisplay?.teaserText?.charAt(0) || 'O'}
                      </Text>
                      {teaserDisplay?.teaserText?.slice(1) || 'nce upon a time, a wonderful adventure was about to begin...'}
                    </Text>

                    {/* Fade out effect at the bottom of the text */}
                    <LinearGradient
                      colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: 60,
                      }}
                    />
                  </View>
                </ScrollView>
              </Animated.View>
            </View>

            {/* Fixed Bottom CTA Section */}
            <Animated.View
              entering={FadeInUp.delay(300).springify()}
              style={{
                paddingHorizontal: 24,
                paddingTop: 12,
                paddingBottom: insets.bottom + 24,
                backgroundColor: 'transparent',
              }}
            >
              <Text style={{
                fontSize: 16,
                color: '#6B7280',
                textAlign: 'center',
                marginBottom: 12,
                fontWeight: '600',
              }}>
                Want to see what happens next?
              </Text>

              <ChunkyButton
                onPress={() => router.push('/(onboarding)/quiz/processing')}
                bgColor="#10B981"
                borderColor="#059669"
                size="large"
              >
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 18,
                  gap: 10,
                }}>
                  <Ionicons name="lock-closed" size={22} color="white" />
                  <Text style={{ fontSize: 20, fontWeight: '800', color: 'white' }}>
                    Ask Parent to Unlock!
                  </Text>
                </View>
              </ChunkyButton>
            </Animated.View>
          </Animated.View>
        )}
      </View>

      {showMascotReveal && (
        <MascotRevealOverlay
          mascotImage={mascotImage}
          mascotName={mascotName}
          onDismiss={handleMascotRevealDismiss}
        />
      )}
      </LinearGradient>
    </>
  );
}
