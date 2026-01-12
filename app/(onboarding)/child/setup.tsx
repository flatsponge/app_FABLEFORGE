import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Switch, Image, ScrollView } from 'react-native';
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

                    {/* Audio Opt-In Toggle */}
                    <Animated.View
                        entering={FadeInUp.delay(550)}
                        style={{
                            width: '100%',
                            backgroundColor: data.audioEnabled ? '#F0FDF4' : 'white',
                            borderRadius: 16,
                            padding: 16,
                            marginBottom: 24,
                            borderWidth: 2,
                            borderColor: data.audioEnabled ? '#86EFAC' : '#FCD34D',
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'flex-start', flex: 1, marginRight: 12 }}>
                                <View style={{
                                    backgroundColor: data.audioEnabled ? '#DCFCE7' : '#FEF3C7',
                                    width: 44,
                                    height: 44,
                                    borderRadius: 12,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 12,
                                    flexShrink: 0,
                                }}>
                                    <Ionicons name="mic" size={24} color={data.audioEnabled ? '#16A34A' : '#D97706'} />
                                </View>
                                <View style={{ flex: 1, paddingRight: 8 }}>
                                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 2 }}>
                                        Voice Storytelling
                                    </Text>
                                    {!data.audioEnabled && (
                                        <View style={{
                                            backgroundColor: '#FEE2E2',
                                            paddingHorizontal: 8,
                                            paddingVertical: 3,
                                            borderRadius: 4,
                                            alignSelf: 'flex-start',
                                            marginBottom: 4,
                                        }}>
                                            <Text style={{ fontSize: 10, fontWeight: '700', color: '#DC2626' }}>
                                                Not Recommended
                                            </Text>
                                        </View>
                                    )}
                                    <Text style={{ fontSize: 12, color: '#6B7280', lineHeight: 16 }}>
                                        {data.audioEnabled
                                            ? '✓ Your child can speak story ideas naturally!'
                                            : 'Used for story suggestions from your child. Without voice, your child must type or tap to suggest story ideas.'}
                                    </Text>
                                </View>
                            </View>
                            <Switch
                                value={data.audioEnabled}
                                onValueChange={(value) => updateData({ audioEnabled: value })}
                                trackColor={{ false: '#D1D5DB', true: '#4ADE80' }}
                                thumbColor={data.audioEnabled ? '#16A34A' : '#f4f3f4'}
                                ios_backgroundColor="#D1D5DB"
                                style={{ marginTop: 8 }}
                            />
                        </View>

                        {/* Benefits / Warning */}
                        {data.audioEnabled && (
                            <View style={{ marginTop: 12, backgroundColor: '#F0FDF4', borderRadius: 8, padding: 10, borderWidth: 1, borderColor: '#BBF7D0' }}>
                                <Text style={{ fontSize: 10, color: '#166534', lineHeight: 14 }}>
                                    <Text style={{ fontWeight: '700' }}>Consent & Privacy: </Text>
                                    By enabling, you consent to audio recording of your child's voice for transcription purposes only. Audio is processed on-device or via secure servers, converted to text, and is not stored or shared. You can disable this anytime. See our Privacy Policy.
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