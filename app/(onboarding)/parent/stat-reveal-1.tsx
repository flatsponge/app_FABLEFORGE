import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInUp, ZoomIn, useSharedValue, useAnimatedProps, withTiming, Easing, withDelay } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const { width } = Dimensions.get('window');

const CIRCLE_SIZE = width * 0.6;
const RADIUS = CIRCLE_SIZE / 2 - 10;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function StatReveal1Screen() {
    const router = useRouter();
    const [showContext, setShowContext] = useState(false);

    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withDelay(500, withTiming(0.22, { duration: 1500, easing: Easing.out(Easing.exp) }));

        const timer = setTimeout(() => setShowContext(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    const animatedProps = useAnimatedProps(() => {
        return {
            strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
        };
    });

    return (
        <View className="flex-1 bg-white items-center justify-center px-6">
            <Animated.View entering={FadeIn.delay(200)} className="items-center w-full mb-12">
                <View className="flex-row items-center mb-6">
                    <View className="bg-red-50 px-3 py-1 rounded-full border border-red-100 flex-row items-center">
                        <View className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2" />
                        <Text className="text-red-600 uppercase tracking-widest text-[10px] font-bold">
                            Critical Finding 1 of 4
                        </Text>
                    </View>
                </View>

                <Text className="text-3xl text-gray-900 font-serif text-center mb-10">
                    Patience Score
                </Text>

                {/* Circular Progress */}
                <View className="relative items-center justify-center" style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}>
                    <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE} className="absolute">
                        <Circle
                            cx={CIRCLE_SIZE / 2}
                            cy={CIRCLE_SIZE / 2}
                            r={RADIUS}
                            stroke="#f3f4f6"
                            strokeWidth={20}
                            fill="none"
                        />
                        <AnimatedCircle
                            cx={CIRCLE_SIZE / 2}
                            cy={CIRCLE_SIZE / 2}
                            r={RADIUS}
                            stroke="#ef4444"
                            strokeWidth={20}
                            fill="none"
                            strokeDasharray={CIRCUMFERENCE}
                            strokeLinecap="round"
                            rotation="-90"
                            origin={`${CIRCLE_SIZE / 2}, ${CIRCLE_SIZE / 2}`}
                            animatedProps={animatedProps}
                        />
                    </Svg>

                    <View className="items-center justify-center">
                        <Animated.Text entering={ZoomIn.delay(800).springify()} className="text-6xl font-black text-gray-900 leading-tight">
                            22%
                        </Animated.Text>
                        <View className="bg-red-100 px-3 py-1 rounded-full mt-4">
                            <Text className="text-red-700 text-xs font-bold uppercase tracking-wide">Critical Area</Text>
                        </View>
                    </View>
                </View>
            </Animated.View>

            {showContext && (
                <Animated.View entering={FadeInUp.springify().damping(15)} className="w-full bg-gray-50 p-6 rounded-3xl border border-gray-100">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-gray-500 font-medium">Ideally by this age</Text>
                        <Text className="text-green-600 font-bold text-lg">70%</Text>
                    </View>

                    <View className="h-2.5 bg-gray-200 rounded-full mb-6 overflow-hidden relative">
                        <View className="absolute top-0 bottom-0 w-0.5 bg-green-500 z-10" style={{ left: '70%' }} />
                        <View className="h-full bg-red-500 rounded-full w-[22%]" />
                    </View>

                    <Text className="text-gray-600 text-center mb-6 leading-relaxed">
                        Your child is scoring <Text className="text-red-600 font-bold">48 points lower</Text> than the healthy benchmark for their age group.
                    </Text>

                    <TouchableOpacity
                        onPress={() => router.push('/(onboarding)/parent/stat-reveal-2')}
                        className="w-full bg-gray-900 py-4 rounded-full flex-row items-center justify-center"
                    >
                        <Text className="text-white text-lg font-bold mr-2">Continue</Text>
                        <Ionicons name="arrow-forward" size={20} color="white" />
                    </TouchableOpacity>
                </Animated.View>
            )}
        </View>
    );
}
