import { ReactNode } from 'react';

export interface Category {
  id: string;
  name: string;
  color: string;
  text: string;
  icon: ReactNode;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  progress: number;
  color: string;
  coverImage: string;
  icon: ReactNode;
  rating: number;
  duration: string;
  description: string;
  vocabularyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  isLiked: boolean;
  generatedDate: string;
}

export interface AvatarItem {
  id: string;
  color?: string;
  icon?: ReactNode | string;
  type?: string;
  label?: string;
}

export interface AvatarConfig {
  skinColor: string;
  outfitId: string;
  hatId: string;
  toyId: string;
}