import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { RotateCcw, ThumbsUp, ThumbsDown, Star, Heart } from 'lucide-react-native';
import { MotiView } from 'moti';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface ReadingCompletionScreenProps {
    /** Current rating ('up' | 'down' | null) */
    rating: 'up' | 'down' | null;
    /** Whether user has already rated */
    hasRated: boolean;
    /** Callback when user rates the story */
    onRate: (rating: 'up' | 'down') => void;
    /** Callback to restart the story */
    onRestart: () => void;
    /** Callback to close/finish */
    onClose: () => void;
}

/**
 * Completion screen shown after finishing the story.
 * Displays rating buttons (if not rated) and action buttons.
 */
export function ReadingCompletionScreen({
    rating,
    hasRated,
    onRate,
    onRestart,
    onClose,
}: ReadingCompletionScreenProps): React.ReactElement {
    const insets = useSafeAreaInsets();

    return (
        <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
                flexGrow: 1,
                justifyContent: 'center',
                paddingTop: 40,
                paddingBottom: Math.max(20, insets.bottom + 20),
            }}
        >
            <View className="items-center w-full max-w-lg mx-auto">
                <Text className="text-4xl font-black text-slate-800 mb-2 text-center">The End!</Text>
                <Text className="text-slate-500 text-lg font-medium mb-10 text-center">
                    What a wonderful adventure!
                </Text>

                {!hasRated ? (
                    <MotiView
                        from={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'timing', duration: 400 }}
                        className="w-full mb-10 items-center"
                    >
                        <Text className="text-center text-slate-600 font-bold text-xl mb-8">
                            Did you like this story?
                        </Text>
                        <View className="flex-row justify-center gap-10">
                            <Pressable
                                onPress={() => onRate('down')}
                                className="items-center active:scale-95"
                                accessibilityLabel="I did not like this story"
                                accessibilityRole="button"
                            >
                                <View className="w-24 h-24 rounded-full bg-slate-100 border-4 border-slate-200 items-center justify-center mb-3 shadow-sm">
                                    <ThumbsDown size={40} color="#64748b" fill="#cbd5e1" />
                                </View>
                                <Text className="text-slate-500 font-bold text-lg">No</Text>
                            </Pressable>

                            <Pressable
                                onPress={() => onRate('up')}
                                className="items-center active:scale-95"
                                accessibilityLabel="I liked this story"
                                accessibilityRole="button"
                            >
                                <View className="w-24 h-24 rounded-full bg-yellow-100 border-4 border-yellow-300 items-center justify-center mb-3 shadow-sm">
                                    <ThumbsUp size={40} color="#ca8a04" fill="#fde047" />
                                </View>
                                <Text className="text-yellow-700 font-bold text-lg">Yes!</Text>
                            </Pressable>
                        </View>
                    </MotiView>
                ) : (
                    <MotiView
                        from={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'timing', duration: 400 }}
                        className="w-full mb-10 items-center"
                    >
                        <View className="items-center justify-center mb-6">
                            {rating === 'up' ? (
                                <MotiView
                                    from={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: 'timing', duration: 500 }}
                                >
                                    <Star size={80} color="#ca8a04" fill="#fde047" />
                                </MotiView>
                            ) : (
                                <MotiView
                                    from={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: 'timing', duration: 500 }}
                                >
                                    <Heart size={80} color="#9333ea" fill="#d8b4fe" />
                                </MotiView>
                            )}
                        </View>

                        <Text className="text-2xl font-black text-slate-800 text-center mb-2">
                            {rating === 'up' ? 'Thanks for feedback!' : 'Thanks for reading!'}
                        </Text>
                        <Text className="text-slate-500 font-medium text-center px-4">
                            {rating === 'up'
                                ? "We're glad you enjoyed the story."
                                : "We'll try to find better stories for you next time."}
                        </Text>
                    </MotiView>
                )}

                <View className="flex-row gap-4 w-full px-4">
                    <Pressable
                        onPress={onRestart}
                        className="flex-1 py-4 rounded-2xl bg-slate-100 border-2 border-slate-200 flex-row items-center justify-center gap-2 active:bg-slate-200"
                        accessibilityLabel="Read the story again"
                        accessibilityRole="button"
                    >
                        <RotateCcw size={20} color="#475569" />
                        <Text className="font-bold text-slate-600 text-base">Read Again</Text>
                    </Pressable>
                    <Pressable
                        onPress={onClose}
                        className="flex-1 py-4 rounded-2xl bg-slate-900 items-center justify-center active:bg-slate-800 shadow-lg shadow-slate-900/20"
                        accessibilityLabel="Finish reading and go back"
                        accessibilityRole="button"
                    >
                        <Text className="font-bold text-white text-base">All Done!</Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    );
}
