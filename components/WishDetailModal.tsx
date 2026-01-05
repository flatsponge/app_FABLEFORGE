import React from 'react';
import { View, Text, ScrollView, Pressable, Modal } from 'react-native';
import { X, Calendar, Check, FileText, Mic, Wand2 } from 'lucide-react-native';
import { MotiView } from 'moti';
import { Wish } from '@/types';

interface WishDetailModalProps {
    visible: boolean;
    wish: Wish | null;
    isSelected: boolean;
    onClose: () => void;
    onUse: (wish: Wish) => void;
}

/**
 * Modal displaying detailed information about a wish from the Wishing Well.
 * Allows parents to view wish details and select it for story creation.
 */
export const WishDetailModal = ({
    visible,
    wish,
    isSelected,
    onClose,
    onUse,
}: WishDetailModalProps) => {
    if (!wish) return null;

    return (
        <Modal visible={visible} transparent animationType="none">
            <View className="flex-1 items-center justify-center px-6">
                {/* Animated backdrop */}
                <MotiView
                    from={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: 'timing', duration: 200 }}
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                    className="bg-black/50"
                >
                    <Pressable className="flex-1" onPress={onClose} />
                </MotiView>

                {/* Animated centered card */}
                <MotiView
                    from={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'timing', duration: 200 }}
                    className="w-full max-w-sm"
                >
                    <View className="bg-white rounded-3xl overflow-hidden">
                        {/* Header accent */}
                        <View className={`px-6 pt-6 pb-4 ${wish.type === 'audio' ? 'bg-rose-50' : 'bg-indigo-50'}`}>
                            <View className="flex-row items-start justify-between">
                                <View className={`w-12 h-12 rounded-2xl items-center justify-center ${wish.type === 'audio' ? 'bg-rose-100' : 'bg-indigo-100'}`}>
                                    {wish.type === 'audio' ? (
                                        <Mic size={24} color="#f43f5e" />
                                    ) : (
                                        <FileText size={24} color="#6366f1" />
                                    )}
                                </View>
                                <Pressable
                                    onPress={onClose}
                                    className="w-8 h-8 rounded-full bg-black/5 items-center justify-center"
                                >
                                    <X size={18} color="#64748b" />
                                </Pressable>
                            </View>
                            <Text className={`text-xs font-bold uppercase tracking-wider mt-3 ${wish.type === 'audio' ? 'text-rose-500' : 'text-indigo-500'}`}>
                                {wish.type === 'audio' ? 'Voice Recording' : 'Written Wish'}
                            </Text>
                        </View>

                        {/* Content */}
                        <View className="px-6 py-5">
                            <Text className="text-xl font-extrabold text-slate-800 leading-tight mb-2">
                                "{wish.text}"
                            </Text>

                            {wish.detail && wish.detail !== wish.text && (
                                <Text className="text-sm text-slate-500 leading-relaxed mb-3">
                                    {wish.detail}
                                </Text>
                            )}

                            <View className="flex-row items-center gap-2">
                                <Calendar size={12} color="#94a3b8" />
                                <Text className="text-xs font-medium text-slate-400">{wish.createdAt}</Text>
                                {wish.isNew && (
                                    <View className="bg-rose-500 px-1.5 py-0.5 rounded ml-1">
                                        <Text className="text-[8px] font-bold text-white">NEW</Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        {/* Action */}
                        <View className="px-6 pb-6">
                            {isSelected ? (
                                <View className="bg-emerald-50 py-3.5 rounded-xl items-center border border-emerald-100">
                                    <View className="flex-row items-center gap-2">
                                        <Check size={16} color="#059669" />
                                        <Text className="text-emerald-700 font-bold text-sm">Already using this wish</Text>
                                    </View>
                                </View>
                            ) : (
                                <Pressable
                                    onPress={() => onUse(wish)}
                                    className="w-full py-3.5 rounded-xl bg-purple-500 flex-row items-center justify-center gap-2 active:scale-[0.98]"
                                >
                                    <Wand2 size={16} color="#ffffff" />
                                    <Text className="text-white font-bold text-sm">Use in Story</Text>
                                </Pressable>
                            )}
                        </View>
                    </View>
                </MotiView>
            </View>
        </Modal>
    );
};
