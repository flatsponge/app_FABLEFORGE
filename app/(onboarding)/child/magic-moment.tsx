import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Pressable, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
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
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Mic, Lock, Sparkles } from 'lucide-react-native';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import { BASE_AVATARS } from '../../../constants/data';

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
          <Mic size={22} color="white" strokeWidth={2.5} />
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

const LOAD_MESSAGES = [
  { title: "Weaving magic from your day...", subtitle: "Adding dragons... 🐉" },
  { title: "Reviewing your adventure...", subtitle: "Sprinkling fairy dust... ✨" },
  { title: "Building your story castle...", subtitle: "Polishing the gates... 🏰" },
  { title: "Almost quite ready...", subtitle: "Getting the glitter ready! 🌟" },
];

const LoadingMessages = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % LOAD_MESSAGES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const msg = LOAD_MESSAGES[index];

  return (
    <Animated.View
      key={index}
      entering={FadeInDown.springify()}
      exiting={FadeOut.duration(200)}
      style={{ alignItems: 'center', height: 80 }}
    >
      <Text style={{
        fontSize: 22,
        fontWeight: '800',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 8,
      }}>
        {msg.title}
      </Text>
      <Text style={{
        fontSize: 16,
        color: '#7C3AED',
        fontWeight: '600',
      }}>
        {msg.subtitle}
      </Text>
    </Animated.View>
  );
};

const ProgressBar = () => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 10000, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View style={{
      width: '80%',
      height: 12,
      backgroundColor: '#F3F4F6',
      borderRadius: 6,
      overflow: 'hidden',
      marginTop: 32,
      borderWidth: 1,
      borderColor: '#E5E7EB'
    }}>
      <Animated.View style={[
        animatedStyle,
        { height: '100%', backgroundColor: '#7C3AED', borderRadius: 6 }
      ]} />
    </View>
  );
};

export default function MagicMomentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data } = useOnboarding();
  const [phase, setPhase] = useState<'input' | 'recording' | 'generating' | 'preview'>('input');

  // Get selected avatar
  const selectedAvatarData = BASE_AVATARS.find(a => a.id === data.avatarId) || BASE_AVATARS[0];

  const handleAvatarPress = () => {
    if (phase === 'input') {
      setPhase('recording');
    } else if (phase === 'recording') {
      finishRecording();
    }
  };

  const finishRecording = () => {
    setPhase('generating');
    // Simulate API call / processing time
    setTimeout(() => {
      setPhase('preview');
    }, 10000);
  };

  const handleBack = () => {
    if (phase === 'recording') {
      setPhase('input');
    } else {
      router.back();
    }
  };

  return (
    <LinearGradient
      colors={['#FEF7ED', '#FFF7ED', '#FFFBEB']}
      style={{ flex: 1 }}
    >
      {/* Header */}
      <View style={{
        paddingTop: insets.top + 20,
        paddingHorizontal: 20,
        paddingBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 10,
      }}>
        <ChunkyButton onPress={handleBack} bgColor="#FFFFFF" borderColor="#E5E7EB" size="small">
          <View style={{ padding: 10 }}>
            <ArrowLeft size={24} color="#4B5563" />
          </View>
        </ChunkyButton>
      </View>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>

        {/* PHASE 1 & 2: INPUT & RECORDING */}
        {(phase === 'input' || phase === 'recording') && (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={{ alignItems: 'center', width: '100%' }}>

            {/* Premium Recording Bubble */}
            <View style={{ marginBottom: 32 }}>
              <RecordingBubble
                isRecording={phase === 'recording'}
                avatarImage={selectedAvatarData.image}
                onPress={handleAvatarPress}
              />
            </View>

            {/* Recording Controls */}
            {phase === 'recording' && (
              <Animated.View
                entering={FadeInUp.springify()}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 20,
                  marginBottom: 24,
                  width: '100%',
                }}
              >
                {/* Redo Button - Using ChunkyButton style */}
                <ChunkyButton
                  onPress={() => setPhase('input')}
                  bgColor="#FFFFFF"
                  borderColor="#E5E7EB"
                  size="medium"
                >
                  <View style={{ padding: 16, alignItems: 'center' }}>
                    <Ionicons name="refresh" size={36} color="#6B7280" />
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#6B7280', marginTop: 4 }}>
                      Redo
                    </Text>
                  </View>
                </ChunkyButton>

                {/* Done Button - Primary action */}
                <ChunkyButton
                  onPress={finishRecording}
                  bgColor="#10B981"
                  borderColor="#059669"
                  size="large"
                >
                  <View style={{ paddingVertical: 20, paddingHorizontal: 32, alignItems: 'center' }}>
                    <Ionicons name="checkmark-circle" size={48} color="white" />
                    <Text style={{ fontSize: 18, fontWeight: '800', color: 'white', marginTop: 4 }}>
                      Done!
                    </Text>
                  </View>
                </ChunkyButton>
              </Animated.View>
            )}

            <Animated.Text
              entering={FadeInDown.delay(100)}
              style={{
                fontSize: 28,
                fontWeight: '800',
                color: '#1F2937',
                textAlign: 'center',
                marginBottom: 16,
              }}
            >
              {phase === 'recording' ? "I'm listening..." : "What did you do today?"}
            </Animated.Text>

            <Animated.Text
              entering={FadeInDown.delay(200)}
              style={{
                fontSize: 18,
                color: phase === 'recording' ? '#EC4899' : '#6B7280',
                textAlign: 'center',
                marginBottom: 32,
                fontWeight: '600',
                lineHeight: 26,
                paddingHorizontal: 16,
              }}
            >
              {phase === 'recording'
                ? "Press Done when finished!"
                : `Tap ${selectedAvatarData.name} to talk!`}
            </Animated.Text>

            {/* Suggestions - Only show when not recording */}
            {phase === 'input' && (
              <Animated.View entering={FadeInUp.delay(300)} style={{ width: '100%' }}>
                <ChunkyButton
                  onPress={() => setPhase('recording')}
                  bgColor="#3B82F6"
                  borderColor="#1D4ED8"
                  size="large"
                >
                  <View style={{ padding: 20, alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, fontWeight: '700', color: 'white' }}>
                      "I played with my dog!"
                    </Text>
                    <Text style={{ fontSize: 13, color: '#BFDBFE', marginTop: 4, fontWeight: '600' }}>
                      (Tap to say this)
                    </Text>
                  </View>
                </ChunkyButton>
              </Animated.View>
            )}
          </Animated.View>
        )}

        {/* PHASE 3: GENERATING */}
        {phase === 'generating' && (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={{ alignItems: 'center', width: '100%' }}>

            {/* Animated Icon / Image */}
            <Animated.View
              style={{ marginBottom: 40 }}
              entering={FadeInDown.springify()}
            >
              <Image
                source={require('../../../assets/images/shooting-star.png')}
                style={{ width: 160, height: 160 }}
                resizeMode="contain"
              />
            </Animated.View>

            {/* Rotating Loading Text */}
            <LoadingMessages />

            {/* Custom Progress Bar */}
            <ProgressBar />

          </Animated.View>
        )}

        {/* PHASE 4: PREVIEW */}
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
                    <Text style={{ fontSize: 80 }}>📖</Text>

                    {/* Simple decorative sparkles */}
                    <View style={{ position: 'absolute', top: 20, right: 30 }}>
                      <Sparkles size={24} color="#C4B5FD" />
                    </View>
                    <View style={{ position: 'absolute', bottom: 30, left: 30 }}>
                      <Sparkles size={20} color="#DDD6FE" />
                    </View>
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
                      The Space Explorer & The Dog's Big Adventure
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
                      fontFamily: 'System', // Use default system serif if available or just clean sans
                    }}>
                      <Text style={{ fontSize: 24, color: '#7C3AED', fontWeight: 'bold' }}>O</Text>nce upon a time, in a galaxy not so far away, there lived a brave young explorer who loved nothing more than discovering new stars. But this explorer wasn't alone—they had the best copilot in the universe...
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
                  <Lock size={22} color="white" strokeWidth={2.5} />
                  <Text style={{ fontSize: 20, fontWeight: '800', color: 'white' }}>
                    Ask Parent to Unlock!
                  </Text>
                </View>
              </ChunkyButton>
            </Animated.View>
          </Animated.View>
        )}
      </View>
    </LinearGradient>
  );
}
