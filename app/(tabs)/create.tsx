import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Modal, Vibration, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimatePresence, MotiView } from 'moti';
import Animated, { useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';
import { UnifiedHeader } from '@/components/UnifiedHeader';
import {
  Activity,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ChevronLeft,
  ClipboardList,
  Clock,
  Diamond,
  Dice5,
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
} from 'lucide-react-native';
import { LucideIcon } from 'lucide-react-native';

import { CrystalModal } from '@/components/CrystalModal';
import { DurationSelector } from '@/components/DurationSelector';
import { VibeSelector } from '@/components/VibeSelector';
import { WishDetailModal } from '@/components/WishDetailModal';
import { MAX_CRYSTALS, REGEN_TIME_SECONDS } from '@/constants/crystals';
import { FRIENDS, PRESET_LOCATIONS, VOICE_PRESETS, WISHES } from '@/constants/data';
import { Friend, PresetLocation, StoryLength, VoicePreset, Wish } from '@/types';

type AppState = 'studio' | 'generating-outline' | 'outline-review' | 'generating-story' | 'preview';
type StudioMode = 'creative' | 'situation' | 'auto';
type StoryVibe = 'energizing' | 'soothing' | 'whimsical' | 'thoughtful';
type ThemeMode = 'purple' | 'teal' | 'amber';
type SelectorType = 'location' | 'value' | 'character' | 'voice';

interface FocusValue {
  id: string;
  name: string;
  icon: LucideIcon;
  bgClass: string;
  iconColor: string;
  desc: string;
}

interface SituationPreset {
  id: string;
  label: string;
  prompt: string;
  icon: LucideIcon;
  bgClass: string;
  borderClass: string;
  textClass: string;
  iconColor: string;
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

const FOCUS_VALUES: FocusValue[] = [
  {
    id: 'compassion',
    name: 'Compassion',
    icon: Heart,
    bgClass: 'bg-rose-50',
    iconColor: '#f43f5e',
    desc: 'Understanding feelings',
  },
  {
    id: 'bravery',
    name: 'Bravery',
    icon: Shield,
    bgClass: 'bg-amber-50',
    iconColor: '#f59e0b',
    desc: 'Finding courage',
  },
  {
    id: 'sharing',
    name: 'Sharing',
    icon: Gift,
    bgClass: 'bg-purple-50',
    iconColor: '#a855f7',
    desc: 'The joy of giving',
  },
  {
    id: 'honesty',
    name: 'Honesty',
    icon: Scale,
    bgClass: 'bg-blue-50',
    iconColor: '#3b82f6',
    desc: 'Telling the truth',
  },
  {
    id: 'patience',
    name: 'Patience',
    icon: Hourglass,
    bgClass: 'bg-emerald-50',
    iconColor: '#10b981',
    desc: 'Waiting calmly',
  },
  {
    id: 'teamwork',
    name: 'Teamwork',
    icon: Users,
    bgClass: 'bg-indigo-50',
    iconColor: '#6366f1',
    desc: 'Working together',
  },
  {
    id: 'curiosity',
    name: 'Curiosity',
    icon: Search,
    bgClass: 'bg-cyan-50',
    iconColor: '#06b6d4',
    desc: 'Discovering new things',
  },
  {
    id: 'gratitude',
    name: 'Gratitude',
    icon: Sun,
    bgClass: 'bg-yellow-50',
    iconColor: '#eab308',
    desc: 'Being thankful',
  },
  {
    id: 'responsibility',
    name: 'Responsibility',
    icon: ClipboardList,
    bgClass: 'bg-slate-100',
    iconColor: '#64748b',
    desc: 'Doing your part',
  },
  {
    id: 'problem_solving',
    name: 'Problem Solving',
    icon: Puzzle,
    bgClass: 'bg-teal-50',
    iconColor: '#14b8a6',
    desc: 'Finding solutions',
  },
];

const SITUATION_PRESETS: SituationPreset[] = [
  {
    id: 'conflict',
    label: 'Conflict',
    prompt: 'My child had a conflict with another child and needs help repairing the friendship.',
    icon: Heart,
    bgClass: 'bg-rose-50',
    borderClass: 'border-rose-100',
    textClass: 'text-rose-700',
    iconColor: '#f43f5e',
  },
  {
    id: 'fear',
    label: 'Feeling scared',
    prompt: 'My child is scared of the dark and wants help feeling brave.',
    icon: Shield,
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-100',
    textClass: 'text-amber-700',
    iconColor: '#f59e0b',
  },
  {
    id: 'sharing',
    label: 'Sharing',
    prompt: 'My child is having trouble sharing and wants to learn how.',
    icon: Users,
    bgClass: 'bg-purple-50',
    borderClass: 'border-purple-100',
    textClass: 'text-purple-700',
    iconColor: '#a855f7',
  },
  {
    id: 'celebration',
    label: 'Celebration',
    prompt: 'We are celebrating a special moment and want to capture it in a story.',
    icon: Gift,
    bgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-100',
    textClass: 'text-emerald-700',
    iconColor: '#059669',
  },
  {
    id: 'doctor',
    label: 'Doctor visit',
    prompt: 'My child is nervous about a doctor or dentist visit tomorrow.',
    icon: Activity,
    bgClass: 'bg-blue-50',
    borderClass: 'border-blue-100',
    textClass: 'text-blue-700',
    iconColor: '#3b82f6',
  },
];

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
        className={`flex-row items-center gap-2 px-5 py-3 rounded-2xl border shadow-sm ${containerClass} active:scale-95`}
      >
        <Icon size={14} color={iconColor} />
        <Text className={`text-[10px] font-black uppercase tracking-wider ${labelClass}`}>{label}</Text>
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
      className={`flex-row items-center gap-2 pl-4 pr-5 py-3 rounded-2xl border shadow-sm ${containerClass} active:scale-95`}
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
  const [appState, setAppState] = useState<AppState>('studio');
  const [studioMode, setStudioMode] = useState<StudioMode>('creative');
  const [showElements, setShowElements] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [storyLength, setStoryLength] = useState<StoryLength>('medium');
  const [storyVibe, setStoryVibe] = useState<StoryVibe>('soothing');
  const [showRemix, setShowRemix] = useState(false);
  const [overrideLocation, setOverrideLocation] = useState<PresetLocation | null>(null);
  const [overrideValue, setOverrideValue] = useState<FocusValue | null>(null);
  const [overrideCharacter, setOverrideCharacter] = useState<Friend | null>(null);
  const [overrideVoice, setOverrideVoice] = useState<VoicePreset | null>(null);
  const [activeSelector, setActiveSelector] = useState<SelectorType | null>(null);
  const [viewingWish, setViewingWish] = useState<Wish | null>(null);
  const [crystalBalance, setCrystalBalance] = useState(150);
  const [showCrystalModal, setShowCrystalModal] = useState(false);
  const [timeToNextCrystal, setTimeToNextCrystal] = useState(REGEN_TIME_SECONDS);
  const [selectedSituationId, setSelectedSituationId] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (crystalBalance >= MAX_CRYSTALS) return;
    const interval = setInterval(() => {
      setTimeToNextCrystal((prev) => {
        if (prev <= 1) {
          setCrystalBalance((balance) => Math.min(balance + 1, MAX_CRYSTALS));
          return REGEN_TIME_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [crystalBalance]);

  useEffect(() => {
    setOverrideLocation(null);
    setOverrideCharacter(null);
    setOverrideValue(null);
    setOverrideVoice(null);
    setPrompt('');
    setShowRemix(false);
    setShowElements(false);
    setSelectedSituationId(null);
  }, [studioMode]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

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

  const calculateTotalCost = () => {
    let cost = 5;
    if (overrideLocation) cost += overrideLocation.cost;
    if (overrideCharacter) cost += overrideCharacter.cost;
    if (overrideVoice) cost += overrideVoice.cost;
    return cost;
  };
  const totalCost = calculateTotalCost();

  const handleCreateStory = () => {
    if (!hasValidPrompt) return;
    if (crystalBalance < totalCost) {
      setShowCrystalModal(true);
      return;
    }

    if (studioMode === 'auto') {
      const randomWish = getRandomItem(WISHES);
      const randomLoc = getRandomItem(PRESET_LOCATIONS);
      const randomChar = getRandomItem(FRIENDS);
      const randomValue = getRandomItem(FOCUS_VALUES);
      const randomVoice = getRandomItem(VOICE_PRESETS);

      if (randomWish && !prompt) setPrompt(randomWish.text);
      if (randomLoc && !overrideLocation) setOverrideLocation(randomLoc);
      if (randomChar && !overrideCharacter) setOverrideCharacter(randomChar);
      if (randomValue && !overrideValue) setOverrideValue(randomValue);
      if (randomVoice && !overrideVoice) setOverrideVoice(randomVoice);
    }

    setCrystalBalance((prev) => prev - totalCost);
    setAppState('generating-outline');
    scheduleStateChange('outline-review', 2500);
  };

  const handleApproveOutline = () => {
    setAppState('generating-story');
    scheduleStateChange('preview', 3000);
  };

  const handleRandomPrompt = () => {
    if (!WISHES.length) return;
    const randomWish = getRandomItem(WISHES);
    if (randomWish) setPrompt(randomWish.text);
  };

  const handlePresetSituation = (preset: SituationPreset) => {
    setPrompt(preset.prompt);
    setSelectedSituationId(preset.id);
    const valueMatch = FOCUS_VALUES.find(
      (valueItem) => preset.id.includes(valueItem.id) || valueItem.id.includes(preset.id)
    );
    if (valueMatch) setOverrideValue(valueMatch);
  };

  const handlePromptChange = (value: string) => {
    setPrompt(value);
    if (selectedSituationId) setSelectedSituationId(null);
  };

  const handleUseWish = (wish: Wish) => {
    setPrompt(wish.text);
    setViewingWish(null);
  };

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const renderStudio = () => {
    const bottomPadding = insets.bottom + 180;
    const selectorTitle = activeSelector
      ? {
        location: 'World',
        value: 'Lesson',
        character: 'Sidekick',
        voice: 'Voice',
      }[activeSelector]
      : 'Option';
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
                className="flex-row items-center gap-2 bg-white px-2 py-1.5 rounded-full border border-slate-200 shadow-sm active:scale-95"
              >
                <View className="w-5 h-5 rounded-full bg-cyan-100 items-center justify-center">
                  <Diamond size={10} color="#06b6d4" fill="#06b6d4" />
                </View>
                <Text className="text-sm font-bold text-slate-700 font-mono">{crystalBalance}</Text>
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
                onPress={() => setStudioMode(isAuto ? 'creative' : 'auto')}
                className="rounded-2xl"
              >
                <View
                  className={`rounded-2xl p-1 border ${isAuto ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-white'
                    }`}
                >
                  <View className="relative rounded-xl overflow-hidden">
                    <MotiView
                      animate={{ opacity: isAuto ? 1 : 0 }}
                      transition={{ type: 'timing', duration: 200 }}
                      style={StyleSheet.absoluteFillObject}
                    >
                      <LinearGradient
                        colors={['#fff7ed', '#ffedd5', '#fff7ed']}
                        style={StyleSheet.absoluteFillObject}
                      />
                    </MotiView>
                    <View className="relative bg-white/80 rounded-xl py-3 px-4 flex-row items-center justify-between">
                      <View className="flex-1 shrink flex-row items-center gap-3">
                        <View
                          className={`w-10 h-10 rounded-full items-center justify-center ${isAuto ? 'bg-amber-500' : 'bg-slate-100'
                            }`}
                        >
                          <Infinity size={20} color={isAuto ? '#ffffff' : '#94a3b8'} />
                        </View>
                        <View className="flex-1 shrink">
                          <Text
                            className={`text-sm font-black uppercase tracking-wide ${isAuto ? 'text-amber-700' : 'text-slate-500'
                              }`}
                          >
                            Instant Story
                          </Text>
                          <Text className="text-[10px] font-bold text-slate-400" numberOfLines={1}>
                            Randomize everything for a perfect story on the go.
                          </Text>
                        </View>
                      </View>
                      {isAuto ? (
                        <View className="bg-amber-100 px-3 py-1 rounded-full flex-row items-center gap-1">
                          <Check size={12} color="#b45309" />
                          <Text className="text-xs font-bold text-amber-700">Active</Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                </View>
              </Pressable>
            </View>

            {!isAuto ? (
              <MotiView
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 250 }}
                className="bg-white p-1 rounded-2xl border border-slate-200 flex-row mb-8 shadow-sm"
              >
                <Pressable
                  onPress={() => setStudioMode('creative')}
                  className={`flex-1 py-3 rounded-xl flex-row items-center justify-center gap-2 ${isCreative ? 'bg-primary-50' : ''
                    }`}
                >
                  <Palette size={16} color={isCreative ? '#a855f7' : '#94a3b8'} />
                  <Text
                    className={`text-sm font-black ${isCreative ? 'text-primary-700' : 'text-slate-400'
                      }`}
                  >
                    Creative Magic
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setStudioMode('situation')}
                  className={`flex-1 py-3 rounded-xl flex-row items-center justify-center gap-2 ${!isCreative ? 'bg-teal-50' : ''
                    }`}
                >
                  <LifeBuoy size={16} color={!isCreative ? '#14b8a6' : '#94a3b8'} />
                  <Text
                    className={`text-sm font-black ${!isCreative ? 'text-teal-700' : 'text-slate-400'
                      }`}
                  >
                    Real Life Help
                  </Text>
                </Pressable>
              </MotiView>
            ) : null}

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
                    ? 'Create a magical story from scratch.'
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
              <View className="bg-white rounded-[26px] p-2 border border-slate-200 shadow-sm mb-8">
                <View className="bg-slate-50 rounded-[20px] px-5 py-4 relative">
                  {isCreative ? (
                    <View className="absolute top-3 right-3">
                      <Pressable
                        onPress={handleRandomPrompt}
                        className="flex-row items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm active:scale-95"
                      >
                        <Dice5 size={14} color="#94a3b8" />
                        <Text className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                          Inspire
                        </Text>
                      </Pressable>
                    </View>
                  ) : null}
                  <TextInput
                    value={prompt}
                    onChangeText={handlePromptChange}
                    placeholder={isCreative ? 'Once upon a time...' : 'Describe the situation (e.g. Scared of the dark)...'}
                    placeholderTextColor="#94a3b8"
                    className={`w-full text-lg text-slate-700 font-medium bg-transparent ${isCreative ? 'h-32' : 'h-24'
                      }`}
                    multiline
                    textAlignVertical="top"
                  />
                </View>
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
                  <View className="flex-row flex-wrap gap-2">
                    <View className="flex-1 min-w-[150px]">
                      <DurationSelector
                        value={storyLength}
                        onChange={setStoryLength}
                        theme={controlsTheme}
                      />
                    </View>
                    <View className="flex-1 min-w-[150px]">
                      <VibeSelector value={storyVibe} onChange={setStoryVibe} theme={controlsTheme} />
                    </View>
                    <View className="flex-1 min-w-[140px]">
                      <VoiceControl
                        value={overrideVoice}
                        onPress={() => setActiveSelector('voice')}
                        theme={controlsTheme}
                      />
                    </View>
                    <View className="flex-1 min-w-[140px]">
                      <TogglePill
                        icon={Shuffle}
                        label="Remix"
                        active={showRemix}
                        onPress={() => setShowRemix((prev) => !prev)}
                        theme={controlsTheme}
                      />
                    </View>
                  </View>
                </View>

                <View className="mb-8">
                  <AnimatePresence>
                    {showRemix ? (
                      <MotiView
                        from={{ opacity: 0, translateY: -8 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        exit={{ opacity: 0, translateY: -8 }}
                        transition={{ type: 'timing', duration: 200 }}
                        className="mb-8"
                      >
                        <SectionHeader title="From the Wish Jar" />
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={{ paddingRight: 12 }}
                          className="pb-2"
                        >
                          <Pressable
                            onPress={() => { }}
                            className="w-12 items-center justify-center mr-3"
                          >
                            <View className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 items-center justify-center">
                              <Plus size={20} color="#94a3b8" />
                            </View>
                            <Text className="text-[10px] font-bold text-slate-400 mt-1">Add</Text>
                          </Pressable>
                          {WISHES.map((wish) => (
                            <Pressable
                              key={wish.id}
                              onPress={() => setViewingWish(wish)}
                              className="w-64 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm mr-3"
                            >
                              {wish.isNew ? (
                                <View className="absolute top-0 right-0 w-3 h-3 bg-rose-500 rounded-bl-lg" />
                              ) : null}
                              <View className="flex-row items-start gap-3">
                                <View className="w-8 h-8 rounded-full bg-purple-50 items-center justify-center">
                                  <Sparkles size={14} color="#a855f7" />
                                </View>
                                <View className="flex-1">
                                  <Text
                                    className="text-sm font-bold text-slate-700"
                                    numberOfLines={2}
                                  >
                                    "{wish.text}"
                                  </Text>
                                  <Text className="text-[10px] font-bold text-slate-400 mt-1">
                                    {wish.createdAt}
                                  </Text>
                                </View>
                              </View>
                            </Pressable>
                          ))}
                        </ScrollView>
                      </MotiView>
                    ) : null}
                  </AnimatePresence>

                  {!isCreative ? (
                    <View className="mb-8">
                      <SectionHeader title="Common Challenges" />
                      <View className="flex-row flex-wrap gap-2">
                        {SITUATION_PRESETS.map((preset) => {
                          const isSelected = selectedSituationId === preset.id;
                          return (
                            <Pressable
                              key={preset.id}
                              onPress={() => handlePresetSituation(preset)}
                              className={`flex-row items-center gap-2 pl-1.5 pr-4 py-1.5 rounded-full border ${isSelected
                                ? 'bg-slate-900 border-slate-900'
                                : `${preset.bgClass} ${preset.borderClass}`
                                } active:scale-95`}
                            >
                              <View
                                className={`w-8 h-8 rounded-full items-center justify-center ${isSelected ? 'bg-white/10' : 'bg-white'
                                  }`}
                              >
                                <preset.icon
                                  size={14}
                                  color={isSelected ? '#ffffff' : preset.iconColor}
                                />
                              </View>
                              <Text
                                className={`text-xs font-bold ${isSelected ? 'text-white' : preset.textClass
                                  }`}
                              >
                                {preset.label}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
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
                                onPress={() => setActiveSelector('location')}
                                onClear={() => setOverrideLocation(null)}
                                theme={controlsTheme}
                              />
                              <CompactElement
                                icon={User}
                                label="Sidekick"
                                value={overrideCharacter?.name || null}
                                onPress={() => setActiveSelector('character')}
                                onClear={() => setOverrideCharacter(null)}
                                theme={controlsTheme}
                              />
                              <CompactElement
                                icon={Heart}
                                label="Lesson"
                                value={overrideValue?.name || null}
                                onPress={() => setActiveSelector('value')}
                                onClear={() => setOverrideValue(null)}
                                theme={controlsTheme}
                              />
                            </View>
                          </MotiView>
                        ) : null}
                      </AnimatePresence>
                    </View>
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

        <Modal
          visible={Boolean(activeSelector)}
          transparent
          animationType="fade"
          onRequestClose={() => setActiveSelector(null)}
        >
          <View style={styles.selectorContainer}>
            <Pressable style={styles.modalOverlay} onPress={() => setActiveSelector(null)} />
            <MotiView
              from={{ translateY: 40, opacity: 0 }}
              animate={{ translateY: 0, opacity: 1 }}
              transition={{ type: 'timing', duration: 220 }}
              className="bg-white rounded-t-[32px] border border-slate-100 shadow-xl max-h-[80%] w-full"
            >
              <View className="p-4 border-b border-slate-100 flex-row items-center justify-between">
                <Text className="font-bold text-slate-800">Select {selectorTitle}</Text>
                <Pressable onPress={() => setActiveSelector(null)} className="active:scale-95">
                  <X size={20} color="#94a3b8" />
                </Pressable>
              </View>
              <ScrollView
                contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}
                showsVerticalScrollIndicator={false}
              >
                {activeSelector === 'location'
                  ? PRESET_LOCATIONS.map((loc) => {
                    const isSelected = overrideLocation?.id === loc.id;
                    return (
                      <Pressable
                        key={loc.id}
                        onPress={() => {
                          setOverrideLocation(loc);
                          setActiveSelector(null);
                        }}
                        className={`w-full p-4 rounded-xl flex-row items-center justify-between mb-2 ${isSelected ? 'bg-slate-100' : 'bg-slate-50'
                          }`}
                      >
                        <Text className="font-bold text-slate-700">{loc.name}</Text>
                        <View className="bg-white px-2 py-1 rounded border border-slate-200">
                          <Text className="text-xs font-bold text-slate-400">{loc.cost} crystals</Text>
                        </View>
                      </Pressable>
                    );
                  })
                  : null}

                {activeSelector === 'value'
                  ? FOCUS_VALUES.map((val) => {
                    const isSelected = overrideValue?.id === val.id;
                    return (
                      <Pressable
                        key={val.id}
                        onPress={() => {
                          setOverrideValue(val);
                          setActiveSelector(null);
                        }}
                        className={`w-full p-4 rounded-xl flex-row items-center justify-between mb-2 ${isSelected ? 'bg-slate-100' : 'bg-slate-50'
                          }`}
                      >
                        <View className="flex-row items-center gap-3">
                          <View className={`w-9 h-9 rounded-full items-center justify-center ${val.bgClass}`}>
                            <val.icon size={18} color={val.iconColor} />
                          </View>
                          <Text className="font-bold text-slate-700">{val.name}</Text>
                        </View>
                        {isSelected ? <Check size={16} color="#10b981" /> : null}
                      </Pressable>
                    );
                  })
                  : null}

                {activeSelector === 'character'
                  ? FRIENDS.map((char) => {
                    const isSelected = overrideCharacter?.id === char.id;
                    return (
                      <Pressable
                        key={char.id}
                        onPress={() => {
                          setOverrideCharacter(char);
                          setActiveSelector(null);
                        }}
                        className={`w-full p-4 rounded-xl flex-row items-center justify-between mb-2 ${isSelected ? 'bg-slate-100' : 'bg-slate-50'
                          }`}
                      >
                        <View className="flex-row items-center gap-3">
                          <View className={`w-9 h-9 rounded-full items-center justify-center ${char.color}`}>
                            <Text className="text-lg">{char.icon}</Text>
                          </View>
                          <Text className="font-bold text-slate-700">{char.name}</Text>
                        </View>
                        <View className="bg-white px-2 py-1 rounded border border-slate-200">
                          <Text className="text-xs font-bold text-slate-400">{char.cost} crystals</Text>
                        </View>
                      </Pressable>
                    );
                  })
                  : null}

                {activeSelector === 'voice'
                  ? VOICE_PRESETS.map((voice) => {
                    const isSelected = overrideVoice?.id === voice.id;
                    return (
                      <Pressable
                        key={voice.id}
                        onPress={() => {
                          setOverrideVoice(voice);
                          setActiveSelector(null);
                        }}
                        className={`w-full p-4 rounded-xl flex-row items-center justify-between mb-2 ${isSelected ? 'bg-slate-100' : 'bg-slate-50'
                          }`}
                      >
                        <View className="flex-row items-center gap-3">
                          <View className={`w-9 h-9 rounded-full items-center justify-center ${voice.color}`}>
                            <Text className="text-base">{voice.icon}</Text>
                          </View>
                          <View>
                            <Text className="font-bold text-slate-700">{voice.name}</Text>
                            <Text className="text-xs text-slate-400">{voice.style}</Text>
                          </View>
                        </View>
                        <View className="bg-white px-2 py-1 rounded border border-slate-200">
                          <Text className="text-xs font-bold text-slate-400">
                            {voice.cost === 0 ? 'Free' : `${voice.cost} crystals`}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })
                  : null}
              </ScrollView>
            </MotiView>
          </View>
        </Modal>

        <WishDetailModal
          visible={Boolean(viewingWish)}
          wish={viewingWish}
          isSelected={Boolean(viewingWish && viewingWish.text === prompt)}
          onClose={() => setViewingWish(null)}
          onUse={handleUseWish}
        />

        <CrystalModal
          visible={showCrystalModal}
          balance={crystalBalance}
          max={MAX_CRYSTALS}
          timeToNext={timeToNextCrystal}
          onClose={() => setShowCrystalModal(false)}
          onRefill={(amount) => {
            setCrystalBalance((prev) => prev + amount);
            setShowCrystalModal(false);
          }}
        />
      </View>
    );
  };

  if (appState === 'generating-outline' || appState === 'generating-story') {
    const isOutline = appState === 'generating-outline';
    return (
      <View className="flex-1 bg-background items-center justify-center px-8">
        <MotiView
          from={{ rotate: '0deg' }}
          animate={{ rotate: '360deg' }}
          transition={{ type: 'timing', duration: 1200, loop: true }}
          className="mb-12"
        >
          <View className="w-28 h-28 bg-white rounded-[40px] shadow-lg items-center justify-center border-2 border-white">
            {isOutline ? (
              <Sparkles size={48} color="#a855f7" />
            ) : (
              <BookOpen size={48} color="#06b6d4" />
            )}
          </View>
        </MotiView>
        <Text className="text-2xl font-black text-slate-800 mb-3 text-center">
          {isOutline ? 'Summoning Ideas...' : 'Weaving Magic...'}
        </Text>
        <View className="bg-white/70 p-5 rounded-3xl border border-slate-100 w-full">
          <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider text-center mb-3">
            {isOutline ? 'Consulting the creative spirits' : 'Writing chapters & drawing art'}
          </Text>
          <View className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <LinearGradient
              colors={['#a855f7', '#ec4899', '#a855f7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFillObject}
            />
          </View>
        </View>
      </View>
    );
  }

  if (appState === 'outline-review') {
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
            onPress={() => setAppState('studio')}
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
              Leo's Park{'\n'}
              <Text className="text-purple-500">Adventure</Text>
            </Text>
          </View>

          <View className="mb-4 pl-2">
            <View className="flex-row items-center gap-2 mb-4">
              <ListChecks size={16} color="#94a3b8" />
              <Text className="font-bold text-slate-800 text-sm">Story Structure</Text>
            </View>

            <View className="gap-4">
              {[
                { title: 'The Arrival', desc: 'Leo arrives at the Magic Castle on a sunny afternoon.' },
                { title: 'The Discovery', desc: 'He hears a mysterious sound behind the big door.' },
                { title: 'New Friend', desc: 'Leo meets Barky the dog and overcomes his shyness.' },
                { title: 'Happy Ending', desc: 'They play fetch and Leo goes home with a new story.' },
              ].map((point, index) => (
                <View key={point.title} className="flex-row gap-4">
                  <View className="w-8 h-8 rounded-full bg-white border-2 border-purple-100 items-center justify-center shadow-sm">
                    <Text className="text-xs font-bold text-purple-500">{index + 1}</Text>
                  </View>
                  <View className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex-1">
                    <Text className="font-bold text-slate-800 text-sm mb-1">{point.title}</Text>
                    <Text className="text-xs text-slate-500 leading-relaxed font-medium">
                      {point.desc}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View className="px-6 py-4 flex-row gap-3">
          <Pressable
            onPress={() => setAppState('studio')}
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

  if (appState === 'preview') {
    return (
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{ paddingTop: insets.top + 12 }}
          className="px-6 flex-row items-center justify-between mb-6"
        >
          <Pressable
            onPress={() => setAppState('outline-review')}
            className="w-10 h-10 rounded-full border border-slate-200 bg-white items-center justify-center shadow-sm active:scale-95"
          >
            <ChevronLeft size={20} color="#475569" />
          </Pressable>
          <View className="flex-row items-center gap-1">
            <Check size={12} color="#8b5cf6" />
            <Text className="text-xs font-bold text-purple-500 uppercase tracking-widest">Ready</Text>
          </View>
          <View className="w-10" />
        </View>

        <View className="px-6">
          <View className="w-full aspect-[3/4] max-h-[340px] rounded-[40px] shadow-lg overflow-hidden mb-8">
            <LinearGradient
              colors={['#6366f1', '#9333ea']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />
            <View className="flex-1 items-center justify-center">
              <BookOpen size={80} color="#ffffff" />
              <View className="absolute bottom-0 left-0 right-0 p-8 pt-12 items-center">
                <Text className="text-white text-2xl font-bold text-center leading-tight">
                  Leo's Park{'\n'}
                  Adventure
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mb-8">
            <View className="flex-row items-center gap-2 mb-3">
              <Sparkles size={14} color="#8b5cf6" />
              <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider">Story Snippet</Text>
            </View>
            <Text className="text-slate-600 leading-relaxed text-lg italic">
              "The sun was shining brightly over Greenleaf Park when Leo arrived. He spotted a wagging tail behind the big oak tree..."
            </Text>
          </View>
        </View>

        <View className="px-6 flex-row gap-3">
          <Pressable
            onPress={() => setAppState('studio')}
            className="flex-1 py-4 rounded-2xl bg-white border border-slate-200 flex-row items-center justify-center gap-2 active:scale-95"
          >
            <RotateCcw size={16} color="#64748b" />
            <Text className="text-slate-600 font-bold text-sm">New</Text>
          </Pressable>
          <Pressable className="flex-[2] py-4 rounded-2xl bg-slate-900 flex-row items-center justify-center gap-2 shadow-lg active:scale-95">
            <BookOpen size={16} color="#ffffff" />
            <Text className="text-white font-bold text-sm">Read Now</Text>
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
