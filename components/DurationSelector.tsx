import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Pressable, Modal, Vibration, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    interpolateColor,
} from 'react-native-reanimated';
import { Clock, ChevronDown, Check } from 'lucide-react-native';
import { StoryLength } from '@/types';

export type ThemeMode = 'purple' | 'teal' | 'amber';

const THEME_TINTS: Record<ThemeMode, { icon: string; bgLight: string; borderLight: string; text: string }> = {
    purple: {
        icon: '#a855f7',
        bgLight: 'bg-primary-50',
        borderLight: 'border-primary-200',
        text: 'text-primary-700',
    },
    teal: {
        icon: '#14b8a6',
        bgLight: 'bg-teal-50',
        borderLight: 'border-teal-200',
        text: 'text-teal-700',
    },
    amber: {
        icon: '#f59e0b',
        bgLight: 'bg-amber-50',
        borderLight: 'border-amber-200',
        text: 'text-amber-700',
    },
};

// Animated Dot Component
const AnimatedDot: React.FC<{
    isActive: boolean;
    activeColor: string;
}> = ({ isActive, activeColor }) => {
    const size = useSharedValue(isActive ? 8 : 6);
    const colorProgress = useSharedValue(isActive ? 1 : 0);

    useEffect(() => {
        size.value = withTiming(isActive ? 8 : 6, { duration: 150 });
        colorProgress.value = withTiming(isActive ? 1 : 0, { duration: 150 });
    }, [isActive]);

    const animatedStyle = useAnimatedStyle(() => ({
        width: size.value,
        height: size.value,
        borderRadius: 4,
        backgroundColor: interpolateColor(colorProgress.value, [0, 1], ['#e2e8f0', activeColor]),
    }));

    return <Animated.View style={animatedStyle} />;
};

interface DurationSelectorProps {
    value: StoryLength;
    onChange: (value: StoryLength) => void;
    theme?: ThemeMode;
}

export const DurationSelector: React.FC<DurationSelectorProps> = ({ value, onChange, theme = 'purple' }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [buttonLayout, setButtonLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const longPressTriggered = useRef(false);
    const buttonRef = useRef<View>(null);
    const tint = THEME_TINTS[theme];

    // Animation for button press
    const buttonScale = useSharedValue(1);

    const options: { val: StoryLength; label: string; desc: string }[] = [
        { val: 'short', label: 'Short', desc: '1 min read' },
        { val: 'medium', label: 'Medium', desc: '5 min read' },
        { val: 'long', label: 'Long', desc: '10 min read' },
    ];

    const currentIndex = options.findIndex((option) => option.val === value);
    const resolvedIndex = currentIndex === -1 ? 1 : currentIndex;
    const current = options[resolvedIndex];

    const getNextOption = () => {
        return options[(resolvedIndex + 1) % options.length].val;
    };

    const handleCycle = () => {
        if (longPressTriggered.current || showMenu) return;
        const nextVal = getNextOption();
        onChange(nextVal);
    };

    const measureAndShowMenu = () => {
        if (buttonRef.current) {
            buttonRef.current.measureInWindow((x, y, width, height) => {
                setButtonLayout({ x, y, width, height });
                setShowMenu(true);
            });
        } else {
            setShowMenu(true);
        }
    };

    const handleLongPress = () => {
        longPressTriggered.current = true;
        Vibration.vibrate(8);
        measureAndShowMenu();
    };

    const handlePressIn = () => {
        longPressTriggered.current = false;
        buttonScale.value = withTiming(0.98, { duration: 100 });
    };

    const handlePressOut = () => {
        buttonScale.value = withTiming(1, { duration: 100 });
    };

    const closeMenu = () => setShowMenu(false);

    const buttonAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: buttonScale.value }],
    }));

    return (
        <>
            <Animated.View
                ref={buttonRef}
                style={buttonAnimatedStyle}
                className="w-full rounded-2xl border shadow-sm bg-white border-slate-200 flex-row overflow-hidden"
            >
                <Pressable
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    onLongPress={handleLongPress}
                    delayLongPress={350}
                    onPress={handleCycle}
                    className="flex-1 flex-row items-center gap-3 pl-5 py-3 pr-2"
                >
                    <Clock size={18} color={tint.icon} />
                    <View className="flex-row items-center gap-1">
                        {[0, 1, 2].map((dot) => (
                            <AnimatedDot
                                key={dot}
                                isActive={dot <= resolvedIndex}
                                activeColor={tint.icon}
                            />
                        ))}
                    </View>
                    <MotiView
                        key={current.label}
                        from={{ opacity: 0, translateY: -6 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: 'timing', duration: 180 }}
                    >
                        <Text className="text-sm font-bold text-slate-700 min-w-[56px]">
                            {current.label}
                        </Text>
                    </MotiView>
                </Pressable>

                <View className="w-px h-5 bg-slate-100 self-center mx-0.5" />

                <Pressable
                    onPress={measureAndShowMenu}
                    className="px-4 py-3 items-center justify-center active:bg-slate-50"
                >
                    <ChevronDown size={14} color="#94a3b8" />
                </Pressable>
            </Animated.View>

            <Modal
                visible={showMenu}
                transparent
                animationType="none"
                onRequestClose={closeMenu}
            >
                <Pressable style={styles.modalOverlay} onPress={closeMenu} />

                <View
                    style={[
                        styles.menuPositioner,
                        {
                            top: buttonLayout.y + buttonLayout.height + 8,
                            left: buttonLayout.x,
                        },
                    ]}
                    pointerEvents="box-none"
                >
                    <MotiView
                        from={{ opacity: 0, scale: 0.95, translateY: -8 }}
                        animate={{ opacity: 1, scale: 1, translateY: 0 }}
                        exit={{ opacity: 0, scale: 0.95, translateY: -8 }}
                        transition={{ type: 'timing', duration: 200 }}
                        className="bg-white rounded-3xl border border-slate-100 shadow-xl p-4 min-w-[220px]"
                    >
                        <Text className="px-2 py-1 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                            Select Duration
                        </Text>
                        {options.map((option, index) => {
                            const selected = value === option.val;
                            const isFilled = (dotIndex: number) => dotIndex <= index;

                            return (
                                <Pressable
                                    key={option.val}
                                    onPress={() => {
                                        onChange(option.val);
                                        closeMenu();
                                    }}
                                    className={`flex-row items-center justify-between p-3 rounded-2xl mb-1 ${selected ? 'bg-slate-50' : 'bg-transparent'
                                        } active:bg-slate-100`}
                                >
                                    <View>
                                        <View className="flex-row items-center gap-2 mb-1">
                                            <View className="flex-row items-center gap-0.5">
                                                {[0, 1, 2].map((dot) => (
                                                    <View
                                                        key={dot}
                                                        style={[
                                                            styles.microDot,
                                                            { backgroundColor: isFilled(dot) ? '#0f172a' : '#e2e8f0' },
                                                        ]}
                                                    />
                                                ))}
                                            </View>
                                            <Text className={`text-sm font-bold ${selected ? 'text-slate-900' : 'text-slate-700'}`}>
                                                {option.label}
                                            </Text>
                                        </View>
                                        <Text className="text-[10px] font-medium text-slate-400 ml-5">
                                            {option.desc}
                                        </Text>
                                    </View>
                                    {selected && <Check size={16} color={tint.icon} />}
                                </Pressable>
                            );
                        })}
                    </MotiView>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    microDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
    },
    modalOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
    },
    menuPositioner: {
        position: 'absolute',
        maxWidth: 300,
    },
});
