import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Sparkles } from 'lucide-react-native';

const AnimatedPath = Animated.createAnimatedComponent(Path);

export interface GrowthScoreArcProps {
    /** The score as a percentage (0-100) */
    score: number;
    /** Size of the widget in pixels */
    size?: number;
    /** Stroke width of the arc */
    strokeWidth?: number;
    /** Duration of the animation in ms */
    animationDuration?: number;
    /** Whether to show the motivational message pill below */
    showMotivation?: boolean;
    /** Custom label text (defaults to "Growth Score") */
    label?: string;
}

const getMotivationalMessage = (score: number) => {
    if (score >= 80) return "You're a Superstar! 🌟";
    if (score >= 60) return "Excellent Progress! 🚀";
    if (score >= 40) return "Great Start! 🌱";
    return "Keep Growing! ✨";
};

export const GrowthScoreArc: React.FC<GrowthScoreArcProps> = ({
    score,
    size = 240,
    strokeWidth = 18,
    animationDuration = 1500,
    showMotivation = true,
    label = "Growth Score",
}) => {
    const center = size / 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    // Arc configuration: Open at the bottom
    // We want to fill from Left (230deg) to Right (130deg) Clockwise.
    const startAngle = 230;
    const endAngle = 130;

    // Helper to get coordinates
    const getCoords = (angleInDegrees: number) => {
        const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
        return {
            x: center + radius * Math.cos(angleInRadians),
            y: center + radius * Math.sin(angleInRadians),
        };
    };

    const startPoint = getCoords(startAngle);
    const endPoint = getCoords(endAngle);

    const largeArcFlag = 1; // 260 degrees > 180
    const sweepFlag = 1;    // 1 for Clockwise directed arc
    const arcLength = circumference * (260 / 360);

    const arcPath = [
        'M', startPoint.x, startPoint.y,
        'A', radius, radius, 0, largeArcFlag, sweepFlag, endPoint.x, endPoint.y
    ].join(' ');

    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withTiming(score / 100, {
            duration: animationDuration,
            easing: Easing.out(Easing.cubic),
        });
    }, [score, animationDuration]);

    const animatedProps = useAnimatedProps(() => {
        const strokeDashoffset = arcLength * (1 - progress.value);
        return {
            strokeDashoffset,
        };
    });

    return (
        <View className="items-center justify-center">
            <View className="relative" style={{ width: size, height: size }}>
                <Svg width={size} height={size}>
                    <Defs>
                        <LinearGradient id="growthGradient" x1="0" y1="0" x2="1" y2="0">
                            <Stop offset="0%" stopColor="#0ea5e9" />
                            <Stop offset="50%" stopColor="#22d3ee" />
                            <Stop offset="100%" stopColor="#10b981" />
                        </LinearGradient>
                    </Defs>

                    {/* Background Track */}
                    <Path
                        d={arcPath}
                        fill="none"
                        stroke="#f1f5f9"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                    />

                    {/* Animated Progress */}
                    <AnimatedPath
                        d={arcPath}
                        fill="none"
                        stroke="url(#growthGradient)"
                        strokeWidth={strokeWidth}
                        strokeDasharray={`${arcLength} ${circumference}`}
                        animatedProps={animatedProps}
                        strokeLinecap="round"
                    />
                </Svg>

                {/* Inner Content */}
                <View className="absolute inset-0 items-center justify-center" style={{ paddingTop: size * 0.08 }}>
                    <View className="items-center">
                        <Text className="font-black text-slate-800 tracking-tighter leading-none" style={{ fontSize: size * 0.25 }}>
                            {score}
                            <Text className="font-bold text-slate-400" style={{ fontSize: size * 0.125 }}>%</Text>
                        </Text>
                        <Text className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">
                            {label}
                        </Text>
                    </View>
                </View>
            </View>

            {showMotivation && (
                <View className="-mt-8 items-center bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-slate-100 shadow-sm z-10">
                    <View className="flex-row items-center gap-2 mb-1">
                        <Sparkles size={14} color="#0ea5e9" />
                        <Text className="text-sm font-bold text-slate-700">
                            {getMotivationalMessage(score)}
                        </Text>
                    </View>
                    <Text className="text-slate-400 text-[10px] font-medium text-center">
                        Based on recent stories & quizzes
                    </Text>
                </View>
            )}
        </View>
    );
};

// Compact version for inline use (like in FulfillmentTracker)
export interface GrowthScoreArcCompactProps {
    /** The score as a percentage (0-100) */
    score: number;
    /** Size of the widget in pixels */
    size?: number;
}

export const GrowthScoreArcCompact: React.FC<GrowthScoreArcCompactProps> = ({
    score,
    size = 52,
}) => {
    const strokeWidth = Math.max(4, size * 0.1);
    const center = size / 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    // Arc configuration: Open at the bottom (260 degrees)
    const startAngle = 230;
    const endAngle = 130;

    const getCoords = (angleInDegrees: number) => {
        const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
        return {
            x: center + radius * Math.cos(angleInRadians),
            y: center + radius * Math.sin(angleInRadians),
        };
    };

    const startPoint = getCoords(startAngle);
    const endPoint = getCoords(endAngle);

    const largeArcFlag = 1;
    const sweepFlag = 1;
    const arcLength = circumference * (260 / 360);
    const progressOffset = arcLength * (1 - score / 100);

    const arcPath = [
        'M', startPoint.x, startPoint.y,
        'A', radius, radius, 0, largeArcFlag, sweepFlag, endPoint.x, endPoint.y
    ].join(' ');

    return (
        <View style={{ width: size, height: size }}>
            <Svg width={size} height={size}>
                <Defs>
                    <LinearGradient id="growthGradientCompact" x1="0" y1="0" x2="1" y2="0">
                        <Stop offset="0%" stopColor="#0ea5e9" />
                        <Stop offset="50%" stopColor="#22d3ee" />
                        <Stop offset="100%" stopColor="#10b981" />
                    </LinearGradient>
                </Defs>

                {/* Background Track */}
                <Path
                    d={arcPath}
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />

                {/* Progress */}
                <Path
                    d={arcPath}
                    fill="none"
                    stroke="url(#growthGradientCompact)"
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${arcLength} ${circumference}`}
                    strokeDashoffset={progressOffset}
                    strokeLinecap="round"
                />
            </Svg>
        </View>
    );
};
