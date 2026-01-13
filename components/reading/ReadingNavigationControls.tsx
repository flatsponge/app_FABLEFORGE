import React from 'react';
import { View, Text, Pressable } from 'react-native';
import {
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    Check,
    Pause,
    Play,
    Timer,
} from 'lucide-react-native';
import { ReadingMode } from '@/types';

export interface ReadingNavigationControlsProps {
    /** Current reading mode */
    mode: ReadingMode;
    /** Current page index (0-based) */
    page: number;
    /** Total number of pages */
    totalPages: number;
    /** Reading progress percentage (0-100) */
    progress: number;
    /** Whether child can advance (after delay) */
    canAdvance: boolean;
    /** Whether autoplay is currently active */
    isAutoPlaying: boolean;
    /** Navigate to next page */
    onNext: () => void;
    /** Navigate to previous page */
    onBack: () => void;
    /** Restart from beginning */
    onRestart: () => void;
    /** Toggle autoplay on/off */
    onToggleAutoplay: () => void;
}

const AUTOPLAY_BUTTON_SHADOW = {
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
};

const PARENT_NEXT_BUTTON_SHADOW = {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
};

/**
 * Renders navigation controls based on reading mode.
 * - autoplay: restart, progress bar, play/pause button
 * - child: back/next buttons with timer delay
 * - parent: minimal prev/next with progress indicator
 */
export function ReadingNavigationControls({
    mode,
    page,
    totalPages,
    progress,
    canAdvance,
    isAutoPlaying,
    onNext,
    onBack,
    onRestart,
    onToggleAutoplay,
}: ReadingNavigationControlsProps): React.ReactElement | null {
    const isFirstPage = page === 0;
    const isLastPage = page === totalPages - 1;

    if (mode === 'autoplay') {
        return (
            <View className="flex-row items-center justify-center gap-4">
                <Pressable
                    onPress={onRestart}
                    className="w-12 h-12 rounded-full bg-slate-100 items-center justify-center active:scale-95"
                >
                    <RotateCcw size={20} color="#64748b" />
                </Pressable>

                <View className="flex-1 max-w-[100px] h-2 bg-slate-100 rounded-full overflow-hidden">
                    <View className="h-full bg-indigo-500" style={{ width: `${progress}%` }} />
                </View>

                <Pressable
                    onPress={onToggleAutoplay}
                    className="w-16 h-16 rounded-2xl bg-indigo-500 items-center justify-center active:scale-95"
                    style={AUTOPLAY_BUTTON_SHADOW}
                >
                    {isAutoPlaying ? (
                        <Pause size={28} color="white" fill="white" />
                    ) : (
                        <Play size={28} color="white" fill="white" />
                    )}
                </Pressable>
            </View>
        );
    }

    if (mode === 'child') {
        return (
            <View className="flex-row gap-3 h-20">
                <Pressable
                    onPress={onBack}
                    disabled={isFirstPage}
                    className={`flex-1 rounded-2xl items-center justify-center flex-row gap-2 ${isFirstPage ? 'bg-slate-100' : 'bg-amber-400'
                        }`}
                    accessibilityLabel="Go to previous page"
                    accessibilityRole="button"
                >
                    <ChevronLeft size={24} color={isFirstPage ? '#cbd5e1' : '#78350f'} strokeWidth={3} />
                    <Text className={`text-lg font-black ${isFirstPage ? 'text-slate-300' : 'text-amber-900'}`}>
                        Back
                    </Text>
                </Pressable>

                <Pressable
                    onPress={onNext}
                    disabled={!canAdvance}
                    className={`flex-[2] rounded-2xl items-center justify-center flex-row gap-2 ${!canAdvance ? 'bg-slate-200' : 'bg-emerald-400'
                        }`}
                    accessibilityLabel="Go to next page"
                    accessibilityRole="button"
                >
                    {!canAdvance ? (
                        <>
                            <Timer size={24} color="#94a3b8" />
                            <Text className="text-lg font-black text-slate-400">Wait...</Text>
                        </>
                    ) : (
                        <>
                            <Text className="text-xl font-black text-emerald-900">Next</Text>
                            <ChevronRight size={28} color="#064e3b" strokeWidth={3} />
                        </>
                    )}
                </Pressable>
            </View>
        );
    }

    if (mode === 'parent') {
        return (
            <View className="flex-row items-center justify-between gap-4">
                <Pressable
                    onPress={onBack}
                    disabled={isFirstPage}
                    className={`w-14 h-14 rounded-2xl items-center justify-center border-2 border-slate-100 ${isFirstPage ? 'opacity-0' : ''
                        }`}
                    accessibilityLabel="Go to previous page"
                    accessibilityRole="button"
                >
                    <ChevronLeft size={24} color="#94a3b8" />
                </Pressable>

                <View className="flex-1 max-w-[120px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <View className="h-full bg-indigo-500" style={{ width: `${progress}%` }} />
                </View>

                <Pressable
                    onPress={onNext}
                    className="w-16 h-16 rounded-2xl bg-slate-900 items-center justify-center active:scale-95"
                    style={PARENT_NEXT_BUTTON_SHADOW}
                    accessibilityLabel={isLastPage ? 'Finish story' : 'Go to next page'}
                    accessibilityRole="button"
                >
                    {isLastPage ? (
                        <Check size={28} color="white" strokeWidth={3} />
                    ) : (
                        <ChevronRight size={32} color="white" />
                    )}
                </Pressable>
            </View>
        );
    }

    return null;
}
