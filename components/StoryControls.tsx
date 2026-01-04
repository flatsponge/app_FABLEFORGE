import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { Clock, BookOpen, Moon, Sun, Feather, Zap, Brain } from 'lucide-react-native';

export type StoryLength = 'short' | 'medium' | 'long';
export type StoryDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type StoryTime = 'day' | 'night';

interface StoryControlsProps {
  length: StoryLength;
  setLength: (l: StoryLength) => void;
  difficulty: StoryDifficulty;
  setDifficulty: (d: StoryDifficulty) => void;
  time: StoryTime;
  setTime: (t: StoryTime) => void;
}

const ControlSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <View className="mb-6">
    <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 pl-1">{title}</Text>
    {children}
  </View>
);

const LengthOption = ({
  label,
  value,
  selected,
  onSelect
}: {
  label: string;
  value: StoryLength;
  selected: boolean;
  onSelect: () => void;
}) => (
  <Pressable
    onPress={onSelect}
    className={`flex-1 p-3 rounded-xl border ${selected ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-100'} items-center active:scale-95`}
  >
    <View className={`w-full h-1.5 rounded-full mb-2 ${selected ? 'bg-indigo-500' : 'bg-slate-200'}`}
      style={{ width: value === 'short' ? '40%' : value === 'medium' ? '70%' : '100%' }}
    />
    <Text className={`text-xs font-bold ${selected ? 'text-indigo-600' : 'text-slate-500'}`}>{label}</Text>
  </Pressable>
);

const DifficultyOption = ({
  label,
  value,
  selected,
  onSelect,
  icon: Icon
}: {
  label: string;
  value: StoryDifficulty;
  selected: boolean;
  onSelect: () => void;
  icon: any;
}) => (
  <Pressable
    onPress={onSelect}
    className={`flex-1 p-3 rounded-xl border ${selected ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-100'} items-center gap-2 active:scale-95`}
  >
    <Icon size={16} color={selected ? '#059669' : '#94a3b8'} />
    <Text className={`text-xs font-bold ${selected ? 'text-emerald-700' : 'text-slate-500'}`}>{label}</Text>
  </Pressable>
);

const TimeOption = ({
  label,
  value,
  selected,
  onSelect,
  icon: Icon,
  color
}: {
  label: string;
  value: StoryTime;
  selected: boolean;
  onSelect: () => void;
  icon: any;
  color: string;
}) => (
  <Pressable
    onPress={onSelect}
    className={`flex-1 flex-row items-center justify-center gap-2 p-3 rounded-xl border ${selected ? `bg-${color}-50 border-${color}-200` : 'bg-white border-slate-100'} active:scale-95`}
  >
    <Icon size={18} color={selected ? (value === 'day' ? '#eab308' : '#6366f1') : '#94a3b8'} />
    <Text className={`text-sm font-bold ${selected ? (value === 'day' ? 'text-yellow-700' : 'text-indigo-700') : 'text-slate-500'}`}>{label}</Text>
  </Pressable>
);

export const StoryControls = ({
  length,
  setLength,
  difficulty,
  setDifficulty,
  time,
  setTime
}: StoryControlsProps) => {

  return (
    <View className="bg-white rounded-[40px] p-6 border border-slate-200 shadow-sm mb-8">

      <ControlSection title="Story Length">
        <View className="flex-row gap-3">
          <LengthOption label="Short" value="short" selected={length === 'short'} onSelect={() => setLength('short')} />
          <LengthOption label="Medium" value="medium" selected={length === 'medium'} onSelect={() => setLength('medium')} />
          <LengthOption label="Long" value="long" selected={length === 'long'} onSelect={() => setLength('long')} />
        </View>
      </ControlSection>

      <ControlSection title="Vocabulary Level">
        <View className="flex-row gap-3">
          <DifficultyOption
            label="Simple"
            value="beginner"
            selected={difficulty === 'beginner'}
            onSelect={() => setDifficulty('beginner')}
            icon={Feather}
          />
          <DifficultyOption
            label="Standard"
            value="intermediate"
            selected={difficulty === 'intermediate'}
            onSelect={() => setDifficulty('intermediate')}
            icon={BookOpen}
          />
          <DifficultyOption
            label="Rich"
            value="advanced"
            selected={difficulty === 'advanced'}
            onSelect={() => setDifficulty('advanced')}
            icon={Brain}
          />
        </View>
      </ControlSection>

      <View>
        <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 pl-1">Story Vibe</Text>
        <View className="flex-row gap-3">
          <TimeOption
            label="Playtime"
            value="day"
            selected={time === 'day'}
            onSelect={() => setTime('day')}
            icon={Sun}
            color="yellow"
          />
          <TimeOption
            label="Bedtime"
            value="night"
            selected={time === 'night'}
            onSelect={() => setTime('night')}
            icon={Moon}
            color="indigo"
          />
        </View>
      </View>

    </View>
  );
};
