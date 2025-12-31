import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { UnifiedHeader } from '@/components/UnifiedHeader';
import {
  Bell,
  Volume2,
  Moon,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Crown,
  CreditCard,
  User,
  Mail,
  Pencil,
} from 'lucide-react-native';
import { LucideIcon } from 'lucide-react-native';

interface SettingItemProps {
  icon: LucideIcon;
  label: string;
  iconColor: string;
  iconBg: string;
  action: React.ReactNode;
  onPress?: () => void;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon: Icon,
  label,
  iconColor,
  iconBg,
  action,
  onPress,
}) => (
  <Pressable
    onPress={onPress}
    className="flex-row items-center justify-between p-4 border-b border-slate-50 active:bg-slate-50"
  >
    <View className="flex-row items-center gap-4">
      <View className={`w-10 h-10 rounded-full ${iconBg} items-center justify-center`}>
        <Icon size={20} color={iconColor} />
      </View>
      <Text className="font-bold text-slate-700 text-sm">{label}</Text>
    </View>
    <View>{action}</View>
  </Pressable>
);

const Toggle = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <Pressable
    onPress={() => onChange(!checked)}
    className={`w-12 h-7 rounded-full ${checked ? 'bg-purple-500' : 'bg-slate-200'} justify-center`}
  >
    <View
      className={`w-5 h-5 rounded-full bg-white shadow-sm ${checked ? 'ml-6' : 'ml-1'}`}
    />
  </Pressable>
);

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <View className="flex-1 bg-background">
      <UnifiedHeader title="Settings" />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="px-6 py-6 gap-8">
          <View className="flex-row items-center gap-4 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <View className="w-16 h-16 rounded-2xl bg-slate-100 items-center justify-center border-2 border-white shadow-sm overflow-hidden">
            <User size={32} color="#94a3b8" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold text-slate-800">Leo's Parent</Text>
            <Text className="text-xs font-medium text-slate-400">Free Plan</Text>
          </View>
          <Pressable className="p-2 bg-slate-50 rounded-full active:bg-slate-100">
            <Pencil size={16} color="#cbd5e1" />
          </Pressable>
        </View>

        <View className="relative overflow-hidden rounded-3xl p-6 bg-slate-900">
          <View className="absolute top-0 right-0 w-32 h-32 bg-purple-500/30 rounded-full blur-3xl -mr-10 -mt-10" />
          <View className="relative z-10">
            <View className="flex-row items-center gap-2 mb-2">
              <Crown size={20} color="#fbbf24" fill="#fbbf24" />
              <Text className="text-xs font-black uppercase tracking-widest text-amber-400">
                Premium
              </Text>
            </View>
            <Text className="text-xl font-bold text-white mb-1">Upgrade to StoryTime+</Text>
            <Text className="text-sm text-slate-300 mb-4 font-medium">
              Unlock unlimited stories, voice cloning, and 4K images.
            </Text>
            <Pressable className="w-full py-3 rounded-xl bg-white items-center active:bg-slate-50">
              <Text className="text-slate-900 font-bold text-sm">View Plans</Text>
            </Pressable>
          </View>
        </View>

        <View className="gap-6">
          <View>
            <Text className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-2">
              App Settings
            </Text>
            <View className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <SettingItem
                icon={Bell}
                label="Notifications"
                iconColor="#3b82f6"
                iconBg="bg-blue-50"
                action={<Toggle checked={notifications} onChange={setNotifications} />}
              />
              <SettingItem
                icon={Volume2}
                label="Sound Effects"
                iconColor="#f43f5e"
                iconBg="bg-rose-50"
                action={<Toggle checked={sound} onChange={setSound} />}
              />
              <SettingItem
                icon={Moon}
                label="Dark Mode"
                iconColor="#6366f1"
                iconBg="bg-indigo-50"
                action={<Toggle checked={darkMode} onChange={setDarkMode} />}
              />
            </View>
          </View>

          <View>
            <Text className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-2">
              Account
            </Text>
            <View className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <SettingItem
                icon={Shield}
                label="Parental Controls"
                iconColor="#10b981"
                iconBg="bg-emerald-50"
                action={<ChevronRight size={20} color="#cbd5e1" />}
              />
              <SettingItem
                icon={CreditCard}
                label="Subscription"
                iconColor="#8b5cf6"
                iconBg="bg-purple-50"
                action={<ChevronRight size={20} color="#cbd5e1" />}
              />
            </View>
          </View>

          <View>
            <Text className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-2">
              Support
            </Text>
            <View className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <SettingItem
                icon={HelpCircle}
                label="Help & FAQ"
                iconColor="#f59e0b"
                iconBg="bg-amber-50"
                action={<ChevronRight size={20} color="#cbd5e1" />}
              />
              <SettingItem
                icon={Mail}
                label="Contact Us"
                iconColor="#06b6d4"
                iconBg="bg-cyan-50"
                action={<ChevronRight size={20} color="#cbd5e1" />}
              />
            </View>
          </View>

          <Pressable className="w-full py-4 rounded-3xl bg-slate-100 flex-row items-center justify-center gap-2 active:bg-slate-200">
            <LogOut size={16} color="#64748b" />
            <Text className="text-slate-600 font-bold text-sm">Log Out</Text>
          </Pressable>

          <View className="pb-8">
            <Text className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Version 1.2.0 (Build 405)
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
