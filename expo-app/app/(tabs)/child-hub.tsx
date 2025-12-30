import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Image, Animated } from 'react-native';
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
} from 'lucide-react-native';
import { SKIN_TONES, OUTFITS, HATS, TOYS, BOOKS } from '@/constants/data';
import { AvatarConfig } from '@/types';

type RoomType = 'wardrobe' | 'well' | 'read';
type WardrobeTab = 'clothes' | 'hats' | 'toys' | 'skin';
type WishState = 'idle' | 'recording' | 'typing' | 'review' | 'sent';

const DEFAULT_AVATAR: AvatarConfig = {
  skinColor: '#FDBF60',
  outfitId: 'blue-shirt',
  hatId: 'none',
  toyId: 'none',
};

const Avatar = ({
  config,
  scale = 1,
}: {
  config: AvatarConfig;
  scale?: number;
}) => {
  const outfit = OUTFITS.find(o => o.id === config.outfitId) || OUTFITS[0];
  const hat = HATS.find(h => h.id === config.hatId);

  return (
    <View
      className="relative w-48 h-64 items-center"
      style={{ transform: [{ scale }] }}
    >
      <View
        className="absolute bottom-0 w-24 h-32 rounded-[32px] border-4 border-black/10"
        style={{ backgroundColor: config.skinColor }}
      />

      <View
        className={`absolute bottom-0 w-28 h-24 rounded-t-[32px] rounded-b-[40px] z-10 ${outfit.color} border-4 border-black/5 items-center justify-center`}
      >
        <View className="opacity-20">
          <Star size={32} color="white" />
        </View>
      </View>

      <View
        className="absolute top-4 w-32 h-36 rounded-[48px] z-20 items-center justify-center pt-6 border-4 border-black/10"
        style={{ backgroundColor: config.skinColor }}
      >
        <View className="flex-row gap-4 mb-2">
          <View className="w-3 h-3 bg-slate-800 rounded-full" />
          <View className="w-3 h-3 bg-slate-800 rounded-full" />
        </View>
        <View className="w-6 h-3 border-b-4 border-slate-800 rounded-full" />
      </View>

      {hat && hat.id !== 'none' && (
        <View className="absolute -top-4 z-30">
          {hat.id === 'crown' && <Crown size={80} color="#fbbf24" fill="#fbbf24" />}
          {hat.id === 'cap' && (
            <View className="w-32 h-16 bg-blue-500 rounded-t-full border-4 border-blue-600" />
          )}
          {hat.id === 'bow' && (
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-pink-400 rounded-full border-4 border-pink-500" />
              <View className="w-10 h-10 bg-pink-400 rounded-full border-4 border-pink-500 -mx-2 z-10" />
              <View className="w-8 h-8 bg-pink-400 rounded-full border-4 border-pink-500" />
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const RoomButton = ({
  active,
  onPress,
  icon: Icon,
  label,
  activeColor,
  activeBorder,
}: {
  active: boolean;
  onPress: () => void;
  icon: typeof Shirt;
  label: string;
  activeColor: string;
  activeBorder: string;
}) => (
  <Pressable
    onPress={onPress}
    className={`w-16 h-16 rounded-2xl border-b-[6px] border-x-4 border-t-4 items-center justify-center active:translate-y-1 ${
      active
        ? `${activeColor} ${activeBorder}`
        : 'bg-white border-slate-300'
    }`}
  >
    <Icon size={24} color={active ? '#1e293b' : '#94a3b8'} strokeWidth={2.5} />
    <Text
      className={`text-[9px] font-black uppercase tracking-wide ${
        active ? 'text-slate-800' : 'text-slate-400'
      }`}
    >
      {label}
    </Text>
  </Pressable>
);

export default function ChildHubScreen() {
  const [isLocked, setIsLocked] = useState(true);
  const [activeRoom, setActiveRoom] = useState<RoomType>('wardrobe');
  const [wardrobeTab, setWardrobeTab] = useState<WardrobeTab>('clothes');
  const [wishState, setWishState] = useState<WishState>('idle');
  const [recordingTime, setRecordingTime] = useState(0);
  const [wishText, setWishText] = useState('');
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>(DEFAULT_AVATAR);
  const [showUnlockHint, setShowUnlockHint] = useState(false);

  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentOutfit = OUTFITS.find(o => o.id === avatarConfig.outfitId) || OUTFITS[0];
  const currentHat = HATS.find(h => h.id === avatarConfig.hatId);
  const currentToy = TOYS.find(t => t.id === avatarConfig.toyId);

  const handleLockPressStart = () => {
    if (isLocked) {
      longPressTimer.current = setTimeout(() => {
        setIsLocked(false);
        setShowUnlockHint(false);
      }, 1500);
    } else {
      setIsLocked(true);
    }
  };

  const handleLockPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    if (isLocked) {
      setShowUnlockHint(true);
      setTimeout(() => setShowUnlockHint(false), 2000);
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
    setWishState('sent');
    setTimeout(() => {
      setWishState('idle');
      setRecordingTime(0);
      setWishText('');
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const tabItems: { id: WardrobeTab; icon: typeof Shirt; color: string; border: string }[] = [
    { id: 'clothes', icon: Shirt, color: 'bg-blue-400', border: 'border-blue-600' },
    { id: 'hats', icon: Crown, color: 'bg-yellow-400', border: 'border-yellow-600' },
    { id: 'toys', icon: Gift, color: 'bg-purple-400', border: 'border-purple-600' },
    { id: 'skin', icon: Palette, color: 'bg-orange-400', border: 'border-orange-600' },
  ];

  return (
    <View className="flex-1 bg-[#4FC3F7]">
      <View className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#81C784]" />

      <View className="absolute top-10 left-10 opacity-80">
        <View className="w-20 h-10 bg-white rounded-full" />
        <View className="w-14 h-14 bg-white rounded-full -mt-8 ml-4" />
      </View>
      <View className="absolute top-20 right-20 opacity-80">
        <View className="w-24 h-12 bg-white rounded-full" />
        <View className="w-16 h-16 bg-white rounded-full -mt-10 ml-6" />
      </View>

      <View className="relative z-50 px-4 pt-14 flex-row justify-between items-start">
        {!isLocked && (
          <View className="flex-row gap-2">
            <RoomButton
              active={activeRoom === 'wardrobe'}
              onPress={() => setActiveRoom('wardrobe')}
              icon={Shirt}
              label="Me"
              activeColor="bg-[#FFF176]"
              activeBorder="border-yellow-600"
            />
            <RoomButton
              active={activeRoom === 'read'}
              onPress={() => setActiveRoom('read')}
              icon={BookOpen}
              label="Read"
              activeColor="bg-[#A5D6A7]"
              activeBorder="border-green-700"
            />
            <RoomButton
              active={activeRoom === 'well'}
              onPress={() => setActiveRoom('well')}
              icon={Sparkles}
              label="Wish"
              activeColor="bg-[#4DD0E1]"
              activeBorder="border-cyan-700"
            />
          </View>
        )}

        <View className="items-end ml-auto">
          <Pressable
            onPressIn={handleLockPressStart}
            onPressOut={handleLockPressEnd}
            className={`w-14 h-14 rounded-2xl border-b-8 border-x-4 border-t-4 items-center justify-center active:translate-y-1 ${
              isLocked
                ? 'bg-red-500 border-red-700'
                : 'bg-white border-slate-300'
            }`}
          >
            {isLocked ? (
              <Lock size={24} color="white" />
            ) : (
              <Unlock size={24} color="#94a3b8" />
            )}
          </Pressable>
          {showUnlockHint && isLocked && (
            <View className="mt-2 bg-red-500 px-2 py-1 rounded-lg border-2 border-red-700">
              <Text className="text-xs font-black text-white">HOLD!</Text>
            </View>
          )}
        </View>
      </View>

      {activeRoom === 'wardrobe' && !isLocked && (
        <View className="flex-1 relative z-10 pb-24">
          <View className="flex-1 items-center justify-center pt-8">
            <View className="bg-white/30 p-8 rounded-full border-4 border-white/50">
              <Avatar config={avatarConfig} scale={1.2} />
            </View>
          </View>

          <View className="px-4 pb-4">
            <View className="flex-row gap-2 mb-4 justify-center">
              {tabItems.map(tab => (
                <Pressable
                  key={tab.id}
                  onPress={() => setWardrobeTab(tab.id)}
                  className={`w-14 h-14 rounded-xl border-b-4 border-x-2 border-t-2 items-center justify-center active:translate-y-1 ${
                    wardrobeTab === tab.id
                      ? `${tab.color} ${tab.border}`
                      : 'bg-white border-slate-300'
                  }`}
                >
                  <tab.icon
                    size={24}
                    color={wardrobeTab === tab.id ? 'white' : '#cbd5e1'}
                    strokeWidth={3}
                  />
                </Pressable>
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
                        className={`w-20 h-20 rounded-2xl items-center justify-center border-4 ${item.color} ${
                          currentOutfit.id === item.id
                            ? 'border-black/20 ring-4'
                            : 'border-transparent opacity-90'
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
                        className={`w-20 h-20 rounded-2xl items-center justify-center bg-slate-100 border-4 ${
                          currentHat?.id === item.id
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
                        className={`w-20 h-20 rounded-2xl items-center justify-center bg-slate-100 border-4 ${
                          currentToy?.id === item.id
                            ? 'border-purple-400 bg-white'
                            : 'border-slate-200'
                        }`}
                      >
                        <Text className="text-4xl">{item.id === 'star' ? '⭐' : item.id === 'camera' ? '📷' : item.id === 'game' ? '🎮' : '❌'}</Text>
                      </Pressable>
                    ))}

                  {wardrobeTab === 'skin' &&
                    SKIN_TONES.map(color => (
                      <Pressable
                        key={color}
                        onPress={() =>
                          setAvatarConfig({ ...avatarConfig, skinColor: color })
                        }
                        style={{ backgroundColor: color }}
                        className={`w-20 h-20 rounded-full border-4 ${
                          avatarConfig.skinColor === color
                            ? 'border-white ring-4 ring-black/10'
                            : 'border-transparent'
                        }`}
                      />
                    ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      )}

      {activeRoom === 'read' && !isLocked && (
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

      {activeRoom === 'well' && !isLocked && (
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
              <View className="relative w-64 h-56" style={{ transform: [{ scale: 1.1 }] }}>
                <View className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-24 bg-[#8D6E63] rounded-t-full border-4 border-[#5D4037] z-20 items-center justify-center" />
                <View className="absolute top-0 left-6 w-4 h-32 bg-[#A1887F] border-2 border-[#5D4037] z-10" />
                <View className="absolute top-0 right-6 w-4 h-32 bg-[#A1887F] border-2 border-[#5D4037] z-10" />
                <View className="absolute bottom-0 w-full h-32 bg-slate-300 rounded-[32px] border-4 border-slate-500 z-10 overflow-hidden">
                  <View className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-12 bg-black/40 rounded-full blur-xl" />
                </View>

                {wishState === 'sent' && (
                  <View className="absolute bottom-32 left-1/2 -translate-x-1/2 z-30">
                    <Sparkles size={96} color="#fde047" fill="#fde047" />
                  </View>
                )}
              </View>
            </View>
          )}

          <View className="w-full max-w-sm pb-4">
            {wishState === 'idle' && (
              <View className="flex-row gap-4">
                <Pressable
                  onPress={handleStartRecording}
                  className="flex-1 aspect-square bg-rose-500 rounded-[48px] border-4 border-b-[16px] border-rose-700 items-center justify-center active:translate-y-3 active:border-b-4 shadow-sm"
                >
                  <View className="bg-white/20 p-6 rounded-full mb-4">
                    <Mic size={56} color="white" strokeWidth={4} />
                  </View>
                  <Text className="text-white font-black text-3xl uppercase tracking-wide">
                    Talk
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setWishState('typing')}
                  className="flex-1 aspect-square bg-sky-500 rounded-[48px] border-4 border-b-[16px] border-sky-700 items-center justify-center active:translate-y-3 active:border-b-4 shadow-sm"
                >
                  <View className="bg-white/20 p-6 rounded-full mb-4">
                    <Keyboard size={56} color="white" strokeWidth={4} />
                  </View>
                  <Text className="text-white font-black text-3xl uppercase tracking-wide">
                    Type
                  </Text>
                </Pressable>
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

                <Pressable
                  onPress={handleStopRecording}
                  className="w-full h-32 rounded-[48px] bg-rose-500 border-4 border-b-[16px] border-rose-800 items-center justify-center flex-row gap-4 active:translate-y-2 active:border-b-4 shadow-sm"
                >
                  <View className="w-10 h-10 bg-white rounded-lg" />
                  <Text className="text-white font-black text-4xl uppercase tracking-wider">
                    Stop
                  </Text>
                </Pressable>
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

                <View className="flex-row gap-4">
                  <Pressable
                    onPress={() => {
                      setWishState('idle');
                      setWishText('');
                    }}
                    className="w-32 h-32 items-center justify-center rounded-[48px] bg-slate-200 border-4 border-b-[16px] border-slate-300 active:translate-y-2 active:border-b-4 shadow-sm"
                  >
                    <X size={48} color="#64748b" strokeWidth={5} />
                  </Pressable>
                  <Pressable
                    onPress={() => setWishState('review')}
                    disabled={!wishText.trim()}
                    className={`flex-1 h-32 rounded-[48px] bg-sky-500 border-4 border-b-[16px] border-sky-700 items-center justify-center active:translate-y-2 active:border-b-4 shadow-sm ${
                      !wishText.trim() ? 'opacity-50' : ''
                    }`}
                  >
                    <Text className="text-white font-black text-4xl uppercase tracking-wider">
                      Done
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}

            {wishState === 'review' && (
              <View className="gap-6 w-full">
                <View className="bg-white p-8 rounded-[40px] border-b-8 border-slate-200 items-center transform rotate-1">
                  {wishText ? (
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
                <View className="flex-row gap-4">
                  <Pressable
                    onPress={() => {
                      if (wishText) {
                        setWishState('typing');
                      } else {
                        setWishState('idle');
                      }
                    }}
                    className="flex-1 h-32 rounded-[48px] bg-white border-4 border-b-[16px] border-slate-300 items-center justify-center active:translate-y-2 active:border-b-4 shadow-sm"
                  >
                    <RotateCcw size={32} color="#64748b" strokeWidth={4} />
                    <Text className="text-slate-500 font-black text-xl uppercase mt-2">
                      Again
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={handleSendWish}
                    className="flex-[2] h-32 rounded-[48px] bg-emerald-500 border-4 border-b-[16px] border-emerald-700 flex-row items-center justify-center gap-4 active:translate-y-2 active:border-b-4 shadow-sm"
                  >
                    <Text className="text-white font-black text-3xl uppercase tracking-wider">
                      Throw It!
                    </Text>
                    <Send size={40} color="white" strokeWidth={4} />
                  </Pressable>
                </View>
              </View>
            )}

            {wishState === 'sent' && (
              <View className="bg-white p-10 rounded-[48px] border-8 border-yellow-400 items-center">
                <View className="w-24 h-24 bg-yellow-100 rounded-full items-center justify-center mb-4">
                  <Star size={56} color="#eab308" fill="#eab308" />
                </View>
                <Text className="text-3xl font-black text-slate-800 mb-2">Wish Sent!</Text>
                <Text className="text-slate-400 font-bold text-lg">Magic is happening...</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {isLocked && (
        <View className="flex-1 items-center justify-center px-4">
          <View className="bg-white/30 p-8 rounded-full border-4 border-white/50">
            <Avatar config={avatarConfig} scale={1.2} />
          </View>
          <Text className="text-white font-black text-2xl mt-8 text-center">
            Hold the lock to unlock! 🔒
          </Text>
        </View>
      )}
    </View>
  );
}
