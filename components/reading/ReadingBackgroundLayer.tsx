import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image as ExpoImage } from 'expo-image';

export interface ReadingBackgroundLayerProps {
    /** URL of the image to display as blurred background */
    imageUrl?: string | null;
    /** Cache key for the image */
    cacheKey?: string;
}

/**
 * Full-screen blurred background layer with dark overlay.
 * Falls back to solid purple if no image provided.
 */
export function ReadingBackgroundLayer({
    imageUrl,
    cacheKey,
}: ReadingBackgroundLayerProps): React.ReactElement {
    return (
        <View style={StyleSheet.absoluteFill}>
            {imageUrl ? (
                <ExpoImage
                    source={{ uri: imageUrl, cacheKey }}
                    style={StyleSheet.absoluteFill}
                    cachePolicy="disk"
                    contentFit="cover"
                    blurRadius={20}
                />
            ) : (
                <View className="flex-1 bg-purple-900" />
            )}
            <View className="absolute inset-0 bg-black/50" />
        </View>
    );
}
