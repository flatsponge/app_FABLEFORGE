import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { UnifiedHeader } from '@/components/UnifiedHeader';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import {
  ChevronLeft,
  Mic,
  BookOpen,
  Sparkles,
  RotateCcw,
  ListChecks,
  ArrowRight,
  Check,
  Diamond,
  Dices,
  Pencil,
  User,
  MapPin,
  Keyboard,
  Heart,
  Shield,
  Gift,
  Hourglass,
  Search,
  Lightbulb,
  Scale,
  Users,
  Sun,
  ClipboardList,
  Puzzle,
  MessageCircle,
  Calendar,
  Activity,
  ChevronDown,
  Lock,
} from 'lucide-react-native';
import { LucideIcon } from 'lucide-react-native';
import { PRESET_LOCATIONS, FRIENDS, VOICE_PRESETS, WISHES } from '@/constants/data';
import { StoryControls, StoryLength, StoryDifficulty, StoryTime } from '@/components/StoryControls';
import { CrystalModal } from '@/components/CrystalModal';
import { WishDetailModal } from '@/components/WishDetailModal';
import { MAX_CRYSTALS, REGEN_TIME_SECONDS } from '@/constants/crystals';
import { Wish } from '@/types';

type StepType = 'input' | 'generating-outline' | 'outline-review' | 'generating-story' | 'preview';

interface FocusValue {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  desc: string;
}

interface SituationPreset {
  id: string;
  label: string;
  prompt: string;
  icon: LucideIcon;
  color: string;
  textColor: string;
  iconColor: string;
}

const FOCUS_VALUES: FocusValue[] = [
  { id: 'compassion', name: 'Compassion', icon: Heart, color: 'bg-rose-50', desc: 'Understanding feelings' },
  { id: 'bravery', name: 'Bravery', icon: Shield, color: 'bg-amber-50', desc: 'Finding courage' },
  { id: 'sharing', name: 'Sharing', icon: Gift, color: 'bg-purple-50', desc: 'The joy of giving' },
  { id: 'honesty', name: 'Honesty', icon: Scale, color: 'bg-blue-50', desc: 'Telling the truth' },
  { id: 'patience', name: 'Patience', icon: Hourglass, color: 'bg-emerald-50', desc: 'Waiting calmly' },
  { id: 'teamwork', name: 'Teamwork', icon: Users, color: 'bg-indigo-50', desc: 'Working together' },
  { id: 'curiosity', name: 'Curiosity', icon: Search, color: 'bg-cyan-50', desc: 'Discovering new things' },
  { id: 'gratitude', name: 'Gratitude', icon: Sun, color: 'bg-yellow-50', desc: 'Being thankful' },
  { id: 'responsibility', name: 'Responsibility', icon: ClipboardList, color: 'bg-slate-100', desc: 'Doing your part' },
  { id: 'problem_solving', name: 'Problem Solving', icon: Puzzle, color: 'bg-teal-50', desc: 'Finding solutions' },
];

const SITUATION_PRESETS: SituationPreset[] = [
  {
    id: 'conflict',
    label: 'Conflict',
    prompt: 'My child had a conflict with another child and needs help repairing the friendship.',
    icon: Heart,
    color: 'bg-rose-50 border-rose-100',
    textColor: 'text-rose-700',
    iconColor: '#f43f5e',
  },
  {
    id: 'fear',
    label: 'Feeling scared',
    prompt: 'My child is scared of the dark and wants help feeling brave.',
    icon: Shield,
    color: 'bg-amber-50 border-amber-100',
    textColor: 'text-amber-700',
    iconColor: '#f59e0b',
  },
  {
    id: 'sharing',
    label: 'Sharing',
    prompt: 'My child is having trouble sharing and wants to learn how.',
    icon: Users,
    color: 'bg-purple-50 border-purple-100',
    textColor: 'text-purple-700',
    iconColor: '#8b5cf6',
  },
  {
    id: 'celebration',
    label: 'Celebration',
    prompt: 'We are celebrating a special moment and want to capture it in a story.',
    icon: Gift,
    color: 'bg-emerald-50 border-emerald-100',
    textColor: 'text-emerald-700',
    iconColor: '#059669',
  },
  {
    id: 'doctor',
    label: 'Doctor visit',
    prompt: 'My child is nervous about a doctor or dentist visit tomorrow.',
    icon: Activity,
    color: 'bg-blue-50 border-blue-100',
    textColor: 'text-blue-700',
    iconColor: '#3b82f6',
  },
];



export default function CreateScreen() {
  const [step, setStep] = useState<StepType>('input');
  const [seedPrompt, setSeedPrompt] = useState('');
  const [selectedWishId, setSelectedWishId] = useState<string | null>(null);
  const [selectedValueId, setSelectedValueId] = useState<string | null>(null);
  const [selectedSituationId, setSelectedSituationId] = useState<string | null>(null);
  const [situationText, setSituationText] = useState('');
  const [crystalBalance, setCrystalBalance] = useState(150);
  const [showCrystalModal, setShowCrystalModal] = useState(false);
  const [timeToNextCrystal, setTimeToNextCrystal] = useState(REGEN_TIME_SECONDS);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(PRESET_LOCATIONS[0].id);
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>(['me']);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>(VOICE_PRESETS[0].id);
  const [storyLength, setStoryLength] = useState<StoryLength>('medium');
  const [storyDifficulty, setStoryDifficulty] = useState<StoryDifficulty>('intermediate');
  const [storyTime, setStoryTime] = useState<StoryTime>('day');
  const [showWorldOptions, setShowWorldOptions] = useState(false);
  const [wishDetailId, setWishDetailId] = useState<string | null>(null);

  const openAssetStudio = (tab: 'places' | 'faces' | 'voices') => {
    router.push({
      pathname: '/asset-studio',
      params: {
        tab,
        selectedLocationId: selectedLocationId || '',
        selectedCharacterIds: selectedCharacterIds.join(','),
        selectedVoiceId,
      },
    });
  };

  const openManageAssets = () => {
    router.push('/manage-assets');
  };

  useEffect(() => {
    if (crystalBalance >= MAX_CRYSTALS) return;
    const interval = setInterval(() => {
      setTimeToNextCrystal(prev => {
        if (prev <= 1) {
          setCrystalBalance(b => Math.min(b + 1, MAX_CRYSTALS));
          return REGEN_TIME_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [crystalBalance]);

  const handleRefill = (amount: number) => {
    setCrystalBalance(prev => Math.min(prev + amount, MAX_CRYSTALS * 2));
    setShowCrystalModal(false);
  };

  const currentLocation = PRESET_LOCATIONS.find(l => l.id === selectedLocationId);
  const currentVoice = VOICE_PRESETS.find(v => v.id === selectedVoiceId);
  const currentFriends = FRIENDS.filter(f => selectedCharacterIds.includes(f.id));
  const isMeSelected = selectedCharacterIds.includes('me');
  const selectedWish = WISHES.find(w => w.id === selectedWishId) || null;
  const activeWish = WISHES.find(w => w.id === wishDetailId) || null;
  const isRemix = Boolean(selectedWish && situationText.trim());
  const isFocusValid = Boolean(selectedValueId || situationText.trim());
  const hasNewWishes = WISHES.some(w => w.isNew);

  const getCharacterSummary = () => {
    const parts = [];
    if (isMeSelected) parts.push('Me');
    if (currentFriends.length > 0) {
      parts.push(`${currentFriends.length} Friend${currentFriends.length > 1 ? 's' : ''}`);
    }
    return parts.length === 0 ? 'None' : parts.join(' & ');
  };

  const calculateTotalCost = () => {
    let cost = 5;
    if (currentLocation) cost += currentLocation.cost;
    selectedCharacterIds.forEach(id => {
      if (id !== 'me') {
        const char = FRIENDS.find(c => c.id === id);
        if (char) cost += char.cost;
      }
    });
    const voice = VOICE_PRESETS.find(v => v.id === selectedVoiceId);
    if (voice) cost += voice.cost;
    return cost;
  };

  const totalCost = calculateTotalCost();

  const handleCreateOutline = () => {
    if (!isFocusValid) {
      return;
    }
    if (crystalBalance < totalCost) {
      setShowCrystalModal(true);
      return;
    }
    setCrystalBalance(prev => prev - totalCost);
    setStep('generating-outline');
    setTimeout(() => setStep('outline-review'), 2000);
  };

  const handleApproveOutline = () => {
    setStep('generating-story');
    setTimeout(() => setStep('preview'), 3000);
  };

  const handleSelectWish = (wish: Wish) => {
    setSelectedWishId(wish.id);
  };

  const handleRemoveWish = () => {
    const currentWishId = selectedWishId;
    setSelectedWishId(null);
    setWishDetailId(prev => (prev === currentWishId ? null : prev));
  };

  const handleSelectSituation = (preset: SituationPreset) => {
    setSituationText(preset.prompt);
    setSelectedSituationId(preset.id);
  };

  const handleSituationChange = (value: string) => {
    setSituationText(value);
    if (selectedSituationId) setSelectedSituationId(null);
  };

  const handleToggleCharacter = (id: string) => {
    setSelectedCharacterIds(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  if (step === 'generating-outline' || step === 'generating-story') {
    const isOutline = step === 'generating-outline';
    return (
      <View className="flex-1 bg-background items-center justify-center px-8">
        <View className="relative mb-12">
          <View className="w-28 h-28 bg-white rounded-[40px] shadow-lg items-center justify-center border-2 border-white">
            {isOutline ? (
              <Sparkles size={48} color="#8b5cf6" />
            ) : (
              <BookOpen size={48} color="#06b6d4" />
            )}
          </View>
        </View>
        <Text className="text-2xl font-black text-slate-800 mb-3 text-center">
          {isOutline ? 'Summoning Ideas...' : 'Weaving Magic...'}
        </Text>
        <View className="bg-white/60 p-5 rounded-3xl border border-slate-100 w-full">
          <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider text-center mb-3">
            {isOutline ? 'Consulting the creative spirits' : 'Writing chapters & drawing art'}
          </Text>
          <View className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <View className="h-full bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 w-full" />
          </View>
        </View>
      </View>
    );
  }

  if (step === 'outline-review') {
    return (
      <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="px-6 pt-14 flex-row items-center justify-between mb-8">
          <Pressable
            onPress={() => setStep('input')}
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
              <Text className="text-purple-600 text-[10px] font-bold uppercase tracking-wider">Proposed Title</Text>
            </View>
            <Text className="text-3xl font-extrabold text-slate-800 leading-tight mb-2">
              Leo's Park{'\n'}<Text className="text-purple-500">Adventure</Text>
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
              ].map((point, idx) => (
                <View key={idx} className="flex-row gap-4">
                  <View className="w-8 h-8 rounded-full bg-white border-2 border-purple-100 items-center justify-center shadow-sm">
                    <Text className="text-xs font-bold text-purple-500">{idx + 1}</Text>
                  </View>
                  <View className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex-1">
                    <Text className="font-bold text-slate-800 text-sm mb-1">{point.title}</Text>
                    <Text className="text-xs text-slate-500 leading-relaxed font-medium">{point.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View className="px-6 py-4 flex-row gap-3 pb-32">
          <Pressable
            onPress={() => setStep('input')}
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
            <ArrowRight size={16} color="white" />
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  if (step === 'preview') {
    return (
      <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="px-6 pt-14 flex-row items-center justify-between mb-6">
          <Pressable
            onPress={() => setStep('outline-review')}
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
          <View className="w-full aspect-[3/4] max-h-[340px] bg-gradient-to-br from-indigo-400 to-purple-500 rounded-[40px] shadow-lg items-center justify-center mb-8">
            <BookOpen size={80} color="white" />
            <View className="absolute bottom-0 left-0 right-0 p-8 pt-12 items-center">
              <Text className="text-white text-2xl font-bold text-center leading-tight">
                Leo's Park{'\n'}Adventure
              </Text>
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

        <View className="px-6 flex-row gap-3 pb-32">
          <Pressable
            onPress={() => setStep('input')}
            className="flex-1 py-4 rounded-2xl bg-white border border-slate-200 flex-row items-center justify-center gap-2 active:scale-95"
          >
            <RotateCcw size={16} color="#64748b" />
            <Text className="text-slate-600 font-bold text-sm">New</Text>
          </Pressable>
          <Pressable className="flex-[2] py-4 rounded-2xl bg-slate-900 flex-row items-center justify-center gap-2 shadow-lg active:scale-95">
            <BookOpen size={16} color="white" />
            <Text className="text-white font-bold text-sm">Read Now</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  return (
    <>
      <CrystalModal
        visible={showCrystalModal}
        balance={crystalBalance}
        max={MAX_CRYSTALS}
        timeToNext={timeToNextCrystal}
        onClose={() => setShowCrystalModal(false)}
        onRefill={handleRefill}
      />
      <WishDetailModal
        visible={Boolean(wishDetailId)}
        wish={activeWish}
        isSelected={Boolean(activeWish && activeWish.id === selectedWishId)}
        onClose={() => setWishDetailId(null)}
        onUse={(wish) => {
          handleSelectWish(wish);
          setWishDetailId(null);
        }}
      />



      <View className="flex-1 bg-background">
        <View className="absolute top-0 left-0 right-0 z-10">
          <UnifiedHeader
            title="Create Story"
            scrollY={scrollY}
            rightAction={
              <View className="flex-row items-center gap-2">
                <Pressable
                  onPress={openManageAssets}
                  className="bg-white p-2 rounded-full border border-slate-100 shadow-sm"
                >
                  <Pencil size={16} color="#64748b" />
                </Pressable>
                <Pressable className="bg-white p-2 rounded-full border border-slate-100 shadow-sm active:scale-95">
                  <Dices size={16} color="#64748b" />
                </Pressable>
                <Pressable
                  onPress={() => setShowCrystalModal(true)}
                  className="flex-row items-center gap-1.5 bg-white px-2 py-1.5 rounded-full shadow-sm border border-slate-100 active:scale-95"
                >
                  <Diamond size={14} color="#06b6d4" fill="#06b6d4" />
                  <Text className="font-bold text-slate-800 text-xs">
                    {crystalBalance}
                  </Text>
                </Pressable>
              </View>
            }
          />
        </View>

        <Animated.ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 100 }}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          <View className="pt-28 px-6 pb-2">
            <Text className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              Create Story
            </Text>
          </View>

          <View className="px-6 py-4">
            <Text className="text-xs font-bold text-slate-400 text-center uppercase tracking-wider">
              Turn memories into magic
            </Text>
          </View>

          <View className="px-6">
            <View className="mb-10">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-lg font-bold text-slate-800">Story Seed</Text>
                <View className="bg-white px-2 py-1 rounded-lg border border-slate-100">
                  <Text className="text-xs font-bold text-slate-400">Step 1</Text>
                </View>
              </View>
              <Text className="text-xs text-slate-400 font-medium mb-4">
                Start with a wish or add your own idea.
              </Text>

              {selectedWish ? (
                <View className="bg-purple-50 p-4 rounded-3xl border border-purple-100 mb-5">
                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-2xl bg-purple-100 items-center justify-center">
                      <Lock size={18} color="#a855f7" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-[10px] font-bold text-purple-500 uppercase tracking-wider">Selected Wish</Text>
                      <Text className="text-sm font-bold text-slate-800 leading-tight" numberOfLines={2}>
                        {selectedWish.text}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row gap-3 mt-3">
                    <Pressable
                      onPress={() => setWishDetailId(selectedWish.id)}
                      className="flex-1 py-2 rounded-xl bg-white border border-purple-100 items-center active:scale-95"
                    >
                      <Text className="text-xs font-bold text-purple-600">View</Text>
                    </Pressable>
                    <Pressable
                      onPress={handleRemoveWish}
                      className="flex-1 py-2 rounded-xl bg-white border border-slate-200 items-center active:scale-95"
                    >
                      <Text className="text-xs font-bold text-slate-600">Remove</Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <View className="bg-slate-50 p-4 rounded-3xl border border-slate-200 mb-5">
                  <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">No wish selected</Text>
                  <Text className="text-sm text-slate-600 mt-1">
                    Choose a wish below to use as your story seed.
                  </Text>
                </View>
              )}

              <View className="mb-6">
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center gap-2">
                    <Sparkles size={14} color="#a855f7" />
                    <Text className="text-sm font-bold text-slate-700">Wishing Well Inbox</Text>
                  </View>
                  {hasNewWishes && (
                    <View className="bg-purple-500 px-2 py-0.5 rounded">
                      <Text className="text-[8px] font-bold text-white uppercase">New</Text>
                    </View>
                  )}
                </View>

                {WISHES.length === 0 ? (
                  <View className="bg-purple-50 p-8 rounded-3xl items-center">
                    <Sparkles size={32} color="#c4b5fd" />
                    <Text className="text-sm font-bold text-slate-600 mt-3 text-center">No wishes yet!</Text>
                    <Text className="text-xs text-slate-400 mt-1 text-center">
                      Your child can make wishes from the Wishing Well.
                    </Text>
                  </View>
                ) : (
                  <View className="gap-3">
                    {WISHES.map(wish => {
                      const isSelected = selectedWishId === wish.id;
                      return (
                        <View
                          key={wish.id}
                          className="bg-white p-4 rounded-3xl border border-purple-100 shadow-sm"
                        >
                          <View className="flex-row items-center gap-4">
                            <View className={`w-12 h-12 rounded-2xl items-center justify-center ${wish.isNew ? 'bg-purple-100' : 'bg-slate-50'}`}>
                              {wish.isNew ? (
                                <Sparkles size={20} color="#a855f7" />
                              ) : (
                                <MessageCircle size={20} color="#94a3b8" />
                              )}
                            </View>
                            <View className="flex-1">
                              <View className="flex-row items-center gap-2 mb-1">
                                {wish.isNew && (
                                  <View className="bg-purple-500 px-1.5 py-0.5 rounded">
                                    <Text className="text-[8px] font-bold text-white uppercase">New</Text>
                                  </View>
                                )}
                                <Text className="font-bold text-slate-800 text-sm leading-tight flex-1" numberOfLines={1}>
                                  {wish.text}
                                </Text>
                              </View>
                              <View className="flex-row items-center gap-1">
                                <Calendar size={10} color="#94a3b8" />
                                <Text className="text-[10px] font-bold text-slate-400">{wish.createdAt}</Text>
                              </View>
                            </View>
                          </View>
                          <View className="flex-row gap-2 mt-3">
                            <Pressable
                              onPress={() => setWishDetailId(wish.id)}
                              className="flex-1 py-2 rounded-xl bg-white border border-slate-200 items-center active:scale-95"
                            >
                              <Text className="text-[10px] font-bold text-slate-600">View</Text>
                            </Pressable>
                            <Pressable
                              onPress={() => handleSelectWish(wish)}
                              disabled={isSelected}
                              style={isSelected ? { opacity: 0.6 } : undefined}
                              className="flex-1 py-2 rounded-xl bg-purple-500 items-center active:scale-95"
                            >
                              <Text className="text-[10px] font-bold text-white">{isSelected ? 'Selected' : 'Use'}</Text>
                            </Pressable>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>

              <View className="bg-white rounded-[32px] p-5 border border-slate-200 shadow-sm">
                <View className="flex-row items-center gap-2 mb-3">
                  <Lightbulb size={14} color="#6366f1" />
                  <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider">Parent idea (optional)</Text>
                </View>
                <TextInput
                  className="w-full h-24 text-slate-700 text-base font-medium"
                  placeholder="Describe what the story should be about..."
                  placeholderTextColor="#94a3b8"
                  value={seedPrompt}
                  onChangeText={setSeedPrompt}
                  multiline
                  textAlignVertical="top"
                />
                <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-slate-100">
                  <View className="flex-row items-center gap-1">
                    <Keyboard size={12} color="#cbd5e1" />
                    <Text className="text-[10px] font-bold text-slate-300">{seedPrompt.length} chars</Text>
                  </View>
                </View>
              </View>
            </View>

            <View className="mb-10">
              <View className="flex-row items-center justify-between mb-2">
                <View>
                  <Text className="text-lg font-bold text-slate-800">Focus</Text>
                  <Text className="text-xs text-slate-400 font-medium">Every story teaches something.</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <View className="bg-rose-50 px-2 py-1 rounded-lg border border-rose-100">
                    <Text className="text-xs font-bold text-rose-600">Required</Text>
                  </View>
                  <View className="bg-white px-2 py-1 rounded-lg border border-slate-100">
                    <Text className="text-xs font-bold text-slate-400">Step 2</Text>
                  </View>
                </View>
              </View>

              {isRemix && (
                <View className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 mb-4">
                  <View className="flex-row items-center gap-2 mb-2">
                    <Sparkles size={14} color="#6366f1" />
                    <Text className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Remix</Text>
                  </View>
                  <Text className="text-sm font-bold text-slate-800">Wish + real life situation</Text>
                  <Text className="text-xs text-slate-500 mt-1">
                    We will weave the wish into the moment and the lesson you choose.
                  </Text>
                </View>
              )}

              {!isFocusValid && (
                <Text className="text-xs font-bold text-rose-500 mb-3">
                  Pick a focus value or describe a situation to continue.
                </Text>
              )}

              <View className="bg-white rounded-[32px] p-5 border border-slate-200 shadow-sm mb-5">
                <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 mb-3">
                  Pick a value
                </Text>
                <View className="flex-row flex-wrap gap-3">
                  {FOCUS_VALUES.map(val => {
                    const IconComponent = val.icon;
                    const isSelected = selectedValueId === val.id;
                    return (
                      <Pressable
                        key={val.id}
                        onPress={() => setSelectedValueId(isSelected ? null : val.id)}
                        className={`p-4 rounded-2xl border-2 ${isSelected ? 'bg-emerald-500 border-emerald-500' : 'bg-slate-50 border-slate-100'} w-[48%]`}
                      >
                        <View className={`w-10 h-10 rounded-xl items-center justify-center mb-2 ${isSelected ? 'bg-white/20' : val.color}`}>
                          <IconComponent size={20} color={isSelected ? 'white' : '#64748b'} />
                        </View>
                        <Text className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                          {val.name}
                        </Text>
                        <Text className={`text-[10px] font-medium mt-0.5 ${isSelected ? 'text-white/70' : 'text-slate-400'}`}>
                          {val.desc}
                        </Text>
                        {isSelected && (
                          <View className="absolute top-3 right-3">
                            <Check size={16} color="white" />
                          </View>
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View className="bg-white rounded-[32px] p-5 border border-slate-200 shadow-sm">
                <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 mb-3">
                  Or describe a situation
                </Text>
                <View className="bg-slate-50 rounded-2xl border border-slate-100 p-4 mb-4">
                  <TextInput
                    className="w-full h-24 text-slate-700 text-base font-medium"
                    placeholder="My child got into a fight at school and felt upset..."
                    placeholderTextColor="#94a3b8"
                    value={situationText}
                    onChangeText={handleSituationChange}
                    multiline
                    textAlignVertical="top"
                  />
                  <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-slate-100">
                    <View className="flex-row items-center gap-1">
                      <Keyboard size={12} color="#cbd5e1" />
                      <Text className="text-[10px] font-bold text-slate-300">{situationText.length} chars</Text>
                    </View>
                  </View>
                </View>

                <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 mb-3">
                  Common situations
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {SITUATION_PRESETS.map(preset => {
                    const isSelected = selectedSituationId === preset.id;
                    return (
                      <Pressable
                        key={preset.id}
                        onPress={() => handleSelectSituation(preset)}
                        className={`flex-row items-center gap-2 px-3 py-2 rounded-xl border ${isSelected ? 'bg-slate-900 border-slate-900' : preset.color} active:scale-95`}
                      >
                        <preset.icon size={12} color={isSelected ? 'white' : preset.iconColor} />
                        <Text className={`text-xs font-bold ${isSelected ? 'text-white' : preset.textColor}`}>
                          {preset.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </View>

            <View className="mb-10">
              <Pressable
                onPress={() => setShowWorldOptions(prev => !prev)}
                className="bg-white rounded-[32px] p-5 border border-slate-200 shadow-sm active:scale-[0.99]"
              >
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-lg font-bold text-slate-800">Enhance World</Text>
                    <Text className="text-xs text-slate-400 font-medium">Optional scene, cast, and voice.</Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <View className="bg-white px-2 py-1 rounded-lg border border-slate-100">
                      <Text className="text-xs font-bold text-slate-400">Step 3</Text>
                    </View>
                    <View
                      className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center"
                      style={showWorldOptions ? { transform: [{ rotate: '180deg' }] } : undefined}
                    >
                      <ChevronDown size={16} color="#64748b" />
                    </View>
                  </View>
                </View>

                <View className="flex-row flex-wrap gap-2 mt-4">
                  <View className="flex-row items-center gap-2 px-3 py-2 rounded-full bg-slate-50 border border-slate-200">
                    <MapPin size={12} color="#6366f1" />
                    <Text className="text-xs font-bold text-slate-600" numberOfLines={1}>
                      Scene: {currentLocation?.name || 'Select'}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2 px-3 py-2 rounded-full bg-slate-50 border border-slate-200">
                    <User size={12} color="#f97316" />
                    <Text className="text-xs font-bold text-slate-600" numberOfLines={1}>
                      Cast: {getCharacterSummary()}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2 px-3 py-2 rounded-full bg-slate-50 border border-slate-200">
                    <Mic size={12} color="#f43f5e" />
                    <Text className="text-xs font-bold text-slate-600" numberOfLines={1}>
                      Voice: {currentVoice?.name || 'Select'}
                    </Text>
                  </View>
                </View>
              </Pressable>

              {showWorldOptions && (
                <View className="flex-row gap-3 mt-4">
                  <Pressable
                    onPress={() => openAssetStudio('places')}
                    className="flex-1 h-28 rounded-3xl bg-white border border-slate-200 shadow-sm items-center justify-center p-2"
                  >
                    <View className="w-10 h-10 rounded-full bg-indigo-50 items-center justify-center mb-2">
                      <MapPin size={20} color="#6366f1" />
                    </View>
                    <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Scene</Text>
                    <Text className="text-xs font-extrabold text-slate-700" numberOfLines={1}>
                      {currentLocation?.name || 'Select'}
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => openAssetStudio('faces')}
                    className="flex-1 h-28 rounded-3xl bg-white border border-slate-200 shadow-sm items-center justify-center p-2"
                  >
                    <View className="w-10 h-10 rounded-full bg-orange-50 items-center justify-center mb-2">
                      <User size={20} color="#f97316" />
                    </View>
                    <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Cast</Text>
                    <Text className="text-xs font-extrabold text-slate-700" numberOfLines={1}>
                      {getCharacterSummary()}
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => openAssetStudio('voices')}
                    className="flex-1 h-28 rounded-3xl bg-white border border-slate-200 shadow-sm items-center justify-center p-2"
                  >
                    <View className="w-10 h-10 rounded-full bg-rose-50 items-center justify-center mb-2">
                      <Mic size={20} color="#f43f5e" />
                    </View>
                    <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Voice</Text>
                    <Text className="text-xs font-extrabold text-slate-700" numberOfLines={1}>
                      {currentVoice?.name || 'Select'}
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>

            <View className="mb-4">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-lg font-bold text-slate-800">Story Settings</Text>
                <View className="bg-white px-2 py-1 rounded-lg border border-slate-100">
                  <Text className="text-xs font-bold text-slate-400">Step 4</Text>
                </View>
              </View>
              <Text className="text-xs text-slate-400 font-medium">Tune length, vocabulary, and vibe.</Text>
            </View>

            <StoryControls
              length={storyLength}
              setLength={setStoryLength}
              difficulty={storyDifficulty}
              setDifficulty={setStoryDifficulty}
              time={storyTime}
              setTime={setStoryTime}
            />
          </View>

          <View className="p-6 pb-32">
            <Pressable
              onPress={handleCreateOutline}
              disabled={!isFocusValid}
              style={!isFocusValid ? { opacity: 0.6 } : undefined}
              className="w-full py-5 rounded-[28px] bg-slate-900 flex-row items-center justify-center gap-3 shadow-lg active:scale-95"
            >
              <Sparkles size={20} color="#67e8f9" />
              <Text className="text-white font-bold text-lg">Create Magic</Text>
              <View className="flex-row items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full">
                <Diamond size={12} color="white" fill="white" />
                <Text className="text-white text-sm font-bold">{totalCost}</Text>
              </View>
            </Pressable>
          </View>
        </Animated.ScrollView>
      </View>
    </>
  );
}
