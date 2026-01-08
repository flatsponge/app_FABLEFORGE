import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from 'react-native';
import Animated, {
    useAnimatedScrollHandler,
    useSharedValue,
    useAnimatedStyle,
    interpolate,
    Extrapolation,
    runOnJS,
    withTiming,
    Easing,
    SharedValue,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { OnboardingTheme } from '../constants/OnboardingTheme';

// Configuration
const ITEM_HEIGHT = 48;
const VISIBLE_ITEMS = 5; // Number of items visible in the picker
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

// Generate months
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// Generate years (reasonable range for child age)
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 18 }, (_, i) => currentYear - i);

interface PickerColumnProps {
    data: (string | number)[];
    selectedIndex: number;
    onSelect: (index: number) => void;
    formatItem?: (item: string | number) => string;
}

function PickerColumn({ data, selectedIndex, onSelect, formatItem }: PickerColumnProps) {
    const scrollViewRef = useRef<Animated.ScrollView>(null);
    const scrollY = useSharedValue(0);
    const isUserScrolling = useSharedValue(false);

    // Scroll to initial position on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            scrollViewRef.current?.scrollTo({
                y: selectedIndex * ITEM_HEIGHT,
                animated: false,
            });
        }, 50);
        return () => clearTimeout(timer);
    }, []);

    const handleScrollEnd = useCallback((offsetY: number) => {
        const index = Math.round(offsetY / ITEM_HEIGHT);
        const clampedIndex = Math.max(0, Math.min(index, data.length - 1));
        if (clampedIndex !== selectedIndex) {
            onSelect(clampedIndex);
        }
    }, [data.length, onSelect, selectedIndex]);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
        onBeginDrag: () => {
            isUserScrolling.value = true;
        },
        onEndDrag: () => {
            isUserScrolling.value = false;
        },
    });

    const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        handleScrollEnd(event.nativeEvent.contentOffset.y);
    };

    // Add padding items for proper centering
    const paddedData = useMemo(() => {
        const padding = Math.floor(VISIBLE_ITEMS / 2);
        const paddingArray = Array(padding).fill('');
        return [...paddingArray, ...data, ...paddingArray];
    }, [data]);

    return (
        <View style={styles.columnContainer}>
            <Animated.ScrollView
                ref={scrollViewRef}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                onScroll={scrollHandler}
                onMomentumScrollEnd={handleMomentumScrollEnd}
                scrollEventThrottle={16}
                contentContainerStyle={styles.scrollContent}
                bounces={true}
                nestedScrollEnabled
            >
                {paddedData.map((item, index) => (
                    <PickerItem
                        key={`${item}-${index}`}
                        item={item}
                        index={index - Math.floor(VISIBLE_ITEMS / 2)}
                        scrollY={scrollY}
                        formatItem={formatItem}
                    />
                ))}
            </Animated.ScrollView>

            {/* Top fade gradient */}
            <View pointerEvents="none" style={styles.fadeTop}>
                <LinearGradient
                    colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0)']}
                    style={StyleSheet.absoluteFillObject}
                />
            </View>

            {/* Bottom fade gradient */}
            <View pointerEvents="none" style={styles.fadeBottom}>
                <LinearGradient
                    colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
                    style={StyleSheet.absoluteFillObject}
                />
            </View>
        </View>
    );
}

interface PickerItemProps {
    item: string | number;
    index: number;
    scrollY: SharedValue<number>;
    formatItem?: (item: string | number) => string;
}

function PickerItem({ item, index, scrollY, formatItem }: PickerItemProps) {
    const animatedStyle = useAnimatedStyle(() => {
        const inputRange = [
            (index - 2) * ITEM_HEIGHT,
            (index - 1) * ITEM_HEIGHT,
            index * ITEM_HEIGHT,
            (index + 1) * ITEM_HEIGHT,
            (index + 2) * ITEM_HEIGHT,
        ];

        const opacity = interpolate(
            scrollY.value,
            inputRange,
            [0.2, 0.4, 1, 0.4, 0.2],
            Extrapolation.CLAMP
        );

        const scale = interpolate(
            scrollY.value,
            inputRange,
            [0.75, 0.85, 1, 0.85, 0.75],
            Extrapolation.CLAMP
        );

        const rotateX = interpolate(
            scrollY.value,
            inputRange,
            [40, 20, 0, -20, -40],
            Extrapolation.CLAMP
        );

        return {
            opacity,
            transform: [
                { scale },
                { perspective: 500 },
                { rotateX: `${rotateX}deg` },
            ],
        };
    });

    const displayText = formatItem ? formatItem(item) : String(item);

    if (item === '') {
        return <View style={styles.itemContainer} />;
    }

    return (
        <Animated.View style={[styles.itemContainer, animatedStyle]}>
            <Text style={styles.itemText}>{displayText}</Text>
        </Animated.View>
    );
}

interface MonthYearPickerProps {
    selectedMonth: number; // 0-11
    selectedYear: number;
    onMonthChange: (month: number) => void;
    onYearChange: (year: number) => void;
    minYear?: number;
    maxYear?: number;
}

export default function MonthYearPicker({
    selectedMonth,
    selectedYear,
    onMonthChange,
    onYearChange,
    minYear,
    maxYear,
}: MonthYearPickerProps) {
    // Calculate which years to show
    const years = useMemo(() => {
        const min = minYear ?? currentYear - 17;
        const max = maxYear ?? currentYear;
        return Array.from({ length: max - min + 1 }, (_, i) => max - i);
    }, [minYear, maxYear]);

    const monthIndex = selectedMonth;
    const yearIndex = years.indexOf(selectedYear);

    const handleMonthSelect = useCallback((index: number) => {
        onMonthChange(index);
    }, [onMonthChange]);

    const handleYearSelect = useCallback((index: number) => {
        if (years[index]) {
            onYearChange(years[index]);
        }
    }, [onYearChange, years]);

    return (
        <View style={styles.container}>
            {/* Selection highlight bar */}
            <View style={styles.selectionHighlight} pointerEvents="none" />

            <View style={styles.pickersRow}>
                {/* Month picker */}
                <View style={styles.monthColumn}>
                    <PickerColumn
                        data={MONTHS}
                        selectedIndex={monthIndex}
                        onSelect={handleMonthSelect}
                    />
                </View>

                {/* Year picker */}
                <View style={styles.yearColumn}>
                    <PickerColumn
                        data={years}
                        selectedIndex={yearIndex >= 0 ? yearIndex : 0}
                        onSelect={handleYearSelect}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: PICKER_HEIGHT,
        backgroundColor: OnboardingTheme.Colors.Surface,
        borderRadius: OnboardingTheme.Radius.xl,
        overflow: 'hidden',
        position: 'relative',
    },
    selectionHighlight: {
        position: 'absolute',
        top: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2),
        left: 16,
        right: 16,
        height: ITEM_HEIGHT,
        backgroundColor: OnboardingTheme.Colors.White,
        borderRadius: OnboardingTheme.Radius.lg,
        borderWidth: 2,
        borderColor: OnboardingTheme.Colors.Primary,
        zIndex: 0,
    },
    pickersRow: {
        flexDirection: 'row',
        flex: 1,
        paddingHorizontal: 8,
    },
    monthColumn: {
        flex: 1.5,
    },
    yearColumn: {
        flex: 1,
    },
    columnContainer: {
        height: PICKER_HEIGHT,
        position: 'relative',
        overflow: 'hidden',
    },
    scrollContent: {
        paddingHorizontal: 8,
    },
    fadeTop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: ITEM_HEIGHT * 1.5,
        pointerEvents: 'none',
    },
    fadeBottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: ITEM_HEIGHT * 1.5,
        pointerEvents: 'none',
    },
    itemContainer: {
        height: ITEM_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemText: {
        fontSize: 20,
        fontWeight: '600',
        color: OnboardingTheme.Colors.Primary,
        textAlign: 'center',
    },
});
