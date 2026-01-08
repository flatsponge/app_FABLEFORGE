import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Switch, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
    FadeInDown,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    interpolate,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, ArrowRight, Users, User, Mic } from 'lucide-react-native';
import { useOnboarding } from '../../../contexts/OnboardingContext';

// Chunky 3D button matching child flow
const ChunkyButton = ({
    onPress,
    children,
    bgColor = '#ffffff',
    borderColor = '#e2e8f0',
    size = 'large',
}: {
    onPress?: () => void;
    children: React.ReactNode;
    bgColor?: string;
    borderColor?: string;
    size?: 'small' | 'medium' | 'large';
}) => {
    const pressed = useSharedValue(0);

    const sizeStyles = {
        small: { borderBottom: 4, borderSide: 2, borderTop: 2 },
        medium: { borderBottom: 6, borderSide: 3, borderTop: 3 },
        large: { borderBottom: 8, borderSide: 3, borderTop: 3 },
    };

    const s = sizeStyles[size];

    const animatedStyle = useAnimatedStyle(() => {
        const translateY = interpolate(pressed.value, [0, 1], [0, s.borderBottom - 2]);
        return {
            transform: [{ translateY }],
        };
    });

    const animatedBorderStyle = useAnimatedStyle(() => {
        const borderBottomWidth = interpolate(pressed.value, [0, 1], [s.borderBottom, 2]);
        // Compensate layout shift with margin so total height remains constant
        const marginBottom = interpolate(pressed.value, [0, 1], [0, s.borderBottom - 2]);
        return {
            borderBottomWidth,
            marginBottom,
        };
    });

    return (
        <Pressable
            onPress={onPress}
            onPressIn={() => {
                pressed.value = withSpring(1, { damping: 25, stiffness: 600 });
            }}
            onPressOut={() => {
                pressed.value = withSpring(0, { damping: 25, stiffness: 600 });
            }}
        >
            <Animated.View
                style={[
                    animatedStyle,
                    animatedBorderStyle,
                    {
                        borderTopWidth: s.borderTop,
                        borderLeftWidth: s.borderSide,
                        borderRightWidth: s.borderSide,
                        borderColor: borderColor,
                        backgroundColor: bgColor,
                        borderRadius: 20,
                    },
                ]}
            >
                {children}
            </Animated.View>
        </Pressable>
    );
};

export default function ChildSetupScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { data, updateData } = useOnboarding();
    const [timerComplete, setTimerComplete] = useState(false);

    // Enable Continue button after 5 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setTimerComplete(true);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    // Continue is enabled if audio is enabled OR 5 seconds have passed
    const canContinue = data.audioEnabled || timerComplete;

    return (
        <LinearGradient
            colors={['#FEF7ED', '#FFF7ED', '#FFFBEB']}
            style={{ flex: 1 }}
        >
            <View style={{ flex: 1, paddingTop: insets.top }}>
                {/* Main Content */}
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
                    {/* Engaging Header */}
                    <Animated.View
                        entering={FadeInDown.delay(200).springify()}
                        style={{ alignItems: 'center', marginBottom: 40 }}
                    >
                        {/* Shooting Star Image */}
                        <View style={{ marginBottom: 16 }}>
                            <Image
                                source={require('../../../assets/images/shooting-star.png')}
                                style={{ width: 140, height: 140 }}
                                resizeMode="contain"
                            />
                        </View>

                        {/* Title with gradient feel */}
                        <Text style={{
                            fontSize: 34,
                            fontWeight: '900',
                            color: '#1F2937',
                            textAlign: 'center',
                            letterSpacing: -1,
                            marginBottom: 8,
                        }}>
                            Let's Create Magic!
                        </Text>

                        {/* Subtitle */}
                        <Text style={{
                            fontSize: 16,
                            color: '#6B7280',
                            textAlign: 'center',
                            lineHeight: 24,
                            paddingHorizontal: 16,
                        }}>
                            Time to build your child's hero character.{'\n'}Here's how to get started:
                        </Text>
                    </Animated.View>

                    {/* Options List */}
                    <Animated.View
                        entering={FadeInUp.delay(500)}
                        style={{ width: '100%', marginBottom: 40 }}
                    >
                        {/* Option 1: Recommended */}
                        <View style={{ flexDirection: 'row', marginBottom: 28 }}>
                            <View style={{ marginRight: 16, alignItems: 'center' }}>
                                <View style={{
                                    backgroundColor: '#EDE9FE',
                                    width: 44,
                                    height: 44,
                                    borderRadius: 12,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Users size={24} color="#7C3AED" strokeWidth={2.5} />
                                </View>
                                <View style={{ width: 2, height: 20, backgroundColor: '#E5E7EB', marginTop: 8 }} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#1F2937' }}>
                                        Together with Your Child
                                    </Text>
                                    <View style={{
                                        backgroundColor: '#7C3AED',
                                        paddingHorizontal: 8,
                                        paddingVertical: 3,
                                        borderRadius: 6,
                                        marginLeft: 10
                                    }}>
                                        <Text style={{ fontSize: 10, fontWeight: '800', color: 'white' }}>
                                            BEST
                                        </Text>
                                    </View>
                                </View>
                                <Text style={{ fontSize: 15, color: '#4B5563', lineHeight: 22 }}>
                                    Hand the device over and let them pick their favorite character. It's more fun!
                                </Text>
                            </View>
                        </View>

                        {/* Option 2: Alternative */}
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ marginRight: 16 }}>
                                <View style={{
                                    backgroundColor: '#F3F4F6',
                                    width: 44,
                                    height: 44,
                                    borderRadius: 12,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <User size={24} color="#9CA3AF" strokeWidth={2.5} />
                                </View>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 18, fontWeight: '700', color: '#4B5563', marginBottom: 6 }}>
                                    Set Up Yourself
                                </Text>
                                <Text style={{ fontSize: 15, color: '#6B7280', lineHeight: 22 }}>
                                    If they aren't around, you can create their character for them.
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
                                    <Mic size={24} color={data.audioEnabled ? '#16A34A' : '#D97706'} strokeWidth={2.5} />
                                </View>
                                <View style={{ flex: 1, paddingRight: 8 }}>
                                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 2 }}>
                                        Voice Storytelling
                                    </Text>
                                    {!data.audioEnabled && (
                                        <View style={{
                                            backgroundColor: '#FEF3C7',
                                            paddingHorizontal: 6,
                                            paddingVertical: 2,
                                            borderRadius: 4,
                                            alignSelf: 'flex-start',
                                            marginBottom: 4,
                                        }}>
                                            <Text style={{ fontSize: 9, fontWeight: '800', color: '#D97706' }}>
                                                RECOMMENDED
                                            </Text>
                                        </View>
                                    )}
                                    <Text style={{ fontSize: 12, color: '#6B7280', lineHeight: 16 }}>
                                        {data.audioEnabled
                                            ? '✓ Your child can speak their stories naturally!'
                                            : 'Let your child speak their adventures aloud.'}
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
                        {!data.audioEnabled ? (
                            <View style={{ marginTop: 12, backgroundColor: '#FFFBEB', borderRadius: 8, padding: 10 }}>
                                <Text style={{ fontSize: 11, color: '#92400E', lineHeight: 15, fontWeight: '500' }}>
                                    ⚠️ Without voice input, your child will need to type or select preset options. Voice makes storytelling much more engaging and personal!
                                </Text>
                            </View>
                        ) : (
                            <View style={{ marginTop: 12, backgroundColor: '#F0FDF4', borderRadius: 8, padding: 10, borderWidth: 1, borderColor: '#BBF7D0' }}>
                                <Text style={{ fontSize: 10, color: '#166534', lineHeight: 14 }}>
                                    <Text style={{ fontWeight: '700' }}>Consent & Privacy: </Text>
                                    By enabling, you consent to audio recording of your child's voice for transcription purposes only. Audio is processed on-device or via secure servers, converted to text, and is not stored or shared. You can disable this anytime. See our Privacy Policy.
                                </Text>
                            </View>
                        )}
                    </Animated.View>

                    {/* CTA Button */}
                    <Animated.View
                        entering={FadeInUp.delay(600).springify()}
                        style={{ width: '100%' }}
                    >
                        <View style={{ opacity: canContinue ? 1 : 0.5 }}>
                            <ChunkyButton
                                onPress={canContinue ? () => router.push('/(onboarding)/child/avatar') : undefined}
                                bgColor={canContinue ? '#22C55E' : '#9CA3AF'}
                                borderColor={canContinue ? '#16A34A' : '#6B7280'}
                                size="large"
                            >
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 18,
                                    gap: 10
                                }}>
                                    <Sparkles size={24} color="white" strokeWidth={2.5} />
                                    <Text style={{
                                        fontSize: 20,
                                        fontWeight: '800',
                                        color: 'white',
                                        letterSpacing: 0.5,
                                    }}>
                                        Continue
                                    </Text>
                                    <ArrowRight size={24} color="white" strokeWidth={2.5} />
                                </View>
                            </ChunkyButton>
                        </View>
                    </Animated.View>
                </View>

                {/* Bottom safe area */}
                <View style={{ height: insets.bottom + 20 }} />
            </View>
        </LinearGradient>
    );
}
