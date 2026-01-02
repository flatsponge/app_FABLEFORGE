import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Path, Svg, Line, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import Animated, { FadeIn, FadeInUp, useSharedValue, withTiming, useAnimatedProps, withDelay } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const GRAPH_HEIGHT = 220;
const GRAPH_WIDTH = width - 48;

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function TrajectoryScreen() {
    const router = useRouter();
    const [showLabels, setShowLabels] = useState(false);
    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withDelay(500, withTiming(1, { duration: 2000 }));
        const timer = setTimeout(() => setShowLabels(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    const pathWithout = `M 0 ${GRAPH_HEIGHT * 0.4} C ${GRAPH_WIDTH * 0.3} ${GRAPH_HEIGHT * 0.5}, ${GRAPH_WIDTH * 0.6} ${GRAPH_HEIGHT * 0.7}, ${GRAPH_WIDTH} ${GRAPH_HEIGHT * 0.9}`;
    const pathWith = `M 0 ${GRAPH_HEIGHT * 0.4} C ${GRAPH_WIDTH * 0.3} ${GRAPH_HEIGHT * 0.3}, ${GRAPH_WIDTH * 0.6} ${GRAPH_HEIGHT * 0.1}, ${GRAPH_WIDTH} 10`;

    const animatedProps = useAnimatedProps(() => ({
        strokeDashoffset: 1000 * (1 - progress.value),
    }));

    return (
        <View className="flex-1 bg-white pt-16 px-6">
            <Animated.View entering={FadeIn.delay(200)} className="mb-8">
                <Text className="text-gray-400 uppercase tracking-widest text-xs font-bold mb-2">
                    Projected Future
                </Text>
                <Text className="text-3xl font-serif text-gray-900 leading-tight">
                    Two Possible <Text className="text-primary-600 italic">Futures</Text>
                </Text>
            </Animated.View>

            <View className="h-[240px] mb-8 relative">
                <Svg width={GRAPH_WIDTH} height={GRAPH_HEIGHT}>
                    <Defs>
                        <LinearGradient id="gradRed" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0%" stopColor="#ef4444" stopOpacity={0.1} />
                            <Stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                        </LinearGradient>
                        <LinearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0%" stopColor="#10b981" stopOpacity={0.1} />
                            <Stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                        </LinearGradient>
                    </Defs>

                    {/* Grid Lines */}
                    <Line x1="0" y1={GRAPH_HEIGHT / 2} x2={GRAPH_WIDTH} y2={GRAPH_HEIGHT / 2} stroke="#e5e7eb" strokeDasharray="5, 5" />
                    <Line x1="0" y1={GRAPH_HEIGHT} x2={GRAPH_WIDTH} y2={GRAPH_HEIGHT} stroke="#e5e7eb" strokeDasharray="5, 5" />

                    {/* Paths */}
                    <AnimatedPath
                        d={pathWithout}
                        stroke="#ef4444"
                        strokeWidth={4}
                        fill="none"
                        strokeDasharray={1000}
                        animatedProps={animatedProps}
                    />
                    <AnimatedPath
                        d={pathWith}
                        stroke="#10b981"
                        strokeWidth={4}
                        fill="none"
                        strokeDasharray={1000}
                        animatedProps={animatedProps}
                    />

                    {/* End Dots */}
                    {showLabels && (
                        <>
                            <Circle cx={GRAPH_WIDTH} cy={GRAPH_HEIGHT * 0.9} r={6} fill="#ef4444" />
                            <Circle cx={GRAPH_WIDTH} cy={10} r={6} fill="#10b981" />
                        </>
                    )}
                </Svg>

                {/* Axis Labels */}
                <View className="flex-row justify-between mt-2">
                    <Text className="text-gray-400 text-xs font-bold">TODAY</Text>
                    <Text className="text-gray-400 text-xs font-bold">12 MONTHS</Text>
                </View>
            </View>

            {showLabels && (
                <Animated.View entering={FadeInUp.duration(600)}>
                    <View className="bg-white border border-red-100 p-4 rounded-2xl flex-row items-center mb-4">
                        <View className="w-10 h-10 rounded-full bg-red-50 items-center justify-center mr-4">
                            <Ionicons name="trending-down" size={20} color="#ef4444" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-red-900 font-bold text-lg">Without Intervention</Text>
                            <Text className="text-red-700/60 text-sm">Skills decline, gap widens</Text>
                        </View>
                    </View>

                    <View className="bg-white border border-green-100 p-4 rounded-2xl flex-row items-center mb-8">
                        <View className="w-10 h-10 rounded-full bg-green-50 items-center justify-center mr-4">
                            <Ionicons name="trending-up" size={20} color="#10b981" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-green-900 font-bold text-lg">With Storytime</Text>
                            <Text className="text-green-700/60 text-sm">Steady mastery within 3 months</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={() => router.push('/(onboarding)/parent/final-warning')}
                        className="w-full bg-gray-900 py-4 rounded-full flex-row items-center justify-center"
                    >
                        <Text className="text-white text-lg font-bold mr-2">Change The Future</Text>
                        <Ionicons name="arrow-forward" size={20} color="white" />
                    </TouchableOpacity>
                </Animated.View>
            )}
        </View>
    );
}
