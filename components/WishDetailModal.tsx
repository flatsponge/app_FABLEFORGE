import React from 'react';
import { View, Text, ScrollView, Pressable, Modal } from 'react-native';
import { X, Sparkles, Calendar, Check } from 'lucide-react-native';
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
        <Modal visible={visible} transparent animationType="slide">
            <View className="flex-1 bg-black/60 justify-end">
                <View className="bg-white rounded-t-[32px] p-6 max-h-[80%]">
                    <Pressable
                        onPress={onClose}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/5 items-center justify-center"
                    >
                        <X size={18} color="#64748b" />
                    </Pressable>

                    <View className="items-start mb-4">
                        <View className="flex-row items-center gap-2 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                            <Sparkles size={12} color="#a855f7" />
                            <Text className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Wish Details</Text>
                        </View>
                    </View>

                    <ScrollView className="mb-6">
                        <Text className="text-2xl font-extrabold text-slate-800 leading-tight mb-3">
                            {wish.text}
                        </Text>
                        <Text className="text-sm text-slate-600 leading-relaxed font-medium mb-4">
                            {wish.detail || wish.text}
                        </Text>
                        <View className="flex-row items-center gap-2">
                            <Calendar size={12} color="#94a3b8" />
                            <Text className="text-xs font-bold text-slate-400">{wish.createdAt}</Text>
                            {wish.isNew && (
                                <View className="bg-purple-500 px-2 py-0.5 rounded">
                                    <Text className="text-[8px] font-bold text-white uppercase">New</Text>
                                </View>
                            )}
                        </View>
                    </ScrollView>

                    {isSelected ? (
                        <View className="bg-emerald-50 py-3 rounded-2xl items-center border border-emerald-100">
                            <View className="flex-row items-center gap-2">
                                <Check size={16} color="#059669" />
                                <Text className="text-emerald-700 font-bold text-sm">Selected for this story</Text>
                            </View>
                        </View>
                    ) : (
                        <Pressable
                            onPress={() => onUse(wish)}
                            className="w-full py-4 rounded-2xl bg-purple-500 items-center active:scale-95"
                        >
                            <Text className="text-white font-bold text-sm">Use this Wish</Text>
                        </Pressable>
                    )}
                </View>
            </View>
        </Modal>
    );
};
