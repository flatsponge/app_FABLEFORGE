import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Modal } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronLeft,
  Mic,
  PenTool,
  Smile,
  Zap,
  Trees,
  GraduationCap,
  Plus,
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
  X,
  Clock,
  MessageCircle,
  Play,
  Calendar,
  Crown,
  BatteryCharging,
  Infinity,
} from 'lucide-react-native';
import { LucideIcon } from 'lucide-react-native';
import { PRESET_LOCATIONS, FRIENDS, VOICE_PRESETS } from '@/constants/data';

const MAX_CRYSTALS = 160;
const REGEN_TIME_SECONDS = 1800;

const AnimatedGradientBorder = ({ children }: { children: React.ReactNode }) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 3000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View className="rounded-[32px] p-[3px] overflow-hidden" style={{ backgroundColor: '#1e293b' }}>
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: 500,
            height: 500,
            top: '50%',
            left: '50%',
            marginTop: -250,
            marginLeft: -250,
          },
          animatedStyle,
        ]}
      >
        <LinearGradient
          colors={['#fcd34d', '#a855f7', '#f43f5e', '#0ea5e9', '#fcd34d']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: 500, height: 500 }}
        />
      </Animated.View>
      <View className="rounded-[29px] overflow-hidden relative">
        {children}
      </View>
    </View>
  );
};

type StepType = 'input' | 'generating-outline' | 'outline-review' | 'generating-story' | 'preview';
type InputMode = 'requests' | 'text' | 'values';

interface TeachingValue {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  desc: string;
}

const TEACHING_VALUES: TeachingValue[] = [
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

const CHILD_REQUESTS = [
  { id: 'r1', text: 'A big red dragon that eats ice cream', date: '2 hours ago', isNew: true },
  { id: 'r2', text: 'The time I lost my tooth at school', date: 'Yesterday', isNew: false },
  { id: 'r3', text: 'Swimming with dolphins in the sky', date: '2 days ago', isNew: false },
];

const QuickTag = ({
  icon: Icon,
  label,
  color,
  onPress,
}: {
  icon: LucideIcon;
  label: string;
  color: string;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    className="flex-row items-center gap-2 pl-2 pr-3 py-2 rounded-full border border-slate-200 bg-white active:scale-95"
  >
    <Icon size={14} color={color} />
    <Text className="text-xs font-bold text-slate-600">{label}</Text>
  </Pressable>
);

const CrystalModal = ({
  visible,
  balance,
  max,
  timeToNext,
  onClose,
  onRefill,
}: {
  visible: boolean;
  balance: number;
  max: number;
  timeToNext: number;
  onClose: () => void;
  onRefill: (amount: number) => void;
}) => {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const formatFullTimer = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const fullInSeconds = (max - balance - 1) * REGEN_TIME_SECONDS + timeToNext;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/60 justify-end">
          <ScrollView className="bg-white rounded-t-[40px] max-h-[90%]">
            <Pressable
              onPress={onClose}
              className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full bg-black/5 items-center justify-center"
            >
              <X size={20} color="#64748b" />
            </Pressable>

            <View className="bg-background p-8 pb-10 border-b border-slate-100 relative overflow-hidden">
              <View className="absolute top-0 right-0 w-64 h-64 bg-cyan-100/30 rounded-full -mr-16 -mt-16" />

              <View className="items-center">
                <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Current Balance
                </Text>
                <View className="flex-row items-center gap-2 mb-4">
                  <Diamond size={32} color="#06b6d4" fill="#06b6d4" />
                  <Text className="text-5xl font-black text-slate-800">{balance}</Text>
                  <Text className="text-2xl font-bold text-slate-300">/{max}</Text>
                </View>

                {balance < max ? (
                  <View className="flex-row items-center gap-3 bg-white px-4 py-2 rounded-full border border-slate-200">
                    <View className="flex-row items-center gap-1.5">
                      <Clock size={14} color="#06b6d4" />
                      <Text className="text-xs font-bold text-slate-600">
                        +1 in <Text className="font-mono text-cyan-600">{formatTime(timeToNext)}</Text>
                      </Text>
                    </View>
                    <View className="w-px h-3 bg-slate-200" />
                    <View className="flex-row items-center gap-1.5">
                      <BatteryCharging size={14} color="#a855f7" />
                      <Text className="text-xs font-bold text-slate-600">
                        Full in <Text className="font-mono text-purple-600">{formatFullTimer(fullInSeconds)}</Text>
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View className="bg-emerald-50 px-4 py-2 rounded-full flex-row items-center gap-2">
                    <Check size={16} color="#059669" />
                    <Text className="text-xs font-bold text-emerald-600">Fully Charged</Text>
                  </View>
                )}
              </View>
            </View>

            <View className="p-6 gap-6 bg-white">
              <AnimatedGradientBorder>
                <View className="bg-slate-900 p-6 relative overflow-hidden">
                  <View className="flex-row justify-between items-start mb-4">
                    <View>
                      <View className="flex-row items-center gap-2 mb-1">
                        <View className="bg-amber-400 px-2 py-0.5 rounded-md">
                          <Text className="text-[10px] font-black text-slate-900 uppercase">Best Value</Text>
                        </View>
                      </View>
                      <Text className="text-2xl font-black text-white italic tracking-wide">
                        STORY<Text className="text-amber-400">MAX</Text>
                      </Text>
                    </View>
                    <Crown size={40} color="#fbbf24" />
                  </View>

                  <View className="gap-3 mb-6">
                    <View className="flex-row items-center gap-3">
                      <View className="w-8 h-8 rounded-full bg-white/10 items-center justify-center">
                        <Zap size={16} color="#fbbf24" />
                      </View>
                      <View>
                        <Text className="font-bold text-sm text-white">2x Faster Generation</Text>
                        <Text className="text-[10px] text-slate-400">Crystals refill every 15m</Text>
                      </View>
                    </View>
                    <View className="flex-row items-center gap-3">
                      <View className="w-8 h-8 rounded-full bg-white/10 items-center justify-center">
                        <Infinity size={16} color="#c084fc" />
                      </View>
                      <View>
                        <Text className="font-bold text-sm text-white">2x Cap Increase</Text>
                        <Text className="text-[10px] text-slate-400">Hold up to 320 Crystals</Text>
                      </View>
                    </View>
                    <View className="flex-row items-center gap-3">
                      <View className="w-8 h-8 rounded-full bg-white/10 items-center justify-center">
                        <Diamond size={16} color="#22d3ee" />
                      </View>
                      <View>
                        <Text className="font-bold text-sm text-white">+1000 Instant Boost</Text>
                        <Text className="text-[10px] text-slate-400">One-time bonus</Text>
                      </View>
                    </View>
                  </View>

                  <Pressable
                    onPress={() => onRefill(1000)}
                    className="w-full py-4 rounded-xl bg-amber-400 items-center flex-row justify-center gap-2 active:scale-95"
                  >
                    <Text className="text-slate-900 font-black text-sm">Upgrade to MAX</Text>
                    <View className="bg-black/10 px-1.5 py-0.5 rounded">
                      <Text className="text-xs text-slate-900/70">$9.99/mo</Text>
                    </View>
                  </Pressable>
                </View>
              </AnimatedGradientBorder>

              <View className="flex-row items-center gap-4">
                <View className="h-px bg-slate-100 flex-1" />
                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Or Top Up</Text>
                <View className="h-px bg-slate-100 flex-1" />
              </View>

              <View className="flex-row gap-4">
                <Pressable
                  onPress={() => onRefill(100)}
                  className="flex-1 bg-slate-50 p-4 rounded-3xl border border-slate-200 items-center gap-3 active:scale-95"
                >
                  <View className="w-12 h-12 bg-white rounded-full items-center justify-center">
                    <Diamond size={24} color="#22d3ee" fill="#22d3ee" />
                  </View>
                  <View className="items-center">
                    <Text className="font-bold text-slate-800 text-lg">100</Text>
                    <Text className="text-xs font-bold text-slate-400">Crystals</Text>
                  </View>
                  <View className="bg-slate-900 px-4 py-2 rounded-full w-full items-center">
                    <Text className="text-white text-xs font-bold">$1.99</Text>
                  </View>
                </Pressable>

                <Pressable
                  onPress={() => onRefill(500)}
                  className="flex-1 bg-slate-50 p-4 rounded-3xl border border-slate-200 items-center gap-3 active:scale-95 relative overflow-hidden"
                >
                  <View className="absolute top-0 right-0 bg-rose-500 px-2 py-1 rounded-bl-xl">
                    <Text className="text-white text-[9px] font-bold">POPULAR</Text>
                  </View>
                  <View className="w-12 h-12 bg-white rounded-full items-center justify-center">
                    <Diamond size={24} color="#06b6d4" fill="#06b6d4" />
                  </View>
                  <View className="items-center">
                    <Text className="font-bold text-slate-800 text-lg">500</Text>
                    <Text className="text-xs font-bold text-slate-400">Crystals</Text>
                  </View>
                  <View className="bg-slate-900 px-4 py-2 rounded-full w-full items-center">
                    <Text className="text-white text-xs font-bold">$4.99</Text>
                  </View>
                </Pressable>
              </View>

              <Text className="text-center text-[10px] text-slate-400 font-medium pb-8">
                Purchase is restored automatically. Cancel anytime.
              </Text>
            </View>
          </ScrollView>
      </View>
    </Modal>
  );
};

export default function CreateScreen() {
  const [step, setStep] = useState<StepType>('input');
  const [inputMode, setInputMode] = useState<InputMode>('requests');
  const [textPrompt, setTextPrompt] = useState('');
  const [selectedValueId, setSelectedValueId] = useState<string | null>(null);
  const [crystalBalance, setCrystalBalance] = useState(150);
  const [showCrystalModal, setShowCrystalModal] = useState(false);
  const [timeToNextCrystal, setTimeToNextCrystal] = useState(REGEN_TIME_SECONDS);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(PRESET_LOCATIONS[0].id);
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>(['me']);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>(VOICE_PRESETS[0].id);

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

  const handleAddTag = (label: string) => {
    if (inputMode !== 'text') setInputMode('text');
    setTextPrompt(prev => prev + (prev.length > 0 ? ' ' : '') + label);
  };

  const handleUseRequest = (text: string) => {
    setTextPrompt(text);
    setInputMode('text');
  };

  const handleToggleCharacter = (id: string) => {
    setSelectedCharacterIds(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

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
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest">Step 2 of 3</Text>
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



      <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="px-6 pt-14 pb-6 flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-extrabold text-slate-800 tracking-tight">Create Story</Text>
            <Text className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
              Turn memories into magic
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Pressable
              onPress={openManageAssets}
              className="bg-white p-2 rounded-full border border-slate-100 shadow-sm"
            >
              <Pencil size={20} color="#64748b" />
            </Pressable>
            <Pressable className="bg-white p-2 rounded-full border border-slate-100 shadow-sm active:scale-95">
              <Dices size={20} color="#64748b" />
            </Pressable>
            <Pressable
              onPress={() => setShowCrystalModal(true)}
              className="flex-row items-center gap-2 bg-white px-3 py-2 rounded-full shadow-sm border border-slate-100 active:scale-95"
            >
              <Diamond size={16} color="#06b6d4" fill="#06b6d4" />
              <Text className="font-bold text-slate-800 text-sm">
                {crystalBalance}<Text className="text-slate-300 text-xs">/{MAX_CRYSTALS}</Text>
              </Text>
            </Pressable>
          </View>
        </View>

        <View className="px-6">
          <View className="mb-8">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-slate-800">Scene & Cast</Text>
              <View className="bg-white px-2 py-1 rounded-lg border border-slate-100">
                <Text className="text-xs font-bold text-slate-400">Step 1</Text>
              </View>
            </View>

            <View className="flex-row gap-3">
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
          </View>

          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-bold text-slate-800 leading-tight">What happened?</Text>
              <View className="flex-row items-center bg-white p-1 rounded-full border border-slate-200 shadow-sm">
                <Pressable
                  onPress={() => setInputMode('requests')}
                  className={`px-3 py-1.5 rounded-full flex-row items-center gap-1.5 ${inputMode === 'requests' ? 'bg-slate-900' : ''}`}
                >
                  <MessageCircle size={12} color={inputMode === 'requests' ? 'white' : '#94a3b8'} />
                  <Text className={`text-[10px] font-bold ${inputMode === 'requests' ? 'text-white' : 'text-slate-400'}`}>
                    Requests
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setInputMode('text')}
                  className={`px-3 py-1.5 rounded-full flex-row items-center gap-1.5 ${inputMode === 'text' ? 'bg-slate-900' : ''}`}
                >
                  <PenTool size={12} color={inputMode === 'text' ? 'white' : '#94a3b8'} />
                  <Text className={`text-[10px] font-bold ${inputMode === 'text' ? 'text-white' : 'text-slate-400'}`}>
                    Text
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setInputMode('values')}
                  className={`px-3 py-1.5 rounded-full flex-row items-center gap-1.5 ${inputMode === 'values' ? 'bg-slate-900' : ''}`}
                >
                  <GraduationCap size={12} color={inputMode === 'values' ? 'white' : '#94a3b8'} />
                  <Text className={`text-[10px] font-bold ${inputMode === 'values' ? 'text-white' : 'text-slate-400'}`}>
                    Values
                  </Text>
                </Pressable>
              </View>
            </View>

            {inputMode === 'requests' && (
              <View className="gap-3 mb-8">
                {CHILD_REQUESTS.map(req => (
                  <Pressable
                    key={req.id}
                    onPress={() => handleUseRequest(req.text)}
                    className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex-row items-center gap-4 active:scale-[0.98]"
                  >
                    <View className={`w-12 h-12 rounded-full items-center justify-center ${req.isNew ? 'bg-red-50' : 'bg-slate-50'}`}>
                      {req.isNew ? (
                        <View className="w-3 h-3 bg-red-500 rounded-full" />
                      ) : (
                        <Play size={20} color="#94a3b8" fill="#94a3b8" />
                      )}
                    </View>
                    <View className="flex-1">
                      <Text className="font-bold text-slate-800 text-sm leading-tight mb-1" numberOfLines={1}>
                        {req.text}
                      </Text>
                      <View className="flex-row items-center gap-3">
                        <View className="flex-row items-center gap-1">
                          <Calendar size={12} color="#94a3b8" />
                          <Text className="text-[10px] font-bold text-slate-400 uppercase">{req.date}</Text>
                        </View>
                      </View>
                    </View>
                    <View className="w-8 h-8 rounded-full border border-slate-100 items-center justify-center">
                      <Plus size={16} color="#cbd5e1" />
                    </View>
                  </Pressable>
                ))}
              </View>
            )}

            {inputMode === 'text' && (
              <View className="bg-white rounded-[40px] p-6 border border-slate-200 mb-8 shadow-sm">
                <TextInput
                  className="w-full h-32 text-slate-700 text-lg font-medium"
                  placeholder="Once upon a time..."
                  placeholderTextColor="#cbd5e1"
                  value={textPrompt}
                  onChangeText={setTextPrompt}
                  multiline
                  textAlignVertical="top"
                />
                <View className="absolute bottom-6 right-6 flex-row items-center gap-1 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">
                  <Keyboard size={12} color="#cbd5e1" />
                  <Text className="text-[10px] font-bold text-slate-300">{textPrompt.length} chars</Text>
                </View>
              </View>
            )}

            {inputMode === 'values' && (
              <View className="bg-white rounded-[40px] p-6 border border-slate-200 mb-8 shadow-sm">
                <View className="flex-row items-center gap-2 mb-4">
                  <Lightbulb size={16} color="#eab308" fill="#eab308" />
                  <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select a Value to Teach</Text>
                </View>
                <View className="flex-row flex-wrap gap-3">
                  {TEACHING_VALUES.map(val => {
                    const IconComponent = val.icon;
                    const isSelected = selectedValueId === val.id;
                    return (
                      <Pressable
                        key={val.id}
                        onPress={() => setSelectedValueId(isSelected ? null : val.id)}
                        className={`p-4 rounded-3xl border-2 ${isSelected ? 'bg-slate-900 border-slate-900' : 'bg-slate-50 border-slate-100'} w-[48%]`}
                      >
                        <View className={`w-10 h-10 rounded-2xl items-center justify-center mb-3 ${isSelected ? 'bg-white/20' : val.color}`}>
                          <IconComponent size={20} color={isSelected ? 'white' : '#64748b'} />
                        </View>
                        <Text className={`font-bold text-sm mb-0.5 ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                          {val.name}
                        </Text>
                        <Text className={`text-[10px] font-bold ${isSelected ? 'text-white/60' : 'text-slate-400'}`}>
                          {val.desc}
                        </Text>
                        {isSelected && (
                          <View className="absolute top-4 right-4">
                            <Check size={16} color="white" />
                          </View>
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}

            {inputMode !== 'values' && (
              <View className="mb-8">
                <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 mb-4">Quick Add</Text>
                <View className="flex-row flex-wrap gap-2.5">
                  <QuickTag icon={Smile} label="Happy" color="#3b82f6" onPress={() => handleAddTag('Happy')} />
                  <QuickTag icon={Zap} label="Energetic" color="#f97316" onPress={() => handleAddTag('Energetic')} />
                  <QuickTag icon={Trees} label="Park" color="#22c55e" onPress={() => handleAddTag('Park')} />
                  <QuickTag icon={GraduationCap} label="School" color="#6366f1" onPress={() => handleAddTag('School')} />
                  <Pressable className="w-9 h-9 rounded-full bg-white border border-dashed border-slate-200 items-center justify-center active:scale-95">
                    <Plus size={16} color="#94a3b8" />
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        </View>

        <View className="p-6 pb-32">
          <Pressable
            onPress={handleCreateOutline}
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
      </ScrollView>
    </>
  );
}
