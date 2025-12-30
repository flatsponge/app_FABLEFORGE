import React from 'react';
import { View, Text, ScrollView, Pressable, Image, Modal } from 'react-native';
import { X, Check, Diamond, User, Mic, Map, Users, Play } from 'lucide-react-native';
import { LucideIcon } from 'lucide-react-native';
import { PRESET_LOCATIONS, FRIENDS, VOICE_PRESETS } from '@/constants/data';
import { AvatarConfig } from '@/types';

type TabType = 'places' | 'faces' | 'voices';

interface AssetStudioProps {
  visible: boolean;
  onClose: () => void;
  initialTab?: TabType;
  selectedLocationId?: string | null;
  onSelectLocation?: (id: string) => void;
  selectedCharacterIds?: string[];
  onToggleCharacter?: (id: string) => void;
  selectedVoiceId?: string;
  onSelectVoice?: (id: string) => void;
  avatarConfig?: AvatarConfig;
}

const getHeaderInfo = (tab: TabType): { title: string; icon: LucideIcon; color: string; bgColor: string } => {
  switch (tab) {
    case 'places':
      return { title: 'Select Scene', icon: Map, color: '#6366f1', bgColor: 'bg-indigo-50' };
    case 'faces':
      return { title: 'Cast Characters', icon: Users, color: '#f97316', bgColor: 'bg-orange-50' };
    case 'voices':
      return { title: 'Choose Narrator', icon: Mic, color: '#f43f5e', bgColor: 'bg-rose-50' };
    default:
      return { title: 'Select Asset', icon: Diamond, color: '#64748b', bgColor: 'bg-slate-50' };
  }
};

export const AssetStudio: React.FC<AssetStudioProps> = ({
  visible,
  onClose,
  initialTab = 'places',
  selectedLocationId,
  onSelectLocation,
  selectedCharacterIds = [],
  onToggleCharacter,
  selectedVoiceId,
  onSelectVoice,
}) => {
  const { title, icon: Icon, color, bgColor } = getHeaderInfo(initialTab);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-end">
        <Pressable className="absolute inset-0 bg-slate-900/20" onPress={onClose} />

        <View className="bg-white/95 rounded-t-[40px] max-h-[75%] overflow-hidden border border-white/40">
          <View className="w-full items-center pt-3 pb-1">
            <View className="w-12 h-1.5 rounded-full bg-slate-200" />
          </View>

          <View className="px-6 pb-4 pt-2 flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className={`w-10 h-10 rounded-full ${bgColor} items-center justify-center`}>
                <Icon size={20} color={color} strokeWidth={2.5} />
              </View>
              <Text className="text-lg font-extrabold text-slate-800 tracking-tight">{title}</Text>
            </View>
            <Pressable
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-slate-100/50 items-center justify-center active:scale-95"
            >
              <X size={20} color="#94a3b8" />
            </Pressable>
          </View>

          <ScrollView className="px-6 pb-6 pt-2">
            {initialTab === 'places' && (
              <View className="flex-row flex-wrap gap-3">
                {PRESET_LOCATIONS.map(loc => {
                  const isSelected = selectedLocationId === loc.id;
                  return (
                    <Pressable
                      key={loc.id}
                      onPress={() => {
                        onSelectLocation?.(loc.id);
                        onClose();
                      }}
                      className={`w-[48%] aspect-[4/5] rounded-3xl overflow-hidden ${isSelected ? 'ring-4 ring-indigo-500/20' : ''}`}
                    >
                      <Image
                        source={{ uri: loc.image }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                      <View className={`absolute inset-0 ${isSelected ? 'bg-indigo-900/40' : 'bg-gradient-to-t from-black/60 to-transparent'}`} />

                      {isSelected && (
                        <View className="absolute inset-0 items-center justify-center">
                          <View className="bg-indigo-500 p-2 rounded-full">
                            <Check size={24} color="white" strokeWidth={3} />
                          </View>
                        </View>
                      )}

                      <View className="absolute bottom-0 left-0 right-0 p-3">
                        <Text className="text-white font-bold text-sm leading-tight">{loc.name}</Text>
                        {loc.cost > 0 && !isSelected && (
                          <View className="flex-row items-center gap-1 mt-1">
                            <Diamond size={12} color="#67e8f9" fill="#67e8f9" />
                            <Text className="text-[10px] font-bold text-cyan-300">{loc.cost}</Text>
                          </View>
                        )}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            )}

            {initialTab === 'faces' && (
              <View className="flex-row flex-wrap gap-3">
                <Pressable
                  onPress={() => onToggleCharacter?.('me')}
                  className={`w-[31%] aspect-[3/4] rounded-2xl items-center justify-center ${
                    selectedCharacterIds.includes('me')
                      ? 'bg-orange-50 border-2 border-orange-500'
                      : 'bg-slate-50 border border-slate-100'
                  }`}
                >
                  <View className="w-12 h-12 bg-white rounded-2xl shadow-sm items-center justify-center mb-2">
                    <User
                      size={24}
                      color={selectedCharacterIds.includes('me') ? '#f97316' : '#94a3b8'}
                    />
                  </View>
                  <Text
                    className={`font-bold text-xs ${
                      selectedCharacterIds.includes('me') ? 'text-orange-600' : 'text-slate-500'
                    }`}
                  >
                    Me
                  </Text>
                </Pressable>

                {FRIENDS.map(friend => {
                  const isSelected = selectedCharacterIds.includes(friend.id);
                  return (
                    <Pressable
                      key={friend.id}
                      onPress={() => onToggleCharacter?.(friend.id)}
                      className={`w-[31%] aspect-[3/4] rounded-2xl items-center justify-center ${
                        isSelected
                          ? 'bg-white border-2 border-orange-500 shadow-md'
                          : 'bg-white border border-slate-100'
                      }`}
                    >
                      <Text className={`text-3xl mb-1 ${isSelected ? 'scale-110' : ''}`}>
                        {friend.icon}
                      </Text>
                      <Text
                        className={`font-bold text-xs ${isSelected ? 'text-slate-800' : 'text-slate-500'}`}
                      >
                        {friend.name}
                      </Text>

                      {isSelected && (
                        <View className="absolute -top-1 -right-1 bg-orange-500 p-0.5 rounded-full border-2 border-white">
                          <Check size={10} color="white" strokeWidth={3} />
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            )}

            {initialTab === 'voices' && (
              <View className="gap-3 pb-6">
                {VOICE_PRESETS.map(voice => {
                  const isSelected = selectedVoiceId === voice.id;
                  return (
                    <Pressable
                      key={voice.id}
                      onPress={() => {
                        onSelectVoice?.(voice.id);
                        onClose();
                      }}
                      className={`w-full flex-row items-center gap-4 p-3 pr-4 rounded-3xl border ${
                        isSelected ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-100'
                      }`}
                    >
                      <View
                        className={`w-12 h-12 rounded-2xl items-center justify-center ${voice.color} bg-white shadow-sm border border-slate-50`}
                      >
                        <Text className="text-xl">{voice.icon}</Text>
                      </View>

                      <View className="flex-1">
                        <Text className="font-bold text-slate-800 text-sm">{voice.name}</Text>
                        <Text className="text-xs font-bold text-slate-400">{voice.style}</Text>
                      </View>

                      {isSelected ? (
                        <View className="w-8 h-8 rounded-full bg-rose-500 items-center justify-center shadow-md">
                          <Check size={16} color="white" strokeWidth={3} />
                        </View>
                      ) : (
                        <View className="w-8 h-8 rounded-full bg-slate-50 items-center justify-center">
                          <Play size={12} color="#94a3b8" fill="#94a3b8" />
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
