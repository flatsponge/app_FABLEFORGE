import React from 'react';
import { Pressable } from 'react-native';
import { X } from 'lucide-react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';

export interface ReadingCloseButtonProps {
    /** Callback when close button is pressed */
    onClose: () => void;
    /** Safe area insets for positioning */
    insets: EdgeInsets;
}

/**
 * X button positioned in top-left corner with safe area awareness.
 */
export function ReadingCloseButton({
    onClose,
    insets,
}: ReadingCloseButtonProps): React.ReactElement {
    return (
        <Pressable
            onPress={onClose}
            className="absolute w-10 h-10 rounded-full bg-white/20 items-center justify-center active:scale-95 z-50"
            style={{
                top: Math.max(insets.top, 12) + 8,
                left: Math.max(insets.left, 12) + 8,
            }}
            accessibilityLabel="Close story"
            accessibilityRole="button"
        >
            <X size={22} color="white" />
        </Pressable>
    );
}
