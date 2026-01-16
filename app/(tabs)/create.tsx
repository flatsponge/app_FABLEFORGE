import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Vibration, StyleSheet, LayoutAnimation, Platform, UIManager, ActivityIndicator, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimatePresence, MotiView } from 'moti';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
  Easing,
} from 'react-native-reanimated';
import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { UnifiedHeader } from '@/components/UnifiedHeader';
import { useCachedValue } from '@/hooks/useCachedValue';
import { useStoryDraft } from '@/hooks/useStoryDraft';
import { CACHE_KEYS } from '@/lib/queryCache';
import {

  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ChevronLeft,
  ClipboardList,
  Clock,
  Diamond,
  Dice5,
  FileText,
  Gift,
  Heart,
  Hourglass,
  Infinity,
  LifeBuoy,
  ListChecks,
  MapPin,
  Mic,
  Moon,
  Palette,
  Plus,
  Puzzle,
  RotateCcw,
  Scale,
  Search,
  Shield,
  Shuffle,
  Sparkles,
  Sun,
  User,
  Users,
  Wand2,
  Zap,
  X,
  LucideIcon
} from 'lucide-react-native';

import { CrystalModal } from '@/components/CrystalModal';
import { DurationSelector } from '@/components/DurationSelector';
import { VibeSelector } from '@/components/VibeSelector';
import { WishDetailModal } from '@/components/WishDetailModal';
import { MAX_CRYSTALS, computeStoryCostClient } from '@/constants/crystals';
import { FRIENDS, PRESET_LOCATIONS, VOICE_PRESETS, FOCUS_VALUES } from '@/constants/data';
import { STORY_STARTERS, CHALLENGE_SUGGESTIONS } from '@/constants/suggestions';
import { Friend, PresetLocation, StoryLength, VoicePreset, Wish } from '@/types';

type AppState = 'studio' | 'generating-outline' | 'outline-review';
type StudioMode = 'creative' | 'situation' | 'auto';
type StoryVibe = 'energizing' | 'soothing' | 'whimsical' | 'thoughtful';
type ThemeMode = 'purple' | 'teal' | 'amber';

export interface FocusValue {
  id: string;
  name: string;
  icon: LucideIcon;
  bgColor: string;
  iconColor: string;
  desc: string;
}



const THEME_TINTS: Record<ThemeMode, { icon: string; bgLight: string; borderLight: string; text: string }> = {
  purple: {
    icon: '#a855f7',
    bgLight: 'bg-primary-50',
    borderLight: 'border-primary-200',
    text: 'text-primary-700',
  },
  teal: {
    icon: '#14b8a6',
    bgLight: 'bg-teal-50',
    borderLight: 'border-teal-200',
    text: 'text-teal-700',
  },
  amber: {
    icon: '#f59e0b',
    bgLight: 'bg-amber-50',
    borderLight: 'border-amber-200',
    text: 'text-amber-700',
  },
};

const TOGGLE_THEMES: Record<ThemeMode, { activeClass: string; icon: string; activeIcon: string }> = {
  purple: {
    activeClass: 'bg-slate-900 border-slate-900',
    icon: '#a855f7',
    activeIcon: '#e9d5ff',
  },
  teal: {
    activeClass: 'bg-teal-700 border-teal-700',
    icon: '#14b8a6',
    activeIcon: '#ccfbf1',
  },
  amber: {
    activeClass: 'bg-amber-500 border-amber-500',
    icon: '#f59e0b',
    activeIcon: '#fef3c7',
  },
};

const getRandomItem = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

interface SectionHeaderProps {
  title: string;
  icon?: LucideIcon;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, icon: Icon }) => (
  <View className="flex-row items-center gap-2 mb-3 px-1">
    {Icon ? <Icon size={14} color="#94a3b8" /> : null}
    <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</Text>
  </View>
);

// === NEW PREMIUM STORY SETTINGS PANEL ===

interface StorySettingsPanelProps {
  storyLength: StoryLength;
  onLengthChange: (value: StoryLength) => void;
  storyVibe: StoryVibe;
  onVibeChange: (value: StoryVibe) => void;
  voice: VoicePreset | null;
  onVoicePress: () => void;
  showWishes: boolean;
  onWishesToggle: () => void;
  theme?: ThemeMode;
}

const DURATION_OPTIONS: { val: StoryLength; label: string }[] = [
  { val: 'short', label: 'Short' },
  { val: 'medium', label: 'Medium' },
  { val: 'long', label: 'Long' },
];

const VIBE_OPTIONS: { val: StoryVibe; label: string; icon: LucideIcon }[] = [
  { val: 'energizing', label: 'Energizing', icon: Zap },
  { val: 'soothing', label: 'Soothing', icon: Moon },
  { val: 'whimsical', label: 'Whimsical', icon: Sparkles },
  { val: 'thoughtful', label: 'Thoughtful', icon: BookOpen },
];

// Animated Duration Dot
const AnimatedDot: React.FC<{
  isActive: boolean;
  activeColor: string;
  onPress: () => void;
}> = ({ isActive, activeColor, onPress }) => {
  const scale = useSharedValue(1);
  const size = useSharedValue(isActive ? 10 : 6);
  const colorProgress = useSharedValue(isActive ? 1 : 0);

  React.useEffect(() => {
    size.value = withSpring(isActive ? 10 : 6, { damping: 12, stiffness: 300 });
    colorProgress.value = withTiming(isActive ? 1 : 0, { duration: 200 });
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: size.value,
    height: size.value,
    borderRadius: 5,
    backgroundColor: interpolateColor(colorProgress.value, [0, 1], ['#e2e8f0', activeColor]),
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.8, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      hitSlop={12}
    >
      <Animated.View style={animatedStyle} />
    </Pressable>
  );
};

// Animated Label with fade transition
const AnimatedLabel: React.FC<{ label: string }> = ({ label }) => {
  return (
    <MotiView
      key={label}
      from={{ opacity: 0, translateY: -4 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 200 }}
    >
      <Text className="text-sm font-bold text-slate-800 min-w-[60px]">{label}</Text>
    </MotiView>
  );
};

// Animated Vibe Chip
const AnimatedVibeChip: React.FC<{
  label: string;
  Icon: LucideIcon;
  isActive: boolean;
  activeIconColor: string;
  onPress: () => void;
}> = ({ label, Icon, isActive, activeIconColor, onPress }) => {
  const scale = useSharedValue(1);
  const bgProgress = useSharedValue(isActive ? 1 : 0);
  const iconScale = useSharedValue(1);

  React.useEffect(() => {
    bgProgress.value = withTiming(isActive ? 1 : 0, { duration: 200 });
    if (isActive) {
      iconScale.value = withSpring(1.15, { damping: 8, stiffness: 300 }, () => {
        iconScale.value = withSpring(1, { damping: 12, stiffness: 300 });
      });
    }
  }, [isActive]);

  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(bgProgress.value, [0, 1], ['#f8fafc', '#0f172a']),
    transform: [{ scale: scale.value }],
  }));

  const iconContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      style={{ minWidth: '47%' }}
    >
      <Animated.View
        style={containerStyle}
        className="flex-row items-center gap-1.5 px-3 py-2 rounded-xl"
      >
        <Animated.View style={iconContainerStyle}>
          <Icon size={14} color={isActive ? '#ffffff' : activeIconColor} />
        </Animated.View>
        <Text className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-600'}`}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

const StorySettingsPanel: React.FC<StorySettingsPanelProps> = ({
  storyLength,
  onLengthChange,
  storyVibe,
  onVibeChange,
  voice,
  onVoicePress,
  showWishes,
  onWishesToggle,
  theme = 'purple',
}) => {
  const tint = THEME_TINTS[theme];
  const currentLengthIndex = DURATION_OPTIONS.findIndex((opt) => opt.val === storyLength);

  return (
    <View className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
      {/* Duration Row */}
      <View className="flex-row items-center justify-between px-5 py-4 border-b border-slate-50">
        <View className="flex-row items-center gap-3">
          <Clock size={18} color={tint.icon} />
          <Text className="text-sm font-semibold text-slate-600">Duration</Text>
        </View>
        <View className="flex-row items-center gap-3">
          {/* Dot Stepper */}
          <View className="flex-row items-center gap-1.5">
            {DURATION_OPTIONS.map((opt, index) => (
              <AnimatedDot
                key={opt.val}
                isActive={index <= currentLengthIndex}
                activeColor={tint.icon}
                onPress={() => onLengthChange(opt.val)}
              />
            ))}
          </View>
          <AnimatedLabel label={DURATION_OPTIONS[currentLengthIndex]?.label || 'Medium'} />
        </View>
      </View>

      {/* Vibe Row - 2x2 Grid (all visible) */}
      <View className="px-4 py-3 border-b border-slate-50">
        <View className="flex-row flex-wrap gap-2">
          {VIBE_OPTIONS.map((opt) => (
            <AnimatedVibeChip
              key={opt.val}
              label={opt.label}
              Icon={opt.icon}
              isActive={storyVibe === opt.val}
              activeIconColor={tint.icon}
              onPress={() => onVibeChange(opt.val)}
            />
          ))}
        </View>
      </View>

      {/* Bottom Row - Voice & Wishes */}
      <View className="flex-row">
        {/* Voice */}
        <Pressable
          onPress={onVoicePress}
          className="flex-1 flex-row items-center gap-2 px-5 py-3.5 border-r border-slate-50 active:bg-slate-50"
        >
          <Mic size={16} color={voice ? tint.icon : '#94a3b8'} />
          <Text
            className={`text-sm font-semibold ${voice ? 'text-slate-800' : 'text-slate-400'
              }`}
          >
            {voice ? voice.name : 'Voice'}
          </Text>
        </Pressable>

        {/* Wishes Toggle */}
        <Pressable
          onPress={onWishesToggle}
          className="flex-1 flex-row items-center justify-between gap-2 px-5 py-3.5 active:bg-slate-50"
        >
          <View className="flex-row items-center gap-2">
            <Shuffle size={16} color={showWishes ? tint.icon : '#94a3b8'} />
            <Text
              className={`text-sm font-semibold ${showWishes ? 'text-slate-800' : 'text-slate-400'
                }`}
            >
              Child's Wishes
            </Text>
          </View>
          <View
            className={`w-10 h-6 rounded-full p-0.5 ${showWishes ? 'bg-slate-900' : 'bg-slate-200'
              }`}
          >
            <MotiView
              animate={{ translateX: showWishes ? 16 : 0 }}
              transition={{ type: 'timing', duration: 150 }}
              className="w-5 h-5 rounded-full bg-white shadow-sm"
            />
          </View>
        </Pressable>
      </View>
    </View>
  );
};

// Keep old components for backwards compatibility (can be removed later)
interface TogglePillProps {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onPress: () => void;
  theme?: ThemeMode;
}

const TogglePill: React.FC<TogglePillProps> = ({ icon: Icon, label, active, onPress, theme = 'purple' }) => {
  const palette = TOGGLE_THEMES[theme];
  const containerClass = active ? palette.activeClass : 'bg-white border-slate-200';
  const labelClass = active ? 'text-white' : 'text-slate-500';
  const iconColor = active ? palette.activeIcon : palette.icon;

  return (
    <MotiView
      animate={{ scale: active ? 1.03 : 1 }}
      transition={{ type: 'timing', duration: 150 }}
    >
      <Pressable
        onPress={onPress}
        className={`flex-row items-center gap-3 pl-5 pr-5 py-3 rounded-2xl border shadow-sm ${containerClass} active:scale-95`}
      >
        <Icon size={18} color={iconColor} />
        <Text className={`text-sm font-bold ${labelClass}`}>{label}</Text>
      </Pressable>
    </MotiView>
  );
};

interface VoiceControlProps {
  value: VoicePreset | null;
  onPress: () => void;
  theme?: ThemeMode;
}

const VoiceControl: React.FC<VoiceControlProps> = ({ value, onPress, theme = 'purple' }) => {
  const tint = THEME_TINTS[theme];
  const hasValue = Boolean(value);
  const containerClass = hasValue ? `${tint.bgLight} ${tint.borderLight}` : 'bg-white border-slate-200';
  const labelClass = hasValue ? 'text-slate-900' : 'text-slate-600';

  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center gap-3 pl-5 pr-5 py-3 rounded-2xl border shadow-sm ${containerClass} active:scale-95`}
    >
      <Mic size={18} color={tint.icon} />
      <Text className={`text-sm font-bold ${labelClass}`}>{value ? value.name : 'Voice'}</Text>
    </Pressable>
  );
};

interface CompactElementProps {
  icon: LucideIcon;
  label: string;
  value: string | null;
  onPress: () => void;
  onClear: () => void;
  theme?: ThemeMode;
}

const CompactElement: React.FC<CompactElementProps> = ({
  icon: Icon,
  label,
  value,
  onPress,
  onClear,
  theme = 'purple',
}) => {
  const tint = THEME_TINTS[theme];
  const hasValue = Boolean(value);
  const containerClass = hasValue ? `${tint.bgLight} ${tint.borderLight}` : 'bg-white border-slate-200';
  const iconColor = hasValue ? tint.icon : '#94a3b8';

  return (
    <Pressable
      onPress={onPress}
      className={`relative flex-1 min-w-0 flex-row items-center gap-2.5 px-3 py-2 rounded-xl border ${containerClass
        }`}
    >
      <View
        className={`w-8 h-8 rounded-lg items-center justify-center ${hasValue ? 'bg-white/60' : 'bg-slate-100'
          }`}
      >
        <Icon size={16} color={iconColor} />
      </View>
      <View className="flex-1 min-w-0">
        <Text className="text-[9px] font-black uppercase tracking-wider text-slate-400">{label}</Text>
        <Text
          className={`text-xs font-bold ${hasValue ? 'text-slate-700' : 'text-slate-400'}`}
          numberOfLines={1}
        >
          {value || 'Auto'}
        </Text>
      </View>
      {hasValue ? (
        <Pressable
          onPress={(event) => {
            event.stopPropagation();
            onClear();
          }}
          hitSlop={6}
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white border border-slate-100 items-center justify-center"
        >
          <X size={12} color="#94a3b8" />
        </Pressable>
      ) : null}
    </Pressable>
  );
};

export const CreateScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  // Handle selections returned from asset-studio
  const searchParams = useLocalSearchParams<{
    selectedLocationId?: string;
    selectedCharacterId?: string;
    selectedVoiceId?: string;
    selectedValueId?: string;
  }>();

  // Get the user's default story length preference from onboarding
  const userDefaultStoryLength = useQuery(api.onboarding.getDefaultStoryLength);

  const {
    isLoaded,
    prompt, setPrompt,
    studioMode, setStudioMode,
    storyLength, setStoryLength,
    storyVibe, setStoryVibe,
    overrideLocation, setOverrideLocation,
    overrideCharacter, setOverrideCharacter,
    overrideValue, setOverrideValue,
    overrideVoice, setOverrideVoice,
    showElements, setShowElements,
    showRemix, setShowRemix,
    clearDraft
  } = useStoryDraft(userDefaultStoryLength ?? undefined);

  const [appState, setAppState] = useState<AppState>('studio');
  const [viewingWish, setViewingWish] = useState<Wish | null>(null);
  const [selectedWishId, setSelectedWishId] = useState<string | null>(null);
  const [showCrystalModal, setShowCrystalModal] = useState(false);

  // Prevent rendering until stored draft is loaded
  if (!isLoaded) return null;

  // Server-side credits & entitlement
  const liveCreditsData = useQuery(api.credits.getUserCredits);
  const { data: creditsData } = useCachedValue(
    CACHE_KEYS.userCredits,
    liveCreditsData
  );
  const addCreditsMutation = useMutation(api.credits.addCredits);
  const hasPaidEntitlement = useQuery(api.credits.hasPaidEntitlement);

  // Wishes from child's wishing well
  const liveWishes = useQuery(api.wishes.getUserWishes);
  const markWishesAsReadMutation = useMutation(api.wishes.markWishesAsRead);
  const markWishAsUsedMutation = useMutation(api.wishes.markWishAsUsed);
  const dismissWishMutation = useMutation(api.wishes.dismissWish);

  // Story generation
  const [currentJobId, setCurrentJobId] = useState<Id<"storyJobs"> | null>(null);
  const queueStoryJobMutation = useMutation(api.storyGeneration.queueStoryJob);
  const cancelStoryJobMutation = useMutation(api.storyGeneration.cancelStoryJob);
  const generateOutlineAction = useAction(api.storyGenerationActions.generateOutline);
  const liveStoryJob = useQuery(
    api.storyGeneration.getStoryJob,
    currentJobId ? { jobId: currentJobId } : "skip"
  );
  const { data: storyJob } = useCachedValue(
    currentJobId ? CACHE_KEYS.storyJob(currentJobId) : null,
    liveStoryJob
  );

  interface StoryOutline {
    title: string;
    subtitle: string;
    moral: string;
    moralDescription: string;
    points: Array<{ title: string; description: string }>;
  }
  const [generatedOutline, setGeneratedOutline] = useState<StoryOutline | null>(null);

  const crystalBalance = creditsData?.balance ?? MAX_CRYSTALS;
  const crystalCap = creditsData?.cap ?? MAX_CRYSTALS;
  const timeToNextCrystal = creditsData?.timeToNextCredit ?? 0;

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [toggleLayout, setToggleLayout] = useState({ width: 0, height: 0 });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Handle selections returned from asset-studio
  useEffect(() => {
    if (searchParams.selectedLocationId) {
      const location = PRESET_LOCATIONS.find(l => l.id === searchParams.selectedLocationId);
      if (location) setOverrideLocation(location);
    }
    if (searchParams.selectedCharacterId) {
      const character = FRIENDS.find(f => f.id === searchParams.selectedCharacterId);
      if (character) setOverrideCharacter(character);
    }
    if (searchParams.selectedVoiceId) {
      const voice = VOICE_PRESETS.find(v => v.id === searchParams.selectedVoiceId);
      if (voice) setOverrideVoice(voice);
    }
    if (searchParams.selectedValueId) {
      const value = FOCUS_VALUES.find(v => v.id === searchParams.selectedValueId);
      if (value) setOverrideValue(value);
    }
  }, [searchParams.selectedLocationId, searchParams.selectedCharacterId, searchParams.selectedVoiceId, searchParams.selectedValueId]);

  // Enable LayoutAnimation for Android
  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const toggleSuggestions = () => {
    LayoutAnimation.configureNext({
      duration: 250,
      create: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
      update: { type: LayoutAnimation.Types.easeInEaseOut },
      delete: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
    });
    setShowSuggestions(!showSuggestions);
  };

  // Removed useEffect that auto-clears on studioMode change to support persistence
  // Clearing logic moved to mode switch handlers

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Job completion is now handled via LibraryView's queue display
  // No need to wait here - user is navigated to home immediately after queuing

  const scheduleStateChange = (state: AppState, delay: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setAppState(state), delay);
  };

  const isCreative = studioMode === 'creative';
  const isAuto = studioMode === 'auto';
  const controlsTheme: ThemeMode = isAuto ? 'amber' : isCreative ? 'purple' : 'teal';
  const hasValidPrompt = prompt.trim().length > 3 || isAuto;
  const activeCount = [overrideLocation, overrideCharacter, overrideValue].filter((item) => item).length;
  const isAutoElements = activeCount === 0;

  // Format relative time for wishes
  const formatRelativeTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  // Convert Convex wishes to UI format
  const wishes: Wish[] = useMemo(() => {
    if (!liveWishes) return [];
    return liveWishes.map((w: { _id: string; text: string; createdAt: number; isNew: boolean; type: 'text' }) => ({
      id: w._id,
      text: w.text,
      createdAt: formatRelativeTime(w.createdAt),
      isNew: w.isNew,
      type: w.type,
    }));
  }, [liveWishes]);

  // Mark wishes as read when user opens the wishes section
  useEffect(() => {
    if (showRemix && liveWishes?.some((w: { isNew: boolean }) => w.isNew)) {
      markWishesAsReadMutation().catch(console.error);
    }
  }, [showRemix, liveWishes, markWishesAsReadMutation]);

  // Use centralized cost calculation (matches server-side logic)
  const totalCost = computeStoryCostClient({
    hasLocation: !!overrideLocation,
    hasCharacter: !!overrideCharacter,
    hasVoice: !!overrideVoice,
  });
  const hasEnoughCredits = crystalBalance >= totalCost;

  const handleCreateStory = async () => {
    if (!hasValidPrompt) return;

    // Check entitlement first - redirect to paywall if not entitled
    if (!hasPaidEntitlement) {
      router.push('/(onboarding)/paywall');
      return;
    }

    if (crystalBalance < totalCost) {
      setShowCrystalModal(true);
      return;
    }

    let finalPrompt = prompt;
    let finalLocation = overrideLocation;
    let finalCharacter = overrideCharacter;
    let finalValue = overrideValue;
    let finalVoice = overrideVoice;

    if (studioMode === 'auto') {
      const randomWish = getRandomItem(wishes);
      const randomLoc = getRandomItem(PRESET_LOCATIONS);
      const randomChar = getRandomItem(FRIENDS);
      const randomValue = getRandomItem(FOCUS_VALUES);
      const randomVoice = getRandomItem(VOICE_PRESETS);

      if (randomWish && !prompt) {
        finalPrompt = randomWish.text;
        setPrompt(randomWish.text);
      }
      if (randomLoc && !overrideLocation) {
        finalLocation = randomLoc;
        setOverrideLocation(randomLoc);
      }
      if (randomChar && !overrideCharacter) {
        finalCharacter = randomChar;
        setOverrideCharacter(randomChar);
      }
      if (randomValue && !overrideValue) {
        finalValue = randomValue;
        setOverrideValue(randomValue);
      }
      if (randomVoice && !overrideVoice) {
        finalVoice = randomVoice;
        setOverrideVoice(randomVoice);
      }
    }

    setAppState('generating-outline');

    try {
      const result = await generateOutlineAction({
        mode: studioMode,
        prompt: finalPrompt || 'a magical adventure',
        storyLength,
        storyVibe,
        moral: finalValue?.id,
        extraCharacterName: finalCharacter?.name,
        locationName: finalLocation?.name,
      });

      if (result.success && result.outline) {
        setGeneratedOutline(result.outline);
        setAppState('outline-review');
      } else {
        setAppState('studio');
      }
    } catch {
      setAppState('studio');
    }
  };

  const handleRandomPrompt = () => {
    if (!wishes.length) return;
    const randomWish = getRandomItem(wishes);
    if (randomWish) setPrompt(randomWish.text);
  };

  const handleApproveOutline = async () => {
    const result = await queueStoryJobMutation({
      mode: studioMode,
      prompt: prompt || 'a magical adventure',
      storyLength,
      storyVibe,
      moral: overrideValue?.id,
      extraCharacterId: overrideCharacter?.id,
      extraCharacterName: overrideCharacter?.name,
      locationId: overrideLocation?.id,
      locationName: overrideLocation?.name,
      voiceId: overrideVoice?.id,
      creditCost: totalCost,
    });

    if (!result.success) {
      setAppState('studio');
      if (result.error === 'No entitlement') {
        // User hasn't completed paywall - redirect there
        router.push('/(onboarding)/paywall');
      } else if (result.error === 'Insufficient credits') {
        setShowCrystalModal(true);
      }
      return;
    }

    // Successfully queued - clear draft, reset state, and navigate to home
    clearDraft();
    setAppState('studio');
    setGeneratedOutline(null);


    // Show confirmation alert
    Alert.alert(
      'Story Queued! ✨',
      'Your story is being created. Check the "Generating Now" section on the home screen to track progress.',
      [{ text: 'Got it!' }]
    );
  };

  const handleRefillCredits = async (amount: number) => {
    await addCreditsMutation({ amount });
    setShowCrystalModal(false);
  };



  const handlePromptChange = (value: string) => {
    setPrompt(value);
  };

  const handleUseWish = (wish: Wish) => {
    setPrompt(wish.text);
    setSelectedWishId(wish.id);
    setViewingWish(null);
    // Mark wish as used (hides from list)
    markWishAsUsedMutation({ wishId: wish.id as Id<"wishes"> }).catch(console.error);
  };

  const handleDismissWish = (wish: Wish) => {
    setViewingWish(null);
    // If this was the selected wish, clear it
    if (selectedWishId === wish.id) {
      setSelectedWishId(null);
      setPrompt('');
    }
    // Dismiss wish (hides from list)
    dismissWishMutation({ wishId: wish.id as Id<"wishes"> }).catch(console.error);
  };

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const renderStudio = () => {
    const bottomPadding = insets.bottom + 180;
    const actionBgClass = hasValidPrompt
      ? isAuto
        ? 'bg-amber-500'
        : isCreative
          ? 'bg-slate-900'
          : 'bg-teal-700'
      : 'bg-slate-400';
    const sparklesColor = hasValidPrompt
      ? isAuto
        ? '#ffffff'
        : isCreative
          ? '#c4b5fd'
          : '#ccfbf1'
      : '#e2e8f0';
    const diamondColor = hasValidPrompt ? '#ffffff' : '#e2e8f0';
    const actionTextClass = hasValidPrompt ? 'text-white' : 'text-slate-200';

    return (
      <View className="flex-1 bg-background">
        <View className="absolute top-0 left-0 right-0 z-40">
          <UnifiedHeader
            title="Create"
            scrollY={scrollY}
            rightAction={
              <Pressable
                onPress={() => setShowCrystalModal(true)}
                className="flex-row items-center gap-2.5 bg-white/90 px-3 py-2 rounded-full border border-slate-200 shadow-sm active:scale-95"
              >
                <View className="w-6 h-6 rounded-full bg-cyan-100 items-center justify-center border border-cyan-200">
                  <Diamond size={12} color="#0891b2" fill="#0891b2" />
                </View>
                <Text className="text-sm font-extrabold text-slate-700">{crystalBalance}</Text>
              </Pressable>
            }
          />
        </View>

        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: bottomPadding }}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        >
          <View className="pt-28 px-6 pb-6">
            <Text className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              Create
            </Text>
          </View>

          <View className="px-5">
            <View className="mb-4">
              <Pressable
                onPress={() => {
                  setStudioMode(isAuto ? 'creative' : 'auto');
                  // Clear specific fields when toggling auto mode if desired, 
                  // or keep them if we want to persist context. 
                  // For now, let's reset prompt and overrides to avoid confusion
                  setPrompt('');
                  setOverrideLocation(null);
                  setOverrideCharacter(null);
                  setOverrideValue(null);
                  setOverrideVoice(null);
                  setShowElements(false);

                  Vibration.vibrate(5);
                }}
                style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.98 : 1 }] })}
              >
                <MotiView
                  animate={{
                    backgroundColor: isAuto ? '#fffbeb' : '#ffffff',
                    borderColor: isAuto ? '#fde68a' : '#e2e8f0',
                  }}
                  transition={{ type: 'timing', duration: 300 }}
                  className="rounded-2xl p-1 border"
                >
                  <View className="relative rounded-xl overflow-hidden">
                    <MotiView
                      animate={{ opacity: isAuto ? 1 : 0 }}
                      transition={{ type: 'timing', duration: 300 }}
                      style={StyleSheet.absoluteFillObject}
                    >
                      <LinearGradient
                        colors={['#fff7ed', '#ffedd5', '#fff7ed']}
                        style={StyleSheet.absoluteFillObject}
                      />
                    </MotiView>
                    <View className="relative bg-white/0 rounded-xl py-3 px-4 flex-row items-center justify-between">
                      <View className="flex-1 shrink flex-row items-center gap-3">
                        <View
                          className={`w-10 h-10 rounded-full items-center justify-center ${isAuto ? 'bg-amber-500' : 'bg-slate-100'
                            }`}
                        >
                          <Infinity size={20} color={isAuto ? '#ffffff' : '#94a3b8'} />
                        </View>
                        <View className="flex-1 shrink">
                          <MotiView animate={{ opacity: isAuto ? 1 : 0.6 }}>
                            <Text
                              className={`text-sm font-black uppercase tracking-wide ${isAuto ? 'text-amber-700' : 'text-slate-500'
                                }`}
                            >
                              Instant Story
                            </Text>
                          </MotiView>
                          <Text className="text-[10px] font-bold text-slate-400" numberOfLines={1}>
                            Randomize everything for a perfect story on the go.
                          </Text>
                        </View>
                      </View>
                      <MotiView
                        animate={{
                          opacity: isAuto ? 1 : 0,
                          scale: isAuto ? 1 : 0,
                        }}
                        transition={{ type: 'timing', duration: 200 }}
                      >
                        <View className="bg-amber-100 px-3 py-1 rounded-full flex-row items-center gap-1">
                          <Check size={12} color="#b45309" />
                          <Text className="text-xs font-bold text-amber-700">Active</Text>
                        </View>
                      </MotiView>
                    </View>
                  </View>
                </MotiView>
              </Pressable>
            </View>

            <AnimatePresence initial={false}>
              {!isAuto && (
                <MotiView
                  from={{ opacity: 0, height: 0, translateY: -10, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 60, translateY: 0, marginBottom: 32 }}
                  exit={{ opacity: 0, height: 0, translateY: -10, marginBottom: 0 }}
                  transition={{ type: 'timing', duration: 300 }}
                  className="bg-white p-1 rounded-2xl border border-slate-200 flex-row shadow-sm overflow-hidden"
                  onLayout={(e) => {
                    if (e.nativeEvent.layout.height > 0) {
                      setToggleLayout(e.nativeEvent.layout);
                    }
                  }}
                >
                  {toggleLayout.width > 0 && (
                    <MotiView
                      animate={{
                        translateX: isCreative ? 0 : (toggleLayout.width - 10) / 2,
                        backgroundColor: isCreative ? '#faf5ff' : '#f0fdfa',
                      }}
                      transition={{
                        type: 'spring',
                        damping: 25,
                        stiffness: 250,
                        mass: 0.8,
                      }}
                      style={{
                        position: 'absolute',
                        top: 5,
                        left: 5,
                        bottom: 5,
                        width: (toggleLayout.width - 10) / 2,
                        borderRadius: 12,
                      }}
                    />
                  )}
                  <Pressable
                    onPress={() => {
                      setStudioMode('creative');
                      // Clear 'incident' specific fields if any, or general reset
                      setPrompt('');
                      setOverrideLocation(null);
                      setOverrideCharacter(null);
                      setOverrideValue(null);
                      setOverrideVoice(null);
                    }}
                    className="flex-1 rounded-xl flex-row items-center justify-center gap-2 z-10"
                  >
                    <Palette size={16} color={isCreative ? '#a855f7' : '#94a3b8'} />
                    <Text
                      className={`text-sm font-black ${isCreative ? 'text-primary-700' : 'text-slate-400'
                        }`}
                    >
                      Creative Mode
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setStudioMode('situation');
                      // Reset for fresh incident input
                      setPrompt('');
                      setOverrideLocation(null);
                      setOverrideCharacter(null);
                      setOverrideValue(null);
                      setOverrideVoice(null);
                    }}
                    className="flex-1 rounded-xl flex-row items-center justify-center gap-2 z-10"
                  >
                    <LifeBuoy size={16} color={!isCreative ? '#14b8a6' : '#94a3b8'} />
                    <Text
                      className={`text-sm font-black ${!isCreative ? 'text-teal-700' : 'text-slate-400'
                        }`}
                    >
                      Incident Mode
                    </Text>
                  </Pressable>
                </MotiView>
              )}
            </AnimatePresence>

            <View className="mb-4">
              <Text className="text-2xl font-black text-slate-800 mb-1 leading-tight">
                {isAuto
                  ? 'Magic is in the air.'
                  : isCreative
                    ? "Let's build a world."
                    : "What's the challenge?"}
              </Text>
              <Text className="text-sm text-slate-500 font-medium">
                {isAuto
                  ? "Sit back. We'll conjure a unique tale for you."
                  : isCreative
                    ? 'Create an amazing story from scratch.'
                    : 'Get help with a specific situation.'}
              </Text>
            </View>

            {isAuto ? (
              <View className="bg-white rounded-[26px] p-8 border border-slate-200 shadow-sm mb-8 items-center">
                <View
                  className="w-16 h-16 bg-amber-50 rounded-2xl items-center justify-center mb-4 border border-amber-100"
                  style={{ transform: [{ rotate: '3deg' }] }}
                >
                  <Sparkles size={28} color="#f59e0b" />
                </View>
                <Text className="text-xl font-extrabold text-slate-800 mb-2">Surprise Me</Text>
                <Text className="text-sm text-slate-500 font-medium text-center leading-relaxed">
                  We'll conjure a unique story with a random{' '}
                  <Text className="text-amber-600 font-bold">World</Text>,{' '}
                  <Text className="text-amber-600 font-bold">Hero</Text>, and{' '}
                  <Text className="text-amber-600 font-bold">Lesson</Text>.
                </Text>
              </View>
            ) : (
              <View className="bg-white rounded-[26px] border border-slate-200 shadow-sm mb-8 relative">
                {/* Ideas chip - positioned absolutely on outer container */}
                <Pressable
                  onPress={toggleSuggestions}
                  className={`absolute -top-2 right-4 z-20 flex-row items-center gap-1.5 px-3 py-1.5 rounded-full active:scale-95 ${showSuggestions
                    ? isCreative ? 'bg-purple-500' : 'bg-teal-500'
                    : 'bg-white border border-slate-200 shadow-sm'
                    }`}
                  style={{ elevation: 4 }}
                >
                  <MotiView
                    animate={{ rotate: showSuggestions ? '180deg' : '0deg' }}
                    transition={{ type: 'timing', duration: 300 }}
                  >
                    <Sparkles size={12} color={showSuggestions ? '#ffffff' : '#94a3b8'} />
                  </MotiView>
                  <Text className={`text-[10px] font-bold uppercase tracking-wide ${showSuggestions
                    ? 'text-white'
                    : 'text-slate-400'
                    }`}>
                    Ideas
                  </Text>
                </Pressable>

                {/* Text input area */}
                <View className="bg-slate-50 rounded-[20px] m-2">
                  <TextInput
                    value={prompt}
                    onChangeText={handlePromptChange}
                    placeholder={isCreative ? 'Once upon a time...' : 'Describe the situation...'}
                    placeholderTextColor="#94a3b8"
                    className="w-full text-lg text-slate-700 font-medium bg-transparent"
                    style={{
                      minHeight: isCreative ? 100 : 80,
                      paddingTop: 20,
                      paddingBottom: 16,
                      paddingHorizontal: 20,
                    }}
                    multiline
                    textAlignVertical="top"
                  />
                </View>

                {/* Suggestion chips - animated with LayoutAnimation */}
                {showSuggestions && (
                  <View className="px-4 pb-4">
                    <View className="flex-row flex-wrap gap-2">
                      {(isCreative ? STORY_STARTERS : CHALLENGE_SUGGESTIONS).map((item) => {
                        const Icon = item.icon;
                        return (
                          <Pressable
                            key={item.id}
                            onPress={() => {
                              setPrompt(item.prompt);
                              toggleSuggestions();
                            }}
                            className={`flex-row items-center gap-1.5 px-3 py-2.5 rounded-xl active:scale-95 ${isCreative ? 'bg-purple-50 border border-purple-100' : 'bg-teal-50 border border-teal-100'
                              }`}
                          >
                            <Icon size={14} color={isCreative ? '#a855f7' : '#14b8a6'} />
                            <Text className={`text-xs font-semibold ${isCreative ? 'text-purple-700' : 'text-teal-700'
                              }`}>
                              {item.label}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                )}
              </View>
            )}

            {!isAuto ? (
              <MotiView
                from={{ opacity: 0, translateY: 14 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 250, delay: 80 }}
              >
                <View className="mb-8">
                  <SectionHeader title="Story Settings" />

                  {/* Primary: Duration & Vibe (original selectors with dropdowns) */}
                  <View className="flex-row gap-3 mb-3">
                    <View className="flex-1">
                      <DurationSelector
                        value={storyLength}
                        onChange={setStoryLength}
                        theme={controlsTheme}
                      />
                    </View>
                    <View className="flex-1">
                      <VibeSelector value={storyVibe} onChange={setStoryVibe} theme={controlsTheme} />
                    </View>
                  </View>

                  {/* Secondary: Voice & Wishes (simple minimal row) */}
                  <View className="flex-row gap-3">
                    <Pressable
                      onPress={() => router.push({
                        pathname: '/manage-assets',
                        params: { tab: 'voices', mode: 'picker', selectedVoiceId: overrideVoice?.id || '' },
                      })}
                      className={`flex-1 flex-row items-center gap-2 px-4 py-3 rounded-xl border ${overrideVoice ? 'bg-primary-50 border-primary-200' : 'bg-slate-50 border-transparent'
                        }`}
                    >
                      <Mic size={16} color={overrideVoice ? '#a855f7' : '#94a3b8'} />
                      <Text className={`text-sm font-medium ${overrideVoice ? 'text-slate-800' : 'text-slate-500'}`}>
                        {overrideVoice ? overrideVoice.name : 'Voice'}
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={() => setShowRemix((prev) => !prev)}
                      className={`flex-1 flex-row items-center justify-between px-4 py-3 rounded-xl border ${showRemix ? 'bg-primary-50 border-primary-200' : 'bg-slate-50 border-transparent'
                        }`}
                    >
                      <View className="flex-row items-center gap-2">
                        <View className="relative">
                          <Shuffle size={16} color={showRemix ? '#a855f7' : '#94a3b8'} />
                          {wishes.some(w => w.isNew) && !showRemix && (
                            <View className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500" />
                          )}
                        </View>
                        <Text className={`text-sm font-medium ${showRemix ? 'text-slate-800' : 'text-slate-500'}`}>
                          Child's Wishes
                        </Text>
                        {wishes.length > 0 && !showRemix && (
                          <View className="bg-slate-200 px-1.5 py-0.5 rounded">
                            <Text className="text-[10px] font-bold text-slate-600">{wishes.length}</Text>
                          </View>
                        )}
                      </View>
                      <View className={`w-8 h-5 rounded-full ${showRemix ? 'bg-primary-500' : 'bg-slate-300'}`}>
                        <MotiView
                          animate={{ translateX: showRemix ? 14 : 2 }}
                          transition={{ type: 'timing', duration: 120 }}
                          className="w-4 h-4 mt-0.5 rounded-full bg-white"
                        />
                      </View>
                    </Pressable>
                  </View>
                </View>

                {showRemix ? (
                  <View className="mb-8">
                    <SectionHeader title="From the Wish Jar" />
                    {wishes.length === 0 ? (
                      <View className="bg-slate-50 rounded-2xl border border-slate-200 p-6 items-center">
                        <View className="w-12 h-12 rounded-full bg-slate-100 items-center justify-center mb-3">
                          <Sparkles size={24} color="#94a3b8" />
                        </View>
                        <Text className="text-sm font-bold text-slate-500 text-center">
                          No wishes yet
                        </Text>
                        <Text className="text-xs text-slate-400 text-center mt-1">
                          Your child can make wishes in My Room
                        </Text>
                      </View>
                    ) : (
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingRight: 12 }}
                        className="pb-2"
                      >
                        {wishes.map((wish) => {
                          const isSelected = selectedWishId === wish.id;
                          return (
                            <Pressable
                              key={wish.id}
                              onPress={() => setViewingWish(wish)}
                              className={`w-64 p-4 rounded-2xl border shadow-sm mr-3 ${isSelected
                                ? 'bg-primary-50 border-primary-300'
                                : 'bg-white border-slate-100'
                                }`}
                            >
                              <View className="flex-row items-start gap-3">
                                <View className={`w-8 h-8 rounded-full items-center justify-center ${isSelected ? 'bg-primary-100' : 'bg-indigo-50'
                                  }`}>
                                  {isSelected ? (
                                    <Check size={14} color="#a855f7" />
                                  ) : (
                                    <FileText size={14} color="#6366f1" />
                                  )}
                                </View>
                                <View className="flex-1">
                                  <Text
                                    className={`text-sm font-bold ${isSelected ? 'text-primary-700' : 'text-slate-700'}`}
                                    numberOfLines={2}
                                  >
                                    "{wish.text}"
                                  </Text>
                                  <View className="flex-row items-center justify-between mt-1">
                                    <Text className="text-[10px] font-bold text-slate-400">
                                      {wish.createdAt}
                                    </Text>
                                    {wish.isNew && (
                                      <View className="bg-rose-500 px-1.5 py-0.5 rounded">
                                        <Text className="text-[8px] font-bold text-white">NEW</Text>
                                      </View>
                                    )}
                                  </View>
                                </View>
                              </View>
                            </Pressable>
                          );
                        })}
                      </ScrollView>
                    )}
                  </View>
                ) : null}



                <View className="mb-8">
                  <SectionHeader title="Story Elements" />
                  <View className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <Pressable
                      onPress={() => setShowElements((prev) => !prev)}
                      className="w-full flex-row items-center justify-between p-4"
                    >
                      <View className="flex-row items-center gap-3">
                        <View
                          className={`w-10 h-10 rounded-xl items-center justify-center ${isAutoElements ? 'bg-amber-100' : 'bg-primary-100'
                            }`}
                        >
                          {isAutoElements ? (
                            <Sparkles size={18} color="#d97706" />
                          ) : (
                            <Palette size={18} color="#7c3aed" />
                          )}
                        </View>
                        <View>
                          <Text className="text-sm font-bold text-slate-800">
                            {isAutoElements ? 'Optimized' : 'Custom Elements'}
                          </Text>
                          <Text className="text-[11px] font-bold text-slate-400">
                            {isAutoElements ? 'World, Sidekick, & Lesson' : `${activeCount} active`}
                          </Text>
                        </View>
                      </View>
                      <View className="flex-row items-center gap-3">
                        {isAutoElements ? (
                          <View className="px-3 py-1.5 bg-amber-50 rounded-lg">
                            <Text className="text-xs font-black uppercase tracking-wider text-amber-600">
                              Auto
                            </Text>
                          </View>
                        ) : (
                          <View className="flex-row -space-x-2">
                            {overrideLocation ? (
                              <View className="w-6 h-6 rounded-full bg-primary-100 border-2 border-white items-center justify-center">
                                <MapPin size={12} color="#7c3aed" />
                              </View>
                            ) : null}
                            {overrideCharacter ? (
                              <View className="w-6 h-6 rounded-full bg-orange-100 border-2 border-white items-center justify-center">
                                <User size={12} color="#f97316" />
                              </View>
                            ) : null}
                            {overrideValue ? (
                              <View className="w-6 h-6 rounded-full bg-rose-100 border-2 border-white items-center justify-center">
                                <Heart size={12} color="#f43f5e" />
                              </View>
                            ) : null}
                          </View>
                        )}
                        <MotiView
                          animate={{ rotate: showElements ? '180deg' : '0deg' }}
                          transition={{ type: 'timing', duration: 200 }}
                        >
                          <ChevronDown size={16} color="#cbd5e1" />
                        </MotiView>
                      </View>
                    </Pressable>

                    <AnimatePresence>
                      {showElements ? (
                        <MotiView
                          from={{ opacity: 0, translateY: -6 }}
                          animate={{ opacity: 1, translateY: 0 }}
                          exit={{ opacity: 0, translateY: -6 }}
                          transition={{ type: 'timing', duration: 200 }}
                          className="p-4 pt-0"
                        >
                          <View className="h-px w-full bg-slate-100 mb-4" />
                          <View className="flex-row gap-2">
                            <CompactElement
                              icon={MapPin}
                              label="World"
                              value={overrideLocation?.name || null}
                              onPress={() => router.push({
                                pathname: '/manage-assets',
                                params: { tab: 'places', mode: 'picker', selectedLocationId: overrideLocation?.id || '' },
                              })}
                              onClear={() => setOverrideLocation(null)}
                              theme={controlsTheme}
                            />
                            <CompactElement
                              icon={User}
                              label="Sidekick"
                              value={overrideCharacter?.name || null}
                              onPress={() => router.push({
                                pathname: '/manage-assets',
                                params: { tab: 'faces', mode: 'picker', selectedCharacterId: overrideCharacter?.id || '' },
                              })}
                              onClear={() => setOverrideCharacter(null)}
                              theme={controlsTheme}
                            />
                            <CompactElement
                              icon={Heart}
                              label="Lesson"
                              value={overrideValue?.name || null}
                              onPress={() => router.push({
                                pathname: '/manage-assets',
                                params: { tab: 'values', mode: 'picker', selectedValueId: overrideValue?.id || '' },
                              })}
                              onClear={() => setOverrideValue(null)}
                              theme={controlsTheme}
                            />
                          </View>
                        </MotiView>
                      ) : null}
                    </AnimatePresence>
                  </View>
                </View>
              </MotiView>
            ) : null}
          </View>
        </Animated.ScrollView>

        <View style={[styles.fabContainer, { bottom: 100 }]}>
          <Pressable
            onPress={handleCreateStory}
            disabled={!hasValidPrompt}
            className={`w-full py-4 rounded-2xl flex-row items-center justify-center gap-3 shadow-lg ${actionBgClass
              } active:scale-[0.98]`}
          >
            <Sparkles size={20} color={sparklesColor} />
            <Text className={`font-black text-lg ${actionTextClass}`}>
              {isAuto ? 'Conjure Surprise' : isCreative ? 'Conjure Story' : 'Create Solution'}
            </Text>
            {hasValidPrompt ? (
              <View className="flex-row items-center gap-1 bg-white/20 px-2 py-0.5 rounded">
                <Diamond size={12} color={diamondColor} fill={diamondColor} />
                <Text className="text-white text-sm font-bold">{totalCost}</Text>
              </View>
            ) : null}
          </Pressable>
        </View>

        <WishDetailModal
          visible={Boolean(viewingWish)}
          wish={viewingWish}
          isSelected={Boolean(viewingWish && selectedWishId === viewingWish.id)}
          onClose={() => setViewingWish(null)}
          onUse={handleUseWish}
          onDismiss={handleDismissWish}
        />

        <CrystalModal
          visible={showCrystalModal}
          balance={crystalBalance}
          max={crystalCap}
          timeToNext={timeToNextCrystal}
          onClose={() => setShowCrystalModal(false)}
          onRefill={handleRefillCredits}
        />
      </View >
    );
  };

  if (appState === 'generating-outline') {
    const loadingPhrases = [
      "Consulting the creative spirits...",
      "Gathering stardust...",
      "Weaving the plot threads...",
      "Igniting the imagination...",
      "Brewing story magic..."
    ];
    const [phraseIndex, setPhraseIndex] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setPhraseIndex(prev => (prev + 1) % loadingPhrases.length);
      }, 2000);
      return () => clearInterval(interval);
    }, []);

    return (
      <View className="flex-1 bg-background items-center justify-center px-12 pb-20">
        <Text className="text-2xl font-black text-slate-800 mb-8 text-center tracking-tight">
          Generating Outline
        </Text>

        <View className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-6">
          <MotiView
            from={{ width: '0%' }}
            animate={{ width: '90%' }}
            transition={{
              type: 'timing',
              duration: 3500,
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }}
            style={{ height: '100%', borderRadius: 999 }}
          >
            <LinearGradient
              colors={['#a855f7', '#ec4899']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFillObject}
            />
          </MotiView>
        </View>

        <View className="h-6 items-center justify-center">
          <AnimatePresence exitBeforeEnter>
            <MotiView
              key={phraseIndex}
              from={{ opacity: 0, translateY: 4 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: -4 }}
              transition={{ type: 'timing', duration: 300 }}
            >
              <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest text-center">
                {loadingPhrases[phraseIndex]}
              </Text>
            </MotiView>
          </AnimatePresence>
        </View>
      </View>
    );
  }





  if (appState === 'outline-review' && generatedOutline) {
    return (
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{ paddingTop: insets.top + 12 }}
          className="px-6 flex-row items-center justify-between mb-8"
        >
          <Pressable
            onPress={() => {
              setAppState('studio');
              setGeneratedOutline(null);
            }}
            className="w-10 h-10 rounded-full border border-slate-200 bg-white items-center justify-center shadow-sm active:scale-95"
          >
            <ChevronLeft size={20} color="#475569" />
          </Pressable>
          <View className="items-center">
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest">Outline</Text>
            <Text className="text-sm font-bold text-slate-800">Review Outline</Text>
          </View>
          <View className="w-10" />
        </View>

        <View className="px-6">
          <View className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 mb-6">
            <View className="bg-purple-50 px-3 py-1 rounded-full self-start mb-3">
              <Text className="text-purple-600 text-[10px] font-bold uppercase tracking-wider">
                Proposed Title
              </Text>
            </View>
            <Text className="text-3xl font-extrabold text-slate-800 leading-tight mb-2">
              {generatedOutline.title}
            </Text>
            {generatedOutline.subtitle ? (
              <Text className="text-sm text-slate-500 font-medium">
                {generatedOutline.subtitle}
              </Text>
            ) : null}
          </View>

          <View className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-6">
            <View className="flex-row items-center gap-2 mb-2">
              <Heart size={14} color="#a855f7" />
              <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lesson</Text>
            </View>
            <Text className="text-sm font-bold text-slate-800 mb-1">{generatedOutline.moral}</Text>
            <Text className="text-xs text-slate-500 font-medium">{generatedOutline.moralDescription}</Text>
          </View>

          <View className="mb-4 pl-2">
            <View className="flex-row items-center gap-2 mb-4">
              <ListChecks size={16} color="#94a3b8" />
              <Text className="font-bold text-slate-800 text-sm">Story Structure</Text>
            </View>

            <View className="gap-4">
              {generatedOutline.points.map((point, index) => (
                <View key={`point-${index}`} className="flex-row gap-4">
                  <View className="w-8 h-8 rounded-full bg-white border-2 border-purple-100 items-center justify-center shadow-sm">
                    <Text className="text-xs font-bold text-purple-500">{index + 1}</Text>
                  </View>
                  <View className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex-1">
                    <Text className="font-bold text-slate-800 text-sm mb-1">{point.title}</Text>
                    <Text className="text-xs text-slate-500 leading-relaxed font-medium">
                      {point.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View className="px-6 py-4 flex-row gap-3">
          <Pressable
            onPress={() => {
              setAppState('studio');
              setGeneratedOutline(null);
            }}
            className="flex-1 py-4 rounded-2xl bg-white border border-slate-200 flex-row items-center justify-center gap-2 active:scale-95"
          >
            <RotateCcw size={16} color="#64748b" />
            <Text className="text-slate-600 font-bold text-sm">Edit Plan</Text>
          </Pressable>
          <Pressable
            onPress={handleApproveOutline}
            className="flex-[2] py-4 rounded-2xl bg-slate-900 flex-row items-center justify-center gap-2 shadow-lg active:scale-95"
          >
            <Sparkles size={16} color="#c4b5fd" />
            <Text className="text-white font-bold text-sm">Write Story</Text>
            <ArrowRight size={16} color="#ffffff" />
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  return renderStudio();
};

export default CreateScreen;

const styles = StyleSheet.create({
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.2)',
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  selectorContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  fabContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 999,
  },
  microDot: {
    width: 4,
    height: 4,
    borderRadius: 999,
  },
  durationMenuContainer: {
    zIndex: 100,
  },
});
