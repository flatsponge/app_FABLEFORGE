import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Pressable } from 'react-native';
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
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Mic, Lock, ArrowRight, Sparkles } from 'lucide-react-native';

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

export default function MagicMomentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [phase, setPhase] = useState<'input' | 'generating' | 'preview'>('input');

  const startMagic = () => {
    setPhase('generating');
    setTimeout(() => {
      setPhase('preview');
    }, 2500);
  };

  const handleBack = () => {
    router.back();
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
        {/* PHASE 1: INPUT */}
        {phase === 'input' && (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={{ alignItems: 'center', width: '100%' }}>
            <View style={{
              width: 96,
              height: 96,
              backgroundColor: '#EDE9FE',
              borderRadius: 48,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 32,
              borderWidth: 4,
              borderColor: '#DDD6FE',
            }}>
              <Mic size={48} color="#7C3AED" strokeWidth={2} />
            </View>

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
              What did you do today?
            </Animated.Text>

            <Animated.Text
              entering={FadeInDown.delay(200)}
              style={{
                fontSize: 17,
                color: '#6B7280',
                textAlign: 'center',
                marginBottom: 48,
                lineHeight: 24,
                paddingHorizontal: 16,
              }}
            >
              Tell me something that happened, and I&apos;ll turn it into a story!
            </Animated.Text>

            <Animated.View entering={FadeInUp.delay(300)} style={{ width: '100%' }}>
              <ChunkyButton
                onPress={startMagic}
                bgColor="#3B82F6"
                borderColor="#1D4ED8"
                size="large"
              >
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <Text style={{ fontSize: 20, fontWeight: '700', color: 'white' }}>
                    &quot;I played with my dog!&quot;
                  </Text>
                  <Text style={{ fontSize: 13, color: '#BFDBFE', marginTop: 4, fontWeight: '600' }}>
                    (Tap to say this)
                  </Text>
                </View>
              </ChunkyButton>
            </Animated.View>
          </Animated.View>
        )}

        {/* PHASE 2: GENERATING */}
        {phase === 'generating' && (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={{ alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#7C3AED" />
            <Text style={{
              fontSize: 22,
              fontWeight: '800',
              color: '#1F2937',
              marginTop: 24,
              textAlign: 'center',
            }}>
              Weaving magic from your day...
            </Text>
            <Text style={{
              fontSize: 16,
              color: '#7C3AED',
              marginTop: 8,
              fontWeight: '600',
            }}>
              Adding dragons... 🐉
            </Text>
          </Animated.View>
        )}

        {/* PHASE 3: PREVIEW */}
        {phase === 'preview' && (
          <Animated.View
            entering={FadeIn.duration(600)}
            style={{
              width: '100%',
              flex: 1,
              paddingTop: 16,
              paddingBottom: insets.bottom + 32,
              justifyContent: 'space-between',
            }}
          >
            <View>
              {/* Story Card */}
              <View style={{
                backgroundColor: '#FFFFFF',
                padding: 24,
                borderRadius: 24,
                marginBottom: 24,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                borderWidth: 1,
                borderColor: '#F3F4F6',
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <Sparkles size={16} color="#7C3AED" />
                  <Text style={{
                    fontSize: 12,
                    fontWeight: '800',
                    color: '#7C3AED',
                    letterSpacing: 1,
                    marginLeft: 6,
                  }}>
                    NEW STORY CREATED!
                  </Text>
                </View>
                <Text style={{
                  fontSize: 26,
                  fontWeight: '800',
                  color: '#1F2937',
                  lineHeight: 32,
                }}>
                  The Space Explorer &amp; The Dog&apos;s Big Adventure
                </Text>
              </View>

              {/* Book Cover Placeholder */}
              <View style={{
                width: '100%',
                aspectRatio: 3 / 4,
                backgroundColor: '#F3F4F6',
                borderRadius: 20,
                borderWidth: 4,
                borderColor: '#FFFFFF',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                marginBottom: 24,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.15,
                shadowRadius: 16,
              }}>
                <Ionicons name="book" size={80} color="#9CA3AF" />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.6)']}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: 24,
                  }}
                >
                  <Text style={{
                    color: 'white',
                    fontStyle: 'italic',
                    fontSize: 16,
                    textAlign: 'center',
                    fontWeight: '500',
                    opacity: 0.9,
                  }}>
                    &quot;Once upon a time, in a galaxy not so far away...&quot;
                  </Text>
                </LinearGradient>
              </View>
            </View>

            <View>
              <Text style={{
                fontSize: 16,
                color: '#6B7280',
                textAlign: 'center',
                marginBottom: 16,
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
                  <Lock size={24} color="white" strokeWidth={2.5} />
                  <Text style={{ fontSize: 20, fontWeight: '800', color: 'white' }}>
                    Ask Parent to Unlock!
                  </Text>
                </View>
              </ChunkyButton>
            </View>
          </Animated.View>
        )}
      </View>
    </LinearGradient>
  );
}
