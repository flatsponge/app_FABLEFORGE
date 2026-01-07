import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Image, StyleSheet, ImageBackground } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { UnifiedHeader } from '@/components/UnifiedHeader';
import { useChildLock } from '@/contexts/ChildLockContext';
import { useOrientation } from '@/components/useOrientation';
import ChildBackground from '@/childbackground/childbackground1.png';
import ChildBackground2 from '@/childbackground/childbackground2.jpg';
import ChildBackground3 from '@/childbackground/childbackground3.jpg';
import ChildBackground4 from '@/childbackground/childbackground4.jpg';
import ChildBackground5 from '@/childbackground/childbackground5.jpg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Easing,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import {
  Lock,
  Unlock,
  Shirt,
  Palette,
  Star,
  Crown,
  Gift,
  Mic,
  Sparkles,
  Send,
  Keyboard,
  X,
  RotateCcw,
  BookOpen,
  Play,
  Image as ImageIcon,
} from 'lucide-react-native';
import { OUTFITS, HATS, TOYS, BOOKS, PRESET_LOCATIONS, BASE_AVATARS } from '@/constants/data';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { AvatarConfig } from '@/types';

type RoomType = 'wardrobe' | 'well' | 'read';
type WardrobeTab = 'clothes' | 'hats' | 'toys' | 'skin' | 'background';
type WishState = 'idle' | 'recording' | 'typing' | 'review' | 'sent';

const DEFAULT_AVATAR: AvatarConfig = {
  skinColor: '#fed0b3',
  outfitId: 'tshirt-blue',
  hatId: 'none',
  toyId: 'none',
};

const AnimatedBottle = ({ onComplete, onLanded }: { onComplete: () => void; onLanded: () => void }) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const landedTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const duration = 800;

    translateY.value = withTiming(-180, {
      duration,
      easing: Easing.out(Easing.quad),
    });

    scale.value = withTiming(0.25, {
      duration,
      easing: Easing.in(Easing.quad),
    });

    rotate.value = withTiming(120, {
      duration,
      easing: Easing.out(Easing.quad),
    });

    opacity.value = withTiming(0, {
      duration,
      easing: Easing.in(Easing.quad),
    });

    landedTimeout.current = setTimeout(() => runOnJS(onLanded)(), 500);
    completeTimeout.current = setTimeout(() => runOnJS(onComplete)(), duration + 50);

    return () => {
      if (landedTimeout.current) {
        clearTimeout(landedTimeout.current);
        landedTimeout.current = null;
      }
      if (completeTimeout.current) {
        clearTimeout(completeTimeout.current);
        completeTimeout.current = null;
      }
    };
  }, [onComplete, onLanded]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          position: 'absolute',
          bottom: -40,
          left: '50%',
          marginLeft: -60,
          zIndex: 25,
        },
      ]}
    >
      <Image
        source={require('@/assets/childview/ui/bottlewell.png')}
        style={{ width: 120, height: 120 }}
        resizeMode="contain"
      />
    </Animated.View>
  );
};

const GlitterBurst = () => {
  const particles = Array.from({ length: 10 }, (_, i) => ({
    translateX: useSharedValue(0),
    translateY: useSharedValue(0),
    opacity: useSharedValue(1),
    scale: useSharedValue(0),
  }));

  useEffect(() => {
    particles.forEach((p, i) => {
      const angle = (i * 36) * (Math.PI / 180);
      const dist = 40 + Math.random() * 30;

      p.scale.value = withSpring(1.2, { damping: 8, stiffness: 300 });
      p.translateX.value = withTiming(Math.cos(angle) * dist, { duration: 600, easing: Easing.out(Easing.cubic) });
      p.translateY.value = withTiming(Math.sin(angle) * dist - 15, { duration: 600, easing: Easing.out(Easing.cubic) });
      p.opacity.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.quad) });
    });
  }, []);

  const colors = ['#fde047', '#fbbf24', '#fef3c7', '#fcd34d', '#ffffff', '#a78bfa', '#c4b5fd', '#e879f9', '#fde047', '#ffffff'];

  return (
    <>
      {particles.map((p, i) => {
        const style = useAnimatedStyle(() => ({
          transform: [
            { translateX: p.translateX.value },
            { translateY: p.translateY.value },
            { scale: p.scale.value },
          ],
          opacity: p.opacity.value,
        }));

        return (
          <Animated.View
            key={i}
            style={[style, { position: 'absolute' }]}
          >
            <Sparkles size={28 + (i % 3) * 8} color={colors[i]} fill={colors[i]} />
          </Animated.View>
        );
      })}
    </>
  );
};

// Chunky 3D button component with proper depth and tactile feel
const ChunkyButton = ({
  onPress,
  onPressIn,
  onPressOut,
  children,
  bgColor = 'bg-white',
  borderColor = 'border-slate-300',
  bottomBorderColor,
  size = 'medium',
  rounded = 'rounded-2xl',
  disabled = false,
  style,
}: {
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  children: React.ReactNode;
  bgColor?: string;
  borderColor?: string;
  bottomBorderColor?: string;
  size?: 'small' | 'medium' | 'large' | 'xl';
  rounded?: string;
  disabled?: boolean;
  style?: any;
}) => {
  const pressed = useSharedValue(0);

  const sizeStyles = {
    small: { borderBottom: 4, borderSide: 2, borderTop: 2 },
    medium: { borderBottom: 6, borderSide: 3, borderTop: 3 },
    large: { borderBottom: 10, borderSide: 4, borderTop: 4 },
    xl: { borderBottom: 14, borderSide: 5, borderTop: 4 },
  };

  const s = sizeStyles[size];
  const actualBottomBorder = bottomBorderColor || borderColor;

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
          onPressIn?.();
        }
      }}
      onPressOut={() => {
        if (!disabled) {
          pressed.value = withSpring(0, { damping: 25, stiffness: 600 });
          onPressOut?.();
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
            opacity: disabled ? 0.5 : 1,
          },
        ]}
        className={`${bgColor} ${rounded} ${borderColor}`}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
};

// Big action button for main wishing well actions - extra chunky and toylike
// Uses same 3D border-based animation style as ChunkyButton for consistency
const BigActionButton = ({
  onPress,
  children,
  bgColor,
  borderColor,
  disabled = false,
  flex = 1,
  aspectSquare = false,
}: {
  onPress: () => void;
  children: React.ReactNode;
  bgColor: string;
  borderColor: string;
  disabled?: boolean;
  flex?: number;
  aspectSquare?: boolean;
}) => {
  const pressed = useSharedValue(0);
  const borderBottom = 12; // Chunky bottom border for 3D effect

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(pressed.value, [0, 1], [0, borderBottom - 3]) },
    ],
  }));

  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderBottomWidth: interpolate(pressed.value, [0, 1], [borderBottom, 3]),
  }));

  return (
    <Pressable
      onPressIn={() => {
        if (!disabled) {
          pressed.value = withSpring(1, { damping: 25, stiffness: 600 });
        }
      }}
      onPressOut={() => {
        if (!disabled) {
          pressed.value = withSpring(0, { damping: 25, stiffness: 600 });
          // Small delay to let the animation complete before action
          setTimeout(() => {
            onPress();
          }, 100);
        }
      }}
      style={{ flex, aspectRatio: aspectSquare ? 1 : undefined }}
    >
      <Animated.View
        style={[
          animatedStyle,
          animatedBorderStyle,
          {
            flex: 1,
            backgroundColor: bgColor,
            borderRadius: 32,
            borderTopWidth: 4,
            borderLeftWidth: 5,
            borderRightWidth: 5,
            borderColor: borderColor,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
};


const Avatar = ({
  config,
  scale = 1,
}: {
  config: AvatarConfig;
  scale?: number;
}) => {
  const { data } = useOnboarding();
  const avatarId = data?.avatarId || 'bears';
  const baseImage = BASE_AVATARS.find(a => a.id === avatarId)?.image || BASE_AVATARS[0].image;

  const outfit = OUTFITS.find(o => o.id === config.outfitId) || OUTFITS[0];
  const hat = HATS.find(h => h.id === config.hatId);

  return (
    <View
      className="relative w-48 h-64 items-center justify-center"
      style={{ transform: [{ scale }] }}
    >
      {/* Base Body */}
      <Image
        source={baseImage}
        className="absolute w-full h-full"
        resizeMode="contain"
      />

      {/* Shoes/Feet - positioned absolute if needed, or included in base? 
            Base includes feet. Clothes go on top. */}

      {/* Clothes */}
      <View
        className={`absolute bottom-[20%] w-28 h-24 rounded-t-[32px] rounded-b-[40px] z-10 ${outfit.color} items-center justify-center`}
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          borderWidth: 4,
          borderColor: 'rgba(0,0,0,0.05)',
        }}
      >
        <View className="opacity-20">
          <Star size={32} color="white" />
        </View>
      </View>

      {/* Hat */}
      {hat && hat.id !== 'none' && (
        <View className="absolute top-[5%] z-30" style={{ transform: [{ scale: 0.9 }] }}>
          {hat.id === 'crown' && (
            <View style={styles.hatShadow}>
              <Crown size={80} color="#fbbf24" fill="#fbbf24" />
            </View>
          )}
          {hat.id === 'cap' && (
            <View
              className="w-32 h-16 bg-blue-500 rounded-t-full"
              style={{
                borderWidth: 4,
                borderColor: '#2563eb',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
              }}
            />
          )}
          {hat.id === 'bow' && (
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-pink-400 rounded-full" style={{ borderWidth: 4, borderColor: '#ec4899' }} />
              <View className="w-10 h-10 bg-pink-400 rounded-full -mx-2 z-10" style={{ borderWidth: 4, borderColor: '#ec4899' }} />
              <View className="w-8 h-8 bg-pink-400 rounded-full" style={{ borderWidth: 4, borderColor: '#ec4899' }} />
            </View>
          )}
        </View>
      )}
    </View>
  );
};

// Big chunky room navigation button
const RoomButton = ({
  active,
  onPress,
  icon: Icon,
  label,
  activeColor,
  activeBorderColor,
}: {
  active: boolean;
  onPress: () => void;
  icon: typeof Shirt;
  label: string;
  activeColor: string;
  activeBorderColor: string;
}) => {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(pressed.value, [0, 1], [0, 4]) }],
  }));

  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderBottomWidth: interpolate(pressed.value, [0, 1], [8, 4]),
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        pressed.value = withSpring(1, { damping: 25, stiffness: 600 });
      }}
      onPressOut={() => {
        pressed.value = withSpring(0, { damping: 25, stiffness: 600 });
      }}
    >
      <Animated.View
        style={[
          animatedStyle,
          animatedBorderStyle,
          {
            borderTopWidth: 4,
            borderLeftWidth: 4,
            borderRightWidth: 4,
            borderColor: active ? activeBorderColor : '#cbd5e1',
            backgroundColor: active ? activeColor : '#ffffff',
            width: 64,
            height: 64,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: active ? 4 : 2 },
            shadowOpacity: active ? 0.2 : 0.1,
            shadowRadius: active ? 6 : 3,
            elevation: active ? 6 : 3,
          },
        ]}
      >
        <Icon size={24} color={active ? '#1e293b' : '#94a3b8'} strokeWidth={2.5} />
        <Text
          style={{
            fontSize: 9,
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            color: active ? '#1e293b' : '#94a3b8',
            marginTop: 2,
          }}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

// Animated lock button with chunky 3D feel
const LockButton = ({
  isLocked,
  onPressIn,
  onPressOut,
}: {
  isLocked: boolean;
  onPressIn: () => void;
  onPressOut: () => void;
}) => {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(pressed.value, [0, 1], [0, 5]) }],
  }));

  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderBottomWidth: interpolate(pressed.value, [0, 1], [10, 4]),
  }));

  return (
    <Pressable
      onPressIn={() => {
        pressed.value = withSpring(1, { damping: 25, stiffness: 600 });
        onPressIn();
      }}
      onPressOut={() => {
        pressed.value = withSpring(0, { damping: 25, stiffness: 600 });
        onPressOut();
      }}
    >
      <Animated.View
        style={[
          animatedStyle,
          animatedBorderStyle,
          {
            width: 56,
            height: 56,
            borderRadius: 16,
            borderTopWidth: 4,
            borderLeftWidth: 4,
            borderRightWidth: 4,
            borderColor: isLocked ? '#b91c1c' : '#cbd5e1',
            backgroundColor: isLocked ? '#ef4444' : '#ffffff',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 6,
            elevation: 6,
          },
        ]}
      >
        {isLocked ? (
          <Lock size={24} color="white" strokeWidth={3} />
        ) : (
          <Unlock size={24} color="#94a3b8" strokeWidth={2.5} />
        )}
      </Animated.View>
    </Pressable>
  );
};

// Animated wardrobe tab button
const WardrobeTabButton = ({
  active,
  onPress,
  icon: Icon,
  activeColor,
  activeBorderColor,
}: {
  active: boolean;
  onPress: () => void;
  icon: typeof Shirt;
  activeColor: string;
  activeBorderColor: string;
}) => {
  const pressed = useSharedValue(0);
  const scale = useSharedValue(active ? 1.1 : 1);

  useEffect(() => {
    scale.value = withSpring(active ? 1.1 : 1, { damping: 25, stiffness: 600 });
  }, [active]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(pressed.value, [0, 1], [0, 3]) },
      { scale: scale.value },
    ],
  }));

  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderBottomWidth: interpolate(pressed.value, [0, 1], [6, 2]),
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        pressed.value = withSpring(1, { damping: 25, stiffness: 600 });
      }}
      onPressOut={() => {
        pressed.value = withSpring(0, { damping: 25, stiffness: 600 });
      }}
    >
      <Animated.View
        style={[
          animatedStyle,
          animatedBorderStyle,
          {
            width: 56,
            height: 56,
            borderRadius: 14,
            borderTopWidth: 3,
            borderLeftWidth: 3,
            borderRightWidth: 3,
            borderColor: active ? activeBorderColor : '#cbd5e1',
            backgroundColor: active ? activeColor : '#ffffff',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: active ? 4 : 2 },
            shadowOpacity: active ? 0.2 : 0.1,
            shadowRadius: active ? 5 : 3,
            elevation: active ? 5 : 2,
          },
        ]}
      >
        <Icon
          size={24}
          color={active ? 'white' : '#cbd5e1'}
          strokeWidth={3}
        />
      </Animated.View>
    </Pressable>
  );
};

export default function ChildHubScreen() {
  const [isLocked, setIsLocked] = useState(false); // Default to unlocked
  const [activeRoom, setActiveRoom] = useState<RoomType>('wardrobe');
  const [wardrobeTab, setWardrobeTab] = useState<WardrobeTab>('clothes');
  const [backgroundSource, setBackgroundSource] = useState<any>(ChildBackground);
  const [wishState, setWishState] = useState<WishState>('idle');
  const [recordingTime, setRecordingTime] = useState(0);
  const [wishText, setWishText] = useState('');
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>(DEFAULT_AVATAR);
  const [showUnlockHint, setShowUnlockHint] = useState(false);
  const [showBottleAnimation, setShowBottleAnimation] = useState(false);
  const [showGlitter, setShowGlitter] = useState(false);
  const [wishSent, setWishSent] = useState(false);
  const { data: onboardingData } = useOnboarding();
  const gender = onboardingData?.gender || 'boy';

  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unlockHintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const insets = useSafeAreaInsets();

  // Enable rotation for this screen (My Room)
  const { isLandscape, width, height } = useOrientation(true);

  // Sync lock state with context for tab bar visibility
  const { setIsChildLocked, setIsOnChildHub } = useChildLock();

  useEffect(() => {
    setIsChildLocked(isLocked);
  }, [isLocked, setIsChildLocked]);

  // Track when this screen is focused
  useFocusEffect(
    useCallback(() => {
      setIsOnChildHub(true);
      return () => setIsOnChildHub(false);
    }, [setIsOnChildHub])
  );

  useEffect(() => {
    PRESET_LOCATIONS.forEach((loc) => {
      if (loc.image) {
        Image.prefetch(loc.image).catch(() => null);
      }
    });
  }, [PRESET_LOCATIONS]);

  const currentOutfit = OUTFITS.find(o => o.id === avatarConfig.outfitId) || OUTFITS[0];
  const currentHat = HATS.find(h => h.id === avatarConfig.hatId);
  const currentToy = TOYS.find(t => t.id === avatarConfig.toyId);

  // Inverted lock behavior: tap to lock, long-press to unlock
  const handleLockPressStart = () => {
    if (isLocked) {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
      // When locked, start long-press timer to unlock
      longPressTimer.current = setTimeout(() => {
        setIsLocked(false);
        setShowUnlockHint(false);
        longPressTimer.current = null;
      }, 1500);
    }
    // When unlocked, we lock on press release (short tap)
  };

  const handleLockPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    if (isLocked) {
      // Show hint that they need to hold longer
      setShowUnlockHint(true);
      if (unlockHintTimer.current) {
        clearTimeout(unlockHintTimer.current);
      }
      unlockHintTimer.current = setTimeout(() => {
        setShowUnlockHint(false);
        unlockHintTimer.current = null;
      }, 2000);
    } else {
      // Short tap while unlocked = lock immediately
      setIsLocked(true);
    }
  };

  const handleStartRecording = () => {
    setWishText('');
    setWishState('recording');
    setRecordingTime(0);
    intervalRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const handleStopRecording = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setWishState('review');
  };

  const handleSendWish = () => {
    // Start animation immediately - buttons will stay visible
    setShowBottleAnimation(true);
  };

  const handleBottleLanded = useCallback(() => {
    // Show glitter when bottle lands in the well
    setShowGlitter(true);
  }, [setShowGlitter]);

  const handleBottleAnimationComplete = useCallback(() => {
    setShowBottleAnimation(false);
    setShowGlitter(false);
    // Show success message - stay in this state until user taps "Again"
    setWishSent(true);
  }, [setShowBottleAnimation, setShowGlitter, setWishSent]);

  const handleSendAnother = () => {
    // Reset to idle state for another wish
    setWishSent(false);
    setWishState('idle');
    setRecordingTime(0);
    setWishText('');
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (longPressTimer.current) clearTimeout(longPressTimer.current);
      if (unlockHintTimer.current) clearTimeout(unlockHintTimer.current);
    };
  }, []);

  const tabItems: { id: WardrobeTab; icon: typeof Shirt; bgColor: string; borderColorValue: string }[] = [
    { id: 'clothes', icon: Shirt, bgColor: '#60a5fa', borderColorValue: '#2563eb' },
    { id: 'hats', icon: Crown, bgColor: '#facc15', borderColorValue: '#ca8a04' },
    { id: 'toys', icon: Gift, bgColor: '#c084fc', borderColorValue: '#9333ea' },
    // { id: 'skin', icon: Palette, bgColor: '#fb923c', borderColorValue: '#ea580c' },
    { id: 'background', icon: ImageIcon, bgColor: '#4ade80', borderColorValue: '#16a34a' },
  ];

  return (
    <View className="flex-1 bg-background">
      {/* Only show header when unlocked */}
      {!isLocked && (
        <UnifiedHeader
          variant="child"
          title="My Room"
          rightAction={
            <View className="items-end">
              <LockButton
                isLocked={isLocked}
                onPressIn={handleLockPressStart}
                onPressOut={handleLockPressEnd}
              />
            </View>
          }
        />
      )}
      <ImageBackground
        source={backgroundSource}
        style={{ flex: 1, paddingTop: isLocked ? insets.top : 0 }}
        resizeMode="cover"
      >
        {/* Child room navigation - Visible even when locked (Child Mode) */}
        <View className="px-4 pt-4 flex-row gap-2 z-50">
          <RoomButton
            active={activeRoom === 'wardrobe'}
            onPress={() => setActiveRoom('wardrobe')}
            icon={Shirt}
            label="Me"
            activeColor="#FFF176"
            activeBorderColor="#ca8a04"
          />
          <RoomButton
            active={activeRoom === 'read'}
            onPress={() => setActiveRoom('read')}
            icon={BookOpen}
            label="Read"
            activeColor="#A5D6A7"
            activeBorderColor="#15803d"
          />
          <RoomButton
            active={activeRoom === 'well'}
            onPress={() => setActiveRoom('well')}
            icon={Sparkles}
            label="Wish"
            activeColor="#4DD0E1"
            activeBorderColor="#0e7490"
          />
        </View>

        {activeRoom === 'wardrobe' && (
          <View className="flex-1 relative z-10 pb-24">
            <View className="flex-1 items-center justify-center pt-8">
              <View className="bg-white/30 p-8 rounded-full border-4 border-white/50">
                <Avatar config={avatarConfig} scale={1.2} />
              </View>
            </View>

            <View className="px-4 pb-4">
              <View className="flex-row gap-3 mb-4 justify-center">
                {tabItems.map(tab => (
                  <WardrobeTabButton
                    key={tab.id}
                    active={wardrobeTab === tab.id}
                    onPress={() => setWardrobeTab(tab.id)}
                    icon={tab.icon}
                    activeColor={tab.bgColor}
                    activeBorderColor={tab.borderColorValue}
                  />
                ))}
              </View>

              <View className="bg-white rounded-3xl p-4 border-4 border-slate-200">
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-3">
                    {wardrobeTab === 'clothes' &&
                      OUTFITS.map(item => (
                        <Pressable
                          key={item.id}
                          onPress={() =>
                            setAvatarConfig({ ...avatarConfig, outfitId: item.id })
                          }
                          style={currentOutfit.id === item.id ? { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 4 } : { opacity: 0.9 }}
                          className={`w-20 h-20 rounded-2xl items-center justify-center border-4 ${item.color} ${currentOutfit.id === item.id
                            ? 'border-black/30'
                            : 'border-transparent'
                            }`}
                        >
                          <Text className="text-4xl">{item.iconName}</Text>
                        </Pressable>
                      ))}

                    {wardrobeTab === 'hats' &&
                      HATS.map(item => (
                        <Pressable
                          key={item.id}
                          onPress={() =>
                            setAvatarConfig({ ...avatarConfig, hatId: item.id })
                          }
                          className={`w-20 h-20 rounded-2xl items-center justify-center bg-slate-100 border-4 ${currentHat?.id === item.id
                            ? 'border-yellow-400 bg-white'
                            : 'border-slate-200'
                            }`}
                        >
                          <Text className="text-4xl">{item.id === 'crown' ? '👑' : item.id === 'cap' ? '🧢' : item.id === 'bow' ? '🎀' : '❌'}</Text>
                        </Pressable>
                      ))}

                    {wardrobeTab === 'toys' &&
                      TOYS.map(item => (
                        <Pressable
                          key={item.id}
                          onPress={() =>
                            setAvatarConfig({ ...avatarConfig, toyId: item.id })
                          }
                          className={`w-20 h-20 rounded-2xl items-center justify-center bg-slate-100 border-4 ${currentToy?.id === item.id
                            ? 'border-purple-400 bg-white'
                            : 'border-slate-200'
                            }`}
                        >
                          <Text className="text-4xl">{item.id === 'star' ? '⭐' : item.id === 'camera' ? '📷' : item.id === 'game' ? '🎮' : '❌'}</Text>
                        </Pressable>
                      ))}

                    {wardrobeTab === 'skin' && (
                      <View className="h-20 items-center justify-center w-full">
                        <Text className="text-gray-400">No skin customization for this hero!</Text>
                      </View>
                    )}

                    {wardrobeTab === 'background' && (
                      <>
                        {/* Default Background */}
                        <Pressable
                          onPress={() => setBackgroundSource(ChildBackground)}
                          style={backgroundSource === ChildBackground ? { shadowColor: '#22c55e', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 6, elevation: 4 } : undefined}
                          className={`w-20 h-20 rounded-2xl overflow-hidden border-4 ${backgroundSource === ChildBackground
                            ? 'border-green-500'
                            : 'border-slate-200'
                            }`}
                        >
                          <Image source={ChildBackground} className="w-full h-full" resizeMode="cover" />
                        </Pressable>

                        {/* Dreamy Night Background */}
                        <Pressable
                          onPress={() => setBackgroundSource(ChildBackground2)}
                          style={backgroundSource === ChildBackground2 ? { shadowColor: '#22c55e', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 6, elevation: 4 } : undefined}
                          className={`w-20 h-20 rounded-2xl overflow-hidden border-4 ${backgroundSource === ChildBackground2
                            ? 'border-green-500'
                            : 'border-slate-200'
                            }`}
                        >
                          <Image source={ChildBackground2} className="w-full h-full" resizeMode="cover" />
                        </Pressable>

                        {/* Sunny Meadow Background */}
                        <Pressable
                          onPress={() => setBackgroundSource(ChildBackground3)}
                          style={backgroundSource === ChildBackground3 ? { shadowColor: '#22c55e', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 6, elevation: 4 } : undefined}
                          className={`w-20 h-20 rounded-2xl overflow-hidden border-4 ${backgroundSource === ChildBackground3
                            ? 'border-green-500'
                            : 'border-slate-200'
                            }`}
                        >
                          <Image source={ChildBackground3} className="w-full h-full" resizeMode="cover" />
                        </Pressable>

                        {/* Ocean Background */}
                        <Pressable
                          onPress={() => setBackgroundSource(ChildBackground4)}
                          style={backgroundSource === ChildBackground4 ? { shadowColor: '#22c55e', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 6, elevation: 4 } : undefined}
                          className={`w-20 h-20 rounded-2xl overflow-hidden border-4 ${backgroundSource === ChildBackground4
                            ? 'border-green-500'
                            : 'border-slate-200'
                            }`}
                        >
                          <Image source={ChildBackground4} className="w-full h-full" resizeMode="cover" />
                        </Pressable>

                        {/* Forest Background */}
                        <Pressable
                          onPress={() => setBackgroundSource(ChildBackground5)}
                          style={backgroundSource === ChildBackground5 ? { shadowColor: '#22c55e', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 6, elevation: 4 } : undefined}
                          className={`w-20 h-20 rounded-2xl overflow-hidden border-4 ${backgroundSource === ChildBackground5
                            ? 'border-green-500'
                            : 'border-slate-200'
                            }`}
                        >
                          <Image source={ChildBackground5} className="w-full h-full" resizeMode="cover" />
                        </Pressable>

                        {/* Preset Locations */}
                        {PRESET_LOCATIONS.map(loc => (
                          <Pressable
                            key={loc.id}
                            onPress={() => setBackgroundSource({ uri: loc.image })}
                            style={(backgroundSource as any)?.uri === loc.image ? { shadowColor: '#22c55e', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 6, elevation: 4 } : undefined}
                            className={`w-20 h-20 rounded-2xl overflow-hidden border-4 ${(backgroundSource as any)?.uri === loc.image
                              ? 'border-green-500'
                              : 'border-slate-200'
                              }`}
                          >
                            <Image source={{ uri: loc.image }} className="w-full h-full" resizeMode="cover" />
                          </Pressable>
                        ))}
                      </>
                    )}
                  </View>
                </ScrollView>
              </View>
            </View>
          </View>
        )}

        {activeRoom === 'read' && (
          <ScrollView className="flex-1 relative z-10 px-4 pt-4" contentContainerStyle={{ paddingBottom: 100 }}>
            <View className="bg-white px-6 py-4 rounded-3xl border-b-8 border-slate-200 mb-6 items-center transform -rotate-1">
              <Text className="text-2xl font-black text-slate-700 tracking-tight">
                My Stories 📚
              </Text>
            </View>

            <View className="gap-6 pb-32">
              {BOOKS.slice(0, 5).map(book => (
                <Pressable
                  key={book.id}
                  className="w-full bg-white p-4 rounded-[40px] border-b-[12px] border-slate-200 flex-row items-center gap-5 active:scale-[0.98] active:border-b-4"
                >
                  <View className="w-24 h-24 rounded-2xl bg-slate-100 overflow-hidden border-4 border-slate-100">
                    <Image
                      source={{ uri: book.coverImage }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </View>
                  <View className="flex-1 py-2">
                    <Text
                      className="text-xl font-black text-slate-800 leading-tight mb-2"
                      numberOfLines={2}
                    >
                      {book.title}
                    </Text>
                    <View className="px-3 py-1 bg-green-100 rounded-full border-2 border-green-200 self-start">
                      <Text className="text-[10px] font-black text-green-600 uppercase tracking-wide">
                        Read Now
                      </Text>
                    </View>
                  </View>
                  <View className="w-20 h-20 rounded-full bg-green-500 border-4 border-b-8 border-green-700 items-center justify-center shadow-sm">
                    <Play size={40} color="white" fill="white" />
                  </View>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        )}

        {activeRoom === 'well' && (
          <View className="flex-1 items-center justify-between relative z-10 pt-8 pb-24 px-4">
            {wishState !== 'typing' && (
              <View className="bg-white px-8 py-4 rounded-3xl border-b-8 border-slate-200 mb-4 transform -rotate-1">
                <Text className="text-2xl font-black text-slate-700 text-center tracking-tight">
                  Make a Wish! ✨
                </Text>
              </View>
            )}

            {wishState !== 'typing' && (
              <View className="flex-1 w-full items-center justify-center">
                <View className="relative" style={{ width: 280, height: 280 }}>
                  <Image
                    source={require('@/assets/childview/ui/wishingwell.png')}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="contain"
                  />

                  {showBottleAnimation && (
                    <AnimatedBottle
                      onComplete={handleBottleAnimationComplete}
                      onLanded={handleBottleLanded}
                    />
                  )}

                  {showGlitter && (
                    <View style={{
                      position: 'absolute',
                      top: '15%',
                      left: '50%',
                      marginLeft: -10,
                      zIndex: 30
                    }}>
                      <GlitterBurst />
                    </View>
                  )}
                </View>
              </View>
            )}

            <View className="w-full max-w-sm pb-4">
              {wishState === 'idle' && (
                <View
                  className="flex-row gap-4"
                  style={{ height: 180 }}
                >
                  <BigActionButton
                    onPress={handleStartRecording}
                    bgColor="#f43f5e"
                    borderColor="#be123c"
                    aspectSquare
                    disabled={showBottleAnimation}
                  >
                    <View style={{
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      padding: 16,
                      borderRadius: 999,
                      marginBottom: 8,
                    }}>
                      <Mic size={40} color="white" strokeWidth={3} />
                    </View>
                    <Text style={{
                      color: 'white',
                      fontWeight: '900',
                      fontSize: 20,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                    }}>
                      Talk
                    </Text>
                  </BigActionButton>

                  <BigActionButton
                    onPress={() => setWishState('typing')}
                    bgColor="#0ea5e9"
                    borderColor="#0369a1"
                    aspectSquare
                    disabled={showBottleAnimation}
                  >
                    <View style={{
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      padding: 16,
                      borderRadius: 999,
                      marginBottom: 8,
                    }}>
                      <Keyboard size={40} color="white" strokeWidth={3} />
                    </View>
                    <Text style={{
                      color: 'white',
                      fontWeight: '900',
                      fontSize: 20,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                    }}>
                      Type
                    </Text>
                  </BigActionButton>
                </View>
              )}

              {wishState === 'recording' && (
                <View className="items-center gap-6 w-full">
                  <View className="bg-white px-8 py-6 rounded-3xl border-4 border-slate-200 flex-row items-center justify-center gap-4 w-full">
                    <View className="w-6 h-6 rounded-full bg-rose-500" />
                    <Text className="text-4xl font-black text-slate-700 font-mono tracking-widest">
                      00:0{recordingTime}
                    </Text>
                  </View>

                  <View style={{ width: '100%', height: 128 }}>
                    <BigActionButton
                      onPress={handleStopRecording}
                      bgColor="#f43f5e"
                      borderColor="#9f1239"
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                        <View style={{ width: 40, height: 40, backgroundColor: 'white', borderRadius: 8 }} />
                        <Text style={{
                          color: 'white',
                          fontWeight: '900',
                          fontSize: 32,
                          textTransform: 'uppercase',
                          letterSpacing: 1,
                        }}>
                          Stop
                        </Text>
                      </View>
                    </BigActionButton>
                  </View>
                </View>
              )}

              {wishState === 'typing' && (
                <View className="gap-4 w-full">
                  <View className="bg-white p-6 rounded-[40px] border-8 border-sky-200 min-h-[200px]">
                    <TextInput
                      value={wishText}
                      onChangeText={setWishText}
                      placeholder="I wish for..."
                      placeholderTextColor="#cbd5e1"
                      multiline
                      className="text-2xl font-black text-slate-700 text-center flex-1"
                      autoFocus
                    />
                    <Text className="text-center text-slate-300 font-bold text-sm uppercase tracking-widest mt-2">
                      Type your story idea
                    </Text>
                  </View>

                  <View className="flex-row gap-4" style={{ height: 128 }}>
                    <View style={{ width: 128 }}>
                      <BigActionButton
                        onPress={() => {
                          setWishState('idle');
                          setWishText('');
                        }}
                        bgColor="#e2e8f0"
                        borderColor="#94a3b8"
                      >
                        <X size={48} color="#64748b" strokeWidth={4} />
                      </BigActionButton>
                    </View>
                    <BigActionButton
                      onPress={() => setWishState('review')}
                      disabled={!wishText.trim()}
                      bgColor="#0ea5e9"
                      borderColor="#0369a1"
                    >
                      <Text style={{
                        color: 'white',
                        fontWeight: '900',
                        fontSize: 36,
                        textTransform: 'uppercase',
                        letterSpacing: 2,
                      }}>
                        Done
                      </Text>
                    </BigActionButton>
                  </View>
                </View>
              )}

              {wishState === 'review' && (
                <View className="gap-6 w-full">
                  <View className="bg-white p-8 rounded-[40px] border-b-8 border-slate-200 items-center transform rotate-1">
                    {wishSent ? (
                      <View className="items-center gap-2">
                        <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-2">
                          <Sparkles size={32} color="#10b981" strokeWidth={3} fill="#10b981" />
                        </View>
                        <Text className="text-slate-800 font-black text-2xl">
                          Wish Sent! ✨
                        </Text>
                      </View>
                    ) : wishText ? (
                      <>
                        <Text className="text-slate-400 font-black text-xs uppercase tracking-widest mb-3">
                          Your Wish
                        </Text>
                        <Text className="text-slate-800 font-black text-2xl leading-tight text-center">
                          "{wishText}"
                        </Text>
                      </>
                    ) : (
                      <View className="items-center gap-2">
                        <View className="w-16 h-16 bg-rose-100 rounded-full items-center justify-center mb-2">
                          <Mic size={32} color="#f43f5e" strokeWidth={3} />
                        </View>
                        <Text className="text-slate-800 font-black text-2xl">
                          Voice Wish Ready!
                        </Text>
                      </View>
                    )}
                  </View>
                  {wishSent ? (
                    // Success state - single "Again" button
                    <View style={{ height: 128, width: '100%' }}>
                      <BigActionButton
                        onPress={handleSendAnother}
                        bgColor="#0ea5e9"
                        borderColor="#0369a1"
                      >
                        <Text style={{
                          color: 'white',
                          fontWeight: '900',
                          fontSize: 32,
                          textTransform: 'uppercase',
                          letterSpacing: 1,
                        }}>
                          Again
                        </Text>
                      </BigActionButton>
                    </View>
                  ) : (
                    // Review state - Reset and Throw It buttons
                    <View
                      className="flex-row gap-4"
                      style={{ height: 128 }}
                    >
                      <BigActionButton
                        onPress={() => {
                          if (wishText) {
                            setWishState('typing');
                          } else {
                            setWishState('idle');
                          }
                        }}
                        bgColor="#ffffff"
                        borderColor="#cbd5e1"
                        disabled={showBottleAnimation || wishSent}
                      >
                        <RotateCcw size={32} color="#64748b" strokeWidth={4} />
                        <Text style={{
                          color: '#64748b',
                          fontWeight: '900',
                          fontSize: 16,
                          textTransform: 'uppercase',
                          marginTop: 8,
                          letterSpacing: 0.5,
                        }}>
                          Reset
                        </Text>
                      </BigActionButton>
                      <BigActionButton
                        onPress={handleSendWish}
                        bgColor={showBottleAnimation ? "#6ee7b7" : "#10b981"}
                        borderColor={showBottleAnimation ? "#059669" : "#047857"}
                        flex={2}
                        disabled={showBottleAnimation || wishSent}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 8 }}>
                          <Text style={{
                            color: 'white',
                            fontWeight: '900',
                            fontSize: 24,
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                          }}>
                            {showBottleAnimation ? 'Thrown!' : 'Throw It!'}
                          </Text>
                          {showBottleAnimation ? (
                            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' }}>
                              <Text style={{ fontSize: 20 }}>✓</Text>
                            </View>
                          ) : (
                            <Send size={32} color="white" strokeWidth={3} />
                          )}
                        </View>
                      </BigActionButton>
                    </View>
                  )}
                </View>
              )}


            </View>
          </View>
        )}

        {isLocked && (
          <View style={{ position: 'absolute', top: insets.top + 8, right: 16, zIndex: 100 }}>
            <LockButton
              isLocked={isLocked}
              onPressIn={handleLockPressStart}
              onPressOut={handleLockPressEnd}
            />
            {showUnlockHint && (
              <View
                style={{
                  position: 'absolute',
                  top: 60,
                  right: 0,
                  backgroundColor: '#ef4444',
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 10,
                  borderWidth: 3,
                  borderColor: '#b91c1c',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                  zIndex: 100,
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: '900', color: 'white' }}>HOLD!</Text>
              </View>
            )}
          </View>
        )}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  hatShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  chunkyButtonBase: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  toyBoxShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
});
