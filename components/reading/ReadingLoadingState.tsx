import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import Colors from '@/constants/Colors';

export interface ReadingLoadingStateProps {
    /** True while book data is being fetched */
    isLoading: boolean;
    /** True if book was not found */
    notFound: boolean;
    /** True if teaser book is generating */
    isTeaserGenerating?: boolean;
}

/**
 * Displays loading spinner, not-found message, or teaser generation progress.
 * Returns null if none of those states apply.
 */
export function ReadingLoadingState({
    isLoading,
    notFound,
    isTeaserGenerating,
}: ReadingLoadingStateProps): React.ReactElement | null {
    if (isLoading) {
        return (
            <View className="flex-1 bg-background items-center justify-center">
                <ActivityIndicator size="large" color={Colors.light.tint} />
                <Text className="text-slate-500 mt-4">Loading story...</Text>
            </View>
        );
    }

    if (notFound) {
        return (
            <View className="flex-1 bg-background items-center justify-center">
                <Text className="text-slate-500">Book not found</Text>
            </View>
        );
    }

    return null;
}
