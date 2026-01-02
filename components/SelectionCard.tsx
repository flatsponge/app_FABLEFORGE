import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type SelectionCardProps = {
    title: string;
    description?: string;
    icon?: keyof typeof Ionicons.glyphMap;
    selected: boolean;
    onPress: () => void;
    index?: number;
};

export function SelectionCard({
    title,
    description,
    icon,
    selected,
    onPress,
    index = 0
}: SelectionCardProps) {
    return (
        <View
            className="mb-3"
        >
            <Pressable
                onPress={onPress}
                className={`p-5 rounded-2xl border-2 flex-row items-center ${selected
                    ? 'bg-primary-50 border-primary-500'
                    : 'bg-white border-gray-100'
                    }`}
            >
                {icon && (
                    <View className={`mr-4 p-3 rounded-xl ${selected ? 'bg-primary-100' : 'bg-gray-50'}`}>
                        <Ionicons
                            name={icon}
                            size={24}
                            color={selected ? '#9333ea' : '#6b7280'}
                        />
                    </View>
                )}

                <View className="flex-1">
                    <Text className={`text-lg font-semibold mb-1 ${selected ? 'text-primary-900' : 'text-gray-900'}`}>
                        {title}
                    </Text>
                    {description && (
                        <Text className={`text-sm ${selected ? 'text-primary-700' : 'text-gray-500'}`}>
                            {description}
                        </Text>
                    )}
                </View>

                <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${selected ? 'border-primary-600 bg-primary-600' : 'border-gray-200'
                    }`}>
                    {selected && (
                        <Ionicons name="checkmark" size={16} color="white" />
                    )}
                </View>
            </Pressable>
        </View>
    );
}
