import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, LayoutChangeEvent } from 'react-native';
import Colors from '@/constants/Colors';

// ============================================================================
// TYPOGRAPHY CONSTANTS
// ============================================================================

/**
 * Text sizing configuration for stepped font size algorithm.
 * Font sizes decrease in 2pt increments for smooth visual transitions.
 */
const TYPOGRAPHY = {
    /** Maximum font size for portrait mode */
    PORTRAIT_MAX_FONT_SIZE: 38,
    /** Minimum font size for portrait mode */
    PORTRAIT_MIN_FONT_SIZE: 18,
    /** Maximum font size for landscape mode (larger to utilize space) */
    LANDSCAPE_MAX_FONT_SIZE: 32,
    /** Minimum font size for landscape mode */
    LANDSCAPE_MIN_FONT_SIZE: 16,
    /** Step size for font adjustments (smaller = smoother transitions) */
    FONT_STEP_SIZE: 2,
    /** Line height multiplier for readability */
    LINE_HEIGHT_MULTIPLIER: 1.35,
    /** Character width ratio estimate for bold text */
    CHAR_WIDTH_RATIO: 0.58,
} as const;

// ============================================================================
// TYPES
// ============================================================================

export interface StoryTextDisplayProps {
    /** The story text to display */
    text: string;
    /** Whether the page is still loading */
    isLoading: boolean;
    /** Whether device is in landscape orientation */
    isLandscape: boolean;
}

interface ContainerDimensions {
    width: number;
    height: number;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculates the optimal font size using a stepped algorithm.
 * Uses text length and container size to estimate best fit.
 */
function calculateOptimalFontSize(
    textLength: number,
    containerDimensions: ContainerDimensions,
    isLandscape: boolean
): number {
    const { width, height } = containerDimensions;

    // Early return if container not measured yet
    if (width === 0 || height === 0) {
        return isLandscape
            ? TYPOGRAPHY.LANDSCAPE_MAX_FONT_SIZE
            : TYPOGRAPHY.PORTRAIT_MAX_FONT_SIZE;
    }

    const maxFontSize = isLandscape
        ? TYPOGRAPHY.LANDSCAPE_MAX_FONT_SIZE
        : TYPOGRAPHY.PORTRAIT_MAX_FONT_SIZE;
    const minFontSize = isLandscape
        ? TYPOGRAPHY.LANDSCAPE_MIN_FONT_SIZE
        : TYPOGRAPHY.PORTRAIT_MIN_FONT_SIZE;

    // Estimate characters per line based on container width
    // Using a larger char width ratio for more conservative estimation
    const charWidthRatio = TYPOGRAPHY.CHAR_WIDTH_RATIO;

    // Account for internal padding (24px on each side in landscape, 4px in portrait)
    const horizontalPadding = isLandscape ? 48 : 8;
    const effectiveWidth = width - horizontalPadding;

    // Reserve some vertical space for safety margin
    const effectiveHeight = height * 0.95;

    // Iterate from max to min font size in steps
    for (let fontSize = maxFontSize; fontSize >= minFontSize; fontSize -= TYPOGRAPHY.FONT_STEP_SIZE) {
        const avgCharWidth = fontSize * charWidthRatio;
        const charsPerLine = Math.floor(effectiveWidth / avgCharWidth);
        const lineHeight = fontSize * TYPOGRAPHY.LINE_HEIGHT_MULTIPLIER;
        const maxLines = Math.floor(effectiveHeight / lineHeight);
        const totalCharsCapacity = charsPerLine * maxLines;

        // Buffer for word wrapping - balanced for readable size without clipping
        const adjustedCapacity = totalCharsCapacity * 0.72;

        if (textLength <= adjustedCapacity) {
            return fontSize;
        }
    }

    // Return minimum if text is very long
    return minFontSize;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Displays story text with stepped font sizing that adjusts smoothly.
 * Uses a measurement-based algorithm to find optimal font size that:
 * - Decreases in small 2pt increments (no jarring size jumps)
 * - Properly utilizes landscape space
 * - Maintains readability with proper line heights
 */
export function StoryTextDisplay({
    text,
    isLoading,
    isLandscape,
}: StoryTextDisplayProps): React.ReactElement {
    const [containerDimensions, setContainerDimensions] = useState<ContainerDimensions>({
        width: 0,
        height: 0
    });
    const [fontSize, setFontSize] = useState<number>(
        isLandscape
            ? TYPOGRAPHY.LANDSCAPE_MAX_FONT_SIZE
            : TYPOGRAPHY.PORTRAIT_MAX_FONT_SIZE
    );

    // Track previous text to detect changes
    const previousTextRef = useRef(text);

    // Handle container layout changes
    const handleLayout = useCallback((event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setContainerDimensions(prev => {
            // Only update if dimensions actually changed (avoid unnecessary re-renders)
            if (Math.abs(prev.width - width) > 1 || Math.abs(prev.height - height) > 1) {
                return { width, height };
            }
            return prev;
        });
    }, []);

    // Recalculate font size when text, dimensions, or orientation changes
    useEffect(() => {
        if (containerDimensions.width > 0 && containerDimensions.height > 0) {
            const optimalSize = calculateOptimalFontSize(
                text.length,
                containerDimensions,
                isLandscape
            );
            setFontSize(optimalSize);
        }
        previousTextRef.current = text;
    }, [text, containerDimensions, isLandscape]);

    // Reset font size when orientation changes to recalculate properly
    useEffect(() => {
        setFontSize(
            isLandscape
                ? TYPOGRAPHY.LANDSCAPE_MAX_FONT_SIZE
                : TYPOGRAPHY.PORTRAIT_MAX_FONT_SIZE
        );
    }, [isLandscape]);

    return (
        <View
            onLayout={handleLayout}
            style={{
                flex: 1,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: isLandscape ? 24 : 4,
            }}
        >
            {isLoading ? (
                <ActivityIndicator size="small" color={Colors.light.tint} />
            ) : (
                <Text
                    style={{
                        fontSize,
                        lineHeight: fontSize * TYPOGRAPHY.LINE_HEIGHT_MULTIPLIER,
                        fontWeight: '900',
                        color: '#1e293b',
                        textAlign: 'center',
                        flexShrink: 1,
                    }}
                >
                    {text}
                </Text>
            )}
        </View>
    );
}
