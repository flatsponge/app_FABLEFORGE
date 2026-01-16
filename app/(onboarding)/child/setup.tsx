import React, { useState } from 'react';
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
    
    const canContinue = data.audioEnabled !== undefined;

    return (
        <LinearGradient
            colors={['#FEF7ED', '#FFF7ED', '#FFFBEB']}
            style={{ flex: 1 }}
        >
            <View style={{ flex: 1, paddingTop: insets.top }}>
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingBottom: 24 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <Animated.View
                        entering={FadeInDown.delay(200).springify()}
                        style={{ alignItems: 'center', marginTop: 32, marginBottom: 40 }}
                    >
                        <Image
                            source={require('../../../assets/images/shooting-star.png')}
                            style={{ width: 100, height: 100, marginBottom: 20 }}
                            resizeMode="contain"
                        />
                        <Text style={{
                            fontSize: 28,
                            fontWeight: '900',
                            color: '#1F2937',
                            textAlign: 'center',
                            letterSpacing: -0.5,
                        }}>
                            Let's build your child's hero
                        </Text>
                        <Text style={{
                            fontSize: 16,
                            color: '#6B7280',
                            textAlign: 'center',
                            marginTop: 8,
                        }}>
                            Grab your child if they're around—it's more fun together!
                        </Text>
                    </Animated.View>

                    {/* Voice Selection */}
                    <Animated.View entering={FadeInUp.delay(400).springify()}>
                        <Text style={{
                            fontSize: 14,
                            fontWeight: '700',
                            color: '#374151',
                            marginBottom: 12,
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                        }}>
                            Voice Input
                        </Text>

                        {/* Enable Voice Option */}
                        <Pressable
                            onPress={() => updateData({ audioEnabled: true })}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                padding: 16,
                                borderRadius: 16,
                                borderWidth: 2,
                                borderColor: data.audioEnabled === true ? '#22C55E' : '#E5E7EB',
                                backgroundColor: data.audioEnabled === true ? '#F0FDF4' : 'white',
                                marginBottom: 10,
                            }}
                        >
                            <View style={{
                                width: 22,
                                height: 22,
                                borderRadius: 11,
                                borderWidth: 2,
                                borderColor: data.audioEnabled === true ? '#22C55E' : '#D1D5DB',
                                backgroundColor: data.audioEnabled === true ? '#22C55E' : 'transparent',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 12,
                            }}>
                                {data.audioEnabled === true && (
                                    <Ionicons name="checkmark" size={14} color="white" />
                                )}
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ 
                                    fontSize: 16, 
                                    fontWeight: '700', 
                                    color: data.audioEnabled === true ? '#166534' : '#1F2937',
                                }}>
                                    Enable voice 🎤
                                </Text>
                                <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>
                                    Child speaks story ideas naturally
                                </Text>
                            </View>
                        </Pressable>

                        {/* Skip Voice Option */}
                        <Pressable
                            onPress={() => updateData({ audioEnabled: false })}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                padding: 16,
                                borderRadius: 16,
                                borderWidth: 2,
                                borderColor: data.audioEnabled === false ? '#9CA3AF' : '#E5E7EB',
                                backgroundColor: data.audioEnabled === false ? '#F9FAFB' : 'white',
                            }}
                        >
                            <View style={{
                                width: 22,
                                height: 22,
                                borderRadius: 11,
                                borderWidth: 2,
                                borderColor: data.audioEnabled === false ? '#6B7280' : '#D1D5DB',
                                backgroundColor: data.audioEnabled === false ? '#6B7280' : 'transparent',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 12,
                            }}>
                                {data.audioEnabled === false && (
                                    <Ionicons name="checkmark" size={14} color="white" />
                                )}
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ 
                                    fontSize: 16, 
                                    fontWeight: '700', 
                                    color: data.audioEnabled === false ? '#374151' : '#1F2937',
                                }}>
                                    Text only
                                </Text>
                                <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>
                                    Type or tap to suggest ideas
                                </Text>
                            </View>
                        </Pressable>

                        {/* Privacy note */}
                        {data.audioEnabled === true && (
                            <Animated.View 
                                entering={FadeInUp.duration(200)}
                                style={{ marginTop: 12, paddingHorizontal: 4 }}
                            >
                                <Text style={{ fontSize: 12, color: '#6B7280', lineHeight: 18 }}>
                                    🔒 Audio is processed securely and never stored.
                                </Text>
                            </Animated.View>
                        )}
                    </Animated.View>
                </ScrollView>

                {/* Bottom CTA */}
                <View style={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 16 }}>
                    <ChunkyButton
                        onPress={() => canContinue && router.push('/(onboarding)/child/mascot-name')}
                        bgColor={canContinue ? "#22C55E" : "#D1D5DB"}
                        borderColor={canContinue ? "#16A34A" : "#9CA3AF"}
                        size="large"
                    >
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 16,
                            gap: 8
                        }}>
                            <Text style={{
                                fontSize: 18,
                                fontWeight: '800',
                                color: canContinue ? 'white' : '#9CA3AF',
                            }}>
                                {canContinue ? "Continue" : "Select an option"}
                            </Text>
                            {canContinue && <Ionicons name="arrow-forward" size={22} color="white" />}
                        </View>
                    </ChunkyButton>
                </View>
            </View>
        </LinearGradient>
    );
}
