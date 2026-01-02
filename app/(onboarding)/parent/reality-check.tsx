import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Svg, Path, Circle, Line, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import Animated, { FadeIn, FadeInDown, SlideInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Skills data matching the stats page - showing concerning levels
const SKILLS_ANALYSIS = [
    { id: 'patience', name: 'Patience', score: 22, benchmark: 70, icon: '⏳', color: '#ef4444', status: 'critical' },
    { id: 'responsibility', name: 'Responsibility', score: 18, benchmark: 65, icon: '📋', color: '#ef4444', status: 'critical' },
    { id: 'honesty', name: 'Honesty', score: 31, benchmark: 75, icon: '💬', color: '#f97316', status: 'needs_work' },
    { id: 'empathy', name: 'Empathy', score: 45, benchmark: 80, icon: '❤️', color: '#f97316', status: 'needs_work' },
    { id: 'teamwork', name: 'Teamwork', score: 52, benchmark: 72, icon: '👫', color: '#eab308', status: 'developing' },
];

// Alarming research statistics
const ALARMING_STATS = [
    { stat: '73%', description: 'of behavioral patterns are set by age 7', source: 'Harvard Child Development' },
    { stat: '4x', description: 'harder to change habits after age 8', source: 'Journal of Pediatric Psychology' },
    { stat: '89%', description: 'of parents wish they started earlier', source: 'Parent Survey 2024' },
];

const AnimatedProgressBar = ({ score, benchmark, color, delay }: { score: number; benchmark: number; color: string; delay: number }) => {
    const [animatedWidth, setAnimatedWidth] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setAnimatedWidth(score), delay);
        return () => clearTimeout(timer);
    }, []);

    const gap = benchmark - score;

    return (
        <View>
            <View className="h-4 bg-gray-100 rounded-full overflow-hidden relative">
                <View
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${animatedWidth}%`, backgroundColor: color }}
                />
                {/* Benchmark marker */}
                <View
                    className="absolute top-0 bottom-0 w-1 bg-green-500"
                    style={{ left: `${benchmark}%` }}
                />
            </View>
            <View className="flex-row justify-between mt-1">
                <Text className="text-xs text-gray-400">Your child: {score}%</Text>
                <Text className="text-xs text-green-600 font-medium">Target: {benchmark}%</Text>
            </View>
            {gap > 30 && (
                <View className="bg-red-50 px-2 py-1 rounded mt-2">
                    <Text className="text-red-600 text-xs font-medium">⚠️ {gap}% below age benchmark</Text>
                </View>
            )}
        </View>
    );
};

export default function RealityCheckScreen() {
    const router = useRouter();
    const [showWarning, setShowWarning] = useState(false);
    const [showStats, setShowStats] = useState(false);

    useEffect(() => {
        const timer1 = setTimeout(() => setShowWarning(true), 1500);
        const timer2 = setTimeout(() => setShowStats(true), 2500);
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    // Graph paths
    const graphWidth = width - 80;
    const graphHeight = 160;

    // Without intervention (declining sharply)
    const pathWithout = `M 0 40 Q ${graphWidth * 0.25} 55, ${graphWidth * 0.4} 75 Q ${graphWidth * 0.6} 100, ${graphWidth * 0.8} 130 L ${graphWidth} 145`;
    // With intervention (improving steadily)
    const pathWith = `M 0 40 Q ${graphWidth * 0.25} 30, ${graphWidth * 0.5} 20 Q ${graphWidth * 0.75} 12, ${graphWidth} 8`;

    const criticalCount = SKILLS_ANALYSIS.filter(s => s.status === 'critical').length;
    const needsWorkCount = SKILLS_ANALYSIS.filter(s => s.status === 'needs_work').length;

    return (
        <ScrollView
            className="flex-1 bg-white"
            contentContainerStyle={{ paddingBottom: 60 }}
            showsVerticalScrollIndicator={false}
        >
            {/* Critical Header */}
            <View className="bg-red-500 pt-16 pb-10 px-6">
                <Animated.View entering={FadeIn.delay(200)} className="items-center">
                    <View className="bg-white p-4 rounded-full mb-4">
                        <Ionicons name="alert-circle" size={48} color="#ef4444" />
                    </View>
                    <Text className="text-3xl font-bold text-center text-white mb-2">
                        Important Discovery
                    </Text>
                    <Text className="text-lg text-center text-red-100">
                        Your assessment revealed {criticalCount} critical areas
                    </Text>
                </Animated.View>
            </View>

            <View className="px-6 -mt-6">
                {/* Summary Card */}
                <Animated.View entering={SlideInUp.delay(300)} className="bg-white rounded-3xl p-6 border border-gray-100 mb-6">
                    <View className="flex-row justify-between mb-4">
                        <View className="items-center flex-1">
                            <Text className="text-4xl font-black text-red-500">{criticalCount}</Text>
                            <Text className="text-xs text-gray-500 text-center">Critical{'\n'}Areas</Text>
                        </View>
                        <View className="w-px bg-gray-200" />
                        <View className="items-center flex-1">
                            <Text className="text-4xl font-black text-orange-500">{needsWorkCount}</Text>
                            <Text className="text-xs text-gray-500 text-center">Needs{'\n'}Attention</Text>
                        </View>
                        <View className="w-px bg-gray-200" />
                        <View className="items-center flex-1">
                            <Text className="text-4xl font-black text-gray-400">32%</Text>
                            <Text className="text-xs text-gray-500 text-center">Overall{'\n'}Score</Text>
                        </View>
                    </View>
                    <View className="bg-red-50 p-3 rounded-xl">
                        <Text className="text-red-700 text-sm text-center font-medium">
                            Below average for age group. Early intervention recommended.
                        </Text>
                    </View>
                </Animated.View>

                {/* Skills Assessment */}
                <Animated.View entering={SlideInUp.delay(500)} className="mb-8">
                    <Text className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                        Detailed Skill Assessment
                    </Text>

                    {SKILLS_ANALYSIS.map((skill, index) => (
                        <Animated.View
                            key={skill.id}
                            entering={FadeInDown.delay(600 + index * 100)}
                            className="mb-5 bg-gray-50 p-4 rounded-2xl"
                        >
                            <View className="flex-row items-center justify-between mb-3">
                                <View className="flex-row items-center">
                                    <Text className="text-2xl mr-3">{skill.icon}</Text>
                                    <Text className="font-bold text-gray-800 text-lg">{skill.name}</Text>
                                </View>
                                {skill.status === 'critical' && (
                                    <View className="bg-red-500 px-3 py-1 rounded-full">
                                        <Text className="text-white text-xs font-bold">CRITICAL</Text>
                                    </View>
                                )}
                                {skill.status === 'needs_work' && (
                                    <View className="bg-orange-500 px-3 py-1 rounded-full">
                                        <Text className="text-white text-xs font-bold">AT RISK</Text>
                                    </View>
                                )}
                            </View>
                            <AnimatedProgressBar
                                score={skill.score}
                                benchmark={skill.benchmark}
                                color={skill.color}
                                delay={700 + index * 100}
                            />
                        </Animated.View>
                    ))}
                </Animated.View>

                {/* Trajectory Graph */}
                <Animated.View entering={SlideInUp.delay(1000)} className="bg-gray-900 rounded-3xl p-6 mb-8">
                    <Text className="font-bold text-white mb-1 text-lg">Behavioral Trajectory</Text>
                    <Text className="text-sm text-gray-400 mb-6">Projected development over next 12 months</Text>

                    <View className="relative">
                        <Svg height={graphHeight} width={graphWidth}>
                            <Defs>
                                <LinearGradient id="gradRed" x1="0" y1="0" x2="0" y2="1">
                                    <Stop offset="0%" stopColor="#ef4444" stopOpacity={0.4} />
                                    <Stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                                </LinearGradient>
                                <LinearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
                                    <Stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
                                    <Stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                                </LinearGradient>
                            </Defs>

                            {/* Grid lines */}
                            <Line x1="0" y1="40" x2={graphWidth} y2="40" stroke="#374151" strokeWidth="1" strokeDasharray="4,4" />
                            <Line x1="0" y1="80" x2={graphWidth} y2="80" stroke="#374151" strokeWidth="1" strokeDasharray="4,4" />
                            <Line x1="0" y1="120" x2={graphWidth} y2="120" stroke="#374151" strokeWidth="1" strokeDasharray="4,4" />

                            {/* Area fills */}
                            <Path d={`${pathWithout} L ${graphWidth} ${graphHeight} L 0 ${graphHeight} Z`} fill="url(#gradRed)" />
                            <Path d={`${pathWith} L ${graphWidth} ${graphHeight} L 0 ${graphHeight} Z`} fill="url(#gradGreen)" />

                            {/* Without intervention (red, declining) */}
                            <Path d={pathWithout} stroke="#ef4444" strokeWidth="3" fill="none" strokeLinecap="round" />
                            <Circle cx={graphWidth} cy="145" r="8" fill="#ef4444" />

                            {/* With intervention (green, improving) */}
                            <Path d={pathWith} stroke="#22c55e" strokeWidth="3" fill="none" strokeLinecap="round" />
                            <Circle cx={graphWidth} cy="8" r="8" fill="#22c55e" />
                        </Svg>

                        {/* Labels */}
                        <View className="absolute top-0 right-0">
                            <View className="bg-green-500 px-3 py-1.5 rounded-lg">
                                <Text className="text-white text-xs font-bold">With Storytime</Text>
                            </View>
                        </View>
                        <View className="absolute bottom-4 right-0">
                            <View className="bg-red-500 px-3 py-1.5 rounded-lg">
                                <Text className="text-white text-xs font-bold">Status Quo</Text>
                            </View>
                        </View>
                    </View>

                    <View className="flex-row justify-between mt-4 px-1">
                        <Text className="text-xs text-gray-500">Today</Text>
                        <Text className="text-xs text-gray-500">3 Mo</Text>
                        <Text className="text-xs text-gray-500">6 Mo</Text>
                        <Text className="text-xs text-gray-500">12 Mo</Text>
                    </View>
                </Animated.View>

                {/* Alarming Research Stats */}
                {showStats && (
                    <Animated.View entering={FadeIn} className="mb-8">
                        <Text className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                            Research Says...
                        </Text>
                        {ALARMING_STATS.map((item, index) => (
                            <View key={index} className="bg-amber-50 border border-amber-200 p-4 rounded-2xl mb-3">
                                <View className="flex-row items-center">
                                    <Text className="text-3xl font-black text-amber-600 mr-4">{item.stat}</Text>
                                    <View className="flex-1">
                                        <Text className="text-gray-800 font-medium">{item.description}</Text>
                                        <Text className="text-xs text-gray-500 mt-1">{item.source}</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </Animated.View>
                )}

                {/* Urgent Warning Box */}
                {showWarning && (
                    <Animated.View entering={FadeIn} className="bg-red-600 p-6 rounded-3xl mb-8">
                        <View className="flex-row items-start">
                            <View className="bg-white rounded-full p-2 mr-4">
                                <Ionicons name="warning" size={24} color="#dc2626" />
                            </View>
                            <View className="flex-1">
                                <Text className="font-bold text-white text-lg mb-2">Time-Sensitive Window</Text>
                                <Text className="text-red-100 leading-relaxed mb-4">
                                    Your child's <Text className="font-bold text-white">Patience</Text> score of 22% and <Text className="font-bold text-white">Responsibility</Text> score of 18% are in the critical range.
                                </Text>
                                <Text className="text-white leading-relaxed">
                                    Research from Harvard's Center on the Developing Child shows that the neural pathways for these skills are <Text className="font-bold underline">75% formed by age 7</Text>. After this window closes, behavioral change requires 4x more effort.
                                </Text>
                            </View>
                        </View>
                    </Animated.View>
                )}

                {/* Success Stories */}
                <Animated.View entering={SlideInUp.delay(1500)} className="bg-green-50 border border-green-200 p-6 rounded-3xl mb-8">
                    <View className="flex-row items-center mb-4">
                        <Ionicons name="star" size={24} color="#16a34a" />
                        <Text className="font-bold text-green-800 ml-2 text-lg">Parent Success Stories</Text>
                    </View>
                    <Text className="text-green-800 italic mb-3">
                        "After just 2 weeks of bedtime stories, my son started sharing toys without being asked. His teacher noticed the change too."
                    </Text>
                    <Text className="text-green-600 font-medium text-sm">— Sarah M., mom of 5-year-old</Text>

                    <View className="h-px bg-green-200 my-4" />

                    <View className="flex-row justify-between">
                        <View className="items-center">
                            <Text className="text-2xl font-black text-green-600">94%</Text>
                            <Text className="text-xs text-green-700">See improvement</Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-2xl font-black text-green-600">14 days</Text>
                            <Text className="text-xs text-green-700">Avg. time to results</Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-2xl font-black text-green-600">50K+</Text>
                            <Text className="text-xs text-green-700">Happy families</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* CTA */}
                <TouchableOpacity
                    onPress={() => router.push('/(onboarding)/paywall')}
                    className="bg-primary-600 py-5 rounded-full items-center mb-3"
                >
                    <Text className="text-white text-lg font-bold">Start My Child's Transformation</Text>
                </TouchableOpacity>

                <Text className="text-center text-gray-400 text-sm mb-6">
                    7-day free trial • Cancel anytime
                </Text>
            </View>
        </ScrollView>
    );
}
