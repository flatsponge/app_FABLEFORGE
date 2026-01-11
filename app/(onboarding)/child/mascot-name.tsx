import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
    FadeInDown,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withSequence,
    withTiming,
    interpolate,
    useAnimatedReaction,
    runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useConvexAuth } from 'convex/react';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import { api } from '../../../convex/_generated/api';

const HeroMascotIcon = require('../../../assets/hero_mascot_icon.png');

// Chunky 3D button matching child flow
const ChunkyButton = ({
    onPress,
    children,
    bgColor = '#ffffff',
    borderColor = '#e2e8f0',
    size = 'large',
    disabled = false,
}: {
    onPress?: () => void;
    children: React.ReactNode;
    bgColor?: string;
    borderColor?: string;
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
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
        const marginBottom = interpolate(pressed.value, [0, 1], [0, s.borderBottom - 2]);
        return {
            borderBottomWidth,
            marginBottom,
        };
    });

    return (
        <Pressable
            onPress={disabled ? undefined : onPress}
            onPressIn={() => {
                if (!disabled) {
                    pressed.value = withSpring(1, { damping: 25, stiffness: 600 });
                }
            }}
            onPressOut={() => {
                if (!disabled) {
                    pressed.value = withSpring(0, { damping: 25, stiffness: 600 });
                }
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
                        backgroundColor: disabled ? '#F3F4F6' : bgColor,
                        borderRadius: 20,
                        opacity: disabled ? 0.7 : 1,
                    },
                ]}
            >
                {children}
            </Animated.View>
        </Pressable>
    );
};

export default function MascotNameScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { data, updateData } = useOnboarding();
    const { isAuthenticated } = useConvexAuth();
    const updateMascotName = useMutation(api.onboarding.updateMascotName);
    const [name, setName] = useState(data.mascotName || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Animation value for shaking the input
    const inputShake = useSharedValue(0);

    const handleContinue = async () => {
        if (isSubmitting) return;

        if (name.trim().length === 0) {
            // Shake animation
            inputShake.value = withSequence(
                withTiming(10, { duration: 50 }),
                withTiming(-10, { duration: 50 }),
                withTiming(10, { duration: 50 }),
                withTiming(0, { duration: 50 })
            );
            return;
        }

        setIsSubmitting(true);
        const cleanName = name.trim();
        updateData({ mascotName: cleanName });

        // Sync with backend if authenticated
        if (isAuthenticated) {
            try {
                await updateMascotName({ mascotName: cleanName });
            } catch (error) {
                console.error("Failed to sync mascot name:", error);
                // Continue anyway, it's saved in context
            }
        }

        setIsSubmitting(false);
        router.push('/(onboarding)/child/avatar');
    };

    const inputAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: inputShake.value }]
        };
    });

    return (
        <LinearGradient
            colors={['#FEF7ED', '#FFF7ED', '#FFFBEB']}
            style={{ flex: 1 }}
        >
            <View style={{ flex: 1, paddingTop: insets.top }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <View style={{ flex: 1, paddingHorizontal: 24, justifyContent: 'center' }}>

                        {/* Header Section */}
                        <Animated.View
                            entering={FadeInDown.delay(200).springify()}
                            style={{ alignItems: 'center', marginBottom: 40 }}
                        >
                            <Image
                                source={HeroMascotIcon}
                                style={{
                                    width: 150,
                                    height: 150,
                                    resizeMode: 'contain',
                                    marginBottom: 20
                                }}
                            />
                            <Text style={{
                                fontSize: 32,
                                fontWeight: '900',
                                color: '#1F2937',
                                textAlign: 'center',
                                letterSpacing: -1,
                                marginBottom: 8,
                            }}>
                                What's your hero's name?
                            </Text>
                            <Text style={{
                                fontSize: 18,
                                color: '#6B7280',
                                textAlign: 'center',
                                maxWidth: 280,
                            }}>
                                Every great story needs a great hero!
                            </Text>
                        </Animated.View>

                        {/* Input Section */}
                        <Animated.View
                            entering={FadeInUp.delay(400).springify()}
                            style={[{
                                width: '100%',
                                marginBottom: 40,
                            }, inputAnimatedStyle]}
                        >
                            <View style={{
                                backgroundColor: 'white',
                                borderRadius: 24,
                                borderWidth: 3,
                                borderColor: name.length > 0 ? '#3B82F6' : '#E5E7EB',
                                padding: 8,
                                shadowColor: '#3B82F6',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: name.length > 0 ? 0.1 : 0,
                                shadowRadius: 12,
                            }}>
                                <TextInput
                                    style={{
                                        fontSize: 28,
                                        fontWeight: '800',
                                        color: '#1F2937',
                                        textAlign: 'center',
                                        paddingVertical: 20,
                                    }}
                                    placeholder="Super Sammy"
                                    placeholderTextColor="#D1D5DB"
                                    value={name}
                                    onChangeText={setName}
                                    autoFocus
                                    maxLength={20}
                                    returnKeyType="done"
                                    onSubmitEditing={handleContinue}
                                    editable={!isSubmitting}
                                />
                            </View>
                        </Animated.View>

                    </View>

                    {/* Bottom CTA */}
                    <View style={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 20 }}>
                        <Animated.View entering={FadeInUp.delay(600).springify()}>
                            <ChunkyButton
                                onPress={handleContinue}
                                bgColor={name.trim().length > 0 ? "#3B82F6" : "#94A3B8"}
                                borderColor={name.trim().length > 0 ? "#2563EB" : "#64748B"}
                                size="large"
                                disabled={isSubmitting}
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
                                        {isSubmitting ? 'Saving...' : "Let's Go!"}
                                    </Text>
                                    <Ionicons name="arrow-forward" size={24} color="white" />
                                </View>
                            </ChunkyButton>
                        </Animated.View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </LinearGradient>
    );
}