import { Category, AvatarItem, PresetLocation, Friend, VoicePreset } from '../types';

import { Heart, Shield, Scale, Hourglass, Users, Search, Sun, ClipboardList, Puzzle, Sparkles } from 'lucide-react-native';
import { LucideIcon } from 'lucide-react-native';

// Core values interface matching Growth screen skills
export interface CoreValue {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  textColor: string;
  description: string;
}

// Unified core values - single source of truth for both Asset selection and Growth tracking
export const CORE_VALUES: CoreValue[] = [
  {
    id: 'empathy',
    name: 'Compassion & Empathy',
    icon: Heart,
    color: '#F43F5E',
    bgColor: '#fff1f2',
    textColor: '#E11D48',
    description: 'Understanding feelings and caring for others.',
  },
  {
    id: 'bravery',
    name: 'Bravery & Resilience',
    icon: Shield,
    color: '#F59E0B',
    bgColor: '#fffbeb',
    textColor: '#D97706',
    description: 'Finding courage and overcoming challenges.',
  },
  {
    id: 'honesty',
    name: 'Honesty',
    icon: Scale,
    color: '#3B82F6',
    bgColor: '#eff6ff',
    textColor: '#2563EB',
    description: 'Valuing truth and integrity.',
  },
  {
    id: 'teamwork',
    name: 'Teamwork',
    icon: Users,
    color: '#6366F1',
    bgColor: '#eef2ff',
    textColor: '#4F46E5',
    description: 'Working together to solve problems.',
  },
  {
    id: 'creativity',
    name: 'Creativity & Imagination',
    icon: Sparkles,
    color: '#8B5CF6',
    bgColor: '#faf5ff',
    textColor: '#7C3AED',
    description: 'Exploring ideas and creative thinking.',
  },
  {
    id: 'gratitude',
    name: 'Gratitude',
    icon: Sun,
    color: '#EAB308',
    bgColor: '#fefce8',
    textColor: '#CA8A04',
    description: 'Appreciating the good things in life.',
  },
  {
    id: 'problem_solving',
    name: 'Problem Solving',
    icon: Puzzle,
    color: '#14B8A6',
    bgColor: '#f0fdfa',
    textColor: '#0D9488',
    description: 'Finding solutions to challenges.',
  },
  {
    id: 'responsibility',
    name: 'Responsibility',
    icon: ClipboardList,
    color: '#64748B',
    bgColor: '#f8fafc',
    textColor: '#475569',
    description: 'Taking ownership of your actions.',
  },
  {
    id: 'patience',
    name: 'Patience',
    icon: Hourglass,
    color: '#10B981',
    bgColor: '#ecfdf5',
    textColor: '#059669',
    description: 'Waiting calmly and practicing self-control.',
  },
  {
    id: 'curiosity',
    name: 'Curiosity',
    icon: Search,
    color: '#06B6D4',
    bgColor: '#ecfeff',
    textColor: '#0891B2',
    description: 'Eagerness to learn and explore.',
  },
];

// Legacy alias for backward compatibility
export const FOCUS_VALUES = CORE_VALUES.map(v => ({
  id: v.id,
  name: v.name,
  icon: v.icon,
  bgColor: v.bgColor,
  iconColor: v.color,
  desc: v.description,
}));

export const CATEGORIES: Category[] = [
  { id: 'animals', name: 'Animals', color: 'bg-orange-50', text: 'text-orange-600', iconName: 'Star' },
  { id: 'space', name: 'Space', color: 'bg-indigo-50', text: 'text-indigo-600', iconName: 'Moon' },
  { id: 'bedtime', name: 'Bedtime', color: 'bg-blue-50', text: 'text-blue-600', iconName: 'Cloud' },
  { id: 'fantasy', name: 'Magic', color: 'bg-pink-50', text: 'text-pink-600', iconName: 'Sparkles' },
];





export const OUTFITS: AvatarItem[] = [
  { 
    id: 'shirt-blue', 
    type: 'Casual', 
    image: require('../assets/avatar/items/shirt_blue.png'),
    aiDescription: 'a casual blue t-shirt',
  },
  { 
    id: 'dress-green', 
    type: 'Party', 
    image: require('../assets/avatar/items/dress_green.png'),
    aiDescription: 'an elegant green party dress',
  },
];

export const HATS: AvatarItem[] = [
  { 
    id: 'crown-gold', 
    label: 'Royal', 
    image: require('../assets/avatar/items/crown_gold.png'),
    aiDescription: 'a shiny golden royal crown',
  },
  { 
    id: 'hat-blue', 
    label: 'Sporty', 
    image: require('../assets/avatar/items/hat_blue.png'),
    aiDescription: 'a sporty blue cap',
  },
];

export const TOYS: AvatarItem[] = [
  { 
    id: 'sunglasses', 
    image: require('../assets/avatar/items/sunglasses.png'),
    aiDescription: 'cool stylish sunglasses',
  },
  { 
    id: 'necklace', 
    image: require('../assets/avatar/items/necklace.png'),
    aiDescription: 'a sparkly necklace',
  },
];

export const PRESET_LOCATIONS: PresetLocation[] = [
  { id: 'loc-1', name: 'Magic Castle', image: require('../assets/places/magic_castle.png'), cost: 2 },
  { id: 'loc-2', name: 'Deep Space', image: require('../assets/places/deep_space.png'), cost: 3 },
  { id: 'loc-3', name: 'Candy Land', image: require('../assets/places/candy_land.png'), cost: 2 },
  { id: 'loc-4', name: 'Dino Valley', image: require('../assets/places/dino_valley.png'), cost: 2 },
];

export const FRIENDS: Friend[] = [
  { id: 'char-1', name: 'Barky', type: 'Dog', color: 'bg-orange-100', icon: '🐶', cost: 1 },
  { id: 'char-2', name: 'Whiskers', type: 'Cat', color: 'bg-slate-200', icon: '🐱', cost: 1 },
  { id: 'char-3', name: 'Hooty', type: 'Owl', color: 'bg-amber-100', icon: '🦉', cost: 2 },
  { id: 'char-4', name: 'Robo', type: 'Robot', color: 'bg-cyan-100', icon: '🤖', cost: 2 },
];

export const VOICE_PRESETS: VoicePreset[] = [
  { id: 'v1', name: 'Nana', style: 'Warm & Cozy', icon: '👵', cost: 0, color: 'bg-rose-100 text-rose-600' },
  { id: 'v2', name: 'Cosmo', style: 'Energetic', icon: '🤖', cost: 2, color: 'bg-blue-100 text-blue-600' },
  { id: 'v3', name: 'Luna', style: 'Soft & Sleepy', icon: '🧚‍♀️', cost: 2, color: 'bg-purple-100 text-purple-600' },
  { id: 'v4', name: 'Captain', style: 'Adventurous', icon: '🏴‍☠️', cost: 2, color: 'bg-amber-100 text-amber-600' },
];

export const BASE_AVATARS = [
  { id: 'bears', name: 'Bear', image: require('../assets/avatar/basestarter/bears.png') },
  { id: 'dinosaurs', name: 'Dino', image: require('../assets/avatar/basestarter/dinosaurs.png') },
  { id: 'dogs', name: 'Dog', image: require('../assets/avatar/basestarter/dogs.png') },
  { id: 'foxes', name: 'Fox', image: require('../assets/avatar/basestarter/foxes.png') },
  { id: 'pandas', name: 'Panda', image: require('../assets/avatar/basestarter/pandas.png') },
  { id: 'rabbit', name: 'Rabbit', image: require('../assets/avatar/basestarter/rabbit.png') },
  { id: 'unicorns', name: 'Unicorn', image: require('../assets/avatar/basestarter/unicorns.png') },
];
