import { Book, Category, AvatarItem, PresetLocation, Friend, VoicePreset, Wish } from '../types';

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

export const BOOKS: Book[] = [
  {
    id: 1,
    title: "The Sleepy Moon",
    author: "",
    progress: 45,
    color: "from-indigo-400 to-purple-500",
    coverImage: "https://images.unsplash.com/photo-1494022299300-899b96e49893?auto=format&fit=crop&w=600&q=80",
    iconName: 'Moon',
    userRating: 'up',
    duration: "5 min",
    description: "Join the Moon on a gentle journey through the night sky as he says goodnight to all his starry friends. Perfect for winding down.",
    vocabularyLevel: 'Beginner',
    generatedDate: "2 days ago"
  },
  {
    id: 2,
    title: "Dino's Big Roar",
    author: "",
    progress: 0,
    color: "from-green-400 to-teal-500",
    coverImage: "https://images.unsplash.com/photo-1552345391-7f999676e6d1?auto=format&fit=crop&w=600&q=80",
    iconName: 'Volume2',
    userRating: null,
    duration: "8 min",
    description: "Dino is a little T-Rex with a tiny voice. Follow him on a prehistoric adventure as he finds his courage and his big, loud roar!",
    vocabularyLevel: 'Intermediate',
    generatedDate: "Yesterday"
  },
  {
    id: 3,
    title: "Princess & Pea",
    author: "",
    progress: 10,
    color: "from-pink-400 to-rose-500",
    coverImage: "https://images.unsplash.com/photo-1595168863620-f46399a6e12e?auto=format&fit=crop&w=600&q=80",
    iconName: 'Star',
    userRating: 'up',
    duration: "12 min",
    description: "A classic tale retold! Can a real princess feel a tiny pea under twenty mattresses? A story about sensitivity and truth.",
    vocabularyLevel: 'Advanced',
    generatedDate: "Last week"
  },
  {
    id: 4,
    title: "Rocket Zoom",
    author: "",
    progress: 0,
    color: "from-blue-400 to-cyan-500",
    coverImage: "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=600&q=80",
    iconName: 'Sun',
    userRating: null,
    duration: "6 min",
    description: "3... 2... 1... Blast off! Rocket is the fastest ship in the galaxy. Join him as he visits colorful planets and meets alien friends.",
    vocabularyLevel: 'Beginner',
    generatedDate: "Just now"
  },
  {
    id: 5,
    title: "The Magic Forest",
    author: "",
    progress: 60,
    color: "from-orange-300 via-rose-300 to-purple-300",
    coverImage: "https://images.unsplash.com/photo-1448375240586-dfd8d395ea6c?auto=format&fit=crop&w=600&q=80",
    iconName: 'Sparkles',
    userRating: 'up',
    duration: "15 min",
    description: "Discover the secrets of the Magic Forest where trees whisper ancient stories and glowing creatures light up the path to adventure.",
    vocabularyLevel: 'Intermediate',
    generatedDate: "3 days ago"
  },
  {
    id: 6,
    title: "The Shy Ghost",
    author: "",
    progress: 0,
    color: "from-slate-400 to-slate-600",
    coverImage: "https://images.unsplash.com/photo-1623945193498-89c564347712?auto=format&fit=crop&w=600&q=80",
    iconName: 'Ghost',
    userRating: 'up',
    duration: "7 min",
    description: "Boo wasn't scary. In fact, he was afraid of the dark! A heartwarming story about finding your own way to shine.",
    vocabularyLevel: 'Beginner',
    generatedDate: "1 day ago"
  },
];

export const WISHES: Wish[] = [
  {
    id: 'wish-1',
    text: 'A big red dragon that eats ice cream.',
    detail: 'I want a big red dragon that eats ice cream and makes friends at the park.',
    createdAt: '2 hours ago',
    isNew: true,
    type: 'audio',
  },
  {
    id: 'wish-2',
    text: 'The time I lost my tooth at school.',
    detail: 'I lost my tooth at school and felt nervous. I want a story about it.',
    createdAt: 'Yesterday',
    type: 'text',
  },
  {
    id: 'wish-3',
    text: 'Swimming with dolphins in the sky.',
    detail: 'I want to swim with dolphins in the sky and explore a rainbow ocean.',
    createdAt: '2 days ago',
    type: 'audio',
  },
];

export const STORY_DATA: Record<number, string[]> = {
  1: [
    "High up in the velvet sky, the Moon let out a big, sleepy yawn. \"It's way past my bedtime,\" he whispered to the twinkling stars.",
    "The Little Dipper poured some starry milk for the Moon to drink. It was warm and glowing.",
    "He fluffed up his cloud pillow and pulled up his blanket of night. The stars began to sing a lullaby.",
    "Goodnight, Moon. Goodnight, stars. Sweet dreams to everyone in the world below!"
  ],
  2: [
    "Dino was a small dinosaur with a very quiet voice.",
    "He tried to roar like his dad, but only a 'squeak' came out.",
    "One day, he saw a butterfly stuck in a tall tree.",
    "He took a deep breath and let out a huge 'ROAR' to shake the branch!",
    "The butterfly flew free, and Dino was the loudest hero of all."
  ],
  3: [
    "Once upon a time, a prince was looking for a real princess.",
    "One stormy night, a girl knocked on the castle door.",
    "The Queen put a tiny green pea under twenty fluffy mattresses.",
    "In the morning, the girl said, \"I slept terribly! Something was hard!\"",
    "Only a real princess is that sensitive. They lived happily ever after."
  ],
  4: [
    "Rocket was the fastest ship in the galaxy, Zoom-Zoom!",
    "He counted down... 3... 2... 1... BLAST OFF!",
    "He zoomed past Mars and waved hello to the aliens.",
    "He looped around Saturn's rings like a celestial rollercoaster.",
    "Time to head home for a fuel nap. Mission accomplished!"
  ],
  5: [
    "The Magic Forest wasn't like any other forest. The leaves shimmered with a silver glow in the moonlight.",
    "Oliver stepped carefully over the mossy roots. Suddenly, a tiny pixie zoomed past his ear!",
    "\"Follow me!\" she jingled, leading him deeper into the magic. The trees seemed to whisper secrets as they passed.",
    "They arrived at a clearing where fireflies danced in a circle. It was the most beautiful thing Oliver had ever seen."
  ],
};



export const OUTFITS: AvatarItem[] = [
  { id: 'shirt-blue', type: 'Casual', image: require('../assets/avatar/items/shirt_blue.png') },
  { id: 'dress-green', type: 'Party', image: require('../assets/avatar/items/dress_green.png') },
];

export const HATS: AvatarItem[] = [
  { id: 'crown-gold', label: 'Royal', image: require('../assets/avatar/items/crown_gold.png') },
  { id: 'hat-blue', label: 'Sporty', image: require('../assets/avatar/items/hat_blue.png') },
];

export const TOYS: AvatarItem[] = [
  { id: 'sunglasses', image: require('../assets/avatar/items/sunglasses.png') },
  { id: 'necklace', image: require('../assets/avatar/items/necklace.png') },
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
