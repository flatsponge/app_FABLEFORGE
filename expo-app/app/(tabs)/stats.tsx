import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import {
  Heart,
  Shield,
  ChevronLeft,
  Calendar as CalendarIcon,
  Flame,
  BookOpen,
  ThumbsUp,
  ThumbsDown,
  Scale,
  Users,
  Sun,
  ClipboardList,
  Puzzle,
  Hourglass,
  Search,
  Sparkles,
  TrendingUp,
} from 'lucide-react-native';
import Svg, { Circle, Path, Line, Defs, LinearGradient, Stop } from 'react-native-svg';
import { LucideIcon } from 'lucide-react-native';

interface SubSkill {
  name: string;
  value: number;
}

interface StoryImpact {
  id: number;
  title: string;
  coverGradient: string;
  date: string;
  impact: string;
  liked: boolean;
}

interface Skill {
  id: string;
  name: string;
  progress: number;
  color: string;
  bgClass: string;
  textColor: string;
  icon: LucideIcon;
  description: string;
  subSkills: SubSkill[];
  weeklyData: number[];
  contributingStories: StoryImpact[];
}

const SKILLS_DATA: Skill[] = [
  {
    id: 'empathy',
    name: 'Compassion & Empathy',
    progress: 85,
    color: '#F43F5E',
    bgClass: 'bg-rose-50',
    textColor: '#E11D48',
    icon: Heart,
    description: 'Understanding feelings and caring for others.',
    subSkills: [
      { name: 'Perspective', value: 90 },
      { name: 'Compassion', value: 75 },
      { name: 'Kindness', value: 85 },
    ],
    weeklyData: [40, 55, 45, 70, 65, 80, 85],
    contributingStories: [
      {
        id: 101,
        title: 'The Lonely Robot',
        coverGradient: 'bg-gradient-to-br from-blue-200 to-cyan-300',
        date: 'Yesterday',
        impact:
          'Leo learned how to identify when someone feels left out and why inviting them to play helps everyone feel included.',
        liked: true,
      },
    ],
  },
  {
    id: 'bravery',
    name: 'Bravery & Resilience',
    progress: 60,
    color: '#F59E0B',
    bgClass: 'bg-amber-50',
    textColor: '#D97706',
    icon: Shield,
    description: 'Understanding conflict and resolution.',
    subSkills: [
      { name: 'Confidence', value: 70 },
      { name: 'Grit', value: 50 },
      { name: 'Risk Taking', value: 60 },
    ],
    weeklyData: [30, 35, 50, 45, 60, 55, 60],
    contributingStories: [],
  },
  {
    id: 'honesty',
    name: 'Honesty',
    progress: 45,
    color: '#3B82F6',
    bgClass: 'bg-blue-50',
    textColor: '#2563EB',
    icon: Scale,
    description: 'Valuing truth and integrity.',
    subSkills: [
      { name: 'Truthfulness', value: 50 },
      { name: 'Trust', value: 40 },
      { name: 'Integrity', value: 45 },
    ],
    weeklyData: [20, 25, 30, 35, 40, 40, 45],
    contributingStories: [],
  },
  {
    id: 'teamwork',
    name: 'Teamwork',
    progress: 72,
    color: '#6366F1',
    bgClass: 'bg-indigo-50',
    textColor: '#4F46E5',
    icon: Users,
    description: 'Working together to solve problems.',
    subSkills: [
      { name: 'Cooperation', value: 80 },
      { name: 'Listening', value: 65 },
      { name: 'Support', value: 70 },
    ],
    weeklyData: [60, 65, 60, 70, 75, 70, 72],
    contributingStories: [],
  },
  {
    id: 'creativity',
    name: 'Creativity & Imagination',
    progress: 40,
    color: '#8B5CF6',
    bgClass: 'bg-violet-50',
    textColor: '#7C3AED',
    icon: Sparkles,
    description: 'World building and creative thinking.',
    subSkills: [
      { name: 'Visualization', value: 95 },
      { name: 'Storytelling', value: 80 },
      { name: 'Wonder', value: 70 },
    ],
    weeklyData: [70, 75, 80, 60, 85, 90, 80],
    contributingStories: [],
  },
  {
    id: 'gratitude',
    name: 'Gratitude',
    progress: 30,
    color: '#EAB308',
    bgClass: 'bg-yellow-50',
    textColor: '#CA8A04',
    icon: Sun,
    description: 'Appreciating the good things.',
    subSkills: [
      { name: 'Thankfulness', value: 40 },
      { name: 'Positivity', value: 30 },
      { name: 'Appreciation', value: 20 },
    ],
    weeklyData: [10, 15, 20, 25, 25, 30, 30],
    contributingStories: [],
  },
  {
    id: 'problem_solving',
    name: 'Problem Solving',
    progress: 55,
    color: '#14B8A6',
    bgClass: 'bg-teal-50',
    textColor: '#0D9488',
    icon: Puzzle,
    description: 'Finding solutions to challenges.',
    subSkills: [
      { name: 'Logic', value: 60 },
      { name: 'Strategy', value: 50 },
      { name: 'Analysis', value: 55 },
    ],
    weeklyData: [40, 45, 50, 50, 55, 50, 55],
    contributingStories: [],
  },
  {
    id: 'responsibility',
    name: 'Responsibility',
    progress: 20,
    color: '#64748B',
    bgClass: 'bg-slate-50',
    textColor: '#475569',
    icon: ClipboardList,
    description: 'Taking ownership of actions.',
    subSkills: [
      { name: 'Duty', value: 20 },
      { name: 'Reliability', value: 30 },
      { name: 'Ownership', value: 10 },
    ],
    weeklyData: [10, 10, 15, 15, 20, 20, 20],
    contributingStories: [],
  },
  {
    id: 'patience',
    name: 'Patience',
    progress: 35,
    color: '#10B981',
    bgClass: 'bg-emerald-50',
    textColor: '#059669',
    icon: Hourglass,
    description: 'Waiting calmly and self-control.',
    subSkills: [
      { name: 'Waiting', value: 40 },
      { name: 'Calmness', value: 35 },
      { name: 'Self-Control', value: 30 },
    ],
    weeklyData: [20, 25, 30, 30, 35, 35, 35],
    contributingStories: [],
  },
  {
    id: 'curiosity',
    name: 'Curiosity',
    progress: 88,
    color: '#06B6D4',
    bgClass: 'bg-cyan-50',
    textColor: '#0891B2',
    icon: Search,
    description: 'Eagerness to learn and explore.',
    subSkills: [
      { name: 'Inquiry', value: 90 },
      { name: 'Exploration', value: 85 },
      { name: 'Discovery', value: 90 },
    ],
    weeklyData: [70, 75, 80, 85, 85, 90, 88],
    contributingStories: [],
  },
];

const MiniProgressRing = ({
  progress,
  color,
  size = 52,
  stroke = 4,
}: {
  progress: number;
  color: string;
  size?: number;
  stroke?: number;
}) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={stroke}
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
};

const ReadingStreakWidget = () => {
  const currentWeek = [
    { day: 'M', status: 'done', date: 14 },
    { day: 'T', status: 'done', date: 15 },
    { day: 'W', status: 'done', date: 16 },
    { day: 'T', status: 'missed', date: 17 },
    { day: 'F', status: 'today', date: 18 },
    { day: 'S', status: 'future', date: 19 },
    { day: 'S', status: 'future', date: 20 },
  ];

  return (
    <View className="bg-white p-6 rounded-3xl shadow-sm mb-8">
      <View className="flex-row justify-between items-center mb-6">
        <View className="flex-row items-center gap-2">
          <CalendarIcon size={20} color="#94a3b8" />
          <Text className="font-bold text-slate-700 text-sm">Reading Consistency</Text>
        </View>
        <View className="flex-row items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
          <Flame size={14} color="#f97316" fill="#f97316" />
          <Text className="text-[10px] font-bold text-orange-700 uppercase tracking-wide">
            3 Day Streak
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center px-1">
        {currentWeek.map((d, i) => (
          <View key={i} className="items-center gap-3">
            <Text className="text-[10px] font-bold text-slate-300">{d.day}</Text>
            <View
              className={`w-9 h-9 rounded-full items-center justify-center ${
                d.status === 'done'
                  ? 'bg-slate-800'
                  : d.status === 'today'
                    ? 'bg-white border-4 border-indigo-50 shadow-sm'
                    : d.status === 'missed'
                      ? 'bg-slate-50'
                      : ''
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  d.status === 'done'
                    ? 'text-white'
                    : d.status === 'today'
                      ? 'text-indigo-700'
                      : d.status === 'missed'
                        ? 'text-slate-300'
                        : 'text-slate-200'
                }`}
              >
                {d.date}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const SkillRow = ({ skill, onPress }: { skill: Skill; onPress: () => void }) => {
  const IconComponent = skill.icon;

  return (
    <Pressable
      onPress={onPress}
      className="bg-white rounded-3xl p-5 mb-4 shadow-sm flex-row items-center justify-between border border-slate-50 active:scale-[0.99]"
    >
      <View className="flex-row items-center gap-5 flex-1">
        <View className={`w-12 h-12 rounded-2xl ${skill.bgClass} items-center justify-center`}>
          <IconComponent size={24} color={skill.textColor} />
        </View>

        <View className="flex-1">
          <Text className="text-base font-bold text-slate-800 leading-tight" numberOfLines={1}>
            {skill.name}
          </Text>
          <Text className="text-xs font-medium text-slate-400" numberOfLines={1}>
            {skill.description}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-3">
        <View className="relative items-center justify-center">
          <MiniProgressRing progress={skill.progress} color={skill.color} />
          <View className="absolute">
            <Text className="text-[11px] font-bold text-slate-700">{skill.progress}%</Text>
          </View>
        </View>
        <ChevronLeft
          size={16}
          color="#cbd5e1"
          style={{ transform: [{ rotate: '180deg' }] }}
        />
      </View>
    </Pressable>
  );
};

const DetailView = ({ skill, onBack }: { skill: Skill; onBack: () => void }) => {
  const IconComponent = skill.icon;
  const size = 200;
  const center = size / 2;
  const radius = 80;
  const strokeWidth = 14;

  const ringRadius = (size - strokeWidth) / 2 - 20;
  const circumference = 2 * Math.PI * ringRadius;
  const offset = circumference - (skill.progress / 100) * circumference;

  const maxVal = Math.max(...skill.weeklyData, 100);
  const chartWidth = 300;
  const chartHeight = 100;
  const padding = 5;

  const points = skill.weeklyData.map((val, i) => {
    const x = (i / (skill.weeklyData.length - 1)) * chartWidth;
    const y = chartHeight - (val / maxVal) * (chartHeight - padding * 2) - padding;
    return { x, y };
  });

  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cp1x = prev.x + (curr.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (curr.x - prev.x) / 2;
    const cp2y = curr.y;
    pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-6 pt-14 pb-4 flex-row items-center justify-between">
        <Pressable
          onPress={onBack}
          className="w-10 h-10 rounded-full bg-white border border-slate-200 items-center justify-center shadow-sm active:scale-95"
        >
          <ChevronLeft size={20} color="#475569" />
        </Pressable>
        <Text className="font-bold text-slate-800 text-lg">{skill.name}</Text>
        <View className={`w-10 h-10 rounded-full ${skill.bgClass} items-center justify-center`}>
          <IconComponent size={20} color={skill.textColor} />
        </View>
      </View>

      <View className="px-6 pt-6 gap-6">
        <View className="bg-white p-6 rounded-[40px] shadow-sm items-center">
          <View className="relative mb-8" style={{ width: size, height: size }}>
            <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
              <Circle
                cx={center}
                cy={center}
                r={ringRadius}
                fill="none"
                stroke="#F1F5F9"
                strokeWidth={strokeWidth}
              />
              <Circle
                cx={center}
                cy={center}
                r={ringRadius}
                fill="none"
                stroke={skill.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={offset}
                strokeLinecap="round"
              />
            </Svg>

            <View className="absolute inset-0 items-center justify-center">
              <IconComponent size={20} color={skill.textColor} />
              <Text className="text-4xl font-black text-slate-800 tracking-tight leading-none mt-1.5">
                {skill.progress}%
              </Text>
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Mastery
              </Text>
            </View>
          </View>

          <View className="w-full gap-3">
            {skill.subSkills.map((sub, i) => (
              <View
                key={i}
                className="flex-row items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100"
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-6 h-6 rounded-full bg-white shadow-sm items-center justify-center border border-slate-100">
                    <Text className="text-[10px] font-bold text-slate-400">{i + 1}</Text>
                  </View>
                  <Text className="text-sm font-bold text-slate-700">{sub.name}</Text>
                </View>
                <View className="flex-row items-center gap-2.5">
                  <View className="h-1.5 w-16 bg-slate-200 rounded-full overflow-hidden">
                    <View
                      className="h-full rounded-full"
                      style={{ width: `${sub.value}%`, backgroundColor: skill.color }}
                    />
                  </View>
                  <Text className="text-xs font-bold text-slate-600 w-8 text-right">
                    {sub.value}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className="bg-white p-6 rounded-3xl shadow-sm">
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="font-bold text-slate-800 text-sm">30 Day Trend</Text>
              <Text className="text-[10px] text-slate-400 font-medium">
                Consistent growth observed
              </Text>
            </View>
            <View className="flex-row items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full">
              <TrendingUp size={12} color="#059669" />
              <Text className="text-[10px] font-bold text-emerald-600">+12%</Text>
            </View>
          </View>

          <View className="h-32 w-full">
            <Svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
              <Defs>
                <LinearGradient id={`gradient-${skill.id}`} x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor={skill.color} stopOpacity={0.2} />
                  <Stop offset="100%" stopColor={skill.color} stopOpacity={0} />
                </LinearGradient>
              </Defs>
              <Line x1="0" y1="25" x2={chartWidth} y2="25" stroke="#f8fafc" strokeWidth="1" />
              <Line x1="0" y1="50" x2={chartWidth} y2="50" stroke="#f8fafc" strokeWidth="1" />
              <Line x1="0" y1="75" x2={chartWidth} y2="75" stroke="#f8fafc" strokeWidth="1" />
              <Path
                d={`${pathD} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`}
                fill={`url(#gradient-${skill.id})`}
              />
              <Path
                d={pathD}
                fill="none"
                stroke={skill.color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
          <View className="flex-row justify-between mt-4 px-1">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <Text key={i} className="text-[10px] text-slate-300 font-bold">
                {d}
              </Text>
            ))}
          </View>
        </View>

        <View className="pb-8">
          <Text className="font-bold text-slate-800 text-sm mb-4 px-1 uppercase tracking-wider opacity-60">
            Contributing Stories
          </Text>
          <View className="gap-4">
            {skill.contributingStories.map(story => (
              <View
                key={story.id}
                className="bg-white p-4 rounded-3xl shadow-sm border border-slate-50 flex-row gap-4"
              >
                <View className="w-16 h-20 rounded-2xl bg-gradient-to-br from-blue-200 to-cyan-300 items-center justify-center">
                  <BookOpen size={24} color="white" />
                </View>
                <View className="flex-1 py-1">
                  <View className="flex-row justify-between items-start mb-2">
                    <View>
                      <Text className="font-bold text-slate-800 text-sm leading-tight mb-0.5">
                        {story.title}
                      </Text>
                      <Text className="text-[10px] text-slate-400 font-medium">{story.date}</Text>
                    </View>
                    <View
                      className={`w-8 h-8 rounded-full items-center justify-center ${story.liked ? 'bg-green-50' : 'bg-red-50'}`}
                    >
                      {story.liked ? (
                        <ThumbsUp size={16} color="#22c55e" />
                      ) : (
                        <ThumbsDown size={16} color="#f87171" />
                      )}
                    </View>
                  </View>
                  <View className="bg-slate-50 rounded-xl p-3">
                    <Text className="text-xs text-slate-600 leading-relaxed font-medium">
                      {story.impact}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
            {skill.contributingStories.length === 0 && (
              <View className="p-8 items-center">
                <Text className="text-slate-400 text-sm">
                  No stories contributing to this skill yet.
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default function StatsScreen() {
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const selectedSkill = SKILLS_DATA.find(s => s.id === selectedSkillId);

  if (selectedSkill) {
    return <DetailView skill={selectedSkill} onBack={() => setSelectedSkillId(null)} />;
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-6 pt-14 pb-8 flex-row justify-between items-center">
        <View>
          <Text className="text-2xl font-bold text-slate-900 leading-tight">Leo's Growth</Text>
          <Text className="text-sm font-medium text-slate-500 mt-1">
            Impact from 12 books read
          </Text>
        </View>
        <View className="w-12 h-12 rounded-full bg-white border-2 border-slate-100 items-center justify-center shadow-sm">
          <Text className="font-black text-xs text-slate-700 tracking-wider">LEO</Text>
        </View>
      </View>

      <View className="px-6">
        <ReadingStreakWidget />

        <View className="mb-8">
          <View className="flex-row items-center gap-2 mb-5 px-1">
            <BookOpen size={16} color="#94a3b8" />
            <Text className="font-bold text-slate-700 text-sm uppercase tracking-wider">
              Core Values & Skills
            </Text>
          </View>

          <View>
            {SKILLS_DATA.map(skill => (
              <SkillRow
                key={skill.id}
                skill={skill}
                onPress={() => setSelectedSkillId(skill.id)}
              />
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
