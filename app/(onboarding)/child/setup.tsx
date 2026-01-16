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
                            fontSize: 13,
                            fontWeight: '700',
                            color: '#6B7280',
                            marginBottom: 16,
                            textTransform: 'uppercase',
                            letterSpacing: 1,
                            textAlign: 'center',
                        }}>
                            How should we capture ideas?
                        </Text>

                        <View style={{ gap: 12 }}>
                            {/* Enable Voice Option */}
                            <Pressable
                                onPress={() => updateData({ audioEnabled: true })}
                                style={({ pressed }) => ({
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    padding: 20,
                                    borderRadius: 24,
                                    borderWidth: 2,
                                    borderColor: data.audioEnabled === true ? '#22C55E' : 'transparent',
                                    backgroundColor: 'white',
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.05,
                                    shadowRadius: 12,
                                    elevation: 2,
                                    transform: [{ scale: pressed ? 0.98 : 1 }]
                                })}
                            >
                                <View style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 24,
                                    backgroundColor: data.audioEnabled === true ? '#DCFCE7' : '#F3F4F6',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 16,
                                }}>
                                    <Ionicons
                                        name="mic"
                                        size={24}
                                        color={data.audioEnabled === true ? '#16A34A' : '#6B7280'}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                        <Text style={{
                                            fontSize: 17,
                                            fontWeight: '700',
                                            color: '#1F2937',
                                        }}>
                                            Voice Mode
                                        </Text>
                                        {data.audioEnabled === true && (
                                            <View style={{ backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 }}>
                                                <Text style={{ fontSize: 11, fontWeight: '700', color: '#16A34A' }}>RECOMMENDED</Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text style={{ fontSize: 14, color: '#6B7280', lineHeight: 20 }}>
                                        Child speaks freely, we write the story
                                    </Text>
                                </View>
                                <View style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: 12,
                                    borderWidth: 2,
                                    borderColor: data.audioEnabled === true ? '#22C55E' : '#E5E7EB',
                                    backgroundColor: data.audioEnabled === true ? '#22C55E' : 'transparent',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    {data.audioEnabled === true && (
                                        <Ionicons name="checkmark" size={16} color="white" />
                                    )}
                                </View>
                            </Pressable>

                            {/* Text Only Option */}
                            <Pressable
                                onPress={() => updateData({ audioEnabled: false })}
                                style={({ pressed }) => ({
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    padding: 20,
                                    borderRadius: 24,
                                    borderWidth: 2,
                                    borderColor: data.audioEnabled === false ? '#1F2937' : 'transparent',
                                    backgroundColor: 'white',
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.05,
                                    shadowRadius: 12,
                                    elevation: 2,
                                    transform: [{ scale: pressed ? 0.98 : 1 }]
                                })}
                            >
                                <View style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 24,
                                    backgroundColor: data.audioEnabled === false ? '#E5E7EB' : '#F3F4F6',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 16,
                                }}>
                                    <Ionicons
                                        name="keypad"
                                        size={24}
                                        color={data.audioEnabled === false ? '#1F2937' : '#6B7280'}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{
                                        fontSize: 17,
                                        fontWeight: '700',
                                        color: '#1F2937',
                                        marginBottom: 4,
                                    }}>
                                        Keyboard Only
                                    </Text>
                                    <Text style={{ fontSize: 14, color: '#6B7280', lineHeight: 20 }}>
                                        Type keywords or choose from lists
                                    </Text>
                                </View>
                                <View style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: 12,
                                    borderWidth: 2,
                                    borderColor: data.audioEnabled === false ? '#1F2937' : '#E5E7EB',
                                    backgroundColor: data.audioEnabled === false ? '#1F2937' : 'transparent',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    {data.audioEnabled === false && (
                                        <Ionicons name="checkmark" size={16} color="white" />
                                    )}
                                </View>
                            </Pressable>
                        </View>

                        {/* Privacy note */}
                        <Animated.View
                            entering={FadeInUp.delay(600)}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: 24,
                                gap: 6,
                                opacity: 0.7
                            }}
                        >
                            <Ionicons name="shield-checkmark" size={14} color="#6B7280" />
                            <Text style={{ fontSize: 12, color: '#6B7280', fontWeight: '500' }}>
                                Privacy First • Audio is never stored
                            </Text>
                        </Animated.View>
                    </Animated.View>                </ScrollView>

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
