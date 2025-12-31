import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Star, Moon, Cloud, Sparkles } from 'lucide-react-native';
import { CATEGORIES } from '../constants/data';

const ICON_COLOR_MAP: Record<string, string> = {
  'text-orange-600': '#ea580c',
  'text-indigo-600': '#4f46e5',
  'text-blue-600': '#2563eb',
  'text-pink-600': '#db2777',
};

const CategoryIcon = ({ iconName, color }: { iconName: string; color: string }) => {
  const iconProps = { size: 20, color, strokeWidth: 2 };
  switch (iconName) {
    case 'Star': return <Star {...iconProps} />;
    case 'Moon': return <Moon {...iconProps} />;
    case 'Cloud': return <Cloud {...iconProps} />;
    case 'Sparkles': return <Sparkles {...iconProps} />;
    default: return <Star {...iconProps} />;
  }
};

export const CategoryRail: React.FC = () => (
  <View className="mb-8 pl-6">
    <Text className="text-lg font-bold text-slate-700 mb-4 pr-6">Explore Worlds</Text>
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingRight: 24, gap: 16 }}
    >
      {CATEGORIES.map((cat) => (
        <Pressable 
          key={cat.id} 
          className={`items-center justify-center w-24 h-24 rounded-3xl ${cat.color} active:scale-95`}
        >
          <View className="mb-2 bg-white/60 p-2 rounded-full">
            <CategoryIcon iconName={cat.iconName} color={ICON_COLOR_MAP[cat.text] || '#64748b'} />
          </View>
          <Text className={`text-xs font-bold ${cat.text}`}>{cat.name}</Text>
        </Pressable>
      ))}
    </ScrollView>
  </View>
);
