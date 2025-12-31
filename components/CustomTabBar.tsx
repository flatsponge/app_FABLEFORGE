import React, { useEffect } from 'react';
import { View, Pressable, Text, useWindowDimensions, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, BarChart2, Baby, Settings, Plus, LucideIcon } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
  interpolate,
  Easing,
} from 'react-native-reanimated';

const AnimatedView = Animated.createAnimatedComponent(View);

// Smooth timing configs (no bounce)
const TIMING_CONFIG = { duration: 200, easing: Easing.out(Easing.cubic) };
const TIMING_FAST = { duration: 100, easing: Easing.out(Easing.quad) };

// --- Navbar Shape SVG ---
const NavbarShape: React.FC<{ width: number; height: number }> = ({ width }) => {
  // The SVG has a notch at top for the FAB
  // We use viewBox to scale it properly
  return (
    <Svg
      width={width}
      height={80}
      viewBox="0 0 360 80"
      preserveAspectRatio="none"
    >
      {/* Main bar shape with center notch for FAB */}
      <Path
        d="M0 32C0 14.3269 14.3269 0 32 0H134C142 0 154 0 162 8C170 16 174 24 180 24C186 24 190 16 198 8C206 0 218 0 226 0H328C345.673 0 360 14.3269 360 32V80H0V32Z"
        fill="white"
      />
      {/* Top border */}
      <Path
        d="M0 32C0 14.3269 14.3269 0 32 0H134C142 0 154 0 162 8C170 16 174 24 180 24C186 24 190 16 198 8C206 0 218 0 226 0H328C345.673 0 360 14.3269 360 32"
        fill="none"
        stroke="#E2E8F0"
        strokeWidth="1"
      />
    </Svg>
  );
};

// --- Tab Button ---
interface TabButtonProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onPress: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ icon: Icon, label, isActive, onPress }) => {
  const pressed = useSharedValue(0);
  const active = useSharedValue(isActive ? 1 : 0);

  useEffect(() => {
    active.value = withTiming(isActive ? 1 : 0, TIMING_CONFIG);
  }, [isActive]);

  // Active background indicator
  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(active.value, [0, 1], [0.8, 1]) }],
    opacity: active.value,
  }));

  // Icon container animation
  const iconContainerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(active.value, [0, 1], [0, -2]) },
      { scale: interpolate(pressed.value, [0, 1], [1, 0.95]) },
    ],
  }));

  // Label animation
  const labelStyle = useAnimatedStyle(() => ({
    opacity: active.value,
    transform: [{ translateY: interpolate(active.value, [0, 1], [-4, 0]) }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        pressed.value = withTiming(1, TIMING_FAST);
      }}
      onPressOut={() => {
        pressed.value = withTiming(0, TIMING_FAST);
      }}
      style={styles.tabButton}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      {/* Active background indicator */}
      <AnimatedView style={[styles.activeIndicator, indicatorStyle]} />

      {/* Icon + Label container */}
      <AnimatedView style={[styles.iconContainer, iconContainerStyle]}>
        <Icon
          size={isActive ? 26 : 24}
          color={isActive ? '#4f46e5' : '#94a3b8'}
          strokeWidth={isActive ? 2.5 : 2}
          fill={isActive ? '#4f46e5' : 'none'}
          fillOpacity={isActive ? 0.15 : 0}
        />
        <AnimatedView style={labelStyle}>
          <Text style={[styles.label, isActive && styles.labelActive]}>
            {label}
          </Text>
        </AnimatedView>
      </AnimatedView>
    </Pressable>
  );
};

// --- FAB (Floating Action Button) ---
interface FabButtonProps {
  onPress: () => void;
}

const FabButton: React.FC<FabButtonProps> = ({ onPress }) => {
  const pressed = useSharedValue(0);

  // Container press effect (shadow + translate)
  const containerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(pressed.value, [0, 1], [0, 4]) },
    ],
    // Simulate shadow removal on press
    shadowOpacity: interpolate(pressed.value, [0, 1], [0.4, 0.1]),
  }));

  // Icon rotation on press
  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(pressed.value, [0, 1], [1, 0.92]) },
      { rotate: `${interpolate(pressed.value, [0, 1], [0, 45])}deg` },
    ],
  }));

  // Background color animation
  const bgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      pressed.value,
      [0, 1],
      ['#4f46e5', '#4338ca']
    ),
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        pressed.value = withTiming(1, TIMING_FAST);
      }}
      onPressOut={() => {
        pressed.value = withTiming(0, TIMING_CONFIG);
      }}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <AnimatedView style={[styles.fabContainer, containerStyle]}>
        <AnimatedView style={[styles.fabInner, bgStyle]}>
          {/* Glossy reflection */}
          <View style={styles.fabGloss} />
          <AnimatedView style={iconStyle}>
            <Plus size={32} color="white" strokeWidth={3.5} />
          </AnimatedView>
        </AnimatedView>
      </AnimatedView>
    </Pressable>
  );
};

// --- Main Tab Bar ---
interface CustomTabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onFabPress: () => void;
}

export const CustomTabBar: React.FC<CustomTabBarProps> = ({
  activeTab,
  onTabChange,
  onFabPress,
}) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      {/* White background that fills safe area */}
      <View style={[styles.safeAreaFill, { height: insets.bottom }]} />

      {/* SVG Background with notch */}
      <View style={styles.shapeContainer}>
        <NavbarShape width={width} height={80} />
      </View>

      {/* Tab Buttons - positioned over the white area */}
      <View style={styles.buttonsContainer}>
        {/* Left Wing */}
        <View style={styles.wing}>
          <TabButton
            icon={Home}
            label="Home"
            isActive={activeTab === 'home'}
            onPress={() => onTabChange('home')}
          />
          <TabButton
            icon={BarChart2}
            label="Stats"
            isActive={activeTab === 'stats'}
            onPress={() => onTabChange('stats')}
          />
        </View>

        {/* Spacer for FAB */}
        <View style={styles.fabSpacer} />

        {/* Right Wing */}
        <View style={styles.wing}>
          <TabButton
            icon={Baby}
            label="Me"
            isActive={activeTab === 'child-hub'}
            onPress={() => onTabChange('child-hub')}
          />
          <TabButton
            icon={Settings}
            label="Settings"
            isActive={activeTab === 'settings'}
            onPress={() => onTabChange('settings')}
          />
        </View>
      </View>

      {/* FAB - positioned above the bar */}
      <View style={styles.fabWrapper}>
        <FabButton onPress={onFabPress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  safeAreaFill: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
  },
  shapeContainer: {
    // Shadow for the navbar
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonsContainer: {
    position: 'absolute',
    top: 8,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
  },
  wing: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  fabSpacer: {
    width: 80,
  },
  fabWrapper: {
    position: 'absolute',
    top: -24,
    alignSelf: 'center',
    left: '50%',
    marginLeft: -32,
    zIndex: 20,
  },
  // Tab Button styles
  tabButton: {
    position: 'relative',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  activeIndicator: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(238, 242, 255, 0.9)', // indigo-50 with opacity
    borderRadius: 16,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: -0.2,
  },
  labelActive: {
    color: '#4f46e5',
  },
  // FAB styles
  fabContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    // Ring effect
    borderWidth: 5,
    borderColor: 'white',
    // Shadow (simulates the 3D effect)
    shadowColor: '#3730a3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 0,
    elevation: 8,
  },
  fabInner: {
    flex: 1,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fabGloss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderTopLeftRadius: 27,
    borderTopRightRadius: 27,
  },
});
