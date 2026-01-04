import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface AnimatedGradientBorderProps {
    children: React.ReactNode;
    /** Border radius in pixels. Default: 32 */
    borderRadius?: number;
    /** Border width in pixels. Default: 3 */
    borderWidth?: number;
    /** Background color behind the gradient. Default: #1e293b */
    backgroundColor?: string;
    /** Gradient colors array. Default: rainbow gradient */
    gradientColors?: readonly [string, string, ...string[]];
    /** Animation duration in ms. Default: 3000 */
    animationDuration?: number;
}

/**
 * A container with an animated rotating gradient border effect.
 * Useful for highlighting premium features or important UI elements.
 */
export const AnimatedGradientBorder = ({
    children,
    borderRadius = 32,
    borderWidth = 3,
    backgroundColor = '#1e293b',
    gradientColors = ['#fcd34d', '#a855f7', '#f43f5e', '#0ea5e9', '#fcd34d'],
    animationDuration = 3000,
}: AnimatedGradientBorderProps) => {
    const rotation = useSharedValue(0);

    useEffect(() => {
        rotation.value = withRepeat(
            withTiming(360, { duration: animationDuration, easing: Easing.linear }),
            -1,
            false
        );
    }, [animationDuration]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));

    const innerRadius = borderRadius - borderWidth;

    return (
        <View
            className="overflow-hidden"
            style={{
                borderRadius,
                padding: borderWidth,
                backgroundColor,
            }}
        >
            <Animated.View
                style={[
                    {
                        position: 'absolute',
                        width: 500,
                        height: 500,
                        top: '50%',
                        left: '50%',
                        marginTop: -250,
                        marginLeft: -250,
                    },
                    animatedStyle,
                ]}
            >
                <LinearGradient
                    colors={gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ width: 500, height: 500 }}
                />
            </Animated.View>
            <View
                className="overflow-hidden relative"
                style={{ borderRadius: innerRadius }}
            >
                {children}
            </View>
        </View>
    );
};
