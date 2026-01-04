import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronRight, TrendingUp } from 'lucide-react-native';
import { GrowthScoreArcCompact } from './GrowthScoreArc';

interface FulfillmentTrackerProps {
  score?: number;
  onPress?: () => void;
}

export const FulfillmentTracker: React.FC<FulfillmentTrackerProps> = ({
  score = 84,
  onPress,
}) => {
  const remaining = 100 - score;

  const getStatusLabel = () => {
    if (score >= 80) return 'Well Adjusted';
    if (score >= 60) return 'Growing';
    if (score >= 40) return 'Developing';
    return 'Emerging';
  };

  return (
    <View className="px-6 mb-6">
      <Pressable
        onPress={onPress}
        className="bg-white py-3 px-4 pr-5 rounded-[28px] border border-slate-100 shadow-sm flex-row items-center justify-between active:scale-[0.99]"
      >
        <View className="flex-row items-center gap-4">
          <View className="relative w-[52px] h-[52px] items-center justify-center">
            <GrowthScoreArcCompact score={score} size={52} />

            <View className="absolute inset-0 items-center justify-center" style={{ paddingTop: 4 }}>
              <TrendingUp size={18} color="#0ea5e9" />
            </View>
          </View>

          <View className="flex-col">
            <View className="flex-row items-center gap-2 mb-0.5">
              <Text className="text-xl font-black text-slate-800 tracking-tight leading-none">
                {score}%
              </Text>
              <View className="bg-cyan-50 px-1.5 py-0.5 rounded-md border border-cyan-100">
                <Text className="text-[9px] font-bold text-cyan-600 uppercase tracking-wide">
                  {getStatusLabel()}
                </Text>
              </View>
            </View>
            <Text className="text-[10px] font-bold text-slate-400">
              {remaining}% left to{' '}
              <Text className="text-slate-600">Optimal Score</Text>
            </Text>
          </View>
        </View>

        <View className="w-8 h-8 rounded-full bg-slate-50 items-center justify-center">
          <ChevronRight size={20} color="#cbd5e1" />
        </View>
      </Pressable>
    </View>
  );
};
