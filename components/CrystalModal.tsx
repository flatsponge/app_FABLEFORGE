import React from 'react';
import { View, Text, ScrollView, Pressable, Modal } from 'react-native';
import {
    X,
    Clock,
    BatteryCharging,
    Check,
    Diamond,
    Zap,
    Infinity,
    Crown,
} from 'lucide-react-native';
import { AnimatedGradientBorder } from './AnimatedGradientBorder';
import {
    REGEN_TIME_SECONDS,
    CRYSTAL_PURCHASE_OPTIONS,
    STORYMAX_PRICE,
} from '@/constants/crystals';

interface CrystalModalProps {
    visible: boolean;
    balance: number;
    max: number;
    timeToNext: number;
    onClose: () => void;
    onRefill: (amount: number) => void;
}

/**
 * Modal displaying crystal balance, regeneration timers,
 * StoryMAX subscription offer, and crystal top-up options.
 */
export const CrystalModal = ({
    visible,
    balance,
    max,
    timeToNext,
    onClose,
    onRefill,
}: CrystalModalProps) => {
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

                    {/* Header Section - Balance Display */}
                    <View className="bg-white p-8 pb-10 border-b border-slate-100 relative overflow-hidden">


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

                    {/* Content Section */}
                    <View className="p-6 gap-6 bg-white">
                        {/* StoryMAX Premium Offer */}
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
                                        <Text className="text-xs text-slate-900/70">{STORYMAX_PRICE}</Text>
                                    </View>
                                </Pressable>
                            </View>
                        </AnimatedGradientBorder>

                        {/* Divider */}
                        <View className="flex-row items-center gap-4">
                            <View className="h-px bg-slate-100 flex-1" />
                            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Or Top Up</Text>
                            <View className="h-px bg-slate-100 flex-1" />
                        </View>

                        {/* Crystal Purchase Options */}
                        <View className="flex-row gap-4">
                            <Pressable
                                onPress={() => onRefill(CRYSTAL_PURCHASE_OPTIONS.small.amount)}
                                className="flex-1 bg-slate-50 p-4 rounded-3xl border border-slate-200 items-center gap-3 active:scale-95"
                            >
                                <View className="w-12 h-12 bg-white rounded-full items-center justify-center">
                                    <Diamond size={24} color="#22d3ee" fill="#22d3ee" />
                                </View>
                                <View className="items-center">
                                    <Text className="font-bold text-slate-800 text-lg">{CRYSTAL_PURCHASE_OPTIONS.small.amount}</Text>
                                    <Text className="text-xs font-bold text-slate-400">Crystals</Text>
                                </View>
                                <View className="bg-slate-900 px-4 py-2 rounded-full w-full items-center">
                                    <Text className="text-white text-xs font-bold">{CRYSTAL_PURCHASE_OPTIONS.small.price}</Text>
                                </View>
                            </Pressable>

                            <Pressable
                                onPress={() => onRefill(CRYSTAL_PURCHASE_OPTIONS.large.amount)}
                                className="flex-1 bg-slate-50 p-4 rounded-3xl border border-slate-200 items-center gap-3 active:scale-95 relative overflow-hidden"
                            >
                                <View className="absolute top-0 right-0 bg-rose-500 px-2 py-1 rounded-bl-xl">
                                    <Text className="text-white text-[9px] font-bold">POPULAR</Text>
                                </View>
                                <View className="w-12 h-12 bg-white rounded-full items-center justify-center">
                                    <Diamond size={24} color="#06b6d4" fill="#06b6d4" />
                                </View>
                                <View className="items-center">
                                    <Text className="font-bold text-slate-800 text-lg">{CRYSTAL_PURCHASE_OPTIONS.large.amount}</Text>
                                    <Text className="text-xs font-bold text-slate-400">Crystals</Text>
                                </View>
                                <View className="bg-slate-900 px-4 py-2 rounded-full w-full items-center">
                                    <Text className="text-white text-xs font-bold">{CRYSTAL_PURCHASE_OPTIONS.large.price}</Text>
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
