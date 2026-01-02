import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Svg, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, { FadeIn, FadeInDown, SlideInUp, useSharedValue, withTiming, useAnimatedProps, withDelay } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const GRAPH_WIDTH = width - 48;
const GRAPH_HEIGHT = 180;

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function PositiveOutlookScreen() {
    const router = useRouter();
    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withDelay(300, withTiming(1, { duration: 1500 }));
    }, []);

    // Cubic Bézier (C) requires exactly 3 points: control1, control2, end
    const path = `M 0 ${GRAPH_HEIGHT} C ${GRAPH_WIDTH * 0.3} ${GRAPH_HEIGHT * 0.5}, ${GRAPH_WIDTH * 0.6} ${GRAPH_HEIGHT * 0.2}, ${GRAPH_WIDTH} 10`;

    const fillPath = `${path} L ${GRAPH_WIDTH} ${GRAPH_HEIGHT} L 0 ${GRAPH_HEIGHT} Z`;

    const animatedProps = useAnimatedProps(() => ({
        strokeDashoffset: 1000 * (1 - progress.value),
    }));

    return (
        <View className="flex-1 bg-white">
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>

                {/* Hero Section */}
                <View className="bg-green-50 pt-16 pb-10 rounded-b-[40px] px-6">
                    <Animated.View entering={FadeInDown} className="items-center mb-6">
                        <View className="bg-white p-3 rounded-full mb-4">
                            <Ionicons name="sparkles" size={32} color="#10b981" />
                        </View>
                        <Text className="text-3xl font-serif text-green-900 text-center mb-2">
                            A Brighter Future
                        </Text>
                        <Text className="text-green-700 text-center leading-relaxed max-w-[300px]">
                            With consistent storytelling, your child can master these skills in weeks, not years.
                        </Text>
                    </Animated.View>

                    {/* Success Chart */}
                    <View className="bg-white p-6 rounded-3xl mb-4">
                        <Text className="text-gray-400 text-xs font-bold uppercase mb-4 tracking-widest">Projected Skill Growth</Text>
                        <View className="h-[180px] w-full relative">
                            <Svg width={GRAPH_WIDTH - 48} height={GRAPH_HEIGHT}>
                                <Defs>
                                    <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                                        <Stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                                        <Stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                                    </LinearGradient>
                                </Defs>
                                <Path d={fillPath} fill="url(#grad)" />
                                <AnimatedPath
                                    d={path}
                                    stroke="#10b981"
                                    strokeWidth={4}
                                    fill="none"
                                    strokeDasharray={1000}
                                    animatedProps={animatedProps}
                                />
                            </Svg>
                            {/* Floating improvement badge */}
                            <Animated.View
                                entering={FadeIn.delay(1500)}
                                className="absolute top-0 right-0 bg-green-100 px-3 py-1 rounded-full border border-green-200"
                            >
                                <Text className="text-green-700 text-xs font-bold">+72% Improved</Text>
                            </Animated.View>
                        </View>
                        <View className="flex-row justify-between mt-2">
                            <Text className="text-gray-400 text-xs">Week 1</Text>
                            <Text className="text-gray-400 text-xs">Week 4</Text>
                            <Text className="text-gray-400 text-xs">Week 8</Text>
                        </View>
                    </View>
                </View>

                {/* Benefits Grid */}
                <View className="px-6 mt-8">
                    <Text className="text-xl font-bold text-gray-900 mb-6 px-2">What you can expect</Text>

                    <View className="flex-row flex-wrap justify-between">
                        {[
                            { title: "Better Sleep", icon: "moon", color: "#8b5cf6" },
                            { title: "More Patience", icon: "hourglass", color: "#f59e0b" },
                            { title: "Less Conflict", icon: "heart", color: "#ec4899" },
                            { title: "Confidence", icon: "star", color: "#3b82f6" },
                        ].map((item, i) => (
                            <Animated.View
                                key={i}
                                entering={FadeInDown.delay(400 + (i * 100))}
                                className="w-[48%] bg-gray-50 p-4 rounded-2xl mb-4 border border-gray-100"
                            >
                                <Ionicons name={item.icon as any} size={24} color={item.color} style={{ marginBottom: 12 }} />
                                <Text className="font-bold text-gray-900">{item.title}</Text>
                                <Text className="text-green-600 text-xs font-bold mt-1">Improved</Text>
                            </Animated.View>
                        ))}
                    </View>

                    <Animated.View entering={FadeInDown.delay(800)} className="bg-gray-900 p-5 rounded-3xl mt-4">
                        <View className="flex-row items-center mb-4">
                            <View className="bg-white/10 p-2 rounded-full mr-3">
                                <Ionicons name="people" size={20} color="white" />
                            </View>
                            <Text className="text-white font-bold text-lg">Join 50,000+ Parents</Text>
                        </View>
                        <Text className="text-gray-400 leading-relaxed italic">
                            "It used to take me 45 minutes to calm him down. Now we read one story and he's ready to listen. It's like magic."
                        </Text>
                        <Text className="text-gray-500 text-sm mt-3 font-medium">— Sarah J., Mom of 5-year-old</Text>
                    </Animated.View>
                </View>

            </ScrollView>

            {/* Final CTA */}
            <View className="absolute bottom-0 left-0 right-0 p-6 bg-white/90 blur-xl">
                <TouchableOpacity
                    onPress={() => router.push('/(onboarding)/paywall')}
                    className="w-full bg-green-600 py-5 rounded-full items-center"
                >
                    <Text className="text-white text-lg font-bold">Start My 7-Day Free Trial</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
