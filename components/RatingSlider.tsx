import React, { useRef, useState, useEffect } from 'react';
import { View, Text, PanResponder, Animated, LayoutChangeEvent, Vibration } from 'react-native';

interface RatingSliderProps {
    value: number;
    onValueChange: (value: number) => void;
    min?: number;
    max?: number;
}

export default function RatingSlider({ value, onValueChange, min = 1, max = 5 }: RatingSliderProps) {
    const [width, setWidth] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    // Animated value for the thumb position (0 to width)
    const position = useRef(new Animated.Value(0)).current;

    // Compute stats
    const stepCount = max - min;

    useEffect(() => {
        if (!isDragging && width > 0) {
            const stepWidth = width / stepCount;
            const targetX = (value - min) * stepWidth;
            Animated.spring(position, {
                toValue: targetX,
                useNativeDriver: false,
                friction: 7,
                tension: 40,
            }).start();
        }
    }, [value, width, isDragging]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                setIsDragging(true);
            },
            onPanResponderMove: (_, gestureState) => {
                const stepWidth = width / stepCount;

                // Calculate raw value from position
                let newX = Math.max(0, Math.min(width, gestureState.x0 + gestureState.dx)); // This might need adjustment based on layout
                // Actually, gestureState.moveX is absolute. let's use locationX if possible, but PanResponder is easier with deltas or relative to start.
                // Better approach: track the accumulated offset.
                // Simplest for this UI: just map local touch coordinate to value.
            },
        })
    ).current;

    // Rethinking Move logic to be robust:
    // We need to map the visual x position to a rating.
    // Let's use a simpler approach: Just track touch events on the container.
    // PanResponder on the container View.

    const handlePan = (x: number) => {
        if (width === 0) return;

        let clampedX = Math.max(0, Math.min(width, x));
        const stepWidth = width / stepCount;
        const rawStep = clampedX / stepWidth;
        const roundedStep = Math.round(rawStep);
        const newValue = Math.min(max, Math.max(min, min + roundedStep));

        if (newValue !== value) {
            Vibration.vibrate(5); // Light tick
            onValueChange(newValue);
        }

        position.setValue(clampedX);
    };

    const panResponderRef = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onStartShouldSetPanResponderCapture: () => true,
            onMoveShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponderCapture: () => true,

            onPanResponderGrant: (evt, gestureState) => {
                setIsDragging(true);
                handlePan(evt.nativeEvent.locationX);
            },
            onPanResponderMove: (evt, gestureState) => {
                handlePan(evt.nativeEvent.locationX);
            },
            onPanResponderRelease: (evt, gestureState) => {
                setIsDragging(false);
                // Snap to final
                const stepWidth = width / stepCount;
                const targetX = (value - min) * stepWidth;
                // The useEffect will handle the spring snap because isDragging becomes false
            },
        })
    );

    return (
        <View
            className="h-16 justify-center w-full"
            onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
            {...panResponderRef.current.panHandlers}
        >
            {/* Track Line */}
            <View
                className="h-2 bg-gray-200 rounded-full w-full absolute"
                pointerEvents="none"
            />

            {/* Ticks */}
            <View
                className="w-full h-2 flex-row justify-between absolute px-0"
                pointerEvents="none"
            >
                {Array.from({ length: stepCount + 1 }).map((_, i) => {
                    const tickValue = min + i;
                    const leftPos = (i / stepCount) * 100; // Percentage
                    return (
                        <View
                            key={i}
                            style={{ left: `${leftPos}%`, marginLeft: -1 }} // Center the 2px tick
                            className={`absolute w-0.5 h-4 -top-1 rounded-full ${tickValue <= value ? 'bg-primary-500' : 'bg-gray-300'}`}
                        />
                    );
                })}
            </View>

            {/* Fill Line (Active) */}
            <Animated.View
                className="h-2 bg-primary-500 rounded-full absolute"
                pointerEvents="none"
                style={{
                    width: position,
                }}
            />

            {/* Thumb */}
            <Animated.View
                className="absolute w-8 h-8 bg-white border-2 border-primary-500 rounded-full shadow-md items-center justify-center"
                pointerEvents="none"
                style={{
                    transform: [{ translateX: -16 }, { translateX: position }], // exact center
                }}
            >
                {/* Inner dot */}
                <View className="w-2 h-2 bg-primary-500 rounded-full" />
            </Animated.View>

            {/* Labels below */}
            <View
                className="w-full flex-row justify-between absolute top-10"
                pointerEvents="none"
            >
                {Array.from({ length: stepCount + 1 }).map((_, i) => (
                    <Text key={i} className={`text-xs ${min + i === value ? 'font-bold text-primary-600' : 'text-gray-400'}`}>
                        {min + i}
                    </Text>
                ))}
            </View>
        </View>
    );
}
