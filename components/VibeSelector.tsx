import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Pressable, Modal, Vibration, StyleSheet, Dimensions } from 'react-native';
import { MotiView } from 'moti';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { ChevronDown, Check, Zap, Moon, Sparkles, BookOpen } from 'lucide-react-native';
import { LucideIcon } from 'lucide-react-native';

export type ThemeMode = 'purple' | 'teal' | 'amber';
export type StoryVibe = 'energizing' | 'soothing' | 'whimsical' | 'thoughtful';

const THEME_TINTS: Record<ThemeMode, { icon: string }> = {
    purple: { icon: '#a855f7' },
    teal: { icon: '#14b8a6' },
    amber: { icon: '#f59e0b' },
};

interface VibeSelectorProps {
    value: StoryVibe;
    onChange: (value: StoryVibe) => void;
    theme?: ThemeMode;
}

export const VibeSelector: React.FC<VibeSelectorProps> = ({ value, onChange, theme = 'purple' }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [buttonLayout, setButtonLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const longPressTriggered = useRef(false);
    const buttonRef = useRef<View>(null);
    const tint = THEME_TINTS[theme];

    // Animation for button press
    const buttonScale = useSharedValue(1);
    const iconScale = useSharedValue(1);

    const options: { val: StoryVibe; label: string; desc: string; icon: LucideIcon }[] = [
        { val: 'energizing', label: 'Energizing', desc: 'Play-focused, active', icon: Zap },
        { val: 'soothing', label: 'Soothing', desc: 'Bedtime-focused, calming', icon: Moon },
        { val: 'whimsical', label: 'Whimsical', desc: 'Funny, magical', icon: Sparkles },
        { val: 'thoughtful', label: 'Thoughtful', desc: 'Learning, value-driven', icon: BookOpen },
    ];

    const currentIndex = options.findIndex((option) => option.val === value);
    const resolvedIndex = currentIndex === -1 ? 1 : currentIndex;
    const current = options[resolvedIndex];
    const CurrentIcon = current.icon;

    // Animate icon when value changes
    useEffect(() => {
        iconScale.value = withTiming(1.1, { duration: 100 }, () => {
            iconScale.value = withTiming(1, { duration: 100 });
        });
    }, [value]);

    const handleCycle = () => {
        if (longPressTriggered.current || showMenu) return;
        const nextIndex = (resolvedIndex + 1) % options.length;
        onChange(options[nextIndex].val);
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

    const iconAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: iconScale.value }],
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
                    <Animated.View style={iconAnimatedStyle}>
                        <CurrentIcon size={18} color={tint.icon} />
                    </Animated.View>
                    <MotiView
                        key={current.label}
                        from={{ opacity: 0, translateY: -6 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: 'timing', duration: 180 }}
                    >
                        <Text className="text-sm font-bold text-slate-700 min-w-[72px]">
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
                            right: 20,
                        },
                    ]}
                    pointerEvents="box-none"
                >
                    <MotiView
                        from={{ opacity: 0, scale: 0.95, translateY: -8 }}
                        animate={{ opacity: 1, scale: 1, translateY: 0 }}
                        exit={{ opacity: 0, scale: 0.95, translateY: -8 }}
                        transition={{ type: 'timing', duration: 200 }}
                        className="bg-white rounded-3xl border border-slate-100 shadow-xl p-4"
                    >
                        <Text className="px-2 py-1 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                            Select Vibe
                        </Text>
                        {options.map((option) => {
                            const selected = value === option.val;
                            const OptionIcon = option.icon;

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
                                    <View className="flex-row items-center gap-3">
                                        <View
                                            className={`w-8 h-8 rounded-full items-center justify-center ${selected ? 'bg-white border border-slate-100' : 'bg-slate-100'
                                                }`}
                                        >
                                            <OptionIcon size={14} color={selected ? tint.icon : '#94a3b8'} />
                                        </View>
                                        <View>
                                            <Text className={`text-sm font-bold ${selected ? 'text-slate-900' : 'text-slate-700'}`}>
                                                {option.label}
                                            </Text>
                                            <Text className="text-[10px] font-medium text-slate-400">
                                                {option.desc}
                                            </Text>
                                        </View>
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

const MENU_WIDTH = 240;
const SCREEN_PADDING = 20;

const styles = StyleSheet.create({
    modalOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
    },
    menuPositioner: {
        position: 'absolute',
        width: MENU_WIDTH,
        maxWidth: Dimensions.get('window').width - (SCREEN_PADDING * 2),
    },
});
