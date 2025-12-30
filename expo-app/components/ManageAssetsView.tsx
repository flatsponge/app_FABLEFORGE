import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, Modal } from 'react-native';
import {
  X,
  Map,
  Users,
  Mic,
  Plus,
  Upload,
  Trash2,
  Pencil,
  MoreVertical,
  CloudLightning,
  Sparkles,
} from 'lucide-react-native';
import { LucideIcon } from 'lucide-react-native';
import { PRESET_LOCATIONS, FRIENDS, VOICE_PRESETS } from '@/constants/data';

interface ManageAssetsViewProps {
  visible: boolean;
  onClose: () => void;
}

type TabType = 'faces' | 'places' | 'voices';

interface TabConfig {
  id: TabType;
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

const tabs: TabConfig[] = [
  { id: 'faces', label: 'Characters', icon: Users, color: '#f97316', bgColor: 'bg-orange-50' },
  { id: 'places', label: 'Places', icon: Map, color: '#6366f1', bgColor: 'bg-indigo-50' },
  { id: 'voices', label: 'Voices', icon: Mic, color: '#f43f5e', bgColor: 'bg-rose-50' },
];

export const ManageAssetsView: React.FC<ManageAssetsViewProps> = ({ visible, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('faces');

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="px-6 pt-14 pb-4 bg-white/80 border-b border-slate-100 flex-row items-center justify-between">
          <View>
            <View className="flex-row items-center gap-2 mb-1">
              <View className="bg-slate-900 px-2 py-0.5 rounded-full">
                <Text className="text-white text-[10px] font-bold uppercase tracking-wider">
                  Parent Zone
                </Text>
              </View>
            </View>
            <Text className="text-2xl font-extrabold text-slate-800 tracking-tight">My Assets</Text>
            <Text className="text-xs font-bold text-slate-400">
              Manage your custom story elements
            </Text>
          </View>
          <Pressable
            onPress={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center active:scale-95"
          >
            <X size={20} color="#64748b" />
          </Pressable>
        </View>

        {/* Tabs */}
        <View className="px-6 py-4">
          <View className="flex-row bg-white p-1.5 rounded-2xl border border-slate-100">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              const TabIcon = tab.icon;
              return (
                <Pressable
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id)}
                  className={`flex-1 items-center justify-center gap-1 py-3 rounded-xl ${
                    isActive ? `${tab.bgColor} shadow-sm` : ''
                  }`}
                >
                  <TabIcon
                    size={20}
                    color={isActive ? tab.color : '#94a3b8'}
                    strokeWidth={2.5}
                  />
                  <Text
                    className={`text-xs font-bold ${
                      isActive ? 'text-slate-700' : 'text-slate-400'
                    }`}
                  >
                    {tab.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Content Area */}
        <ScrollView className="flex-1 px-6 pb-20">
          {/* CHARACTERS TAB */}
          {activeTab === 'faces' && (
            <View className="gap-6">
              {/* Upload Action */}
              <Pressable className="w-full h-32 rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 items-center justify-center gap-3 active:bg-white">
                <View className="w-12 h-12 rounded-full bg-orange-100 items-center justify-center">
                  <Plus size={24} color="#f97316" />
                </View>
                <View className="items-center">
                  <Text className="font-bold text-slate-700">Create New Character</Text>
                  <Text className="text-xs font-bold text-slate-400">
                    Upload photo or design avatar
                  </Text>
                </View>
              </Pressable>

              {/* List */}
              <View className="gap-4">
                {FRIENDS.map(friend => (
                  <View
                    key={friend.id}
                    className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex-row items-center gap-4"
                  >
                    <View
                      className={`w-16 h-16 rounded-2xl ${friend.color} items-center justify-center`}
                    >
                      <Text className="text-3xl">{friend.icon}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="font-bold text-slate-800 text-lg">{friend.name}</Text>
                      <Text className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                        {friend.type}
                      </Text>
                    </View>
                    <View className="flex-row gap-2">
                      <Pressable className="w-9 h-9 rounded-full bg-slate-50 items-center justify-center active:bg-blue-50">
                        <Pencil size={16} color="#94a3b8" />
                      </Pressable>
                      <Pressable className="w-9 h-9 rounded-full bg-slate-50 items-center justify-center active:bg-red-50">
                        <Trash2 size={16} color="#94a3b8" />
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* PLACES TAB */}
          {activeTab === 'places' && (
            <View className="gap-6">
              {/* Upload Action */}
              <Pressable className="w-full h-24 rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 flex-row items-center justify-center gap-4 px-6 active:bg-white">
                <View className="w-10 h-10 rounded-full bg-indigo-100 items-center justify-center">
                  <Upload size={20} color="#6366f1" />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-slate-700">Upload Location Photo</Text>
                  <Text className="text-xs font-bold text-slate-400">
                    Use real places from your life
                  </Text>
                </View>
              </Pressable>

              {/* Grid */}
              <View className="flex-row flex-wrap gap-4">
                {PRESET_LOCATIONS.map(loc => (
                  <View
                    key={loc.id}
                    className="w-[47%] bg-white p-3 rounded-3xl border border-slate-100 shadow-sm"
                  >
                    <View className="aspect-square rounded-2xl overflow-hidden mb-3 relative">
                      <Image
                        source={{ uri: loc.image }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                      <View className="absolute top-2 right-2">
                        <Pressable className="w-7 h-7 bg-white/90 rounded-full items-center justify-center shadow-sm active:bg-red-50">
                          <Trash2 size={14} color="#64748b" />
                        </Pressable>
                      </View>
                    </View>
                    <View className="px-1">
                      <Text className="font-bold text-slate-800 text-sm" numberOfLines={1}>
                        {loc.name}
                      </Text>
                      <View className="flex-row items-center justify-between mt-1">
                        <Text className="text-[10px] font-bold text-slate-400 uppercase">
                          Preset
                        </Text>
                        <Pressable className="active:opacity-60">
                          <Pencil size={12} color="#cbd5e1" />
                        </Pressable>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* VOICES TAB */}
          {activeTab === 'voices' && (
            <View className="relative">
              {/* Disabled Layer */}
              <View className="gap-4 opacity-40">
                {/* Clone Action */}
                <View className="bg-rose-500 p-6 rounded-3xl shadow-lg">
                  <View className="flex-row items-start justify-between mb-4">
                    <View className="flex-1">
                      <Text className="font-bold text-xl text-white">Clone a Voice</Text>
                      <Text className="text-white/80 text-sm font-medium">
                        Create a custom narrator using your own voice.
                      </Text>
                    </View>
                    <View className="bg-white/20 p-2 rounded-xl">
                      <CloudLightning size={24} color="white" />
                    </View>
                  </View>
                  <View className="bg-white py-3 rounded-xl items-center flex-row justify-center gap-2">
                    <Mic size={16} color="#f43f5e" />
                    <Text className="text-rose-600 font-bold text-sm">Start Recording</Text>
                  </View>
                </View>

                <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">
                  Your Voices
                </Text>

                {VOICE_PRESETS.map(voice => (
                  <View
                    key={voice.id}
                    className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex-row items-center gap-4"
                  >
                    <View
                      className={`w-12 h-12 rounded-2xl ${voice.color} bg-opacity-20 items-center justify-center border border-slate-50`}
                    >
                      <Text className="text-xl">{voice.icon}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="font-bold text-slate-800">{voice.name}</Text>
                      <Text className="text-xs font-bold text-slate-400">{voice.style}</Text>
                    </View>
                    <Pressable className="p-2">
                      <MoreVertical size={20} color="#cbd5e1" />
                    </Pressable>
                  </View>
                ))}
              </View>

              {/* Overlay */}
              <View className="absolute inset-0 items-center justify-center">
                <View
                  className="bg-white/90 p-6 rounded-3xl border border-slate-200 shadow-2xl items-center max-w-[240px]"
                  style={{ transform: [{ rotate: '3deg' }] }}
                >
                  <View className="w-14 h-14 bg-rose-100 rounded-full items-center justify-center mb-4">
                    <Sparkles size={28} color="#f43f5e" />
                  </View>
                  <Text className="font-extrabold text-slate-800 text-xl mb-2">Coming Soon</Text>
                  <Text className="text-xs font-bold text-slate-500 leading-relaxed text-center">
                    Voice Cloning is currently under development. Stay tuned for updates!
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};
