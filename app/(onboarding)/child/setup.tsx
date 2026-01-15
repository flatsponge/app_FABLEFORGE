import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import { ChunkyButton } from '@/components/ChunkyButton';

export default function ChildSetupScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { data, updateData } = useOnboarding();
    
    // Auto-scroll state
    const [viewportHeight, setViewportHeight] = useState(0);
    const [contentHeight, setContentHeight] = useState(0);
    
    // Always allow continue in this new design, it's just instructions
    const canContinue = true; 

    return (
        <LinearGradient
            colors={['#FEF7ED', '#FFF7ED', '#FFFBEB']}
            style={{ flex: 1 }}
        >
            <View style={{ flex: 1, paddingTop: insets.top }}>
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24 }}
                    scrollEnabled={contentHeight > viewportHeight}
                    showsVerticalScrollIndicator={false}
                    onLayout={(e) => setViewportHeight(e.nativeEvent.layout.height)}
                    onContentSizeChange={(_, h) => setContentHeight(h)}
                >
                    
                    {/* Header Section */}
                    <Animated.View
                        entering={FadeInDown.delay(200).springify()}
                        style={{ alignItems: 'center', marginTop: 20, marginBottom: 30 }}
                    >
                        <Image
                            source={require('../../../assets/images/shooting-star.png')}
                            style={{ width: 120, height: 120, marginBottom: 16 }}
                            resizeMode="contain"
                        />
                        <Text style={{
                            fontSize: 32,
                            fontWeight: '900',
                            color: '#1F2937',
                            textAlign: 'center',
                            letterSpacing: -1,
                            marginBottom: 8,
                        }}>
                            We're about to build your child's hero.
                        </Text>
                    </Animated.View>

                    {/* Main "How to" Card */}
                    <Animated.View
                        entering={FadeInUp.delay(400).springify()}
                        style={{
                            backgroundColor: 'white',
                            borderRadius: 24,
                            padding: 24,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.05,
                            shadowRadius: 12,
                            elevation: 3,
                            marginBottom: 24,
                            borderWidth: 1,
                            borderColor: '#F3F4F6'
                        }}
                    >
                        {/* Primary Option: Together */}
                        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 24 }}>
                            <View style={{
                                backgroundColor: '#F5F3FF',
                                width: 48,
                                height: 48,
                                borderRadius: 16,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 16
                            }}>
                                <Ionicons name="people" size={26} color="#7C3AED" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                    <Text style={{ fontSize: 18, fontWeight: '800', color: '#1F2937' }}>
                                        Do it Together
                                    </Text>
                                    <View style={{
                                        backgroundColor: '#7C3AED',
                                        paddingHorizontal: 8,
                                        paddingVertical: 2,
                                        borderRadius: 100,
                                        marginLeft: 8
                                    }}>
                                        <Text style={{ fontSize: 10, fontWeight: '800', color: 'white' }}>BEST</Text>
                                    </View>
                                </View>
                                <Text style={{ fontSize: 15, color: '#4B5563', lineHeight: 22 }}>
                                    Grab your child! Let them pick their favorite character—it's way more fun.
                                </Text>
                            </View>
                        </View>

                        {/* Divider */}
                        <View style={{ height: 1, backgroundColor: '#F3F4F6', marginLeft: 64, marginBottom: 20 }} />

                        {/* Secondary Option: Solo */}
                        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                            <View style={{
                                width: 48,
                                height: 48,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 16
                            }}>
                                <Ionicons name="person-outline" size={24} color="#9CA3AF" />
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', minHeight: 48 }}>
                                <Text style={{ fontSize: 15, color: '#6B7280', lineHeight: 22 }}>
                                    <Text style={{ fontWeight: '600', color: '#4B5563' }}>Or set it up yourself</Text> if they aren't around right now.
                                </Text>
                            </View>
                        </View>
                    </Animated.View>

                    {/* Voice Storytelling Selection */}
                    <Animated.View
                        entering={FadeInUp.delay(550)}
                        style={{
                            width: '100%',
                            backgroundColor: 'white',
                            borderRadius: 20,
                            padding: 20,
                            marginBottom: 24,
                            borderWidth: 1,
                            borderColor: '#E5E7EB',
                        }}
                    >
                        {/* Header */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                            <View style={{
                                backgroundColor: '#F3E8FF',
                                width: 44,
                                height: 44,
                                borderRadius: 12,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 12,
                            }}>
                                <Ionicons name="mic" size={24} color="#9333EA" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 17, fontWeight: '800', color: '#1F2937' }}>
                                    Voice Storytelling
                                </Text>
                                <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>
                                    Allow your child to speak story ideas
                                </Text>
                            </View>
                        </View>

                        {/* Two-Option Selection */}
                        <View style={{ gap: 12 }}>
                            {/* Recommended Option */}
                            <Pressable
                                onPress={() => updateData({ audioEnabled: true })}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    padding: 16,
                                    borderRadius: 14,
                                    borderWidth: 2,
                                    borderColor: data.audioEnabled === true ? '#22C55E' : '#E5E7EB',
                                    backgroundColor: data.audioEnabled === true ? '#F0FDF4' : '#FAFAFA',
                                }}
                            >
                                <View style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: 12,
                                    borderWidth: 2,
                                    borderColor: data.audioEnabled === true ? '#22C55E' : '#D1D5DB',
                                    backgroundColor: data.audioEnabled === true ? '#22C55E' : 'transparent',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 14,
                                }}>
                                    {data.audioEnabled === true && (
                                        <Ionicons name="checkmark" size={14} color="white" />
                                    )}
                                </View>
                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                        <Text style={{ 
                                            fontSize: 15, 
                                            fontWeight: '700', 
                                            color: data.audioEnabled === true ? '#166534' : '#374151' 
                                        }}>
                                            Enable Voice
                                        </Text>
                                        <View style={{
                                            backgroundColor: '#22C55E',
                                            paddingHorizontal: 8,
                                            paddingVertical: 3,
                                            borderRadius: 6,
                                        }}>
                                            <Text style={{ fontSize: 10, fontWeight: '800', color: 'white' }}>
                                                RECOMMENDED
                                            </Text>
                                        </View>
                                    </View>
                                    <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 4, lineHeight: 16 }}>
                                        Your child can speak story ideas naturally
                                    </Text>
                                </View>
                            </Pressable>

                            {/* Not Recommended Option */}
                            <Pressable
                                onPress={() => updateData({ audioEnabled: false })}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    padding: 16,
                                    borderRadius: 14,
                                    borderWidth: 2,
                                    borderColor: data.audioEnabled === false ? '#F59E0B' : '#E5E7EB',
                                    backgroundColor: data.audioEnabled === false ? '#FFFBEB' : '#FAFAFA',
                                }}
                            >
                                <View style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: 12,
                                    borderWidth: 2,
                                    borderColor: data.audioEnabled === false ? '#F59E0B' : '#D1D5DB',
                                    backgroundColor: data.audioEnabled === false ? '#F59E0B' : 'transparent',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 14,
                                }}>
                                    {data.audioEnabled === false && (
                                        <Ionicons name="checkmark" size={14} color="white" />
                                    )}
                                </View>
                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                        <Text style={{ 
                                            fontSize: 15, 
                                            fontWeight: '700', 
                                            color: data.audioEnabled === false ? '#92400E' : '#374151' 
                                        }}>
                                            Skip Voice
                                        </Text>
                                        <View style={{
                                            backgroundColor: '#FEE2E2',
                                            paddingHorizontal: 8,
                                            paddingVertical: 3,
                                            borderRadius: 6,
                                        }}>
                                            <Text style={{ fontSize: 10, fontWeight: '700', color: '#DC2626' }}>
                                                NOT RECOMMENDED
                                            </Text>
                                        </View>
                                    </View>
                                    <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 4, lineHeight: 16 }}>
                                        Your child must type or tap to suggest ideas
                                    </Text>
                                </View>
                            </Pressable>
                        </View>

                        {/* Privacy Notice - shown when voice enabled */}
                        {data.audioEnabled === true && (
                            <View style={{ 
                                marginTop: 14, 
                                backgroundColor: '#F0FDF4', 
                                borderRadius: 10, 
                                padding: 12, 
                                borderWidth: 1, 
                                borderColor: '#BBF7D0' 
                            }}>
                                <Text style={{ fontSize: 11, color: '#166534', lineHeight: 15 }}>
                                    <Text style={{ fontWeight: '700' }}>Privacy: </Text>
                                    Audio is processed securely, converted to text, and never stored or shared.
                                </Text>
                            </View>
                        )}
                    </Animated.View>

                </ScrollView>

                {/* Bottom CTA */}
                <View style={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 20 }}>
                    <Animated.View entering={FadeInUp.delay(600).springify()}>
                        <ChunkyButton
                            onPress={() => router.push('/(onboarding)/child/mascot-name')}
                            bgColor="#22C55E"
                            borderColor="#16A34A"
                            size="large"
                        >
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 18,
                                gap: 10
                            }}>
                                <Text style={{
                                    fontSize: 20,
                                    fontWeight: '800',
                                    color: 'white',
                                    letterSpacing: 0.5,
                                }}>
                                    Let's Start!
                                </Text>
                                <Ionicons name="arrow-forward" size={24} color="white" />
                            </View>
                        </ChunkyButton>
                    </Animated.View>
                </View>
            </View>
        </LinearGradient>
    );
}