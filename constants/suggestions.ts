import {
    Activity,
    Bed,
    BookOpen,
    Compass,
    Gift,
    Heart,
    Mountain,
    Rocket,
    Shield,
    Sparkles,
    Users,
    Wand2,
} from 'lucide-react-native';
import { LucideIcon } from 'lucide-react-native';

export interface StoryStarter {
    id: string;
    label: string;
    prompt: string;
    icon: LucideIcon;
    gradient: [string, string];
}

export interface ChallengeSuggestion {
    id: string;
    label: string;
    prompt: string;
    icon: LucideIcon;
    gradient: [string, string];
}

/**
 * Story starters for Creative Magic mode
 * These provide imaginative starting points for storytelling
 */
export const STORY_STARTERS: StoryStarter[] = [
    {
        id: 'adventure',
        label: 'Adventure',
        prompt: 'A brave explorer discovers a hidden door behind a waterfall that leads to a magical world...',
        icon: Compass,
        gradient: ['#fef3c7', '#fcd34d'],
    },
    {
        id: 'friendship',
        label: 'Friendship',
        prompt: 'Two very different characters become the best of friends after meeting in an unexpected place...',
        icon: Heart,
        gradient: ['#fce7f3', '#f9a8d4'],
    },
    {
        id: 'bedtime',
        label: 'Bedtime',
        prompt: 'As the stars begin to twinkle, a sleepy mascot embarks on a journey through dreamland...',
        icon: Bed,
        gradient: ['#e0e7ff', '#a5b4fc'],
    },
    {
        id: 'magic',
        label: 'Magic',
        prompt: 'A mascot discovers they have a special magical power that only works when they believe in themselves...',
        icon: Wand2,
        gradient: ['#f3e8ff', '#c4b5fd'],
    },
    {
        id: 'nature',
        label: 'Nature',
        prompt: 'Deep in an enchanted forest, the animals are preparing for their biggest celebration of the year...',
        icon: Mountain,
        gradient: ['#d1fae5', '#6ee7b7'],
    },
    {
        id: 'space',
        label: 'Space',
        prompt: 'A curious astronaut lands on a planet made entirely of sweets and meets the friendliest aliens...',
        icon: Rocket,
        gradient: ['#dbeafe', '#93c5fd'],
    },
];

/**
 * Common challenges for Real Life Help mode
 * These address real situations children face and need guidance on
 */
export const CHALLENGE_SUGGESTIONS: ChallengeSuggestion[] = [
    {
        id: 'conflict',
        label: 'Conflict',
        prompt: 'My child had a conflict with another child and needs help repairing the friendship.',
        icon: Heart,
        gradient: ['#fee2e2', '#fca5a5'],
    },
    {
        id: 'fear',
        label: 'Feeling Scared',
        prompt: 'My child is scared of the dark and wants help feeling brave.',
        icon: Shield,
        gradient: ['#fef3c7', '#fcd34d'],
    },
    {
        id: 'sharing',
        label: 'Sharing',
        prompt: 'My child is having trouble sharing toys with siblings or friends.',
        icon: Users,
        gradient: ['#f3e8ff', '#c4b5fd'],
    },
    {
        id: 'celebration',
        label: 'Celebration',
        prompt: 'We are celebrating a special moment and want to capture it in a story.',
        icon: Gift,
        gradient: ['#d1fae5', '#6ee7b7'],
    },
    {
        id: 'doctor',
        label: 'Doctor Visit',
        prompt: 'My child is nervous about a doctor or dentist visit tomorrow.',
        icon: Activity,
        gradient: ['#dbeafe', '#93c5fd'],
    },
    {
        id: 'new_sibling',
        label: 'New Sibling',
        prompt: 'We are welcoming a new baby and want to help prepare for the change.',
        icon: Sparkles,
        gradient: ['#fce7f3', '#f9a8d4'],
    },
    {
        id: 'school',
        label: 'Starting School',
        prompt: 'My child is anxious about starting at a new school or classroom.',
        icon: BookOpen,
        gradient: ['#e0e7ff', '#a5b4fc'],
    },
    {
        id: 'loss',
        label: 'Loss',
        prompt: 'My child is dealing with the loss of a pet or loved one and needs comfort.',
        icon: Heart,
        gradient: ['#f1f5f9', '#cbd5e1'],
    },
];
