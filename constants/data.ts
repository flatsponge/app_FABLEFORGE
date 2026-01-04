import { Book, Category, AvatarItem, PresetLocation, Friend, VoicePreset, Wish } from '../types';

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
    author: "AI Storyteller",
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
    author: "AI Storyteller",
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
    author: "AI Storyteller",
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
    author: "AI Storyteller",
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
    author: "AI Storyteller",
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
    author: "AI Storyteller",
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
  },
  {
    id: 'wish-2',
    text: 'The time I lost my tooth at school.',
    detail: 'I lost my tooth at school and felt nervous. I want a story about it.',
    createdAt: 'Yesterday',
  },
  {
    id: 'wish-3',
    text: 'Swimming with dolphins in the sky.',
    detail: 'I want to swim with dolphins in the sky and explore a rainbow ocean.',
    createdAt: '2 days ago',
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

export const SKIN_TONES = [
  '#FCD5B5', '#EAC098', '#D6A47C', '#C68642', '#8D5524', '#593618'
];

export const OUTFITS: AvatarItem[] = [
  { id: 'tshirt-red', color: 'bg-red-400', iconName: '👕', type: 'Casual' },
  { id: 'tshirt-blue', color: 'bg-blue-400', iconName: '👕', type: 'Cool' },
  { id: 'dress-pink', color: 'bg-pink-300', iconName: '👗', type: 'Party' },
  { id: 'jumpsuit-green', color: 'bg-green-400', iconName: '🦺', type: 'Adventure' },
  { id: 'hoodie-purple', color: 'bg-purple-500', iconName: '🧥', type: 'Cozy' },
];

export const HATS: AvatarItem[] = [
  { id: 'none', iconName: 'none', label: 'None' },
  { id: 'crown', iconName: 'Crown', label: 'Royal' },
  { id: 'cap', iconName: 'cap', label: 'Sporty' },
  { id: 'bow', iconName: 'bow', label: 'Cute' },
];

export const TOYS: AvatarItem[] = [
  { id: 'none', iconName: 'none' },
  { id: 'star', iconName: 'Star' },
  { id: 'camera', iconName: 'Camera' },
  { id: 'game', iconName: 'Gamepad2' },
];

export const PRESET_LOCATIONS: PresetLocation[] = [
  { id: 'loc-1', name: 'Magic Castle', image: 'https://images.unsplash.com/photo-1599694467232-09e0a05b38cb?auto=format&fit=crop&w=300&q=80', cost: 2 },
  { id: 'loc-2', name: 'Deep Space', image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=300&q=80', cost: 3 },
  { id: 'loc-3', name: 'Candy Land', image: 'https://images.unsplash.com/photo-1535572290543-960a8046f5af?auto=format&fit=crop&w=300&q=80', cost: 2 },
  { id: 'loc-4', name: 'Dino Valley', image: 'https://images.unsplash.com/photo-1518275497276-2c5d72f9602c?auto=format&fit=crop&w=300&q=80', cost: 2 },
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
