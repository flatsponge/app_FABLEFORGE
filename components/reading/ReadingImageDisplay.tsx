import React from 'react';
import { View } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { BookOpen } from 'lucide-react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';

export interface ReadingImageDisplayProps {
    /** URL of the image to display */
    imageUrl?: string | null;
    /** Cache key for the image */
    cacheKey?: string;
    /** Whether device is in landscape orientation */
    isLandscape: boolean;
    /** Screen dimensions */
    dimensions: { width: number; height: number };
    /** Safe area insets */
    insets: EdgeInsets;
}

const IMAGE_SHADOW = {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
};

/**
 * Displays book page image in portrait or landscape layout.
 * In landscape: positioned on the left side.
 * In portrait: positioned above the content panel.
 */
export function ReadingImageDisplay({
    imageUrl,
    cacheKey,
    isLandscape,
    dimensions,
    insets,
}: ReadingImageDisplayProps): React.ReactElement {
    const { width, height } = dimensions;

    // Calculate cover size based on orientation
    const landscapeCoverHeight = height - insets.top - insets.bottom - 48;
    const landscapeCoverWidth = landscapeCoverHeight * 0.75;
    const coverSize = isLandscape
        ? { width: Math.min(landscapeCoverWidth, width * 0.35), height: landscapeCoverHeight }
        : { width: 256, height: 192 };

    const ImageContent = (
        <>
            {imageUrl ? (
                <ExpoImage
                    source={{ uri: imageUrl, cacheKey }}
                    style={{ width: '100%', height: '100%' }}
                    cachePolicy="disk"
                    contentFit="cover"
                />
            ) : (
                <View className="w-full h-full bg-purple-600 items-center justify-center">
                    <BookOpen size={60} color="white" />
                </View>
            )}
        </>
    );

    if (isLandscape) {
        return (
            <View
                className="items-center justify-center z-10"
                style={{
                    width: width * 0.42,
                    paddingTop: 24,
                    paddingBottom: 24,
                    paddingLeft: 24,
                }}
            >
                <View
                    className="rounded-3xl overflow-hidden border-4 border-white/20"
                    style={[coverSize, IMAGE_SHADOW]}
                >
                    {ImageContent}
                </View>
            </View>
        );
    }

    // Portrait mode: position image to sit on top of the white card
    // White card starts at height * 0.38 (100% - 62% = 38%)
    // Image height is 192px, position so ~half overlaps the white card
    const whiteCardTop = height * 0.38;
    // Position image so its center aligns near the white card edge
    const imageTop = whiteCardTop - 100;

    return (
        <View
            className="absolute left-0 right-0 px-6 items-center z-10"
            style={{ top: imageTop }}
        >
            <View
                className="w-64 h-48 rounded-3xl overflow-hidden border-4 border-white/20"
                style={IMAGE_SHADOW}
            >
                {ImageContent}
            </View>
        </View>
    );
}
