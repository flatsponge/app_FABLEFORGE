export interface Category {
  id: string;
  name: string;
  color: string;
  text: string;
  iconName: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  progress: number;
  color: string;
  coverImage: string;
  iconName: string;
  duration: string;
  description: string;
  vocabularyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  userRating: 'up' | 'down' | null;
  generatedDate: string;
}

export interface AvatarItem {
  id: string;
  color?: string;
  iconName?: string;
  type?: string;
  label?: string;
  image?: any;
}

export interface AvatarConfig {
  skinColor: string;
  outfitId: string;
  hatId: string;
  toyId: string;
}

export interface PresetLocation {
  id: string;
  name: string;
  image: any;
  cost: number;
}

export interface Friend {
  id: string;
  name: string;
  type: string;
  color: string;
  icon: string;
  cost: number;
}

export interface VoicePreset {
  id: string;
  name: string;
  style: string;
  icon: string;
  cost: number;
  color: string;
}

export interface Wish {
  id: string;
  text: string;
  detail?: string;
  createdAt: string;
  isNew?: boolean;
  type: 'text' | 'audio';
}

export type ReadingMode = 'autoplay' | 'child' | 'parent';

export type StoryLength = 'short' | 'medium' | 'long';
